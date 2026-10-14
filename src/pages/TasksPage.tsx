import { FormEvent, useEffect, useMemo, useState } from "react"
import * as Dialog from "@radix-ui/react-dialog"
import * as DropdownMenu from "@radix-ui/react-dropdown-menu"
import * as Select from "@radix-ui/react-select"
import {
  BarChart3,
  BatteryLow,
  BookOpen,
  BriefcaseBusiness,
  CalendarDays,
  Check,
  ChevronDown,
  Clock3,
  Circle,
  Copy,
  Dumbbell,
  Edit3,
  FolderKanban,
  HeartPulse,
  Lightbulb,
  Link2,
  MoreHorizontal,
  Plus,
  Rocket,
  Search,
  Sparkles,
  Trash2,
  WalletCards,
  X,
  Zap,
} from "lucide-react"

import {
  fetchInitialData,
  toggleTaskInDb,
  deleteTaskFromDb,
  createTaskInDb,
  createTypeInDb,
} from "../lib/taskService"

type Filter = "all" | "pending" | "completed"
type Priority = "Baja" | "Media" | "Alta" | "Urgente"
type Energy = "Alta" | "Baja"
type DomainId = "study" | "gym" | "finance" | "projects" | "wellness" | "work" | "home" | "reading" | "travel" | "ideas"

type Task = {
  id: number
  title: string
  badge?: string
  badgeTone?: "urgent" | "neutral" | "progress"
  completed: boolean
  description?: string
  taskType?: string
  priority?: Priority
  dueDate?: string
  estimate?: number
  energy?: Energy
  tags?: string[]
  resourceUrl?: string
}

type Domain = {
  id: DomainId
  title: string
  eyebrow: string
  icon: typeof FolderKanban
  accent: string
  iconStyle: string
  countStyle: string
  focusStyle: string
  tasks: Task[]
}

const initialDomains: Domain[] = [
  {
    id: "study",
    title: "Estudios & Universidad",
    eyebrow: "Cuadrante 01",
    icon: FolderKanban,
    accent: "bg-indigo-400",
    iconStyle: "bg-indigo-500/10 text-indigo-300 ring-indigo-400/20",
    countStyle: "bg-indigo-400/10 text-indigo-300 ring-indigo-400/20",
    focusStyle: "focus-within:border-indigo-400/40",
    tasks: [],
  },
  {
    id: "gym",
    title: "Entrenamiento & Gym",
    eyebrow: "Cuadrante 02",
    icon: Dumbbell,
    accent: "bg-emerald-400",
    iconStyle: "bg-emerald-500/10 text-emerald-300 ring-emerald-400/20",
    countStyle: "bg-emerald-400/10 text-emerald-300 ring-emerald-400/20",
    focusStyle: "focus-within:border-emerald-400/40",
    tasks: [],
  },
  {
    id: "finance",
    title: "Finanzas Personales",
    eyebrow: "Cuadrante 03",
    icon: WalletCards,
    accent: "bg-amber-400",
    iconStyle: "bg-amber-500/10 text-amber-300 ring-amber-400/20",
    countStyle: "bg-amber-400/10 text-amber-300 ring-amber-400/20",
    focusStyle: "focus-within:border-amber-400/40",
    tasks: [],
  },
  {
    id: "projects",
    title: "Marca Personal - Victopvl",
    eyebrow: "Cuadrante 04",
    icon: Rocket,
    accent: "bg-violet-400",
    iconStyle: "bg-violet-500/10 text-violet-300 ring-violet-400/20",
    countStyle: "bg-violet-400/10 text-violet-300 ring-violet-400/20",
    focusStyle: "focus-within:border-violet-400/40",
    tasks: [],
  },
  {
    id: "wellness",
    title: "Salud & Bienestar",
    eyebrow: "Plantilla editable",
    icon: HeartPulse,
    accent: "bg-rose-400",
    iconStyle: "bg-rose-500/10 text-rose-300 ring-rose-400/20",
    countStyle: "bg-rose-400/10 text-rose-300 ring-rose-400/20",
    focusStyle: "focus-within:border-rose-400/40",
    tasks: [],
  },
  {
    id: "work",
    title: "Marca Profesional - Victopvl.PM",
    eyebrow: "Plantilla editable",
    icon: BriefcaseBusiness,
    accent: "bg-cyan-400",
    iconStyle: "bg-cyan-500/10 text-cyan-300 ring-cyan-400/20",
    countStyle: "bg-cyan-400/10 text-cyan-300 ring-cyan-400/20",
    focusStyle: "focus-within:border-cyan-400/40",
    tasks: [],
  },
  {
    id: "home",
    title: "Club Emprendedores Unab",
    eyebrow: "Plantilla editable",
    icon: Rocket,
    accent: "bg-orange-400",
    iconStyle: "bg-orange-500/10 text-orange-300 ring-orange-400/20",
    countStyle: "bg-orange-400/10 text-orange-300 ring-orange-400/20",
    focusStyle: "focus-within:border-orange-400/40",
    tasks: [],
  },
  {
    id: "reading",
    title: "Participaciones Tertulias",
    eyebrow: "Plantilla editable",
    icon: BookOpen,
    accent: "bg-teal-400",
    iconStyle: "bg-teal-500/10 text-teal-300 ring-teal-400/20",
    countStyle: "bg-teal-400/10 text-teal-300 ring-teal-400/20",
    focusStyle: "focus-within:border-teal-400/40",
    tasks: [],
  },
  {
    id: "travel",
    title: "Participaciones TechAI",
    eyebrow: "Plantilla editable",
    icon: Sparkles,
    accent: "bg-sky-400",
    iconStyle: "bg-sky-500/10 text-sky-300 ring-sky-400/20",
    countStyle: "bg-sky-400/10 text-sky-300 ring-sky-400/20",
    focusStyle: "focus-within:border-sky-400/40",
    tasks: [],
  },
  {
    id: "ideas",
    title: "Airosstore",
    eyebrow: "Plantilla editable",
    icon: Lightbulb,
    accent: "bg-fuchsia-400",
    iconStyle: "bg-fuchsia-500/10 text-fuchsia-300 ring-fuchsia-400/20",
    countStyle: "bg-fuchsia-400/10 text-fuchsia-300 ring-fuchsia-400/20",
    focusStyle: "focus-within:border-fuchsia-400/40",
    tasks: [],
  },
]

const badgeStyles = {
  urgent: "bg-rose-400/10 text-rose-300 ring-rose-400/20",
  neutral: "bg-slate-400/10 text-slate-400 ring-white/10",
  progress: "bg-indigo-400/10 text-indigo-300 ring-indigo-400/20",
}

const initialTaskTypes = [
  "Documento",
  "Reunión",
  "Estudio",
  "Trámite",
  "Creación de Contenido",
  "Grabar Video",
]

const typeStyles: Record<string, string> = {
  Documento: "bg-sky-400/10 text-sky-300 ring-sky-400/20",
  Reunión: "bg-violet-400/10 text-violet-300 ring-violet-400/20",
  Estudio: "bg-emerald-400/10 text-emerald-300 ring-emerald-400/20",
  Trámite: "bg-amber-400/10 text-amber-300 ring-amber-400/20",
  "Creación de Contenido": "bg-pink-400/10 text-pink-300 ring-pink-400/20",
  "Grabar Video": "bg-rose-400/10 text-rose-300 ring-rose-400/20",
}

const priorityStyles: Record<Priority, string> = {
  Baja: "bg-slate-400",
  Media: "bg-sky-400",
  Alta: "bg-amber-400",
  Urgente: "bg-rose-400 shadow-[0_0_8px_rgba(251,113,133,0.65)]",
}

function getTaskMeta(task: Task) {
  const inferredType =
    task.id % 6 === 0
      ? "Documento"
      : task.id % 5 === 0
        ? "Trámite"
        : task.id % 4 === 0
          ? "Creación de Contenido"
          : task.id % 3 === 0
            ? "Reunión"
            : "Estudio"
  return {
    taskType: task.taskType ?? inferredType,
    priority:
      task.priority ??
      (task.badgeTone === "urgent"
        ? "Urgente"
        : task.id % 3 === 0
          ? "Alta"
          : "Baja"),
    dueDate: task.dueDate ?? task.badge ?? "Sin fecha",
    estimate: task.estimate ?? 30 + (task.id % 3) * 15,
    energy: task.energy ?? (task.id % 2 === 0 ? "Alta" : "Baja"),
  } as const
}

function AppButton({
  children,
  className = "",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={`inline-flex items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

function TaskRow({
  task,
  domainId,
  onToggle,
  onDelete,
  onEdit,
}: {
  task: Task
  domainId: DomainId
  onToggle: (domainId: DomainId, taskId: number) => void
  onDelete: (domainId: DomainId, taskId: number) => void
  onEdit: (domainId: DomainId, task: Task) => void
}) {
  const metadata = getTaskMeta(task)

  async function copyTaskLink() {
    const link = task.resourceUrl || `${window.location.origin}/task/${task.id}`
    await navigator.clipboard?.writeText(link)
  }

  return (
    <div className="group flex min-h-16 items-start gap-3 border-b border-slate-800/70 px-1 py-3 last:border-b-0">
      <AppButton
        aria-label={
          task.completed ? "Marcar como pendiente" : "Marcar como completada"
        }
        className={`mt-0.5 size-5 shrink-0 rounded-md border ${
          task.completed
            ? "border-indigo-400 bg-indigo-500 text-white shadow-[0_0_12px_rgba(99,102,241,0.28)]"
            : "border-slate-600 bg-slate-950/50 text-transparent hover:border-indigo-400"
        }`}
        onClick={() => onToggle(domainId, task.id)}
      >
        <Check className="size-3.5" strokeWidth={3} />
      </AppButton>
      <div className="min-w-0 flex-1">
        <div
          className={`truncate text-sm font-medium transition-all ${
            task.completed
              ? "text-slate-600 line-through decoration-slate-600"
              : "text-slate-200"
          }`}
        >
          {task.title}
        </div>
        <div className="mt-2 flex flex-wrap items-center gap-1.5">
          <span
            className={`rounded-full px-2 py-0.5 text-[9px] font-semibold ring-1 ring-inset ${
              typeStyles[metadata.taskType] ??
              "bg-indigo-400/10 text-indigo-300 ring-indigo-400/20"
            }`}
          >
            {metadata.taskType}
          </span>
          <span
            className="inline-flex items-center gap-1.5 rounded-full bg-slate-950/60 px-2 py-0.5 text-[9px] font-semibold text-slate-400 ring-1 ring-inset ring-white/5"
            title={`Prioridad ${metadata.priority}`}
          >
            <span
              className={`size-1.5 rounded-full ${priorityStyles[metadata.priority]}`}
            />
            {metadata.priority}
          </span>
          <span
            className={`rounded-full px-2 py-0.5 text-[9px] font-semibold ring-1 ring-inset ${
              badgeStyles[task.badgeTone ?? "neutral"]
            }`}
          >
            {metadata.dueDate}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-slate-950/60 px-2 py-0.5 text-[9px] font-semibold text-slate-500 ring-1 ring-inset ring-white/5">
            <Clock3 className="size-3" />
            {metadata.estimate}m
          </span>
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-semibold ${
              metadata.energy === "Alta"
                ? "bg-amber-400/10 text-amber-300"
                : "bg-emerald-400/10 text-emerald-300"
            }`}
          >
            {metadata.energy === "Alta" ? (
              <Zap className="size-3" />
            ) : (
              <BatteryLow className="size-3" />
            )}
            {metadata.energy}
          </span>
        </div>
      </div>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <AppButton
            aria-label={`Opciones de ${task.title}`}
            className="size-7 shrink-0 rounded-md text-slate-600 opacity-0 hover:bg-white/5 hover:text-slate-300 group-hover:opacity-100 data-[state=open]:bg-white/5 data-[state=open]:text-slate-300 data-[state=open]:opacity-100"
          >
            <MoreHorizontal className="size-4" />
          </AppButton>
        </DropdownMenu.Trigger>
        <DropdownMenu.Portal>
          <DropdownMenu.Content
            align="end"
            className="z-50 min-w-36 rounded-xl border border-slate-700/80 bg-slate-900 p-1.5 text-sm text-slate-200 shadow-2xl"
            sideOffset={6}
          >
            <DropdownMenu.Item
              className="flex cursor-pointer items-center gap-2 rounded-lg px-2.5 py-2 outline-none hover:bg-white/5 focus:bg-white/5"
              onSelect={() => onEdit(domainId, task)}
            >
              <Edit3 className="size-3.5 text-slate-400" />
              Editar
            </DropdownMenu.Item>
            <DropdownMenu.Item
              className="flex cursor-pointer items-center gap-2 rounded-lg px-2.5 py-2 outline-none hover:bg-white/5 focus:bg-white/5"
              onSelect={copyTaskLink}
            >
              <Copy className="size-3.5 text-slate-400" />
              Copiar enlace
            </DropdownMenu.Item>
            <DropdownMenu.Separator className="my-1 h-px bg-slate-800" />
            <DropdownMenu.Item
              className="flex cursor-pointer items-center gap-2 rounded-lg px-2.5 py-2 text-rose-300 outline-none hover:bg-rose-400/10 focus:bg-rose-400/10"
              onSelect={() => onDelete(domainId, task.id)}
            >
              <Trash2 className="size-3.5" />
              Eliminar
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
    </div>
  )
}

function DomainCard({
  domain,
  tasks,
  onToggle,
  onDelete,
  onEdit,
  onQuickAdd,
  onRename,
}: {
  domain: Domain
  tasks: Task[]
  onToggle: (domainId: DomainId, taskId: number) => void
  onDelete: (domainId: DomainId, taskId: number) => void
  onEdit: (domainId: DomainId, task: Task) => void
  onQuickAdd: (domainId: DomainId, title: string) => void
  onRename: (domainId: DomainId, title: string) => void
}) {
  const [quickTitle, setQuickTitle] = useState("")
  const [isRenaming, setIsRenaming] = useState(false)
  const [folderTitle, setFolderTitle] = useState(domain.title)
  const pending = domain.tasks.filter((task) => !task.completed).length
  const Icon = domain.icon

  function submitQuickTask(event: FormEvent) {
    event.preventDefault()
    if (!quickTitle.trim()) return
    onQuickAdd(domain.id, quickTitle.trim())
    setQuickTitle("")
  }

  function finishRenaming() {
    if (folderTitle.trim()) onRename(domain.id, folderTitle.trim())
    else setFolderTitle(domain.title)
    setIsRenaming(false)
  }

  return (
    <section className="group/folder relative flex min-h-0 flex-col overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900/60 shadow-[0_18px_60px_rgba(0,0,0,0.18)] backdrop-blur-sm">
      <div className={`absolute inset-x-0 top-0 h-0.5 ${domain.accent}`} />
      <div className="flex items-center gap-3 border-b border-slate-800/70 px-5 py-4">
        <div
          className={`grid size-9 place-items-center rounded-xl ring-1 ring-inset ${domain.iconStyle}`}
        >
          <Icon className="size-4.5" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="mb-0.5 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-600">
            {domain.eyebrow}
          </div>
          {isRenaming ? (
            <form
              onSubmit={(event) => {
                event.preventDefault()
                finishRenaming()
              }}
            >
              <input
                aria-label="Nombre de la carpeta"
                autoFocus
                className="w-full border-b border-indigo-400/60 bg-transparent text-sm font-semibold text-slate-100 outline-none"
                onBlur={finishRenaming}
                onChange={(event) => setFolderTitle(event.target.value)}
                value={folderTitle}
              />
            </form>
          ) : (
            <div className="truncate text-sm font-semibold text-slate-100">
              {domain.title}
            </div>
          )}
        </div>
        <AppButton
          aria-label={`Editar nombre de ${domain.title}`}
          className="size-7 shrink-0 rounded-lg text-slate-600 opacity-0 hover:bg-white/5 hover:text-slate-300 group-hover/folder:opacity-100"
          onClick={() => {
            setFolderTitle(domain.title)
            setIsRenaming(true)
          }}
        >
          <Edit3 className="size-3.5" />
        </AppButton>
        <span
          className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ring-1 ring-inset ${domain.countStyle}`}
        >
          {pending} {pending === 1 ? "pendiente" : "pendientes"}
        </span>
        <AppButton
          aria-label={`Añadir tarea a ${domain.title}`}
          className="size-8 rounded-lg border border-slate-700/70 bg-slate-950/40 text-slate-400 hover:border-slate-600 hover:text-white"
          onClick={() => {
            const input = document.querySelector<HTMLInputElement>(
              `#quick-${domain.id}`,
            )
            input?.focus()
          }}
        >
          <Plus className="size-4" />
        </AppButton>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-1">
        {tasks.length ? (
          tasks.map((task) => (
            <TaskRow
              domainId={domain.id}
              key={task.id}
              onDelete={onDelete}
              onEdit={onEdit}
              onToggle={onToggle}
              task={task}
            />
          ))
        ) : (
          <div className="grid min-h-24 place-items-center text-xs text-slate-600">
            No hay tareas en esta vista
          </div>
        )}
      </div>

      <form
        className={`mx-4 mb-3 flex items-center gap-2 rounded-lg border border-transparent px-1 py-2 transition-colors ${domain.focusStyle}`}
        onSubmit={submitQuickTask}
      >
        <Plus className="size-4 shrink-0 text-slate-600" />
        <input
          aria-label={`Agregar tarea rápida en ${domain.title}`}
          className="min-w-0 flex-1 bg-transparent text-xs text-slate-300 outline-none placeholder:text-slate-600"
          id={`quick-${domain.id}`}
          onChange={(event) => setQuickTitle(event.target.value)}
          placeholder="Agregar tarea rápida..."
          value={quickTitle}
        />
        <span className="rounded border border-slate-800 px-1.5 py-0.5 text-[9px] font-medium text-slate-600">
          ENTER
        </span>
      </form>
    </section>
  )
}

function SelectField({
  label,
  value,
  onValueChange,
  options,
}: {
  label: string
  value: string
  onValueChange: (value: string) => void
  options: { label: string; value: string }[]
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-semibold text-slate-300">
        {label}
      </span>
      <Select.Root onValueChange={onValueChange} value={value}>
        <Select.Trigger className="flex h-11 w-full items-center justify-between rounded-xl border border-slate-700/80 bg-slate-950/60 px-3.5 text-sm text-slate-200 outline-none transition-colors focus:border-indigo-400/60">
          <Select.Value />
          <Select.Icon>
            <ChevronDown className="size-4 text-slate-500" />
          </Select.Icon>
        </Select.Trigger>
        <Select.Portal>
          <Select.Content
            className="z-[60] overflow-hidden rounded-xl border border-slate-700/80 bg-slate-900 p-1.5 text-sm text-slate-200 shadow-2xl"
            position="popper"
            sideOffset={6}
          >
            <Select.Viewport>
              {options.map((option) => (
                <Select.Item
                  className="relative flex cursor-pointer items-center rounded-lg py-2.5 pl-8 pr-4 outline-none hover:bg-white/5 focus:bg-white/5"
                  key={option.value}
                  value={option.value}
                >
                  <Select.ItemIndicator className="absolute left-2.5">
                    <Check className="size-3.5 text-indigo-400" />
                  </Select.ItemIndicator>
                  <Select.ItemText>{option.label}</Select.ItemText>
                </Select.Item>
              ))}
            </Select.Viewport>
          </Select.Content>
        </Select.Portal>
      </Select.Root>
    </label>
  )
}

function CompactSelect({
  label,
  value,
  options,
  onValueChange,
}: {
  label: string
  value: string
  options: { label: string; value: string }[]
  onValueChange: (value: string) => void
}) {
  return (
    <Select.Root value={value} onValueChange={onValueChange}>
      <Select.Trigger
        aria-label={label}
        className="inline-flex h-8 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-lg border border-slate-800 bg-slate-900/80 px-2.5 text-xs font-medium text-slate-300 outline-none hover:border-slate-700 focus:border-indigo-500/50"
      >
        <Select.Value />
        <Select.Icon>
          <ChevronDown className="size-3.5 text-slate-500" />
        </Select.Icon>
      </Select.Trigger>
      <Select.Portal>
        <Select.Content
          align="start"
          className="z-50 min-w-36 rounded-xl border border-slate-700/80 bg-slate-900 p-1 text-xs text-slate-200 shadow-xl"
          position="popper"
          sideOffset={4}
        >
          <Select.Viewport className="p-1">
            {options.map((option) => (
              <Select.Item
                key={option.value}
                value={option.value}
                className="flex cursor-pointer items-center rounded-lg px-2.5 py-1.5 outline-none hover:bg-white/5 focus:bg-white/5 data-[state=checked]:font-semibold data-[state=checked]:text-indigo-400"
              >
                <Select.ItemText>{option.label}</Select.ItemText>
              </Select.Item>
            ))}
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  )
}

export default function TasksPage() {
  const [domains, setDomains] = useState(initialDomains)
  const [filter, setFilter] = useState<Filter>("all")
  const [priorityFilter, setPriorityFilter] = useState<"all" | Priority>("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [taskTypes, setTaskTypes] = useState(initialTaskTypes)
  const [query, setQuery] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [typeDialogOpen, setTypeDialogOpen] = useState(false)
  const [newTypeName, setNewTypeName] = useState("")
  const [editing, setEditing] = useState<{
    domainId: DomainId
    taskId: number
  } | null>(null)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState<DomainId>("study")
  const [taskType, setTaskType] = useState("Documento")
  const [dueDate, setDueDate] = useState("")
  const [priority, setPriority] = useState<Priority>("Media")
  const [estimate, setEstimate] = useState("30")
  const [energy, setEnergy] = useState<Energy>("Alta")
  const [tags, setTags] = useState("")
  const [resourceUrl, setResourceUrl] = useState("")

  useEffect(() => {
    async function loadData() {
      try {
        const { domains: dbDomains, tasks: dbTasks, taskTypes: dbTypes } = await fetchInitialData()

        if (dbDomains.length > 0) {
          const mappedDomains = initialDomains.map((initDomain) => {
            const domainTasks = dbTasks.filter((t: any) => t.domain_id === initDomain.id)

            const formattedTasks = domainTasks.map((t: any) => ({
              id: t.id,
              title: t.title,
              completed: t.completed,
              description: t.description,
              badge: t.badge,
              badgeTone: t.badge_tone,
              taskType: t.task_type,
              priority: t.priority,
              dueDate: t.due_date,
              estimate: t.estimate,
              energy: t.energy,
              tags: t.tags,
              resourceUrl: t.resource_url,
            }))

            return {
              ...initDomain,
              tasks: formattedTasks,
            }
          })
          setDomains(mappedDomains)
        }

        if (dbTypes.length > 0) {
          setTaskTypes(dbTypes)
        }
      } catch (error) {
        console.error("Error al cargar datos desde Supabase:", error)
      }
    }

    loadData()
  }, [])

  const visibleDomains = useMemo(
    () =>
      domains.map((domain) => ({
        ...domain,
        filteredTasks: domain.tasks.filter((task) => {
          const matchesQuery = task.title
            .toLowerCase()
            .includes(query.toLowerCase().trim())
          const matchesFilter =
            filter === "all" ||
            (filter === "pending" && !task.completed) ||
            (filter === "completed" && task.completed)
          const metadata = getTaskMeta(task)
          const matchesPriority =
            priorityFilter === "all" || metadata.priority === priorityFilter
          const matchesType =
            typeFilter === "all" || metadata.taskType === typeFilter
          return matchesQuery && matchesFilter && matchesPriority && matchesType
        }),
      })),
    [domains, filter, priorityFilter, query, typeFilter],
  )

  const totalTasks = domains.reduce(
    (total, domain) => total + domain.tasks.length,
    0,
  )
  const completedTasks = domains.reduce(
    (total, domain) =>
      total + domain.tasks.filter((task) => task.completed).length,
    0,
  )
  const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

  async function toggleTask(domainId: DomainId, taskId: number) {
    let nextState = false

    setDomains((current) =>
      current.map((domain) =>
        domain.id === domainId
          ? {
              ...domain,
              tasks: domain.tasks.map((task) => {
                if (task.id === taskId) {
                  nextState = !task.completed
                  return { ...task, completed: nextState }
                }
                return task
              }),
            }
          : domain,
      ),
    )

    await toggleTaskInDb(taskId, nextState)
  }

  async function deleteTask(domainId: DomainId, taskId: number) {
    setDomains((current) =>
      current.map((domain) =>
        domain.id === domainId
          ? {
              ...domain,
              tasks: domain.tasks.filter((task) => task.id !== taskId),
            }
          : domain,
      ),
    )

    await deleteTaskFromDb(taskId)
  }

  async function quickAdd(domainId: DomainId, taskTitle: string) {
    const newDbTask = await createTaskInDb({
      domain_id: domainId,
      title: taskTitle,
      completed: false,
      badge: "Pendiente",
      badge_tone: "neutral",
      task_type: "Documento",
      priority: "Media",
      due_date: "Sin fecha",
      estimate: 30,
      energy: "Baja",
    })

    if (newDbTask) {
      setDomains((current) =>
        current.map((domain) =>
          domain.id === domainId
            ? {
                ...domain,
                tasks: [
                  ...domain.tasks,
                  {
                    id: newDbTask.id,
                    title: newDbTask.title,
                    completed: newDbTask.completed,
                    badge: newDbTask.badge,
                    badgeTone: newDbTask.badge_tone,
                    taskType: newDbTask.task_type,
                    priority: newDbTask.priority,
                    dueDate: newDbTask.due_date,
                    estimate: newDbTask.estimate,
                    energy: newDbTask.energy,
                  },
                ],
              }
            : domain,
        ),
      )
    }
  }

  function renameDomain(domainId: DomainId, nextTitle: string) {
    setDomains((current) =>
      current.map((domain) =>
        domain.id === domainId ? { ...domain, title: nextTitle } : domain,
      ),
    )
  }

  function openNewTask() {
    setEditing(null)
    setTitle("")
    setDescription("")
    setCategory("study")
    setTaskType(taskTypes[0] ?? "Documento")
    setDueDate("")
    setPriority("Media")
    setEstimate("30")
    setEnergy("Alta")
    setTags("")
    setResourceUrl("")
    setDialogOpen(true)
  }

  function openEdit(domainId: DomainId, task: Task) {
    setEditing({ domainId, taskId: task.id })
    setTitle(task.title)
    setDescription(task.description ?? "")
    setCategory(domainId)
    setTaskType(getTaskMeta(task).taskType)
    setDueDate(task.dueDate ?? "")
    setPriority(getTaskMeta(task).priority)
    setEstimate(String(getTaskMeta(task).estimate))
    setEnergy(getTaskMeta(task).energy)
    setTags(task.tags?.join(", ") ?? "")
    setResourceUrl(task.resourceUrl ?? "")
    setDialogOpen(true)
  }

  async function createTaskType(event: FormEvent) {
    event.preventDefault()
    const nextType = newTypeName.trim()
    if (!nextType) return

    setTaskTypes((current) =>
      current.includes(nextType) ? current : [...current, nextType],
    )
    setTaskType(nextType)
    setNewTypeName("")
    setTypeDialogOpen(false)

    await createTypeInDb(nextType)
  }

  async function submitTask(event: FormEvent) {
    event.preventDefault()
    if (!title.trim()) return

    if (editing) {
      setDomains((current) =>
        current.map((domain) => {
          const remainingTasks =
            domain.id === editing.domainId
              ? domain.tasks.filter((task) => task.id !== editing.taskId)
              : domain.tasks
          if (domain.id !== category)
            return { ...domain, tasks: remainingTasks }
          const existing = domains
            .find((item) => item.id === editing.domainId)
            ?.tasks.find((task) => task.id === editing.taskId)
          return {
            ...domain,
            tasks: [
              ...remainingTasks,
              {
                id: editing.taskId,
                title: title.trim(),
                completed: existing?.completed ?? false,
                description,
                taskType,
                priority,
                dueDate: dueDate || "Sin fecha",
                estimate: Number(estimate) || 0,
                energy,
                tags: tags
                  .split(",")
                  .map((tag) => tag.trim())
                  .filter(Boolean),
                resourceUrl,
                badgeTone: priority === "Urgente" ? "urgent" : "neutral",
              },
            ],
          }
        }),
      )
    } else {
      const created = await createTaskInDb({
        domain_id: category,
        title: title.trim(),
        completed: false,
        description,
        task_type: taskType,
        priority,
        due_date: dueDate || "Sin fecha",
        estimate: Number(estimate) || 0,
        energy,
        tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
        resource_url: resourceUrl,
        badge_tone: priority === "Urgente" ? "urgent" : "neutral",
      })

      if (created) {
        setDomains((current) =>
          current.map((domain) =>
            domain.id === category
              ? {
                  ...domain,
                  tasks: [
                    ...domain.tasks,
                    {
                      id: created.id,
                      title: created.title,
                      completed: created.completed,
                      description: created.description,
                      taskType: created.task_type,
                      priority: created.priority,
                      dueDate: created.due_date,
                      estimate: created.estimate,
                      energy: created.energy,
                      tags: created.tags,
                      resourceUrl: created.resource_url,
                      badgeTone: created.badge_tone,
                    },
                  ],
                }
              : domain,
          ),
        )
      }
    }
    setDialogOpen(false)
  }

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 selection:bg-indigo-500/30">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(79,70,229,0.10),transparent_28%),radial-gradient(circle_at_90%_100%,rgba(124,58,237,0.08),transparent_30%)]" />

<header className="relative z-10 border-b border-slate-800/80 bg-[#090d16]/80 backdrop-blur-xl">
  <div className="mx-auto max-w-[1600px] px-7">
    {/* Fila Superior: Título, Buscador y Botones de Creación */}
    <div className="flex items-center gap-6 py-4">
      <div className="flex min-w-52 items-center gap-3">
        <div className="grid size-9 place-items-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-[0_0_24px_rgba(99,102,241,0.24)]">
          <Sparkles className="size-4.5 text-white" />
        </div>
        <div>
          <div className="text-base font-bold tracking-tight text-white">
            Personal OS
          </div>
          <div className="mt-0.5 flex items-center gap-1.5 text-[10px] font-medium text-slate-500">
            <span className="size-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
            MVP v1.0
          </div>
        </div>
      </div>

      <div className="relative mx-auto w-full max-w-xl">
        <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-600" />
        <input
          aria-label="Buscar tareas"
          className="h-10 w-full rounded-xl border border-slate-800 bg-slate-900/80 pl-10 pr-4 text-sm text-slate-200 outline-none transition-colors placeholder:text-slate-600 focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/10"
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Buscar tareas..."
          value={query}
        />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 rounded border border-slate-700/70 px-1.5 py-0.5 text-[9px] font-semibold text-slate-600">
          ⌘ K
        </span>
      </div>

      <div className="flex shrink-0 items-center justify-end gap-2">
        <AppButton
          className="h-10 gap-2 whitespace-nowrap rounded-xl border border-slate-700/80 bg-slate-900 px-3.5 text-xs font-semibold text-slate-300 hover:border-indigo-400/40 hover:text-white"
          onClick={() => setTypeDialogOpen(true)}
        >
          <Plus className="size-3.5" />
          Nuevo tipo
        </AppButton>
        <AppButton
          className="h-10 gap-2 whitespace-nowrap rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 px-4 text-xs font-semibold text-white shadow-[0_8px_26px_rgba(79,70,229,0.28)] hover:from-indigo-400 hover:to-violet-500"
          onClick={openNewTask}
        >
          <Plus className="size-4" strokeWidth={2.5} />
          Nueva tarea
        </AppButton>
        <div className="grid size-10 shrink-0 place-items-center rounded-full border border-slate-700 bg-gradient-to-br from-slate-700 to-slate-900 text-xs font-bold text-slate-200 ring-2 ring-slate-900">
          JA
        </div>
      </div>
    </div>

    {/* Fila Inferior: Filtros de Estado, Prioridad y Tipos */}
    <div className="flex items-center gap-2.5 overflow-x-auto border-t border-slate-800/60 py-3 scrollbar-none">
      <div className="flex shrink-0 rounded-xl border border-slate-800 bg-slate-900/70 p-1">
        {[
          { label: "Todas", value: "all" },
          { label: "Pendientes", value: "pending" },
          { label: "Completadas", value: "completed" },
        ].map((item) => (
          <AppButton
            className={`whitespace-nowrap rounded-lg px-3 py-1.5 text-[11px] font-medium transition-colors ${
              filter === item.value
                ? "bg-slate-700/80 text-white shadow-sm"
                : "text-slate-500 hover:text-slate-300"
            }`}
            key={item.value}
            onClick={() => setFilter(item.value as Filter)}
          >
            {item.label}
          </AppButton>
        ))}
      </div>

      <CompactSelect
        label="Filtrar por prioridad"
        onValueChange={(value) =>
          setPriorityFilter(value as "all" | Priority)
        }
        options={[
          { label: "Toda prioridad", value: "all" },
          ...(["Baja", "Media", "Alta", "Urgente"] as Priority[]).map((item) => ({
            label: item,
            value: item,
          })),
        ]}
        value={priorityFilter}
      />

      <div className="h-5 w-px shrink-0 bg-slate-800" />

      <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
        <AppButton
          className={`shrink-0 whitespace-nowrap rounded-full px-3 py-1.5 text-[10px] font-semibold ring-1 ring-inset ${
            typeFilter === "all"
              ? "bg-indigo-500/15 text-indigo-300 ring-indigo-400/30"
              : "text-slate-500 ring-slate-800 hover:text-slate-300"
          }`}
          onClick={() => setTypeFilter("all")}
        >
          Todos los tipos
        </AppButton>
        {taskTypes.map((item) => (
          <AppButton
            className={`shrink-0 whitespace-nowrap rounded-full px-3 py-1.5 text-[10px] font-semibold ring-1 ring-inset ${
              typeFilter === item
                ? (typeStyles[item] ?? "bg-indigo-400/10 text-indigo-300 ring-indigo-400/20")
                : "text-slate-500 ring-slate-800 hover:text-slate-300"
            }`}
            key={item}
            onClick={() => setTypeFilter(item)}
          >
            {item}
          </AppButton>
        ))}
      </div>
    </div>
  </div>
</header>

      <main className="relative z-0 mx-auto flex max-w-[1600px] flex-col px-7 py-6">
        <div className="mb-5 flex items-end justify-between">
          <div>
            <div className="mb-1 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-indigo-400">
              <Circle className="size-1.5 fill-current" />
              Centro de comando
            </div>
            <div className="text-2xl font-bold tracking-tight text-white">
              Tus prioridades, en orden.
            </div>
            <div className="mt-1 text-sm text-slate-500">
              Organiza cada área sin perder de vista lo importante.
            </div>
          </div>

          <div className="flex items-center gap-4 rounded-xl border border-slate-800/80 bg-slate-900/50 px-4 py-2.5">
            <div className="grid size-8 place-items-center rounded-lg bg-indigo-500/10 text-indigo-300">
              <BarChart3 className="size-4" />
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-sm font-bold text-slate-200">
                  {progress}% completado
                </span>
                <span className="text-[10px] text-slate-600">HOY</span>
              </div>
              <div className="mt-1.5 h-1.5 w-32 overflow-hidden rounded-full bg-slate-800">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-400 transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="grid min-h-[640px] flex-1 auto-rows-[minmax(260px,1fr)] grid-cols-1 lg:grid-cols-2 gap-4">
          {visibleDomains.slice(0, 4).map((domain) => (
            <DomainCard
              domain={domain}
              key={domain.id}
              onDelete={deleteTask}
              onEdit={openEdit}
              onQuickAdd={quickAdd}
              onRename={renameDomain}
              onToggle={toggleTask}
              tasks={domain.filteredTasks}
            />
          ))}
        </div>

        <div className="mb-4 mt-8 flex items-center gap-3">
          <div className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
            Espacios personalizados
          </div>
          <div className="h-px flex-1 bg-slate-800/80" />
          <span className="text-[10px] font-semibold text-slate-600">
            6 PLANTILLAS
          </span>
        </div>
        <div className="grid auto-rows-[minmax(240px,1fr)] grid-cols-2 gap-4">
          {visibleDomains.slice(4).map((domain) => (
            <DomainCard
              domain={domain}
              key={domain.id}
              onDelete={deleteTask}
              onEdit={openEdit}
              onQuickAdd={quickAdd}
              onRename={renameDomain}
              onToggle={toggleTask}
              tasks={domain.filteredTasks}
            />
          ))}
        </div>
      </main>

      <Dialog.Root onOpenChange={setDialogOpen} open={dialogOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm data-[state=open]:animate-[fadeIn_180ms_ease-out]" />
          <Dialog.Content className="fixed left-1/2 top-1/2 z-50 max-h-[92vh] w-[min(92vw,720px)] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-2xl border border-slate-700/80 bg-slate-900 p-6 shadow-[0_30px_100px_rgba(0,0,0,0.55)] outline-none data-[state=open]:animate-[dialogIn_220ms_ease-out]">
            <div className="mb-6 flex items-start justify-between">
              <div>
                <Dialog.Title className="text-lg font-bold tracking-tight text-white">
                  {editing ? "Editar tarea" : "Crear nueva tarea"}
                </Dialog.Title>
                <Dialog.Description className="mt-1 text-sm text-slate-500">
                  {editing
                    ? "Actualiza los detalles y guarda los cambios."
                    : "Captura una tarea y asígnala a un área de tu vida."}
                </Dialog.Description>
              </div>
              <Dialog.Close asChild>
                <AppButton className="size-8 rounded-lg text-slate-500 hover:bg-white/5 hover:text-white">
                  <X className="size-4" />
                </AppButton>
              </Dialog.Close>
            </div>

            <form className="space-y-5" onSubmit={submitTask}>
              <div className="grid grid-cols-2 gap-4">
                <label className="block">
                  <span className="mb-2 block text-xs font-semibold text-slate-300">
                    Título
                  </span>
                  <input
                    autoFocus
                    className="h-11 w-full rounded-xl border border-slate-700/80 bg-slate-950/60 px-3.5 text-sm text-slate-100 outline-none placeholder:text-slate-600 focus:border-indigo-400/60"
                    onChange={(event) => setTitle(event.target.value)}
                    placeholder="Ej. Preparar presentación"
                    required
                    value={title}
                  />
                </label>
                <SelectField
                  label="Cuadrante / categoría"
                  onValueChange={(value) => setCategory(value as DomainId)}
                    options={initialDomains.map((domain) => ({
                      label: domain.title,
                      value: domain.id,
                    }))}
                  value={category}
                />
              </div>

              <label className="block">
                <span className="mb-2 block text-xs font-semibold text-slate-300">
                  Descripción
                </span>
                <textarea
                  className="min-h-20 w-full resize-none rounded-xl border border-slate-700/80 bg-slate-950/60 px-3.5 py-3 text-sm text-slate-100 outline-none placeholder:text-slate-600 focus:border-indigo-400/60"
                  onChange={(event) => setDescription(event.target.value)}
                  placeholder="Contexto, resultado esperado o próximos pasos..."
                  value={description}
                />
              </label>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <SelectField
                    label="Tipo de tarea"
                    onValueChange={setTaskType}
                    options={taskTypes.map((item) => ({
                      label: item,
                      value: item,
                    }))}
                    value={taskType}
                  />
                  <AppButton
                    className="mt-2 gap-1 text-[10px] font-semibold text-indigo-300 hover:text-indigo-200"
                    onClick={() => setTypeDialogOpen(true)}
                    type="button"
                  >
                    <Plus className="size-3" />
                    Crear nuevo tipo
                  </AppButton>
                </div>
                <SelectField
                  label="Prioridad"
                  onValueChange={(value) => setPriority(value as Priority)}
                  options={([
                    "Baja",
                    "Media",
                    "Alta",
                    "Urgente",
                  ] as Priority[]).map((item) => ({
                    label: item,
                    value: item,
                  }))}
                  value={priority}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <label className="block">
                  <span className="mb-2 block text-xs font-semibold text-slate-300">
                    Fecha límite
                  </span>
                  <div className="relative">
                    <CalendarDays className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-500" />
                    <input
                      className="date-input h-11 w-full rounded-xl border border-slate-700/80 bg-slate-950/60 pl-10 pr-3 text-sm text-slate-300 outline-none focus:border-indigo-400/60"
                      onChange={(event) => setDueDate(event.target.value)}
                      type="date"
                      value={dueDate}
                    />
                  </div>
                </label>
                <label className="block">
                  <span className="mb-2 block text-xs font-semibold text-slate-300">
                    Tiempo estimado
                  </span>
                  <div className="relative">
                    <Clock3 className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-500" />
                    <input
                      className="h-11 w-full rounded-xl border border-slate-700/80 bg-slate-950/60 pl-10 pr-12 text-sm text-slate-300 outline-none focus:border-indigo-400/60"
                      min="0"
                      onChange={(event) => setEstimate(event.target.value)}
                      type="number"
                      value={estimate}
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-600">
                      MIN
                    </span>
                  </div>
                </label>
                <div>
                  <span className="mb-2 block text-xs font-semibold text-slate-300">
                    Energía
                  </span>
                  <div className="flex h-11 rounded-xl border border-slate-700/80 bg-slate-950/60 p-1">
                    {(["Alta", "Baja"] as Energy[]).map((item) => (
                      <AppButton
                        className={`flex-1 gap-1.5 rounded-lg text-[10px] font-semibold ${
                          energy === item
                            ? "bg-slate-700 text-white"
                            : "text-slate-500 hover:text-slate-300"
                        }`}
                        key={item}
                        onClick={() => setEnergy(item)}
                        type="button"
                      >
                        {item === "Alta" ? (
                          <Zap className="size-3" />
                        ) : (
                          <BatteryLow className="size-3" />
                        )}
                        {item}
                      </AppButton>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <label className="block">
                  <span className="mb-2 block text-xs font-semibold text-slate-300">
                    Etiquetas
                  </span>
                  <input
                    className="h-11 w-full rounded-xl border border-slate-700/80 bg-slate-950/60 px-3.5 text-sm text-slate-100 outline-none placeholder:text-slate-600 focus:border-indigo-400/60"
                    onChange={(event) => setTags(event.target.value)}
                    placeholder="diseño, universidad, foco"
                    value={tags}
                  />
                  {tags && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {tags
                        .split(",")
                        .map((tag) => tag.trim())
                        .filter(Boolean)
                        .map((tag) => (
                          <span
                            className="rounded-full bg-slate-800 px-2 py-0.5 text-[9px] text-slate-400"
                            key={tag}
                          >
                            #{tag}
                          </span>
                        ))}
                    </div>
                  )}
                </label>
                <label className="block">
                  <span className="mb-2 block text-xs font-semibold text-slate-300">
                    Recurso o enlace
                  </span>
                  <div className="relative">
                    <Link2 className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-500" />
                    <input
                      className="h-11 w-full rounded-xl border border-slate-700/80 bg-slate-950/60 pl-10 pr-3.5 text-sm text-slate-100 outline-none placeholder:text-slate-600 focus:border-indigo-400/60"
                      onChange={(event) => setResourceUrl(event.target.value)}
                      placeholder="obsidian://... o https://..."
                      type="url"
                      value={resourceUrl}
                    />
                  </div>
                </label>
              </div>

              <div className="flex justify-end gap-3 border-t border-slate-800 pt-5">
                <Dialog.Close asChild>
                  <AppButton
                    className="h-10 rounded-xl border border-slate-700 px-4 text-sm font-semibold text-slate-400 hover:bg-white/5 hover:text-white"
                    type="button"
                  >
                    Cancelar
                  </AppButton>
                </Dialog.Close>
                <AppButton
                  className="h-10 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 px-5 text-sm font-semibold text-white shadow-[0_8px_24px_rgba(79,70,229,0.24)] hover:from-indigo-400 hover:to-violet-500"
                  type="submit"
                >
                  {editing ? "Guardar cambios" : "Crear tarea"}
                </AppButton>
              </div>
            </form>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      <Dialog.Root onOpenChange={setTypeDialogOpen} open={typeDialogOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-[60] bg-slate-950/75 backdrop-blur-sm" />
          <Dialog.Content className="fixed left-1/2 top-1/2 z-[70] w-[min(92vw,420px)] -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-slate-700/80 bg-slate-900 p-6 shadow-2xl outline-none">
            <div className="mb-5 flex items-start justify-between">
              <div>
                <Dialog.Title className="text-base font-bold text-white">
                  Nuevo tipo de tarea
                </Dialog.Title>
                <Dialog.Description className="mt-1 text-xs text-slate-500">
                  Crea una categoría reutilizable para tus tareas.
                </Dialog.Description>
              </div>
              <Dialog.Close asChild>
                <AppButton className="size-8 rounded-lg text-slate-500 hover:bg-white/5 hover:text-white">
                  <X className="size-4" />
                </AppButton>
              </Dialog.Close>
            </div>
            <form onSubmit={createTaskType}>
              <label className="block">
                <span className="mb-2 block text-xs font-semibold text-slate-300">
                  Nombre del tipo
                </span>
                <input
                  autoFocus
                  className="h-11 w-full rounded-xl border border-slate-700/80 bg-slate-950/60 px-3.5 text-sm text-slate-100 outline-none placeholder:text-slate-600 focus:border-indigo-400/60"
                  onChange={(event) => setNewTypeName(event.target.value)}
                  placeholder="Ej. Investigación"
                  value={newTypeName}
                />
              </label>
              <div className="mt-5 flex justify-end gap-3">
                <Dialog.Close asChild>
                  <AppButton
                    className="h-10 rounded-xl border border-slate-700 px-4 text-xs font-semibold text-slate-400 hover:bg-white/5"
                    type="button"
                  >
                    Cancelar
                  </AppButton>
                </Dialog.Close>
                <AppButton
                  className="h-10 rounded-xl bg-indigo-500 px-4 text-xs font-semibold text-white hover:bg-indigo-400"
                  type="submit"
                >
                  Crear tipo
                </AppButton>
              </div>
            </form>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  )
}
