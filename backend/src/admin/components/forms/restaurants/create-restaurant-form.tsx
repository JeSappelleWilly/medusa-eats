import React from "react"
import { useForm, FormProvider, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as zod from "zod"
import {
  FocusModal,
  Heading,
  Label,
  Input,
  Button,
  Checkbox,
} from "@medusajs/ui"

const restaurantSchema = zod.object({
  handle: zod.string().min(3, "Handle must be at least 3 characters"),
  is_open: zod.boolean().default(false),
  name: zod.string().min(2, "Name must be at least 2 characters"),
  description: zod.string().optional(),
  address: zod.string().min(5, "Address must be at least 5 characters"),
  phone: zod.string().min(7, "Phone number must be at least 7 digits"),
  email: zod.string().email("Invalid email format"),
  image_url: zod.string().optional(),
});

type RestaurantFormValues = zod.infer<typeof restaurantSchema>;

export const CreateRestaurantForm = () => {
  const form = useForm<RestaurantFormValues>({
    resolver: zodResolver(restaurantSchema),
    defaultValues: {
      handle: "",
      is_open: false,
      name: "",
      description: "",
      address: "",
      phone: "",
      email: "",
      image_url: "",
    },
  });

  const { handleSubmit } = form;

  const onSubmit = (data: RestaurantFormValues) => {
    // TODO: Implement your create logic here (e.g., API call)
    console.log("Create Restaurant Data:", data);
  };

  return (
    <FocusModal>
      <FocusModal.Trigger asChild>
        <Button>Create Restaurant</Button>
      </FocusModal.Trigger>
      <FocusModal.Content>
        <FormProvider {...form}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex h-full flex-col overflow-hidden"
          >
            <FocusModal.Header>
              <div className="flex items-center justify-end gap-x-2">
                <FocusModal.Close asChild>
                  <Button size="small" variant="secondary">
                    Cancel
                  </Button>
                </FocusModal.Close>
                <Button type="submit" size="small">
                  Save
                </Button>
              </div>
            </FocusModal.Header>
            <FocusModal.Body>
              <div className="flex flex-1 flex-col items-center overflow-y-auto p-6"> {/* Added p-6 for padding */}
                <div className="mx-auto flex w-full max-w-[720px] flex-col gap-y-8"> {/* Increased gap-y */}
                  <div>
                    <Heading className="capitalize">Create Restaurant</Heading>
                  </div>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-6"> {/* Added gap-y */}
                    <div className="flex flex-col space-y-2">
                      <Label size="small" weight="plus">
                        Handle
                      </Label>
                      <Input {...form.register("handle")} /> {/* Using register for simplicity */}
                    </div>
                    <div className="flex flex-col space-y-2">
                      <Label size="small" weight="plus">
                        Name
                      </Label>
                      <Input {...form.register("name")} />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox {...form.register("is_open")} />
                      <Label size="small" weight="plus">
                        Is Open
                      </Label>
                    </div>
                    <div className="flex flex-col space-y-2">
                      <Label size="small" weight="plus">
                        Address
                      </Label>
                      <Input {...form.register("address")} />
                    </div>
                    <div className="flex flex-col space-y-2">
                      <Label size="small" weight="plus">
                        Phone
                      </Label>
                      <Input {...form.register("phone")} />
                    </div>
                    <div className="flex flex-col space-y-2">
                      <Label size="small" weight="plus">
                        Email
                      </Label>
                      <Input {...form.register("email")} />
                    </div>
                    <div className="flex flex-col space-y-2">
                      <Label size="small" weight="plus">
                        Description
                      </Label>
                      <Input {...form.register("description")} />
                    </div>
                    <div className="flex flex-col space-y-2">
                      <Label size="small" weight="plus">
                        Image URL
                      </Label>
                      <Input {...form.register("image_url")} />
                    </div>
                  </div>
                </div>
              </div>
            </FocusModal.Body>
            <FocusModal.Footer> {/* Added FocusModal.Footer */}
              <div className="flex justify-end gap-x-2">
                <FocusModal.Close asChild>
                  <Button size="small" variant="secondary">
                    Cancel
                  </Button>
                </FocusModal.Close>
                <Button type="submit" size="small">
                  Save
                </Button>
              </div>
            </FocusModal.Footer>
          </form>
        </FormProvider>
      </FocusModal.Content>
    </FocusModal>
  );
};
