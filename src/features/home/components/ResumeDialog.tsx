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
        <Button className="inline-flex items-center gap-2 rounded-sm bg-primary-foreground px-4 py-2 text-sm font-medium text-primary shadow-sm transition hover:-translate-y-0.5 hover:bg-primary-foreground/90 hover:shadow-md active:translate-y-0">
          <FileText className="h-4 w-4" />
          Review CV
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] gap-4 overflow-hidden p-0 sm:max-w-3xl">
        <DialogHeader className="px-5 pt-5">
          <DialogTitle>Khant Wai Yan - Resume</DialogTitle>
          <DialogDescription>
            Preview the resume here, or open the PDF in a new tab.
          </DialogDescription>
        </DialogHeader>

        <div className="h-[65vh] overflow-y-auto border-y border-border bg-muted/30">
          <Image
            src="/resume/resume-preview.png"
            alt="Preview of Khant Wai Yan's resume"
            width={1275}
            height={1650}
            className="h-auto w-full border"
          />
        </div>

        <DialogFooter className="px-5 pb-5">
          <Button variant="default" asChild>
            <a href="/Resume.pdf" download>
              <Download className="h-4 w-4" />
              Download
            </a>
          </Button>
          <Button asChild>
            <a href="/resume/resume.pdf" target="_blank" rel="noreferrer">
              <ExternalLink className="h-4 w-4" />
              Open in new tab
            </a>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
