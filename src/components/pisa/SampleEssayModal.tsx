import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "./StatusBadge";
import { LoadingState } from "./EmptyState";
import { generateSampleEssay, SAMPLE_ESSAY_PROMPT_TEMPLATE } from "@/lib/ai";
import { Sparkles, Wand2 } from "lucide-react";
import { toast } from "sonner";

type Style = "simple" | "natural" | "teacher";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  questionPrompt: string;
  studentEssay: string;
  defaultTargetBand?: number;
  onAttach: (sample: string) => void;
}

const BANDS = [5.5, 6.0, 6.5, 7.0, 7.5, 8.0];

export const SampleEssayModal = ({
  open,
  onOpenChange,
  questionPrompt,
  studentEssay,
  defaultTargetBand = 6.5,
  onAttach,
}: Props) => {
  const [target, setTarget] = useState(defaultTargetBand);
  const [style, setStyle] = useState<Style>("natural");
  const [instructions, setInstructions] = useState("");
  const [generating, setGenerating] = useState(false);
  const [output, setOutput] = useState("");

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const text = await generateSampleEssay({
        questionPrompt,
        studentEssay,
        targetBand: target,
        style,
        instructions,
      });
      setOutput(text);
    } catch (e) {
      toast.error("Couldn't generate sample. Try again.");
    } finally {
      setGenerating(false);
    }
  };

  const handleAttach = () => {
    if (!output.trim()) {
      toast.error("Generate or write a sample first.");
      return;
    }
    onAttach(output);
    toast.success("Sample essay attached to feedback.");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl p-0 overflow-hidden rounded-2xl border-border">
        <div className="bg-pisa-purple text-pisa-purple-deep p-5 relative overflow-hidden">
          <div className="absolute -top-12 -right-12 h-44 w-44 rounded-full bg-white/30" />
          <DialogHeader className="relative">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              <StatusBadge variant="purple">AI assist</StatusBadge>
            </div>
            <DialogTitle className="font-display text-2xl text-pisa-purple-deep mt-2">
              Generate a teachable sample essay
            </DialogTitle>
            <p className="text-[13px] text-pisa-purple-deep/80 mt-1">
              The model uses the question, the student's essay, your target band, and your style notes.
              You always review and approve before sending.
            </p>
          </DialogHeader>
        </div>

        <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
          <div>
            <label className="text-[12px] font-medium text-muted-foreground">Target band</label>
            <div className="mt-1 flex flex-wrap gap-1.5">
              {BANDS.map((b) => (
                <button
                  key={b}
                  type="button"
                  onClick={() => setTarget(b)}
                  className={`h-8 px-3 rounded-pill text-[12px] font-medium border ${
                    target === b
                      ? "bg-pisa-navy text-white border-pisa-navy"
                      : "bg-white text-pisa-navy border-border hover:border-pisa-navy/40"
                  }`}
                >
                  {b.toFixed(1)}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-[12px] font-medium text-muted-foreground">Style</label>
            <div className="mt-1 grid grid-cols-3 gap-1.5">
              {([
                { id: "simple", label: "Simple & clear" },
                { id: "natural", label: "Band 7 natural" },
                { id: "teacher", label: "Teacher-style" },
              ] as { id: Style; label: string }[]).map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setStyle(s.id)}
                  className={`py-2 rounded-xl text-[12px] font-medium border transition-all ${
                    style === s.id
                      ? "bg-pisa-navy text-white border-pisa-navy"
                      : "bg-white text-pisa-navy border-border hover:border-pisa-navy/40"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-[12px] font-medium text-muted-foreground">Additional instructions (optional)</label>
            <textarea
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="e.g. Keep the student's example about Vietnamese tech firms."
              className="mt-1 w-full min-h-[64px] rounded-xl border border-border bg-white p-3 text-sm focus:outline-none focus:border-pisa-navy focus:ring-[3px] focus:ring-pisa-navy/15 resize-y"
            />
          </div>

          <div className="flex justify-end">
            <Button variant="primary" onClick={handleGenerate} disabled={generating}>
              <Wand2 className="h-4 w-4" /> {generating ? "Generating…" : "Generate"}
            </Button>
          </div>

          {generating && <LoadingState label="Drafting a band-appropriate sample…" />}

          {output && (
            <div>
              <label className="text-[12px] font-medium text-muted-foreground">
                Generated sample (editable — review before sending)
              </label>
              <textarea
                value={output}
                onChange={(e) => setOutput(e.target.value)}
                className="mt-1 w-full min-h-[260px] rounded-xl border border-border bg-secondary p-4 text-[14px] leading-[1.75] focus:outline-none focus:border-pisa-navy focus:ring-[3px] focus:ring-pisa-navy/15 resize-y"
              />
            </div>
          )}

          <details className="text-[11px] text-muted-foreground">
            <summary className="cursor-pointer">Prompt template used</summary>
            <pre className="mt-2 whitespace-pre-wrap rounded-lg bg-secondary p-3">
              {SAMPLE_ESSAY_PROMPT_TEMPLATE(target)}
            </pre>
          </details>
        </div>

        <div className="flex items-center justify-end gap-2 p-4 border-t border-border bg-secondary/40">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button variant="accent" onClick={handleAttach} disabled={!output}>
            Attach sample essay to feedback
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};