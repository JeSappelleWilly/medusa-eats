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
} from "@medusajs/ui"

const driverSchema = zod.object({
  first_name: zod.string().min(2, "First name must be at least 2 characters"),
  last_name: zod.string().min(2, "Last name must be at least 2 characters"),
  email: zod.string().email("Invalid email format"),
  phone: zod.string().min(7, "Phone number must be at least 7 digits"),
  avatar_url: zod.string().optional(),
});

type DriverFormValues = zod.infer<typeof driverSchema>;

export const CreateDriverForm = () => {
  const form = useForm<DriverFormValues>({
    resolver: zodResolver(driverSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      avatar_url: "",
    },
  });

  const { handleSubmit } = form;

  const onSubmit = (data: DriverFormValues) => {
    // TODO: Implement your create driver logic here
    console.log("Create Driver Data:", data);
  };

  return (
    <FocusModal>
      <FocusModal.Trigger asChild>
        <Button>Create Driver</Button>
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
            <FocusModal.Body className="flex flex-1 flex-col items-center overflow-y-auto p-6">
              <div className="mx-auto flex w-full max-w-[720px] flex-col gap-y-8">
                <div>
                  <Heading className="capitalize">Create Driver</Heading>
                </div>
                <div className="grid grid-cols-2 gap-x-4 gap-y-6">
                  <div className="flex flex-col space-y-2">
                    <Label size="small" weight="plus">
                      First Name
                    </Label>
                    <Input {...form.register("first_name")} />
                  </div>
                  <div className="flex flex-col space-y-2">
                    <Label size="small" weight="plus">
                      Last Name
                    </Label>
                    <Input {...form.register("last_name")} />
                  </div>
                  <div className="flex flex-col space-y-2">
                    <Label size="small" weight="plus">
                      Email
                    </Label>
                    <Input {...form.register("email")} />
                  </div>
                  <div className="flex flex-col space-y-2">
                    <Label size="small" weight="plus">
                      Phone
                    </Label>
                    <Input {...form.register("phone")} />
                  </div>
                  <div className="col-span-2 flex flex-col space-y-2">
                    <Label size="small" weight="plus">
                      Avatar URL (Optional)
                    </Label>
                    <Input {...form.register("avatar_url")} />
                  </div>
                </div>
              </div>
            </FocusModal.Body>
            <FocusModal.Footer>
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
