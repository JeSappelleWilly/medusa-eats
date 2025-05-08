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
              <div className="flex flex-1 flex-col items-center overflow-y-auto">
                <div className="mx-auto flex w-full max-w-[720px] flex-col gap-y-8 px-2 py-16">
                  <div>
                    <Heading className="capitalize">Create Restaurant</Heading>
                  </div>
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
                </div>
              </div>
            </FocusModal.Body>
          </form>
        </FormProvider>
      </FocusModal.Content>
    </FocusModal>
  );
};
