import React from "react"
import { useForm, FormProvider, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as zod from "zod"
import {
  Drawer,
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

// Define props to pass initial data for editing
interface EditRestaurantFormProps {
  initialValues?: RestaurantFormValues;
  onClose: () => void;
}

export const EditRestaurantForm: React.FC<EditRestaurantFormProps> = ({ initialValues, onClose }) => {
  const form = useForm<RestaurantFormValues>({
    resolver: zodResolver(restaurantSchema),
    defaultValues: initialValues || {
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
    // TODO: Implement your update logic here (e.g., API call with ID)
    console.log("Edit Restaurant Data:", data);
    onClose(); // Close the drawer after submission
  };

  return (
    <Drawer.Content>
      <FormProvider {...form}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-1 flex-col overflow-hidden"
        >
          <Drawer.Header>
            <Heading className="capitalize">Edit Restaurant</Heading>
          </Drawer.Header>
          <Drawer.Body className="flex max-w-full flex-1 flex-col gap-y-8 overflow-y-auto p-6">
            <div className="grid grid-cols-2 gap-4">
              <Controller
                name="handle"
                control={form.control}
                render={({ field }) => (
                  <div className="flex flex-col space-y-2">
                    <Label size="small" weight="plus">
                      Handle
                    </Label>
                    <Input {...field} />
                  </div>
                )}
              />
              <Controller
                name="name"
                control={form.control}
                render={({ field }) => (
                  <div className="flex flex-col space-y-2">
                    <Label size="small" weight="plus">
                      Name
                    </Label>
                    <Input {...field} />
                  </div>
                )}
              />
              <Controller
                name="is_open"
                control={form.control}
                render={({ field }) => (
                  <div className="flex items-center space-x-2">
                    <Checkbox checked={field.value} onChange={field.onChange} />
                    <Label size="small" weight="plus">
                      Is Open
                    </Label>
                  </div>
                )}
              />
              <Controller
                name="address"
                control={form.control}
                render={({ field }) => (
                  <div className="flex flex-col space-y-2">
                    <Label size="small" weight="plus">
                      Address
                    </Label>
                    <Input {...field} />
                  </div>
                )}
              />
              <Controller
                name="phone"
                control={form.control}
                render={({ field }) => (
                  <div className="flex flex-col space-y-2">
                    <Label size="small" weight="plus">
                      Phone
                    </Label>
                    <Input {...field} />
                  </div>
                )}
              />
              <Controller
                name="email"
                control={form.control}
                render={({ field }) => (
                  <div className="flex flex-col space-y-2">
                    <Label size="small" weight="plus">
                      Email
                    </Label>
                    <Input {...field} />
                  </div>
                )}
              />
              <Controller
                name="description"
                control={form.control}
                render={({ field }) => (
                  <div className="flex flex-col space-y-2">
                    <Label size="small" weight="plus">
                      Description
                    </Label>
                    <Input {...field} />
                  </div>
                )}
              />
              <Controller
                name="image_url"
                control={form.control}
                render={({ field }) => (
                  <div className="flex flex-col space-y-2">
                    <Label size="small" weight="plus">
                      Image URL
                    </Label>
                    <Input {...field} />
                  </div>
                )}
              />
            </div>
          </Drawer.Body>
          <Drawer.Footer>
            <div className="flex items-center justify-end gap-x-2">
              <Drawer.Close asChild>
                <Button size="small" variant="secondary">
                  Cancel
                </Button>
              </Drawer.Close>
              <Button size="small" type="submit">
                Save
              </Button>
            </div>
          </Drawer.Footer>
        </form>
      </FormProvider>
    </Drawer.Content>
  );
};

export const EditRestaurantFormWithTrigger = ({ initialValues, onClose }: { initialValues?: RestaurantFormValues, onClose: () => void }) => (
  <Drawer>
    <Drawer.Trigger asChild>
      <Button>Edit Restaurant</Button>
    </Drawer.Trigger>
    <EditRestaurantForm initialValues={initialValues} onClose={onClose} />
  </Drawer>
);
