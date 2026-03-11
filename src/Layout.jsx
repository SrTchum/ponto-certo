import { Link, Outlet, useLocation } from "react-router-dom";
import { BarChart3, CalendarDays, Clock, History, Home, Plus, User } from "lucide-react";

const navItems = [
  { path: "/", icon: Home, label: "Hoje" },
  { path: "/historico", icon: History, label: "Histórico" },
  { path: "/banco", icon: BarChart3, label: "Banco" },
  { path: "/avulsas", icon: Plus, label: "Avulsas" },
  { path: "/perfis", icon: User, label: "Perfis" },
];

function getActiveLabel(pathname) {
  return navItems.find((i) => i.path === pathname)?.label ?? "";
}

export default function Layout() {
  const location = useLocation();
  const activeLabel = getActiveLabel(location.pathname);

  return (
    <div className="min-h-dvh flex flex-col text-text-2 font-sans">
      <header className="pt-safe sticky top-0 z-20">
        <div className="relative mx-auto w-full max-w-[920px] px-5 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-2xl border border-border-1 bg-[rgba(20,40,63,0.55)] text-primary flex items-center justify-center">
                <Clock size={18} strokeWidth={2.2} />
              </div>
              <div className="leading-tight">
                <div className="text-[15px] font-semibold text-text-1">Ponto</div>
                <div className="text-[11px] text-text-3 -mt-0.5">controle de horas</div>
              </div>
            </div>

            <div className="absolute left-1/2 -translate-x-1/2 text-[13px] font-semibold text-primary">
              {activeLabel}
            </div>

            <button
              type="button"
              className="h-10 w-10 rounded-full border border-border-1 bg-[rgba(20,40,63,0.35)] text-text-3 hover:text-text-1 transition"
              aria-label="Calendário"
            >
              <div className="flex items-center justify-center">
                <CalendarDays size={18} />
              </div>
            </button>
          </div>
        </div>
        <div className="h-px w-full bg-gradient-to-r from-transparent via-border-1 to-transparent" />
      </header>

      <main className="flex-1">
        <div className="mx-auto w-full max-w-[920px] px-5 py-6">
          <Outlet />
        </div>
      </main>

      <nav className="pb-safe sticky bottom-0 z-20">
        <div className="h-px w-full bg-gradient-to-r from-transparent via-border-1 to-transparent" />
        <div className="mx-auto w-full max-w-[920px] px-4 py-3">
          <div className="grid grid-cols-5 gap-2 rounded-[28px] border border-border-1 bg-[rgba(10,27,51,0.55)] backdrop-blur-md px-2 py-2">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={[
                    "flex flex-col items-center justify-center gap-1 rounded-2xl py-2 transition",
                    isActive ? "text-primary" : "text-text-3 hover:text-text-2",
                  ].join(" ")}
                >
                  <div
                    className={
                      isActive ? "drop-shadow-[0_0_10px_rgba(249,115,22,0.35)]" : ""
                    }
                  >
                    <Icon size={22} strokeWidth={isActive ? 2.6 : 2.2} />
                  </div>
                  <span className={["text-[10px]", isActive ? "font-semibold" : "font-medium"].join(" ")}>
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>
    </div>
  );
}