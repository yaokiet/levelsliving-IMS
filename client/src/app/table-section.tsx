import MainPageTable from "@/components/table/main-page-table"
import UsersTable from "@/components/table/users-table";

export default function TableSection() {
  return (
    <div>
      <div>
        <MainPageTable />
      </div>
      <div>
        <UsersTable />
      </div>
    </div>
  )
}
