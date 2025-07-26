import { SectionCards } from "@/components/sample/section-cards"
import TableSection from "../../components/table/table-section";

export default function Page() {
  return (
    <div>
      <h2 className="scroll-m-20 border-b pb-2 px-4 text-3xl font-semibold tracking-tight first:mt-0">
        Main page
      </h2>
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <SectionCards />
          </div>
          <div>
            <TableSection />
          </div>
        </div>
      </div>
    </div>
  )
}
