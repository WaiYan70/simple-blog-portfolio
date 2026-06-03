import Chart from "./Chart";
import { RecentTransactions } from "./RecentTransaction";
import StatCards from "./StatCards";

export default function Dashboard() {
  return (
    <div className="rounded-lg pb-4 shadow h-[200vh]">
      <div className="grid grid-cols-12 gap-3 px-4">
        <StatCards />
        <Chart />
        <RecentTransactions />
      </div>
    </div>
  );
}
