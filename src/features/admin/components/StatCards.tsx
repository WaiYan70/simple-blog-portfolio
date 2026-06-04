import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TrendingDown, TrendingUp } from "lucide-react";

const stateCardData = [
  {
    title: "Gross Revenue",
    value: "$120,54.24",
    pillText: "2.75%",
    trend: "up",
    period: "From Jan 1st - Jul 31st",
  },
  {
    title: "Avg Order",
    value: "$27.97",
    pillText: "1.01%",
    trend: "down",
    period: "From Jan 1st - Jul 31st",
  },
  {
    title: "Revenue",
    value: "$120,04.24",
    pillText: "2.75%",
    trend: "up",
    period: "From Jan 1st - Jul 31st",
  },
  {
    title: "Trailing Year",
    value: "$278,05.4",
    pillText: "60.75%",
    trend: "up",
    period: "Previous 365 days",
  },
];

export default function StateCard() {
  return (
    <div className="px-4 grid grid-cols-1 @xl/main:grid-cols-2 @5xl/main:grid-cols-4 gap-4 *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs dark:*:data-[slot=card]:bg-card">
      {stateCardData.map((card) => (
        <Card className="@container/card" key={card.title}>
          <CardHeader>
            <CardDescription>{card.title}</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {card.value}
            </CardTitle>
            <CardAction>
              <Badge variant="outline">
                {card.trend === "up" ? <TrendingUp /> : <TrendingDown />}
                {card.pillText}
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">
              Trending up this month{" "}
              {card.trend === "up" ? (
                <TrendingUp size={18} />
              ) : (
                <TrendingDown size={18} />
              )}
            </div>
            <div className="text-muted-foreground">{card.period}</div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
