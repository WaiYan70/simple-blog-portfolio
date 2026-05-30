"use client";

import { useState } from "react";
import { useMediaQuery } from "../hook/useMediaQuery";
import { Mail } from "lucide-react";
import { Block } from "./Block";
import { Button } from "@/components/ui/button";
import { ResumeDialog } from "../resume/ResumeDialog";
import { ResumeDrawer } from "../resume/ResumeDrawer";

const handleScrollToContact = () => {
  document.getElementById("contact")?.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });

  window.history.pushState(null, "", "#contact");
};

export function ContactBlock() {
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  return (
    <Block className="col-span-12 md:col-span-6 bg-primary text-primary-foreground">
      <p className="text-xs uppercase tracking-[0.2em] opacity-75">
        Available for work
      </p>
      <h2 className="mt-2 text-2xl font-semibold">
        Have a project or role in mind?
      </h2>
      <div className="mt-2 sm:mt-5 flex gap-2">
        <Button
          onClick={handleScrollToContact}
          className="inline-flex items-center gap-2 rounded-sm bg-primary-foreground px-4 py-2 text-sm font-medium text-primary shadow-sm transition hover:-translate-y-0.5 hover:bg-primary-foreground/90 hover:shadow-md active:translate-y-0"
        >
          <Mail className="h-4 w-4" />
          Send Email
        </Button>
        {isDesktop ? (
          <ResumeDialog openDialog={openDialog} setOpenDialog={setOpenDialog} />
        ) : (
          <ResumeDrawer />
        )}
      </div>
    </Block>
  );
}
