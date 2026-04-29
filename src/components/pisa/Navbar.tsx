import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { LogOut, Menu, X } from "lucide-react";
import { useState } from "react";

export const Navbar = () => {
  const { profile, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const studentLinks = [
    { to: "/student", label: "Dashboard" },
    { to: "/settings", label: "Settings" },
  ];
  const teacherLinks = [
    { to: "/teacher", label: "Dashboard" },
    { to: "/teacher/classes", label: "Classes" },
    { to: "/teacher/tasks/new", label: "Create task" },
    { to: "/settings", label: "Settings" },
  ];
  const links = profile?.role === "teacher" ? teacherLinks : profile ? studentLinks : [];

  return (
    <header className="sticky top-0 z-40 px-4 pt-4">
      <div className="w-full px-0 md:px-2">
        <nav className="flex items-center justify-between rounded-2xl bg-pisa-navy px-4 py-2.5 md:px-5 shadow-[0_4px_24px_-12px_hsl(var(--pisa-navy)/0.5)]">
          <Link to="/" className="flex items-center gap-2">
            <span className="grid h-7 w-7 place-items-center rounded-lg bg-pisa-yellow text-pisa-navy font-display font-extrabold text-sm">
              P
            </span>
            <span className="font-display text-[15px] font-bold text-white tracking-tight">
              PISA <span className="text-pisa-yellow">Writing Hub</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === "/student" || l.to === "/teacher"}
                className={({ isActive }) =>
                  `px-3 py-1.5 text-[13px] rounded-pill transition-colors ${
                    isActive
                      ? "text-pisa-yellow"
                      : "text-white/65 hover:text-white"
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-2">
            {profile ? (
              <>
                <span className="text-[12px] text-white/70">
                  {profile.full_name}
                </span>
                <Button
                  variant="accent"
                  size="sm"
                  onClick={() => {
                    logout();
                    navigate("/");
                  }}
                >
                  <LogOut className="h-3.5 w-3.5" />
                  Sign out
                </Button>
              </>
            ) : (
              <Button variant="accent" size="sm" onClick={() => navigate("/login")}>
                Log in
              </Button>
            )}
          </div>

          <button
            className="md:hidden text-white"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </nav>

        {open && (
          <div className="md:hidden mt-2 rounded-2xl bg-pisa-navy p-3 flex flex-col gap-1">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `px-3 py-2 text-sm rounded-pill ${
                    isActive ? "text-pisa-yellow" : "text-white/75"
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
            {profile ? (
              <Button
                variant="accent"
                size="sm"
                className="mt-1"
                onClick={() => {
                  logout();
                  setOpen(false);
                  navigate("/");
                }}
              >
                Sign out
              </Button>
            ) : (
              <Button
                variant="accent"
                size="sm"
                className="mt-1"
                onClick={() => {
                  setOpen(false);
                  navigate("/login");
                }}
              >
                Log in
              </Button>
            )}
          </div>
        )}
      </div>
    </header>
  );
};