import MainPageTable from "@/components/table/main/main-page-table";
import UsersTable from "@/components/table/users/users-table";

// This component now just acts as a layout container
export default function TableSection() {
  return (
    <div className="container mx-auto py-10 px-6">
      <div>
        <MainPageTable />
      </div>
      <div>
        <UsersTable />
      </div>
    </div>
  );
}
