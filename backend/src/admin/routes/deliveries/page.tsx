import { defineRouteConfig } from "@medusajs/admin-sdk";
import { Button, Container, Heading, Table, Text } from "@medusajs/ui";
import DeliveryRow from "../../components/delivery-row";
import { PizzaIcon } from "../../components/icons";
import { useDeliveries } from "../../hooks";
import { Plus, StackPerspective } from "@medusajs/icons"

const Deliveries = () => {
  const { data, loading } = useDeliveries();

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
        <Heading className="txt-large-plus">Deliveries</Heading>
        <div className="flex gap-x-2">
          <Button variant="primary" onClick={handleCreate}>
            <Plus className="mr-2" />
            Create
          </Button>
          <Button variant="secondary" onClick={handleExport}>
            <StackPerspective className="mr-2" />
            Export
          </Button>
        </div>
      </div>
      {loading && <Text>Loading...</Text>}
      {data?.deliveries && (
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>ID</Table.HeaderCell>
              <Table.HeaderCell>Created</Table.HeaderCell>
              <Table.HeaderCell>Status</Table.HeaderCell>
              <Table.HeaderCell>Delivery</Table.HeaderCell>
              <Table.HeaderCell>Restaurant</Table.HeaderCell>
              <Table.HeaderCell>Items</Table.HeaderCell>
              <Table.HeaderCell>Action</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {data.deliveries.map((delivery) => (
              <DeliveryRow key={delivery.id} delivery={delivery} />
            ))}
          </Table.Body>
        </Table>
      )}
      <div className="p-6"></div>
    </Container>
  );
};

export const config = defineRouteConfig({
  label: "Deliveries",
  icon: PizzaIcon,
});

export default Deliveries;
