import { CheckSquare, Dumbbell, Home, FolderKanban, Wallet } from "lucide-react"

type PageId = "home" | "tasks" | "projects" | "gym" | "finance"

interface SidebarProps {
  currentPage: PageId
  onSelectPage: (page: PageId) => void
}

export default function Sidebar({ currentPage, onSelectPage }: SidebarProps) {
  const menuItems = [
    { id: "home", label: "01. Inicio", icon: Home, disabled: true },
    { id: "tasks", label: "02. Tareas", icon: CheckSquare, disabled: false },
    { id: "projects", label: "03. Proyectos", icon: FolderKanban, disabled: true },
    { id: "gym", label: "05. Gym & Taekwondo", icon: Dumbbell, disabled: false },
    { id: "finance", label: "06. Finanzas", icon: Wallet, disabled: true },
  ]

  return (
    <aside className="w-64 bg-[#0d1322] border-r border-slate-800/80 min-h-screen p-4 flex flex-col justify-between">
      <div>
        <div className="flex items-center gap-2 mb-8 px-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 grid place-items-center text-emerald-400 font-bold">
            OS
          </div>
          <div>
            <h1 className="text-sm font-bold text-white tracking-wide">Personal OS</h1>
            <p className="text-[10px] text-slate-500 uppercase tracking-wider">SSOT System</p>
          </div>
        </div>

        <nav className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon
            const active = currentPage === item.id
            return (
              <button
                key={item.id}
                onClick={() => !item.disabled && onSelectPage(item.id as PageId)}
                disabled={item.disabled}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  active
                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                    : item.disabled
                    ? "text-slate-600 cursor-not-allowed opacity-50"
                    : "text-slate-400 hover:bg-slate-800/50 hover:text-white"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </div>
                {item.disabled && <span className="text-[9px] bg-slate-800 text-slate-500 px-1.5 py-0.5 rounded">Pronto</span>}
              </button>
            )
          })}
        </nav>
      </div>

      <div className="p-3 bg-slate-900/50 border border-slate-800/80 rounded-xl">
        <p className="text-[10px] text-slate-400 font-medium">Estado del Sistema</p>
        <p className="text-xs text-emerald-400 font-semibold flex items-center gap-1.5 mt-1">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Supabase Online
        </p>
      </div>
    </aside>
  )
}