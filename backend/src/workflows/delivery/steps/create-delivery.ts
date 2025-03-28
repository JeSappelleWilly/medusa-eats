import { StepResponse, createStep } from "@medusajs/workflows-sdk";
import { DeliveryDTO } from "../../../modules/delivery/types/common";
import { DELIVERY_MODULE } from "../../../modules/delivery";

export const createDeliveryStepId = "create-delivery-step";
export const createDeliveryStep = createStep(
  createDeliveryStepId,
  async function (input, { container }) {
    const service = container.resolve(DELIVERY_MODULE);
    
    // Provide the required properties for DeliveryDTO
    const deliveryData = {
      transaction_id: input.transaction_id || '', // Provide a transaction ID
      driver_id: input.driver_id || '', // Optional driver ID
      delivery_status: 'pending', // Initial delivery status
      eta: new Date(), // Estimated time of arrival
      items: input.items || [], // Delivery items
      restaurant: input.restaurant || null, // Associated restaurant
    };

    const delivery = await service.createDeliveries(deliveryData) as DeliveryDTO;
    
    return new StepResponse(delivery, {
      delivery_id: delivery.id,
    });
  },
  async function (
    {
      delivery_id,
    },
    { container }
  ) {
    const service = container.resolve(DELIVERY_MODULE);
    await service.softDeleteDeliveries(delivery_id);
  }
);
