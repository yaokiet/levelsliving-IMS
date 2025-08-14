import ItemComponentsTable from "./main/item-components-table";

// This component now just acts as a layout container
export default function ItemTableSection() {
  return (
    <div className="container mx-auto py-10 px-6">
      <div>
        <ItemComponentsTable />
      </div>
    </div>
  );
}
