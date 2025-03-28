import {
  createWorkflow,
  WorkflowData,
  WorkflowResponse,
} from "@medusajs/workflows-sdk";
import { DeliveryStatus } from "../../../modules/delivery/types/common";
import { setStepSuccessStep } from "../../util/steps";
import { deleteDeliveryDriversStep, updateDeliveryStep } from "../steps";
import { findDriverStepId } from "../steps/find-driver";
import { DeliveryDTO } from "../../../modules/delivery/types/common";

export type ClaimWorkflowInput = {
  driver_id: string;
  delivery_id: string;
};

export const claimDeliveryWorkflow = createWorkflow(
  "claim-delivery-workflow",
  function (input: WorkflowData<ClaimWorkflowInput>) {
    // Update the delivery with the provided data
    const claimedDelivery = updateDeliveryStep({
      data: {
        id: input.delivery_id,
        driver_id: input.driver_id,
        delivery_status: DeliveryStatus.PICKUP_CLAIMED,
        // Add missing required properties
        items: [], // Ensure items are included
        restaurant: null, // Provide restaurant if applicable
      },
    }) as WorkflowData<DeliveryDTO>;

    // Delete the delivery drivers as they are no longer needed
    deleteDeliveryDriversStep({ delivery_id: claimedDelivery.id });

    // Set the step success for the find driver step
    // Ensure the updatedDelivery matches the expected type
    setStepSuccessStep({
      stepId: findDriverStepId,
      updatedDelivery: {
        ...claimedDelivery,
        id: claimedDelivery.id,
        items: claimedDelivery.items || [],
        restaurant: claimedDelivery.restaurant || null,
      },
    });

    // Return the updated delivery
    return new WorkflowResponse(claimedDelivery);
  }
);
