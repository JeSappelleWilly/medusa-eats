import {
  createWorkflow,
  WorkflowData,
  WorkflowResponse,
} from "@medusajs/workflows-sdk";
import { UpdateDeliveryDTO } from "../../../modules/delivery/types/mutations";
import { updateDeliveryStep } from "../../delivery/steps";
import { setStepFailedStep, setStepSuccessStep } from "../../util/steps";

export type WorkflowInput = {
  data: UpdateDeliveryDTO;
  stepIdToSucceed?: string;
  stepIdToFail?: string;
};

export const updateDeliveryWorkflow = createWorkflow(
  "update-delivery-workflow",
  function (input: WorkflowData<WorkflowInput>) {
    // Update the delivery with the provided data
    const updatedDelivery = updateDeliveryStep({
      data: input.data,
    }) as WorkflowData<any>;

    // Ensure the delivery has all required properties
    const completeDelivery = {
      ...updatedDelivery,
      items: updatedDelivery.items || [],
      restaurant: updatedDelivery.restaurant || null,
    };

    // If a stepIdToSucceed is provided, we will set that step as successful
    if (input.stepIdToSucceed) {
      setStepSuccessStep({
        stepId: input.stepIdToSucceed,
        updatedDelivery: completeDelivery,
      });
    }

    // If a stepIdToFail is provided, we will set that step as failed
    if (input.stepIdToFail) {
      setStepFailedStep({
        stepId: input.stepIdToFail,
        updatedDelivery: completeDelivery,
      });
    }

    // Return the updated delivery
    return new WorkflowResponse(completeDelivery);
  }
);
