import MainPageTable from "@/components/table/main/main-page-table"
import UsersTable from "@/components/table/users/users-table";

export default function TableSection() {
  return (
    <div className="container mx-auto py-10">
      <div>
        <MainPageTable />
      </div>
      <div>
        <UsersTable />
      </div>
    </div>
  )
}
