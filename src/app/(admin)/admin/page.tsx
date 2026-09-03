import Chart from "@/features/admin/dashboard/Chart";
import { RecentTransactions } from "@/features/admin/dashboard/RecentTransaction";
import StateCard from "@/features/admin/dashboard/StatCards";


export default function AdminHomePage() {
  return (
    <div className="@container/main flex flex-1 flex-col h-[200vh]">
      <div className="flex flex-col gap-4 md-gap-6 md:py-6">
        <StateCard />
        <div className="px-4">
          <Chart />
        </div>
        <div className="px-4">
          <RecentTransactions />
        </div>
      </div>
    </div>
  );
}
