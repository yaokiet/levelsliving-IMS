import MainPageTable from "@/components/table/main/main-page-table";

// This component now just acts as a layout container
export default function TableSection() {
  return (
    <div className="container mx-auto py-10 px-6">
      <div>
        <MainPageTable />
      </div>
    </div>
  );
}
