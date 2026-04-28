import { useState } from "react";
import { Navigate } from "react-router-dom";
import { PageShell } from "@/components/pisa/PageShell";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { mockClasses } from "@/data/mockData";
import { toast } from "sonner";

const Settings = () => {
  const { profile } = useAuth();
  const [name, setName] = useState(profile?.full_name ?? "");
  const [email, setEmail] = useState(profile?.email ?? "");
  const [className, setClassName] = useState(profile?.class_name ?? "");
  const [target, setTarget] = useState(profile?.target_band ?? 7);

  if (!profile) return <Navigate to="/login" replace />;

  const onSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Profile updated");
  };

  return (
    <PageShell className="space-y-5">
      <div>
        <p className="pisa-tag text-pisa-pink-deep">Account</p>
        <h1 className="font-display text-2xl text-pisa-navy">Settings</h1>
      </div>

      <form onSubmit={onSave} className="pisa-card max-w-2xl space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-[12px] font-medium text-muted-foreground">Full name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full rounded-xl border border-border bg-white p-2.5 text-sm focus:outline-none focus:border-pisa-navy focus:ring-[3px] focus:ring-pisa-navy/15"
            />
          </div>
          <div>
            <label className="text-[12px] font-medium text-muted-foreground">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-xl border border-border bg-white p-2.5 text-sm focus:outline-none focus:border-pisa-navy focus:ring-[3px] focus:ring-pisa-navy/15"
            />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-[12px] font-medium text-muted-foreground">Role</label>
            <input
              value={profile.role === "teacher" ? "Teacher" : "Student"}
              disabled
              className="mt-1 w-full rounded-xl border border-border bg-secondary p-2.5 text-sm text-muted-foreground"
            />
          </div>
          <div>
            <label className="text-[12px] font-medium text-muted-foreground">Class</label>
            <select
              value={className}
              onChange={(e) => setClassName(e.target.value)}
              className="mt-1 w-full rounded-xl border border-border bg-white p-2.5 text-sm focus:outline-none focus:border-pisa-navy focus:ring-[3px] focus:ring-pisa-navy/15"
            >
              <option value="">—</option>
              {mockClasses.map((c) => (
                <option key={c.id} value={c.class_name}>{c.class_name}</option>
              ))}
            </select>
          </div>
        </div>

        {profile.role === "student" && (
          <div>
            <label className="text-[12px] font-medium text-muted-foreground">Target band</label>
            <select
              value={target}
              onChange={(e) => setTarget(parseFloat(e.target.value))}
              className="mt-1 w-full rounded-xl border border-border bg-white p-2.5 text-sm focus:outline-none focus:border-pisa-navy focus:ring-[3px] focus:ring-pisa-navy/15"
            >
              {[5.5, 6, 6.5, 7, 7.5, 8].map((b) => (
                <option key={b} value={b}>Band {b.toFixed(1)}</option>
              ))}
            </select>
          </div>
        )}

        <div className="flex justify-end pt-2">
          <Button type="submit" variant="accent">Save changes</Button>
        </div>
      </form>
    </PageShell>
  );
};

export default Settings;