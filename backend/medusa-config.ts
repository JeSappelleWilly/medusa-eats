import { loadEnv, defineConfig, Modules } from "@medusajs/framework/utils";

loadEnv(process.env.NODE_ENV || "development", process.cwd());
const REDIS_URL = process.env.REDIS_URL || "redis://localhost:6379"

module.exports = defineConfig({
  admin: {
    backendUrl: "https://backend-production-a427.up.railway.app",
  },
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    redisUrl: process.env.REDIS_URL,
    http: {
      storeCors: process.env.STORE_CORS,
      adminCors: process.env.ADMIN_CORS,
      authCors: process.env.AUTH_CORS,
      jwtSecret: process.env.JWT_SECRET || "supersecret",
      cookieSecret: process.env.COOKIE_SECRET || "supersecret",
    },
  },
  modules: {
    eventBus: {
      resolve: "@medusajs/event-bus-redis",
      options: {
        redisUrl: REDIS_URL
      }
    },
    [Modules.WORKFLOW_ENGINE]: {
      resolve: "@medusajs/medusa/workflow-engine-inmemory",
    },
    cacheService: {
      resolve: "@medusajs/cache-redis",
      options: {
        redisUrl: REDIS_URL
      }
    },
    restaurantModuleService: {
      resolve: "./modules/restaurant",
    },
    deliveryModuleService: {
      resolve: "./modules/delivery",
    },
    [Modules.FULFILLMENT]: {
      options: {
        providers: [
          {
            resolve: "@medusajs/fulfillment-manual",
            id: "manual-provider",
          },
        ],
      },
    },
  },
});
