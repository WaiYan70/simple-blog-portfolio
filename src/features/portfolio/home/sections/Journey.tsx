import { Section } from "@/components/shared/Section";
import { SectionHeader } from "@/components/shared/SectionHeader";

import { BigJourneyCard } from "../components/journey/BigCard";
import { SmallJourneyCard } from "../components/journey/SmallCard";
import { MobileJourneyCard } from "../components/journey/MobileCard";
import { journey } from "../data/journey";
import {
  JourneyTimeLine,
  JourneyTimeLineItem,
} from "../components/journey/JourneyTimeline";

export function Journey() {
  return (
    <Section>
      <SectionHeader
        title="Engineering Journey"
        description="A short timeline of my experience and how I got here."
      />

      <JourneyTimeLine>
        {journey.map((item) => (
          <JourneyTimeLineItem
            key={`${item.period}-${item.context}`}
            smallCard={<SmallJourneyCard item={item} />}
            bigCard={<BigJourneyCard item={item} />}
            mobileCard={<MobileJourneyCard item={item} />}
          />
        ))}
      </JourneyTimeLine>
    </Section>
  );
}
