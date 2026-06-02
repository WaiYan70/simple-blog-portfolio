import Chart from "./Chart";
import { RecentTransactions } from "./RecentTransaction";
import StatCards from "./StatCards";

export default function Grid() {
  return (
    <div className="grid grid-cols-12 gap-3 px-4">
      <StatCards />
      <Chart />
      <RecentTransactions />
    </div>
  );
}
