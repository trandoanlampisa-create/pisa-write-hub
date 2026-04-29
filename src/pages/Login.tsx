import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Navbar } from "@/components/pisa/Navbar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import type { Role } from "@/types";
import { mockClasses } from "@/data/mockData";
import { GraduationCap, UserRound } from "lucide-react";
import { toast } from "sonner";

const Login = ({ mode = "login" as "login" | "signup" }) => {
  const [params] = useSearchParams();
  const initialRole = (params.get("role") as Role) || "student";
  const [role, setRole] = useState<Role>(initialRole);
  const [email, setEmail] = useState(initialRole === "teacher" ? "linh@pisa.edu.vn" : "minh@student.pisa.edu.vn");
  const [password, setPassword] = useState("demo1234");
  const [fullName, setFullName] = useState("");
  const [selectedClass, setSelectedClass] = useState(mockClasses[0]?.class_name ?? "");
  const [targetBand, setTargetBand] = useState(7);
  const [joinCode, setJoinCode] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    setEmail(role === "teacher" ? "linh@pisa.edu.vn" : "minh@student.pisa.edu.vn");
  }, [role]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please enter your email and password.");
      return;
    }
    if (mode === "signup" && !fullName) {
      toast.error("Please enter your full name.");
      return;
    }
    if (mode === "signup" && role === "student" && !selectedClass) {
      toast.error("Please select your class.");
      return;
    }
    if (mode === "signup" && role === "student") {
      const cls = mockClasses.find((c) => c.class_name === selectedClass);
      if (!cls || joinCode.trim().toUpperCase() !== cls.join_code.toUpperCase()) {
        toast.error("Invalid join code for this class.", {
          description: "Ask your teacher for the correct code.",
        });
        return;
      }
    }
    const profile = login(role);
    if (mode === "signup") {
      toast.success(
        role === "student"
          ? `Welcome to PISA, ${fullName.split(" ")[0]}! You've joined ${selectedClass}.`
          : `Welcome to PISA, ${fullName.split(" ")[0]}!`,
      );
    } else {
      toast.success(`Welcome back, ${profile.full_name.split(" ")[0]}!`);
    }
    navigate(role === "teacher" ? "/teacher" : "/student");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto max-w-5xl px-4 py-10 grid gap-8 md:grid-cols-2 items-center">
        <div className="hidden md:block relative overflow-hidden rounded-3xl bg-pisa-navy text-white p-10">
          <div className="absolute -right-16 -top-20 h-72 w-72 rounded-full bg-pisa-pink opacity-25" />
          <div className="absolute -left-10 -bottom-10 h-40 w-40 rounded-full bg-pisa-yellow opacity-15" />
          <p className="pisa-tag text-pisa-yellow relative">PISA IELTS</p>
          <h2 className="relative font-display text-3xl mt-3 text-white leading-tight">
            Write. Get feedback. Improve every week.
          </h2>
          <p className="relative mt-3 text-white/70 text-sm leading-relaxed max-w-sm">
            Log in to submit essays, review student work, or generate teachable sample answers.
          </p>
        </div>

        <div className="pisa-card p-6 md:p-8">
          <p className="pisa-tag text-pisa-pink-deep">{mode === "signup" ? "Create account" : "Welcome back"}</p>
          <h1 className="font-display text-2xl text-pisa-navy mt-1">
            {mode === "signup" ? "Sign up to get started" : "Log in to your hub"}
          </h1>

          <div className="mt-5 grid grid-cols-2 gap-2 p-1 bg-secondary rounded-pill">
            {(["student", "teacher"] as Role[]).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRole(r)}
                className={`flex items-center justify-center gap-1.5 py-2 rounded-pill text-sm font-medium transition-all ${
                  role === r
                    ? "bg-pisa-navy text-white"
                    : "text-pisa-navy/70"
                }`}
              >
                {r === "student" ? <UserRound className="h-4 w-4" /> : <GraduationCap className="h-4 w-4" />}
                {r === "student" ? "Student" : "Teacher"}
              </button>
            ))}
          </div>

          <form onSubmit={onSubmit} className="mt-5 space-y-4">
            {mode === "signup" && (
              <div>
                <label className="text-[12px] font-medium text-muted-foreground">Full name</label>
                <input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="mt-1 input-base"
                  placeholder="Your full name"
                />
              </div>
            )}
            <div>
              <label className="text-[12px] font-medium text-muted-foreground">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 input-base"
                placeholder="you@pisa.edu.vn"
              />
            </div>
            <div>
              <label className="text-[12px] font-medium text-muted-foreground">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 input-base"
                placeholder="••••••••"
              />
            </div>

            {mode === "signup" && role === "student" && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[12px] font-medium text-muted-foreground">Your class</label>
                  <select
                    value={selectedClass}
                    onChange={(e) => setSelectedClass(e.target.value)}
                    className="mt-1 input-base"
                  >
                    {mockClasses.map((c) => (
                      <option key={c.id} value={c.class_name}>{c.class_name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[12px] font-medium text-muted-foreground">Target band</label>
                  <select
                    value={targetBand}
                    onChange={(e) => setTargetBand(parseFloat(e.target.value))}
                    className="mt-1 input-base"
                  >
                    {[5.5, 6, 6.5, 7, 7.5, 8, 8.5].map((b) => (
                      <option key={b} value={b}>Band {b.toFixed(1)}</option>
                    ))}
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="text-[12px] font-medium text-muted-foreground">Class join code</label>
                  <input
                    value={joinCode}
                    onChange={(e) => setJoinCode(e.target.value)}
                    className="mt-1 input-base font-mono tracking-wider uppercase"
                    placeholder="e.g. PISA-65EV"
                  />
                </div>
                <p className="col-span-2 text-[11px] text-muted-foreground">
                  The join code is provided by your teacher to confirm your enrolment.
                </p>
              </div>
            )}

            <Button type="submit" variant="accent" className="w-full">
              {mode === "signup" ? "Create account" : "Log in"}
            </Button>

            <p className="text-[12px] text-center text-muted-foreground">
              {mode === "signup" ? (
                <>Already have an account? <Link to="/login" className="text-pisa-navy font-medium">Log in</Link></>
              ) : (
                <>New to PISA? <Link to="/signup" className="text-pisa-navy font-medium">Create account</Link></>
              )}
            </p>
            <p className="text-[11px] text-center text-muted-foreground">
              Demo mode — any password works.
            </p>
          </form>
        </div>
      </main>

      <style>{`
        .input-base {
          width: 100%;
          border: 1px solid hsl(var(--border));
          border-radius: 10px;
          padding: 10px 12px;
          font-size: 14px;
          background: white;
          color: hsl(var(--foreground));
          outline: none;
          transition: border-color 0.15s, box-shadow 0.15s;
        }
        .input-base:hover { border-color: hsl(var(--pisa-navy) / 0.35); }
        .input-base:focus {
          border-color: hsl(var(--pisa-navy));
          box-shadow: 0 0 0 3px hsl(var(--pisa-navy) / 0.12);
        }
      `}</style>
    </div>
  );
};

export default Login;