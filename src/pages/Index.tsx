import { Link } from "react-router-dom";
import { Navbar } from "@/components/pisa/Navbar";
import { HeroBanner } from "@/components/pisa/HeroBanner";
import { Button } from "@/components/ui/button";
import { MetricCard } from "@/components/pisa/MetricCard";
import { BandChip } from "@/components/pisa/BandChip";
import { StatusBadge } from "@/components/pisa/StatusBadge";
import { ProgressBar } from "@/components/pisa/ProgressBar";
import {
  PenLine,
  MessagesSquare,
  Sparkles,
  LineChart,
  ArrowRight,
} from "lucide-react";

const features = [
  {
    icon: PenLine,
    tag: "Submission",
    title: "Essay submission",
    desc: "Students write Task 1 or Task 2 essays in a clean editor with live word count and drafts.",
    color: "navy",
  },
  {
    icon: MessagesSquare,
    tag: "Feedback",
    title: "Teacher feedback",
    desc: "Teachers score the four IELTS criteria and write strengths, weaknesses, and next steps.",
    color: "pink",
  },
  {
    icon: Sparkles,
    tag: "AI assist",
    title: "AI-assisted sample essays",
    desc: "Generate a teachable model answer at the target band — teacher reviews before sending.",
    color: "purple",
  },
  {
    icon: LineChart,
    tag: "Progress",
    title: "Long-term progress",
    desc: "Every essay updates a student timeline so improvement is visible week after week.",
    color: "yellow",
  },
] as const;

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-6 md:py-8 space-y-10">
        <HeroBanner
          tag="IELTS Writing Hub"
          size="lg"
          title="Write, receive feedback, and improve every week."
          subtitle="A guided writing space where students submit essays, receive teacher feedback, compare with sample answers, and track long-term progress."
        >
          <div className="flex flex-wrap gap-3">
            <Button asChild variant="accent" size="lg">
              <Link to="/login?role=student">
                Student login <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="yellow" size="lg">
              <Link to="/login?role=teacher">Teacher login</Link>
            </Button>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <BandChip label="Current" band="6.0" variant="current" />
            <BandChip label="Target" band="7.0" variant="target" />
            <StatusBadge variant="ghost">3 essays this month</StatusBadge>
          </div>
        </HeroBanner>

        {/* Feature grid */}
        <section>
          <p className="pisa-tag text-pisa-pink-deep mb-2">Built for IELTS writing</p>
          <h2 className="font-display text-2xl md:text-3xl text-pisa-navy max-w-2xl">
            Everything your writing class needs, in one place.
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f) => {
              const Icon = f.icon;
              const iconBg = {
                navy: "bg-tint-navy text-pisa-navy",
                pink: "bg-tint-pink text-pisa-pink-deep",
                purple: "bg-tint-purple text-pisa-purple-deep",
                yellow: "bg-tint-yellow text-pisa-yellow-deep",
              }[f.color];
              return (
                <div key={f.title} className="pisa-card flex flex-col gap-3 h-full">
                  <div className={`grid h-10 w-10 place-items-center rounded-xl ${iconBg}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <p className="pisa-tag text-muted-foreground">{f.tag}</p>
                  <h3 className="font-display text-lg text-pisa-navy leading-snug">
                    {f.title}
                  </h3>
                  <p className="text-[13.5px] text-muted-foreground leading-relaxed">
                    {f.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Dashboard preview */}
        <section className="grid gap-4 lg:grid-cols-12">
          <div className="lg:col-span-7 pisa-card">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="pisa-tag text-muted-foreground">Student dashboard preview</p>
                <h3 className="font-display text-xl text-pisa-navy">Ready for your next essay?</h3>
              </div>
              <StatusBadge variant="success">2 reviewed</StatusBadge>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
              <MetricCard label="Current band" value="6.0" accent="purple" />
              <MetricCard label="Target band" value="7.0" accent="pink" />
              <MetricCard label="Essays" value="8" accent="navy" />
              <MetricCard label="This week" value="Grammar" accent="yellow" />
            </div>
            <div className="mt-5">
              <p className="text-[12px] text-muted-foreground mb-1.5">Writing progress</p>
              <ProgressBar value={67} color="yellow" />
            </div>
          </div>

          <div className="lg:col-span-5 rounded-3xl bg-pisa-purple text-pisa-purple-deep p-6 relative overflow-hidden">
            <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-white/30" />
            <p className="pisa-tag relative">AI assist</p>
            <h3 className="relative font-display text-2xl text-pisa-purple-deep mt-2">
              Generate a teachable sample essay
            </h3>
            <p className="relative mt-2 text-[14px] leading-relaxed text-pisa-purple-deep/85">
              Choose a target band, set the style, and instantly draft a model answer
              tailored to the student's essay. The teacher always reviews before sending.
            </p>
            <div className="relative mt-5">
              <Button asChild variant="primary" size="sm">
                <Link to="/login?role=teacher">
                  See teacher workflow <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        <footer className="text-center text-[12px] text-muted-foreground pt-4 pb-6">
          © {new Date().getFullYear()} PISA English Center · IELTS Writing Hub
        </footer>
      </main>
    </div>
  );
};

export default Index;
