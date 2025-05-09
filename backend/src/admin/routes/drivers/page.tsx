import { defineRouteConfig } from "@medusajs/admin-sdk";
import {
  Container,
  Heading,
  Table,
  Text,
  Button,
} from "@medusajs/ui";
import { DriverDTO } from "../../../modules/delivery/types/common";
import DriverActionsMenu from "../../components/driver-actions-menu";
import { BikeIcon } from "../../components/icons";
import { useDeliveries, useDrivers } from "../../hooks";
import { useNavigate } from "react-router-dom";
import { Plus, StackPerspective } from "@medusajs/icons"
import { CreateDriverForm } from "../../components/forms/drivers/create-driver-form";

const Drivers = () => {
  const { data, loading } = useDrivers();

  const handleCreate = () => {
    // Implement your create logic here or navigate to a create page
    console.log("Create button clicked");
  };

  const handleExport = () => {
    // Implement your export logic here
    console.log("Export button clicked");
  };

  return (
    <Container className="flex flex-col p-0 overflow-hidden">
      <div className="p-6 flex items-center justify-between">
        <Heading className="txt-large-plus">Drivers</Heading>
        <div className="flex gap-x-2">
          <CreateDriverForm />
          <Button variant="secondary" onClick={handleExport}>
            <StackPerspective className="mr-2" />
            Export
          </Button>
        </div>
      </div>
      <Table>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Name</Table.HeaderCell>
            <Table.HeaderCell>Phone</Table.HeaderCell>
            <Table.HeaderCell>Email</Table.HeaderCell>
            <Table.HeaderCell>Completed deliveries</Table.HeaderCell>
            <Table.HeaderCell>Actions</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        {loading && <Text>Loading...</Text>}
        {data?.drivers && (
          <Table.Body>
            {data.drivers.map((driver) => {
              return (
                <Table.Row key={driver.id}>
                  <Table.Cell className="flex gap-2 items-center">
                    {driver.avatar_url && (
                      <img
                        src={driver.avatar_url}
                        className="rounded-full h-8"
                      />
                    )}
                    {driver.first_name} {driver.last_name}
                  </Table.Cell>
                  <Table.Cell>{driver.phone}</Table.Cell>
                  <Table.Cell>{driver.email}</Table.Cell>
                  <Table.Cell>
                    <DeliveryCount driver={driver} />
                  </Table.Cell>
                  <Table.Cell>
                    <DriverActionsMenu driver={driver} />
                  </Table.Cell>
                </Table.Row>
              );
            })}
          </Table.Body>
        )}
      </Table>
      <div className="p-6"></div>
    </Container>
  );
};

const DeliveryCount = ({ driver }: { driver: DriverDTO }) => {
  const { data, loading } = useDeliveries({
    driver_id: driver.id,
  });

  return <Text>{loading ? "Loading..." : data?.deliveries.length}</Text>;
};

export const config = defineRouteConfig({
  label: "Drivers",
  icon: BikeIcon,
});

export default Drivers;
