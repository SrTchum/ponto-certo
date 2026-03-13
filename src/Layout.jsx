import { useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  BarChart3,
  CalendarDays,
  Clock,
  History,
  Settings,
  User,
} from "lucide-react";

// Ordem: Perfis (esquerda), Banco (centro/principal), Histórico (direita)
const navItems = [
  { path: "/perfis", icon: User, label: "Perfis" },
  { path: "/banco", icon: BarChart3, label: "Banco" },
  { path: "/historico", icon: History, label: "Histórico" },
];

function getActiveLabel(pathname) {
  const direct = navItems.find((i) => i.path === pathname)?.label;
  if (direct) return direct;

  if (pathname === "/") return "Banco";
  if (pathname.startsWith("/perfis/")) return "Perfil";
  if (pathname === "/conta") return "Minha Conta";
  if (pathname === "/nfc") return "Configurar NFC";

  return "";
}

export default function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const activeLabel = getActiveLabel(location.pathname);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(
    () => new Date().toISOString().slice(0, 10),
  );

  return (
    <div className="min-h-dvh flex flex-col text-text-2 font-sans">
      <header className="pt-safe sticky top-0 z-50 bg-background">
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
              onClick={() => setIsCalendarOpen((open) => !open)}
              className="h-10 w-10 rounded-full border border-border-1 bg-[rgba(20,40,63,0.35)] text-text-3 hover:text-text-1 transition"
              aria-label="Calendário"
            >
              <div className="flex items-center justify-center">
                <CalendarDays size={18} />
              </div>
            </button>

            <button
              type="button"
              onClick={() => navigate("/configuracoes")}
              className="ml-2 h-10 w-10 rounded-full border border-border-1 bg-[rgba(20,40,63,0.35)] text-text-3 hover:text-text-1 transition"
              aria-label="Configurações"
            >
              <div className="flex items-center justify-center">
                <Settings size={18} />
              </div>
            </button>
          </div>
        </div>

        {isCalendarOpen && (
          <div className="absolute left-0 right-0 top-[72px] z-30">
            <div className="mx-auto w-full max-w-[920px] px-5">
              <div className="ml-auto w-full max-w-[260px] rounded-2xl border border-border-1 bg-[rgba(10,27,51,0.98)] px-4 py-4 shadow-[0_18px_46px_rgba(0,0,0,0.7)]">
                <div className="flex items-center justify-between">
                  <div className="text-[13px] font-semibold text-text-1">
                    Selecionar data
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsCalendarOpen(false)}
                    className="text-[12px] text-text-3 hover:text-text-1 transition"
                  >
                    Fechar
                  </button>
                </div>

                <div className="mt-3">
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(event) => setSelectedDate(event.target.value)}
                    className="w-full rounded-[10px] border border-border-1 bg-[rgba(15,23,42,0.92)] px-3 py-2 text-[13px] text-text-1 outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

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
          <div className="grid grid-cols-3 gap-2 rounded-[28px] border border-border-1 bg-[rgba(10,27,51,0.55)] backdrop-blur-md px-2 py-2">
            {navItems.map((item) => {
              const currentPath = location.pathname === "/" ? "/banco" : location.pathname;
              const isActive = currentPath === item.path;
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