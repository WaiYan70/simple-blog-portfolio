import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { FileText, Download } from "lucide-react";

export function ResumeDrawer() {
  return (
    <div className="flex flex-wrap gap-2">
      <Drawer>
        <DrawerTrigger asChild>
          <Button variant="default">
            <FileText className="h-4 w-4" />
            Review CV
          </Button>
        </DrawerTrigger>
        <DrawerContent className="data-[vaul-drawer-direction=bottom]:max-h-[70vh] data-[vaul-drawer-direction=top]:max-h-[50vh]">
          <DrawerHeader>
            <DrawerTitle>Khant Wai Yan - Resume</DrawerTitle>
            <DrawerDescription>
              Preview my resume here, or open the PDF in a new tab.
            </DrawerDescription>
          </DrawerHeader>
          <div className="no-scrollbar min-h-0 flex-1 overflow-y-auto overscroll-contain px-4">
            <div className="border-y border-border bg-muted/30">
              <Image
                src="/resume/KhantWaiYan_Resume_150.png"
                alt="Preview of Khant Wai Yan's resume"
                width={1240}
                height={1753}
                unoptimized
                className="h-auto w-full border"
              />
            </div>
          </div>
          <DrawerFooter>
            <Button variant="default" asChild>
              <a href="/resume/KhantWaiYan_Resume.pdf" download>
                <Download className="h-4 w-4" />
                Download
              </a>
            </Button>
            <DrawerClose asChild>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
