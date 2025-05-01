import {
  createApiKeysWorkflow,
  createProductCategoriesWorkflow,
  createRegionsWorkflow,
  createSalesChannelsWorkflow,
  createShippingOptionsWorkflow,
  createShippingProfilesWorkflow,
  createStockLocationsWorkflow,
  createTaxRegionsWorkflow,
  linkSalesChannelsToApiKeyWorkflow,
  updateStoresWorkflow,
} from "@medusajs/core-flows";
import { Logger } from "@medusajs/medusa";
import { Link } from "@medusajs/modules-sdk";
import { ExecArgs } from "@medusajs/types";
import {
  ContainerRegistrationKeys,
  ModuleRegistrationName,
  Modules,
  ProductStatus,
} from "@medusajs/utils";
import dotenv from "dotenv";
import medusaEatsSeedData from "../../data/medusa-eats-seed-data.json";
import { createRestaurantWorkflow } from "../workflows/restaurant/workflows/create-restaurant";
import { createRestaurantProductsWorkflow } from "../workflows/restaurant/workflows/create-restaurant-products";

dotenv.config();
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";

// Core region definitions
const REGIONS = [
  {
    name: "Europe",
    currency_code: "eur",
    countries: ["gb", "de", "dk", "se", "fr", "es", "it"],
    payment_providers: ["pp_system_default"],
  },
  {
    name: "ECOWAS",
    currency_code: "xof",
    countries: [
      "bf","bj","ci","cv","gm","gh","gn","gw","lr",
      "ml","mr","ne","sn","sl","tg",
    ],
    payment_providers: ["pp_system_default"],
  },
  {
    name: "CEMAC",
    currency_code: "xaf",
    countries: ["cm","cf","td","cg","gq","ga"],
    payment_providers: ["pp_system_default"],
  },
];

export default async function seedDemoData({ container }: ExecArgs) {
  const logger: Logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const linkService: Link = container.resolve(ContainerRegistrationKeys.LINK);
  const fulfillmentService = container.resolve(ModuleRegistrationName.FULFILLMENT);
  const salesChannelService = container.resolve(ModuleRegistrationName.SALES_CHANNEL);
  const storeService = container.resolve(ModuleRegistrationName.STORE);

  logger.info("🌱 Starting seeding demo data...");

  // --- Sales Channel & Store Setup ---
  let [store] = await storeService.listStores();
  let channels = await salesChannelService.listSalesChannels({ name: "Default Sales Channel" });
  if (!channels.length) {
    const { result } = await createSalesChannelsWorkflow(container).run({
      input: { salesChannelsData: [{ name: "Default Sales Channel" }] },
    });
    channels = result;
    logger.info("✅ Created Default Sales Channel");
  }
  const defaultChannelId = channels[0].id;

  // Derive supported currencies (unique codes + USD) and mark EUR default
  const supportedCurrencies = Array.from(
    new Set([...REGIONS.map(r => r.currency_code), "usd"])
  ).map(code => ({ currency_code: code, is_default: code === "eur" }));

  await updateStoresWorkflow(container).run({
    input: {
      selector: { id: store.id },
      update: {
        supported_currencies: supportedCurrencies,
        default_sales_channel_id: defaultChannelId,
      },
    },
  });
  logger.info("✅ Updated store with supported currencies & sales channel");

  // --- Region & Tax Setup ---
  logger.info("🗺️ Creating regions...");
  const { result: regions } = await createRegionsWorkflow(container).run({
    input: { regions: REGIONS },
  });
  logger.info(`✅ Created ${regions.length} regions`);

  // Create tax regions for every country across all regions
  const allCountries = REGIONS.flatMap(r => r.countries);
  await createTaxRegionsWorkflow(container).run({
    input: allCountries.map(code => ({ country_code: code })),
  });
  logger.info("✅ Created tax regions for all countries");

  // --- Shipping Profile ---
  const { result: shippingProfiles } = await createShippingProfilesWorkflow(container).run({
    input: { data: [{ name: "Default", type: "default" }] },
  });
  const shippingProfile = shippingProfiles[0];

  // Get default fulfillment provider
  const provider = (await fulfillmentService.listFulfillmentProviders({}, { take: 1 }))[0];

  // --- Fulfillment & Stock Location per Region ---
  for (const reg of regions) {
    logger.info(`🚚 Seeding fulfillment & stock location for ${reg.name}...`);

    // 1. Fulfillment Set
    const serviceZone = {
      name: `${reg.name} Zone`,
      geo_zones: reg.countries.map(cc => ({ country_code: cc, type: "country" })),
    };
    const fulfillmentSet = await fulfillmentService.createFulfillmentSets({
      name: `${reg.name} Warehouse Delivery`,
      type: "shipping",
      service_zones: [serviceZone],
    });

    // 2. Stock Location
    const { result: stockLocations } = await createStockLocationsWorkflow(container).run({
      input: {
        locations: [{
          name: `${reg.name} Warehouse`,
          address: {
            city: `${reg.name} HQ`, 
            country_code: reg.countries[0].toUpperCase(),
            address_1: "",
          },
        }],
      },
    });
    const stockLocation = stockLocations[0];

    // 3. Remote Linking
    await linkService.create([
      { [Modules.STOCK_LOCATION]: { stock_location_id: stockLocation.id }, [Modules.FULFILLMENT]: { fulfillment_set_id: fulfillmentSet.id } },
      { [Modules.STOCK_LOCATION]: { stock_location_id: stockLocation.id }, [Modules.FULFILLMENT]: { fulfillment_provider_id: provider.id } },
      { [Modules.SALES_CHANNEL]: { sales_channel_id: fulfillmentSet.id }, [Modules.STOCK_LOCATION]: { stock_location_id: stockLocation.id } },
    ]);

    // 4. Shipping Options
    const regionShippingOptions = [
      {
        name: `${reg.name} Standard Shipping`,
        price_type: "flat",
        provider_id: provider.id,
        service_zone_id: fulfillmentSet.service_zones[0].id,
        shipping_profile_id: shippingProfile.id,
        type: { label: "Standard", description: "Ship in 2-3 days.", code: "standard" },
        prices: supportedCurrencies.map(cur => ({ currency_code: cur.currency_code, amount: 10 })),
        rules: [
          { attribute: "enabled_in_store", operator: "eq", value: '"true"' },
          { attribute: "is_return", operator: "eq", value: "false" },
        ],
      },
      {
        name: `${reg.name} Express Shipping`,
        price_type: "flat",
        provider_id: provider.id,
        service_zone_id: fulfillmentSet.service_zones[0].id,
        shipping_profile_id: shippingProfile.id,
        type: { label: "Express", description: "Ship in 24 hours.", code: "express" },
        prices: supportedCurrencies.map(cur => ({ currency_code: cur.currency_code, amount: 20 })),
        rules: [
          { attribute: "enabled_in_store", operator: "eq", value: '"true"' },
          { attribute: "is_return", operator: "eq", value: "false" },
        ],
      },
    ];
    await createShippingOptionsWorkflow(container).run({ input: regionShippingOptions });
    logger.info(`✅ Seeded shipping for ${reg.name}`);
  }

  // --- API Keys & Channel Linking ---
  logger.info("🔑 Seeding API keys...");
  const { result: apiKeys } = await createApiKeysWorkflow(container).run({
    input: { api_keys: [{ title: "Webshop", type: "publishable", created_by: "" }] },
  });
  const pubKey = apiKeys[0];
  await linkSalesChannelsToApiKeyWorkflow(container).run({ input: { id: pubKey.id, add: [defaultChannelId] } });
  logger.info("✅ Published API key and linked to sales channel");

  // --- Restaurant & Product Data ---
  logger.info("🍽️ Seeding restaurant & product data...");
  const { restaurant } = medusaEatsSeedData;
  restaurant.image_url = FRONTEND_URL + restaurant.image_url;
  const { result: [createdRestaurant] } = await createRestaurantWorkflow(container).run({ input: { restaurant } });

  const { result: categories } = await createProductCategoriesWorkflow(container).run({
    input: { product_categories: medusaEatsSeedData.categories },
  });

  const products = medusaEatsSeedData.products.map(p => {
    const { id } = categories.find(c => c.handle === p.category)!;
    return {
      ...p,
      thumbnail: FRONTEND_URL + p.thumbnail,
      category_ids: [id],
      status: ProductStatus.PUBLISHED,
      sales_channels: [{ id: defaultChannelId }],
    };
  });
  await createRestaurantProductsWorkflow(container).run({ input: { products, restaurant_id: createdRestaurant.id } });

  logger.info("🎉 Seeding complete.");
}
