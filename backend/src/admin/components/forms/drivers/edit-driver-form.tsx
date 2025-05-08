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
} from "@medusajs/ui"
import { DriverDTO } from "../types/common"

const driverSchema = zod.object({
  first_name: zod.string().min(2, "First name must be at least 2 characters"),
  last_name: zod.string().min(2, "Last name must be at least 2 characters"),
  email: zod.string().email("Invalid email format"),
  phone: zod.string().min(7, "Phone number must be at least 7 digits"),
  avatar_url: zod.string().optional().nullable(),
});

type DriverFormValues = zod.infer<typeof driverSchema>;

interface EditDriverFormProps {
  initialValues?: DriverDTO;
  onClose: () => void;
}

export const EditDriverForm: React.FC<EditDriverFormProps> = ({ initialValues, onClose }) => {
  const form = useForm<DriverFormValues>({
    resolver: zodResolver(driverSchema),
    defaultValues: initialValues || {
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      avatar_url: null,
    },
  });

  const { handleSubmit } = form;

  const onSubmit = (data: DriverFormValues) => {
    // TODO: Implement your update driver logic here (with driver ID)
    console.log("Edit Driver Data:", data);
    onClose();
  };

  return (
    <Drawer.Content>
      <FormProvider {...form}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-1 flex-col overflow-hidden"
        >
          <Drawer.Header>
            <Heading className="capitalize">Edit Driver</Heading>
          </Drawer.Header>
          <Drawer.Body className="flex max-w-full flex-1 flex-col gap-y-8 overflow-y-auto p-6">
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
          </Drawer.Body>
          <Drawer.Footer>
            <div className="flex justify-end gap-x-2">
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

export const EditDriverFormWithTrigger = ({ initialValues, onClose }: { initialValues?: DriverDTO, onClose: () => void }) => (
  <Drawer>
    <Drawer.Trigger asChild>
      <Button>Edit Driver</Button>
    </Drawer.Trigger>
    <EditDriverForm initialValues={initialValues} onClose={onClose} />
  </Drawer>
);
