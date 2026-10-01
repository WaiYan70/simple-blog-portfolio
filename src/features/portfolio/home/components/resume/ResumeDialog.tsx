import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ExternalLink, FileText, Download } from "lucide-react";

type ResumeDialogProps = {
  openDialog: boolean;
  setOpenDialog: React.Dispatch<React.SetStateAction<boolean>>;
};

export function ResumeDialog({ openDialog, setOpenDialog }: ResumeDialogProps) {
  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogTrigger asChild>
        <Button variant="default">
          <FileText className="h-4 w-4" />
          Review CV
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] gap-4 overflow-hidden p-0 sm:max-w-3xl">
        <DialogHeader className="px-5 pt-5">
          <DialogTitle>Khant Wai Yan - Resume</DialogTitle>
          <DialogDescription>
            Preview my resume here, or open the PDF in a new tab.
          </DialogDescription>
        </DialogHeader>

        <div className="h-[65vh] overflow-y-auto overscroll-contain border-y border-border bg-muted/30">
          <Image
            src="/resume/KhantWaiYan_Resume_150.png"
            alt="Preview of Khant Wai Yan's resume"
            width={1240}
            height={1753}
            unoptimized
            className="h-auto w-full border"
          />
        </div>

        <DialogFooter className="px-5 pb-5">
          <Button variant="default" asChild>
            <a href="/resume/KhantWaiYan_Resume.pdf" download>
              <Download className="h-4 w-4" />
              Download
            </a>
          </Button>
          <Button asChild>
            <a
              href="/resume/KhantWaiYan_Resume.pdf"
              target="_blank"
              rel="noreferrer"
            >
              <ExternalLink className="h-4 w-4" />
              Open in new tab
            </a>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
