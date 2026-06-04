import Chart from "./Chart";
import { RecentTransactions } from "./RecentTransaction";
import StatCards from "./StatCards";

export default function Dashboard() {
  return (
    <div className="@container/main flex flex-1 flex-col h-[200vh]">
      <div className="flex flex-col gap-4 md-gap-6 md:py-6">
        <StatCards />
        {/*<Chart />*/}
        <RecentTransactions />
      </div>
    </div>
  );
}
