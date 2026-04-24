"use client";

import { FadeIn } from "./FadeIn";

type Props = {
  children: React.ReactNode[];
};

export function StaggerContainer({ children }: Props) {
  return (
    <>
      {children.map((child, index) => (
        <FadeIn key={index} delay={index * 500}>
          {child}
        </FadeIn>
      ))}
    </>
  );
}
