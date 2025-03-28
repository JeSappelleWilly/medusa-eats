import {
  ModuleRegistrationName,
  remoteQueryObjectFromString,
} from "@medusajs/utils";
import { createStep } from "@medusajs/workflows-sdk";

export const notifyRestaurantStepId = "notify-restaurant-step";

export const notifyRestaurantStep = createStep(
  {
    name: notifyRestaurantStepId,
    async: true,
    timeout: 60 * 15, // 15 minutes
    maxRetries: 2,
  },
  async function (deliveryId: string, { container }) {
    if (!deliveryId) {
      throw new Error("Delivery ID is required");
    }

    const remoteQuery = container.resolve("remoteQuery");
    const deliveryQuery = remoteQueryObjectFromString({
      entryPoint: "deliveries",
      filters: {
        id: deliveryId,
      },
      fields: ["id", "restaurant.id"],
    });

    const deliveries = await remoteQuery(deliveryQuery);
    
    if (!deliveries || deliveries.length === 0) {
      throw new Error(`No delivery found with ID: ${deliveryId}`);
    }

    const delivery = deliveries[0];

    if (!delivery.restaurant || !delivery.restaurant.id) {
      throw new Error(`No restaurant associated with delivery ${deliveryId}`);
    }

    const eventBus = container.resolve(ModuleRegistrationName.EVENT_BUS);
    
    await eventBus.emit({
      name: "notify.restaurant",
      data: {
        restaurant_id: delivery.restaurant.id,
        delivery_id: delivery.id,
      },
    });

    return delivery;
  },
  function (input: string, { container }) {
    const logger = container.resolve("logger");
    
    try {
      logger.error("Failed to notify restaurant", { 
        deliveryId: input,
        timestamp: new Date().toISOString() 
      });
    } catch (loggerError) {
      console.error("Error logging notification failure", loggerError);
    }
  }
);
