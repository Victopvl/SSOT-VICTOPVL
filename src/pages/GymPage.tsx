import { useEffect, useState, type ReactNode } from "react"
import {
  fetchWeeklyRoutines,
  createGymRoutine,
  updateGymRoutine,
  deleteGymRoutine,
  logGymSet,
  fetchTkdProfile,
  upsertTkdProfile,
  fetchTkdPoomsaes,
  createTkdPoomsae,
  deleteTkdPoomsae,
  fetchTkdCompetitions,
  createTkdCompetition,
  deleteTkdCompetition,
  fetchTkdGoals,
  createTkdGoal,
  toggleTkdGoal,
  deleteTkdGoal,
  logBodyWeight,
  fetchRecentBodyWeightLogs,
  logBodyMeasurement,
  fetchMeasurementLogsByZone,
  fetchActiveHabits,
  createHabit,
  deleteHabit,
  logDailyHabit,
  fetchDailyHabitLogs,
  type GymRoutine,
  type GymSetLog,
  type TkdProfile,
  type TkdPoomsae,
  type TkdCompetition,
  type TkdGoal,
  type BodyWeightLog,
  type BodyMeasurementLog,
  type Habit,
  type HabitDailyLog,
} from "../lib/gymService"

type IconName =
  | "activity"
  | "arrow"
  | "bolt"
  | "calendar"
  | "check"
  | "chevron"
  | "clock"
  | "close"
  | "command"
  | "droplet"
  | "dumbbell"
  | "flame"
  | "heart"
  | "medal"
  | "pause"
  | "play"
  | "plus"
  | "search"
  | "shield"
  | "sparkles"
  | "target"
  | "trending"
  | "edit"
  | "trash"

const paths: Record<IconName, ReactNode> = {
  activity: <path d="M4 12h3l2.2-7 4 14 2.2-7H20" />,
  arrow: <path d="m9 18 6-6-6-6" />,
  bolt: <path d="m13 2-8 12h7l-1 8 8-12h-7l1-8Z" />,
  calendar: (
    <>
      <path d="M6 2v3M18 2v3M3 9h18" />
      <rect x="3" y="4" width="18" height="17" rx="3" />
    </>
  ),
  check: <path d="m5 12 4 4L19 6" />,
  chevron: <path d="m8 10 4 4 4-4" />,
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>
  ),
  close: <path d="m6 6 12 12M18 6 6 18" />,
  command: (
    <path d="M9 6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6Z" />
  ),
  droplet: <path d="M12 2S5 9.2 5 14a7 7 0 0 0 14 0c0-4.8-7-12-7-12Z" />,
  dumbbell: <path d="M6 7v10M3 9v6M18 7v10M21 9v6M6 12h12" />,
  flame: (
    <path d="M12 22c4.4 0 7-3.1 7-7.3 0-3.5-2-6.5-5.8-10.7.2 3-1.7 4.7-3 6.2-.7-1.4-.8-2.7-.5-4.2C6.7 8.5 5 11.4 5 14.7 5 18.9 7.6 22 12 22Z" />
  ),
  heart: (
    <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z" />
  ),
  medal: (
    <>
      <circle cx="12" cy="15" r="6" />
      <path d="m8 2 4 7 4-7M9.5 15l1.5 1.5 3.5-3.5" />
    </>
  ),
  pause: <path d="M9 7v10M15 7v10" />,
  play: <path d="m9 7 8 5-8 5V7Z" />,
  plus: <path d="M12 5v14M5 12h14" />,
  search: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-4-4" />
    </>
  ),
  shield: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />,
  sparkles: (
    <path d="m12 3 1.2 3.8L17 8l-3.8 1.2L12 13l-1.2-3.8L7 8l3.8-1.2L12 3ZM5 15l.7 2.3L8 18l-2.3.7L5 21l-.7-2.3L2 18l2.3-.7L5 15ZM19 13l.7 2.3 2.3.7-2.3.7L19 19l-.7-2.3L16 16l2.3-.7L19 13Z" />
  ),
  target: (
    <>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="4" />
      <path d="M12 3v3M21 12h-3M12 21v-3M3 12h3" />
    </>
  ),
  trending: <path d="m3 17 6-6 4 4 8-9M15 6h6v6" />,
  edit: (
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  ),
  trash: (
    <>
      <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </>
  ),
}

function Icon({ name, size = 16 }: { name: IconName; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  )
}

function Button({
  children,
  variant = "primary",
  className = "",
  onClick,
  type = "button",
}: {
  children: ReactNode
  variant?: "primary" | "secondary" | "ghost"
  className?: string
  onClick?: () => void
  type?: "button" | "submit" | "reset"
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`button button-${variant} ${className}`}
    >
      {children}
    </button>
  )
}

const viewTabs = [
  { id: "gym", label: "Gym & Programación", icon: "dumbbell" as IconName },
  { id: "tkd", label: "Taekwondo WT", icon: "shield" as IconName },
  { id: "body", label: "Recomposición", icon: "trending" as IconName },
]

const filters = [
  ["Todos", "activity"],
  ["Fuerza & Hipertrofia", "dumbbell"],
  ["Pliometría", "bolt"],
  ["Velocidad & Reacción", "trending"],
  ["Elasticidad", "sparkles"],
  ["Core & Estabilidad", "shield"],
  ["HIIT & Cardio", "heart"],
] as [string, IconName][]

const defaultWeek: GymRoutine[] = [
  {
    day_of_week: 1,
    title: "Pliometría & Potencia de Cadera",
    training_type: "Pliometría",
    estimated_duration_min: 50,
    target_focus: "Glúteos · Cuádriceps",
    accent_color: "sky",
    is_completed: true,
  },
  {
    day_of_week: 2,
    title: "Fuerza Glúteos & Cadena Posterior",
    training_type: "Fuerza & Hipertrofia",
    estimated_duration_min: 70,
    target_focus: "Glúteos · Femoral",
    accent_color: "emerald",
    is_completed: true,
  },
  {
    day_of_week: 3,
    title: "Velocidad, Reacción & Core",
    training_type: "Velocidad & Reacción",
    estimated_duration_min: 45,
    target_focus: "Core · Estabilidad",
    accent_color: "violet",
    is_completed: true,
  },
  {
    day_of_week: 4,
    title: "Hipertrofia Tren Inferior",
    training_type: "Fuerza & Hipertrofia",
    estimated_duration_min: 65,
    target_focus: "Glúteos · Cuádriceps",
    accent_color: "emerald",
    is_completed: true,
  },
  {
    day_of_week: 5,
    title: "Flexibilidad PNF Spagat",
    training_type: "Elasticidad",
    estimated_duration_min: 40,
    target_focus: "Cadera · Isquios",
    accent_color: "amber",
    is_completed: false,
  },
  {
    day_of_week: 6,
    title: "HIIT Específico Kyorugi",
    training_type: "HIIT & Cardio",
    estimated_duration_min: 35,
    target_focus: "Full body · Cardio",
    accent_color: "rose",
    is_completed: false,
  },
  {
    day_of_week: 7,
    title: "Recuperación & Movilidad",
    training_type: "Elasticidad",
    estimated_duration_min: 30,
    target_focus: "Movilidad global",
    accent_color: "slate",
    is_completed: false,
  },
]

const DAYS = [
  { id: 1, day: "LUN", date: "12" },
  { id: 2, day: "MAR", date: "13" },
  { id: 3, day: "MIÉ", date: "14" },
  { id: 4, day: "JUE", date: "15" },
  { id: 5, day: "VIE", date: "16" },
  { id: 6, day: "SÁB", date: "17" },
  { id: 7, day: "DOM", date: "18" },
]

function Brand() {
  return (
    <div className="brand">
      <div className="brand-mark">
        <Icon name="activity" size={19} />
      </div>
      <div>
        <div className="brand-title">
          Personal <span>OS</span>
        </div>
        <div className="brand-sub">PERFORMANCE SYSTEM</div>
      </div>
    </div>
  )
}

function Header({
  active,
  setActive,
  openDrawer,
  openRoutineModal,
}: {
  active: string
  setActive: (id: string) => void
  openDrawer: () => void
  openRoutineModal: () => void
}) {
  return (
    <header className="header">
      <div className="header-top">
        <Brand />
        <div className="workspace-badge">
          <span>05</span>
          <b>Entrenamiento, Gym & Taekwondo WT</b>
        </div>
        <label className="search">
          <Icon name="search" />
          <input placeholder="Buscar ejercicios, poomsaes, torneos..." />
          <kbd>
            <Icon name="command" size={12} /> K
          </kbd>
        </label>
        <div className="live">
          <i /> Supabase Connected
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={openRoutineModal} variant="secondary">
            <Icon name="plus" /> Nueva rutina
          </Button>
          <Button onClick={openDrawer}>
            <Icon name="play" /> Iniciar entreno
          </Button>
        </div>
        <button type="button" className="avatar">
          MR
          <span />
        </button>
      </div>
      <div className="header-nav">
        <div className="view-tabs">
          {viewTabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActive(tab.id)}
              className={active === tab.id ? "active" : ""}
            >
              <Icon name={tab.icon} />
              {tab.label}
            </button>
          ))}
        </div>
        <div className="week-range">
          <Icon name="calendar" />
          <span>12 — 18 MAYO 2026</span>
          <Icon name="chevron" />
        </div>
      </div>
    </header>
  )
}

function SectionTitle({
  eyebrow,
  title,
  detail,
}: {
  eyebrow: string
  title: string
  detail?: string
}) {
  return (
    <div className="section-title">
      <div>
        <span>{eyebrow}</span>
        <h2>{title}</h2>
      </div>
      {detail && <p>{detail}</p>}
    </div>
  )
}

// ==========================================
// PESTAÑA 1: GYM & PROGRAMACIÓN
// ==========================================
function GymView({
  openDrawer,
  routines,
  loading,
  onOpenCreate,
  onOpenEdit,
  onDelete,
  sets,
  setSets,
}: {
  openDrawer: (routine?: GymRoutine) => void
  routines: GymRoutine[]
  loading: boolean
  onOpenCreate: () => void
  onOpenEdit: (routine: GymRoutine) => void
  onDelete: (id: string) => void
  sets: { kg: string; reps: string; rpe: string }[]
  setSets: React.Dispatch<
    React.SetStateAction<{ kg: string; reps: string; rpe: string }[]>
  >
}) {
  const [filter, setFilter] = useState("Todos")

  const displayRoutines = routines.length > 0 ? routines : defaultWeek

  const filteredRoutines = displayRoutines.filter((routine) => {
    if (filter === "Todos") return true
    return routine.training_type.toLowerCase().includes(filter.toLowerCase())
  })

  const totalSessions = displayRoutines.length
  const totalMinutes = displayRoutines.reduce(
    (acc, r) => acc + (r.estimated_duration_min || 0),
    0,
  )
  const hours = Math.floor(totalMinutes / 60)
  const mins = totalMinutes % 60
  const completedCount = displayRoutines.filter((r) => r.is_completed).length

  return (
    <main className="page">
      <section className="hero-line">
        <div>
          <div className="eyebrow">
            <span className="pulse-dot" /> MICROCICLO · SEMANA 20
          </div>
          <h1>
            Tu semana de <span>alto rendimiento.</span>
          </h1>
          <p>
            Equilibra fuerza, explosividad y recuperación para llegar a tu pico.
          </p>
        </div>
        <div className="mini-stats">
          <div>
            <Icon name="flame" />
            <span>
              <b>{totalSessions}</b> sesiones
            </span>
          </div>
          <div>
            <Icon name="clock" />
            <span>
              <b>
                {hours}h {mins}m
              </b>{" "}
              volumen
            </span>
          </div>
          <div>
            <Icon name="trending" />
            <span>
              <b>+{completedCount ? Math.round((completedCount / totalSessions) * 100) : 0}%</b> carga
            </span>
          </div>
        </div>
      </section>

      <div className="filters">
        {filters.map(([label, icon]) => (
          <button
            type="button"
            key={label}
            onClick={() => setFilter(label)}
            className={filter === label ? "selected" : ""}
          >
            <Icon name={icon} />
            {label}
          </button>
        ))}
      </div>

      <section>
        <SectionTitle
          eyebrow="PLAN SEMANAL"
          title="Programación multifacética"
          detail={`${totalSessions} sesiones · ${completedCount} completadas`}
        />

        {loading ? (
          <div className="py-12 text-center text-xs text-slate-500">
            Cargando programación desde Supabase...
          </div>
        ) : (
          <div className="week-grid">
            {filteredRoutines.map((session, index) => {
              const dayMeta = DAYS.find((d) => d.id === session.day_of_week) || DAYS[index % 7]
              return (
                <article
                  className={`day-card accent-${session.accent_color || "emerald"} ${
                    index === 0 ? "featured" : ""
                  }`}
                  key={session.id || session.title + index}
                >
                  <div className="day-top">
                    <span>{dayMeta.day}</span>
                    <b>{dayMeta.date}</b>
                    {session.is_completed && (
                      <i>
                        <Icon name="check" size={11} />
                      </i>
                    )}
                  </div>
                  <div className="type-label">{session.training_type}</div>
                  <h3>{session.title}</h3>
                  <div className="session-meta">
                    <span>
                      <Icon name="clock" size={13} />
                      {session.estimated_duration_min} min
                    </span>
                    <span>
                      <Icon name="target" size={13} />
                      {session.target_focus || "General"}
                    </span>
                  </div>
                  <div className="mt-2 flex items-center justify-between gap-2 border-t border-slate-800/60 pt-2">
                    <Button
                      variant={index === 0 ? "primary" : "secondary"}
                      onClick={() => openDrawer(session)}
                    >
                      {index === 0 ? (
                        <Icon name="play" size={14} />
                      ) : (
                        <Icon name="plus" size={14} />
                      )}{" "}
                      {index === 0 ? "Iniciar sesión" : "Ver sesión"}
                    </Button>

                    {session.id && (
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => onOpenEdit(session)}
                          className="rounded-lg p-1 text-slate-500 hover:bg-slate-800 hover:text-white"
                          title="Editar rutina"
                        >
                          <Icon name="edit" size={13} />
                        </button>
                        <button
                          type="button"
                          onClick={() => session.id && onDelete(session.id)}
                          className="rounded-lg p-1 text-slate-500 hover:bg-slate-800 hover:text-rose-400"
                          title="Eliminar rutina"
                        >
                          <Icon name="trash" size={13} />
                        </button>
                      </div>
                    )}
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </section>

      <section className="logger card">
        <div className="logger-head">
          <div className="exercise-icon">
            <Icon name="dumbbell" size={20} />
          </div>
          <div>
            <span>REGISTRO DE SOBRECARGA PROGRESIVA</span>
            <h2>Hip Thrust con barra</h2>
            <p>Glúteo mayor · Fuerza / Hipertrofia</p>
          </div>
          <div className="personal-best">
            <span>MEJOR MARCA</span>
            <b>100 kg × 6</b>
          </div>
          <div className="rest-timer">
            <Icon name="clock" />
            <span>DESCANSO</span>
            <b>01:30</b>
            <button type="button">
              <Icon name="pause" size={14} />
            </button>
          </div>
        </div>
        <div className="table">
          <div className="table-row table-header">
            <span>SERIE</span>
            <span>PESO (KG)</span>
            <span>REPETICIONES</span>
            <span>RPE (1–10)</span>
            <span>RECORD ANTERIOR</span>
            <span>ESTADO</span>
          </div>
          {sets.map((set, i) => (
            <div className="table-row" key={i}>
              <span className="set-number">
                {String(i + 1).padStart(2, "0")}
              </span>
              <label>
                <input
                  value={set.kg}
                  onChange={(e) =>
                    setSets(
                      sets.map((s, n) =>
                        n === i ? { ...s, kg: e.target.value } : s,
                      ),
                    )
                  }
                />
                <em>kg</em>
              </label>
              <label>
                <input
                  value={set.reps}
                  onChange={(e) =>
                    setSets(
                      sets.map((s, n) =>
                        n === i ? { ...s, reps: e.target.value } : s,
                      ),
                    )
                  }
                />
                <em>reps</em>
              </label>
              <label>
                <input
                  value={set.rpe}
                  onChange={(e) =>
                    setSets(
                      sets.map((s, n) =>
                        n === i ? { ...s, rpe: e.target.value } : s,
                      ),
                    )
                  }
                />
                <em>RPE</em>
              </label>
              <span className="previous">
                Última vez: <b>{i ? "85kg × 8" : "85kg × 10"}</b>
              </span>
              <span className="done">
                <Icon name="check" size={13} /> Completada
              </span>
            </div>
          ))}
        </div>
        <Button
          variant="ghost"
          className="add-set"
          onClick={() => setSets([...sets, { kg: "90", reps: "6", rpe: "9" }])}
        >
          <Icon name="plus" /> Agregar serie
        </Button>
      </section>
    </main>
  )
}

// ==========================================
// PESTAÑA 2: TAEKWONDO WT
// ==========================================
function TkdView() {
  const [profile, setProfile] = useState<TkdProfile>({
    belt_grade: "Cinturón Rojo 2° Gup",
    dan_gup: "1er Dan",
    academy_name: "Academia Central Taekwondo WT",
    weight_category: "−57 kg Kyorugi",
    current_macrocycle: "Preparación Pre-Competitiva",
    next_tournament_date: "2026-06-24",
  })
  const [poomsaes, setPoomsaes] = useState<TkdPoomsae[]>([])
  const [competitions, setCompetitions] = useState<TkdCompetition[]>([])
  const [goals, setGoals] = useState<TkdGoal[]>([])
  const [loading, setLoading] = useState(true)

  // Modales
  const [profileModal, setProfileModal] = useState(false)
  const [poomsaeModal, setPoomsaeModal] = useState(false)
  const [compModal, setCompModal] = useState(false)
  const [goalModal, setGoalModal] = useState(false)

  // Forms
  const [poomsaeForm, setPoomsaeForm] = useState<Partial<TkdPoomsae>>({
    poomsae_name: "",
    category: "Poomsae Tradicional",
    mastery_percentage: 80,
    technique_notes: "",
  })
  const [compForm, setCompForm] = useState<Partial<TkdCompetition>>({
    event_name: "",
    event_date: "2026-06-24",
    competition_type: "Combate Kyorugi",
    city_location: "",
    result_medal: "PRÓXIMO",
    technical_review: "",
  })
  const [goalForm, setGoalForm] = useState<Partial<TkdGoal>>({
    title: "",
    description: "Meta prioritaria",
    category: "Competencia",
  })

  const loadTkdData = async () => {
    setLoading(true)
    const pData = await fetchTkdProfile()
    if (pData) setProfile(pData)

    const pmData = await fetchTkdPoomsaes()
    setPoomsaes(pmData)

    const cData = await fetchTkdCompetitions()
    setCompetitions(cData)

    const gData = await fetchTkdGoals()
    setGoals(gData)

    setLoading(false)
  }

  useEffect(() => {
    loadTkdData()
  }, [])

  const getDaysRemaining = () => {
    if (!profile.next_tournament_date) return 32
    const target = new Date(profile.next_tournament_date)
    const today = new Date()
    const diff = Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    return diff > 0 ? diff : 0
  }

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    await upsertTkdProfile(profile)
    setProfileModal(false)
    loadTkdData()
  }

  const handleSavePoomsae = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!poomsaeForm.poomsae_name) return
    await createTkdPoomsae(poomsaeForm as TkdPoomsae)
    setPoomsaeModal(false)
    setPoomsaeForm({ poomsae_name: "", category: "Poomsae Tradicional", mastery_percentage: 80, technique_notes: "" })
    loadTkdData()
  }

  const handleDeletePoomsae = async (id: string) => {
    if (confirm("¿Eliminar este Poomsae?")) {
      await deleteTkdPoomsae(id)
      loadTkdData()
    }
  }

  const handleSaveCompetition = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!compForm.event_name) return
    await createTkdCompetition(compForm as TkdCompetition)
    setCompModal(false)
    setCompForm({ event_name: "", event_date: "2026-06-24", competition_type: "Combate Kyorugi", city_location: "", result_medal: "PRÓXIMO", technical_review: "" })
    loadTkdData()
  }

  const handleDeleteCompetition = async (id: string) => {
    if (confirm("¿Eliminar este torneo?")) {
      await deleteTkdCompetition(id)
      loadTkdData()
    }
  }

  const handleSaveGoal = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!goalForm.title) return
    await createTkdGoal(goalForm as TkdGoal)
    setGoalModal(false)
    setGoalForm({ title: "", description: "Meta prioritaria", category: "Competencia" })
    loadTkdData()
  }

  const handleToggleGoal = async (id: string, currentVal?: boolean) => {
    await toggleTkdGoal(id, !currentVal)
    loadTkdData()
  }

  const handleDeleteGoal = async (id: string) => {
    if (confirm("¿Eliminar este objetivo?")) {
      await deleteTkdGoal(id)
      loadTkdData()
    }
  }

  return (
    <main className="page">
      <section className="martial-banner relative group">
        <button
          onClick={() => setProfileModal(true)}
          className="absolute top-4 right-4 bg-slate-800/80 hover:bg-slate-700 text-slate-300 p-2 rounded-xl text-xs flex items-center gap-1.5 transition-all"
        >
          <Icon name="edit" size={14} /> Editar Perfil
        </button>

        <div className="belt-symbol">
          <span />
          <span />
        </div>
        <div>
          <span className="red-eyebrow">PERFIL MARCIAL · WORLD TAEKWONDO</span>
          <h1>
            {profile.belt_grade} <small>{profile.dan_gup}</small>
          </h1>
          <p>{profile.academy_name}</p>
        </div>
        <div className="profile-data">
          <span>
            CATEGORÍA<b>{profile.weight_category}</b>
          </span>
          <span>
            MACROCICLO ACTUAL
            <b>
              <Icon name="flame" /> {profile.current_macrocycle}
            </b>
          </span>
          <span>
            PRÓXIMO EVENTO<b>En {getDaysRemaining()} días</b>
          </span>
        </div>
      </section>

      <div className="tkd-grid">
        <section className="card poomsae-card">
          <div className="flex items-center justify-between mb-4">
            <SectionTitle
              eyebrow="DOMINIO TÉCNICO"
              title="Repertorio de Poomsaes"
              detail={`${poomsaes.length} formas registradas`}
            />
            <Button onClick={() => setPoomsaeModal(true)} variant="secondary">
              <Icon name="plus" /> Poomsae
            </Button>
          </div>

          {loading ? (
            <div className="text-xs text-slate-500 py-6 text-center">Cargando poomsaes...</div>
          ) : poomsaes.length === 0 ? (
            <div className="text-xs text-slate-500 py-6 text-center border border-dashed border-slate-800 rounded-xl">
              No hay Poomsaes registrados. Agrega el primero con "+ Poomsae".
            </div>
          ) : (
            <div className="poomsae-list">
              {poomsaes.map((item) => (
                <div className="poomsae-row group relative" key={item.id}>
                  <div className="rank">品</div>
                  <div className="flex-1">
                    <h3 className="flex items-center justify-between">
                      <span>{item.poomsae_name}</span>
                      <span className="text-[10px] text-slate-400 font-normal">{item.category}</span>
                    </h3>
                    <p>{item.technique_notes || "Sin notas adicionales"}</p>
                    <div className="progress">
                      <i style={{ width: `${item.mastery_percentage}%` }} />
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <b>{item.mastery_percentage}%</b>
                    <button
                      onClick={() => item.id && handleDeletePoomsae(item.id)}
                      className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-rose-400 p-1"
                      title="Eliminar"
                    >
                      <Icon name="trash" size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="card competitions">
          <div className="flex items-center justify-between mb-4">
            <SectionTitle eyebrow="CALENDARIO WT" title="Torneos & Participaciones" />
            <Button onClick={() => setCompModal(true)} variant="secondary">
              <Icon name="plus" /> Torneo
            </Button>
          </div>

          {loading ? (
            <div className="text-xs text-slate-500 py-6 text-center">Cargando competencias...</div>
          ) : competitions.length === 0 ? (
            <div className="text-xs text-slate-500 py-6 text-center border border-dashed border-slate-800 rounded-xl">
              No hay torneos registrados. Agrega uno con "+ Torneo".
            </div>
          ) : (
            <div className="timeline">
              {competitions.map((item) => {
                const isGold = item.result_medal?.includes("ORO")
                const isSilver = item.result_medal?.includes("PLATA")
                const isBronze = item.result_medal?.includes("BRONCE")
                return (
                  <div className={`event ${item.result_medal === "PRÓXIMO" ? "upcoming" : ""} group relative`} key={item.id}>
                    <i />
                    <div className="flex items-center justify-between">
                      <span>{item.event_date}</span>
                      <button
                        onClick={() => item.id && handleDeleteCompetition(item.id)}
                        className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-rose-400 p-1"
                      >
                        <Icon name="trash" size={12} />
                      </button>
                    </div>
                    <h3>{item.event_name}</h3>
                    <p>
                      {item.competition_type} · {item.city_location || "Sede por confirmar"}
                    </p>
                    <b className={isGold ? "gold" : isSilver ? "silver" : isBronze ? "bronze" : ""}>
                      {item.result_medal || "PARTICIPACIÓN"}
                    </b>
                    {item.technical_review && (
                      <blockquote>Análisis: {item.technical_review}</blockquote>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </section>

        <section className="card goals">
          <div className="flex items-center justify-between mb-4">
            <SectionTitle eyebrow="ROAD TO BLACK BELT" title="Objetivos deportivos" />
            <Button onClick={() => setGoalModal(true)} variant="secondary">
              <Icon name="plus" /> Nuevo objetivo
            </Button>
          </div>

          {loading ? (
            <div className="text-xs text-slate-500 py-6 text-center">Cargando objetivos...</div>
          ) : goals.length === 0 ? (
            <div className="text-xs text-slate-500 py-6 text-center border border-dashed border-slate-800 rounded-xl">
              No hay objetivos deportivos activos. Agrega uno nuevo.
            </div>
          ) : (
            <div className="space-y-2">
              {goals.map((item) => (
                <div
                  key={item.id}
                  className={`flex items-center justify-between p-3 rounded-xl border border-slate-800/80 bg-slate-900/50 transition-all ${
                    item.is_completed ? "opacity-60 line-through" : ""
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => item.id && handleToggleGoal(item.id, item.is_completed)}
                    className="flex items-center gap-3 text-left flex-1"
                  >
                    <span
                      className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-all ${
                        item.is_completed
                          ? "bg-emerald-500/20 border-emerald-500 text-emerald-400"
                          : "border-slate-700 bg-slate-950"
                      }`}
                    >
                      {item.is_completed && <Icon name="check" size={12} />}
                    </span>
                    <div>
                      <div className="text-xs font-semibold text-white">{item.title}</div>
                      <div className="text-[10px] text-slate-400">{item.description || item.category}</div>
                    </div>
                  </button>
                  <button
                    onClick={() => item.id && handleDeleteGoal(item.id)}
                    className="p-1 text-slate-500 hover:text-rose-400"
                  >
                    <Icon name="trash" size={13} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* MODALES PESTAÑA 2 */}
      {profileModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md space-y-4 rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">Editar Perfil Marcial WT</h3>
              <button onClick={() => setProfileModal(false)} className="text-slate-400 hover:text-white">
                <Icon name="close" size={18} />
              </button>
            </div>
            <form onSubmit={handleSaveProfile} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Grado / Cinturón</label>
                <input
                  type="text"
                  value={profile.belt_grade || ""}
                  onChange={(e) => setProfile({ ...profile, belt_grade: e.target.value })}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Dan / Gup</label>
                <input
                  type="text"
                  value={profile.dan_gup || ""}
                  onChange={(e) => setProfile({ ...profile, dan_gup: e.target.value })}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Academia / Dojang</label>
                <input
                  type="text"
                  value={profile.academy_name || ""}
                  onChange={(e) => setProfile({ ...profile, academy_name: e.target.value })}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Categoría de Peso</label>
                <input
                  type="text"
                  value={profile.weight_category || ""}
                  onChange={(e) => setProfile({ ...profile, weight_category: e.target.value })}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Macrociclo Actual</label>
                <input
                  type="text"
                  value={profile.current_macrocycle || ""}
                  onChange={(e) => setProfile({ ...profile, current_macrocycle: e.target.value })}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Fecha Próximo Torneo</label>
                <input
                  type="date"
                  value={profile.next_tournament_date || ""}
                  onChange={(e) => setProfile({ ...profile, next_tournament_date: e.target.value })}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>
              <div className="flex items-center justify-end gap-2 border-t border-slate-800 pt-3">
                <button type="button" onClick={() => setProfileModal(false)} className="rounded-xl bg-slate-800 px-4 py-2 font-semibold text-slate-300">
                  Cancelar
                </button>
                <button type="submit" className="rounded-xl bg-emerald-500 px-4 py-2 font-semibold text-slate-950">
                  Guardar Perfil
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {poomsaeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md space-y-4 rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">Nuevo Poomsae</h3>
              <button onClick={() => setPoomsaeModal(false)} className="text-slate-400 hover:text-white">
                <Icon name="close" size={18} />
              </button>
            </div>
            <form onSubmit={handleSavePoomsae} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Nombre del Poomsae</label>
                <input
                  required
                  type="text"
                  placeholder="Ej: Koryo, Taegeuk 8 Jang"
                  value={poomsaeForm.poomsae_name || ""}
                  onChange={(e) => setPoomsaeForm({ ...poomsaeForm, poomsae_name: e.target.value })}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Porcentaje de Dominio ({poomsaeForm.mastery_percentage}%)</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={poomsaeForm.mastery_percentage || 0}
                  onChange={(e) => setPoomsaeForm({ ...poomsaeForm, mastery_percentage: parseInt(e.target.value) })}
                  className="w-full accent-emerald-500"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Notas de Técnica / Puntos por Pulir</label>
                <textarea
                  rows={3}
                  placeholder="Ej: Ajustar ritmo en secuencia de patadas y estabilidad en Ap Seogi..."
                  value={poomsaeForm.technique_notes || ""}
                  onChange={(e) => setPoomsaeForm({ ...poomsaeForm, technique_notes: e.target.value })}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>
              <div className="flex items-center justify-end gap-2 border-t border-slate-800 pt-3">
                <button type="button" onClick={() => setPoomsaeModal(false)} className="rounded-xl bg-slate-800 px-4 py-2 font-semibold text-slate-300">
                  Cancelar
                </button>
                <button type="submit" className="rounded-xl bg-emerald-500 px-4 py-2 font-semibold text-slate-950">
                  Guardar Poomsae
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {compModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md space-y-4 rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">Nuevo Torneo / Evento WT</h3>
              <button onClick={() => setCompModal(false)} className="text-slate-400 hover:text-white">
                <Icon name="close" size={18} />
              </button>
            </div>
            <form onSubmit={handleSaveCompetition} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Nombre del Evento</label>
                <input
                  required
                  type="text"
                  placeholder="Ej: Campeonato Nacional WT 2026"
                  value={compForm.event_name || ""}
                  onChange={(e) => setCompForm({ ...compForm, event_name: e.target.value })}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-400 mb-1">Fecha</label>
                  <input
                    type="date"
                    value={compForm.event_date || ""}
                    onChange={(e) => setCompForm({ ...compForm, event_date: e.target.value })}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Resultado / Medalla</label>
                  <select
                    value={compForm.result_medal || "PRÓXIMO"}
                    onChange={(e) => setCompForm({ ...compForm, result_medal: e.target.value })}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="PRÓXIMO">PRÓXIMO</option>
                    <option value="1° ORO">1° ORO 🥇</option>
                    <option value="2° PLATA">2° PLATA 🥈</option>
                    <option value="3° BRONCE">3° BRONCE 🥉</option>
                    <option value="PARTICIPACIÓN">PARTICIPACIÓN</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Sede / Ciudad</label>
                <input
                  type="text"
                  placeholder="Ej: Bogotá"
                  value={compForm.city_location || ""}
                  onChange={(e) => setCompForm({ ...compForm, city_location: e.target.value })}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Análisis Técnico Post-Combate</label>
                <textarea
                  rows={3}
                  placeholder="Ej: Mejorar anticipación de Bandal Chagi con pie adelantado..."
                  value={compForm.technical_review || ""}
                  onChange={(e) => setCompForm({ ...compForm, technical_review: e.target.value })}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>
              <div className="flex items-center justify-end gap-2 border-t border-slate-800 pt-3">
                <button type="button" onClick={() => setCompModal(false)} className="rounded-xl bg-slate-800 px-4 py-2 font-semibold text-slate-300">
                  Cancelar
                </button>
                <button type="submit" className="rounded-xl bg-emerald-500 px-4 py-2 font-semibold text-slate-950">
                  Guardar Torneo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {goalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md space-y-4 rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">Nuevo Objetivo Deportivo</h3>
              <button onClick={() => setGoalModal(false)} className="text-slate-400 hover:text-white">
                <Icon name="close" size={18} />
              </button>
            </div>
            <form onSubmit={handleSaveGoal} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Título del Objetivo</label>
                <input
                  required
                  type="text"
                  placeholder="Ej: Clasificar al Campeonato Nacional WT"
                  value={goalForm.title || ""}
                  onChange={(e) => setGoalForm({ ...goalForm, title: e.target.value })}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Descripción / Detalle</label>
                <input
                  type="text"
                  placeholder="Ej: Meta prioritaria · Junio 2026"
                  value={goalForm.description || ""}
                  onChange={(e) => setGoalForm({ ...goalForm, description: e.target.value })}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>
              <div className="flex items-center justify-end gap-2 border-t border-slate-800 pt-3">
                <button type="button" onClick={() => setGoalModal(false)} className="rounded-xl bg-slate-800 px-4 py-2 font-semibold text-slate-300">
                  Cancelar
                </button>
                <button type="submit" className="rounded-xl bg-emerald-500 px-4 py-2 font-semibold text-slate-950">
                  Guardar Objetivo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  )
}

// ==========================================
// PESTAÑA 3: RECOMPOSICIÓN CORPORAL & HÁBITOS
// ==========================================
function BodyView() {
  const [weightLogs, setWeightLogs] = useState<BodyWeightLog[]>([])
  const [measurements, setMeasurements] = useState<BodyMeasurementLog[]>([])
  const [habits, setHabits] = useState<Habit[]>([])
  const [dailyLogs, setDailyLogs] = useState<HabitDailyLog[]>([])
  const [selectedZone, setSelectedZone] = useState("Glúteos/Cadera")

  // Modales
  const [weightModal, setWeightModal] = useState(false)
  const [measureModal, setMeasureModal] = useState(false)
  const [habitModal, setHabitModal] = useState(false)

  // Forms
  const [weightInput, setWeightInput] = useState("")
  const [measureForm, setMeasureForm] = useState<Partial<BodyMeasurementLog>>({
    zone: "Glúteos/Cadera",
    measurement_cm: 100,
    notes: "",
  })
  const [habitForm, setHabitForm] = useState<Partial<Habit>>({
    name: "",
    type: "Suplemento",
    target_daily: "5g",
  })

  const loadBodyData = async () => {
    const weights = await fetchRecentBodyWeightLogs(10)
    setWeightLogs(weights)

    const measures = await fetchMeasurementLogsByZone()
    setMeasurements(measures)

    const activeHabits = await fetchActiveHabits()
    setHabits(activeHabits)

    const logs = await fetchDailyHabitLogs()
    setDailyLogs(logs)
  }

  useEffect(() => {
    loadBodyData()
  }, [])

  const latestWeight = weightLogs[0]?.weight_kg || 68.5
  const latestGluteMeasure =
    measurements.find((m) => m.zone === "Glúteos/Cadera")?.measurement_cm || 101.4

  const handleSaveWeight = async (e: React.FormEvent) => {
    e.preventDefault()
    const num = parseFloat(weightInput)
    if (!num) return
    await logBodyWeight(num)
    setWeightModal(false)
    setWeightInput("")
    loadBodyData()
  }

  const handleSaveMeasurement = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!measureForm.measurement_cm) return
    await logBodyMeasurement(measureForm as BodyMeasurementLog)
    setMeasureModal(false)
    loadBodyData()
  }

  const handleSaveHabit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!habitForm.name) return
    await createHabit(habitForm as Habit)
    setHabitModal(false)
    setHabitForm({ name: "", type: "Suplemento", target_daily: "5g" })
    loadBodyData()
  }

  const handleToggleHabitCheck = async (habitId?: string) => {
    if (!habitId) return
    const existingLog = dailyLogs.find((l) => l.habit_id === habitId)
    const newStatus = !existingLog?.completed
    await logDailyHabit(habitId, newStatus)
    loadBodyData()
  }

  const handleDeleteHabitItem = async (habitId: string) => {
    if (confirm("¿Eliminar este hábito/suplemento?")) {
      await deleteHabit(habitId)
      loadBodyData()
    }
  }

  // CÁLCULO DE COORDENADAS DINÁMICAS SVG (Tendencia)
  const generateSvgPoints = () => {
    // Reversar para orden cronológico
    const sortedWeights = [...weightLogs].reverse()
    const sortedMeasures = [...measurements]
      .filter((m) => m.zone === "Glúteos/Cadera")
      .reverse()

    if (sortedWeights.length === 0) {
      return {
        weightPath: "M0 150 L200 140 L400 130 L600 120 L800 110 L1000 100",
        glutePath: "M0 215 C230 185 470 145 730 105 1000 55",
        gluteDots: [
          { x: 0, y: 215 },
          { x: 230, y: 185 },
          { x: 470, y: 145 },
          { x: 730, y: 105 },
          { x: 1000, y: 55 },
        ],
      }
    }

    const stepX = 1000 / Math.max(sortedWeights.length - 1, 1)

    const weightPoints = sortedWeights.map((w, i) => {
      const x = Math.round(i * stepX)
      // Mapear min 60kg max 80kg a coordenada Y 250 -> 30
      const y = Math.round(250 - ((w.weight_kg - 60) / 20) * 220)
      return `${x} ${y}`
    })

    const glutePoints = sortedMeasures.map((m, i) => {
      const x = Math.round(i * (1000 / Math.max(sortedMeasures.length - 1, 1)))
      // Mapear min 90cm max 110cm a coordenada Y 250 -> 30
      const y = Math.round(250 - ((m.measurement_cm - 90) / 20) * 220)
      return { x, y }
    })

    return {
      weightPath: `M${weightPoints.join(" L")}`,
      glutePath: glutePoints.length > 0 ? `M${glutePoints.map((p) => `${p.x}${p.y}`).join(" L")}` : "M0 200 L1000 100",
      gluteDots: glutePoints,
    }
  }

  const svgData = generateSvgPoints()

  return (
    <main className="page">
      <section className="hero-line">
        <div>
          <div className="eyebrow">
            <span className="pulse-dot" /> RECOMPOSICIÓN CORPORAL · FASE 03
          </div>
          <h1>
            Construye fuerza. <span>Mide el cambio.</span>
          </h1>
          <p>Composición corporal orientada a rendimiento y potencia marcial.</p>
        </div>
        <div className="goal-chip">
          <Icon name="target" />
          <span>
            OBJETIVO ACTUAL<b>−57 kg · Categoría WT</b>
          </span>
        </div>
      </section>

      {/* METRICS GRID */}
      <div className="metrics-grid">
        {/* CARDI 1: PESO CORPORAL */}
        <article className="metric-card green relative group">
          <div className="flex items-center justify-between mb-2">
            <div className="metric-icon">
              <Icon name="activity" />
            </div>
            <button
              onClick={() => setWeightModal(true)}
              className="text-xs text-emerald-400 hover:underline flex items-center gap-1 font-semibold"
            >
              <Icon name="plus" size={12} /> Registrar Peso
            </button>
          </div>
          <span>PESO CORPORAL ACTUAL</span>
          <h2>
            {latestWeight} <small>kg</small>
          </h2>
          <p>Últimos 10 registros logueados en Supabase</p>
          <div className="metric-progress">
            <i style={{ width: "75%" }} />
          </div>
        </article>

        {/* CARD 2: MEDIDA MULTIZONA */}
        <article className="metric-card purple relative group">
          <div className="flex items-center justify-between mb-2">
            <div className="metric-icon">
              <Icon name="trending" />
            </div>
            <button
              onClick={() => setMeasureModal(true)}
              className="text-xs text-purple-400 hover:underline flex items-center gap-1 font-semibold"
            >
              <Icon name="plus" size={12} /> Registrar Medida
            </button>
          </div>
          <span>MEDIDA GLÚTEO / CADERA</span>
          <h2>
            {latestGluteMeasure} <small>cm</small>
          </h2>
          <p>Hipertrofia de glúteo & potencia posterior</p>
          <div className="metric-progress">
            <i style={{ width: "85%" }} />
          </div>
        </article>

        {/* CARD 3: SUPLEMENTACIÓN & HÁBITOS */}
        <article className="metric-card habits">
          <div className="flex items-center justify-between mb-2">
            <div className="metric-icon">
              <Icon name="flame" />
            </div>
            <button
              onClick={() => setHabitModal(true)}
              className="text-xs text-emerald-400 hover:underline flex items-center gap-1 font-semibold"
            >
              <Icon name="plus" size={12} /> Nuevo Hábito
            </button>
          </div>
          <span>SUPLEMENTACIÓN & HÁBITOS</span>
          <h2>
            {dailyLogs.filter((l) => l.completed).length}{" "}
            <small>/ {habits.length} completados hoy</small>
          </h2>

          <div className="space-y-1.5 mt-3">
            {habits.map((item) => {
              const isDone = dailyLogs.some((l) => l.habit_id === item.id && l.completed)
              return (
                <div key={item.id} className="flex items-center justify-between text-xs">
                  <button
                    type="button"
                    onClick={() => handleToggleHabitCheck(item.id)}
                    className="flex items-center gap-2 text-left"
                  >
                    <i className={`w-4 h-4 rounded border flex items-center justify-center ${isDone ? "bg-emerald-500 border-emerald-500 text-slate-950 font-bold" : "border-slate-700 bg-slate-950"}`}>
                      {isDone && <Icon name="check" size={10} />}
                    </i>
                    <span className={isDone ? "line-through text-slate-400" : "text-white"}>
                      {item.name} <small className="text-slate-500">({item.target_daily})</small>
                    </span>
                  </button>
                  <button
                    onClick={() => item.id && handleDeleteHabitItem(item.id)}
                    className="text-slate-600 hover:text-rose-400 p-1"
                  >
                    <Icon name="trash" size={11} />
                  </button>
                </div>
              )
            })}
          </div>
        </article>
      </div>

      {/* DYNAMIC SVG CHART CARD */}
      <section className="card chart-card mt-6">
        <div className="chart-head">
          <div>
            <span>PROGRESO CORPORAL</span>
            <h2>Tendencia de métricas reales</h2>
          </div>
          <div className="legend">
            <span>
              <i className="weight" /> Peso corporal (Verde)
            </span>
            <span>
              <i className="glute" /> Medida glúteo (Morado)
            </span>
            <div className="flex items-center gap-1">
              {["Glúteos/Cadera", "Cintura", "Muslos", "Brazos", "Pecho"].map((zone) => (
                <button
                  key={zone}
                  onClick={() => setSelectedZone(zone)}
                  className={`px-2 py-0.5 rounded text-[10px] ${
                    selectedZone === zone ? "bg-purple-500/20 text-purple-300 border border-purple-500/40" : "text-slate-500"
                  }`}
                >
                  {zone}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="chart">
          <div className="y-labels">
            <span>105 cm / kg</span>
            <span>100 cm / kg</span>
            <span>95 cm / kg</span>
            <span>90 cm / kg</span>
            <span>85 cm / kg</span>
          </div>
          <svg
            viewBox="0 0 1000 280"
            preserveAspectRatio="none"
            aria-label="Gráfico de progreso corporal"
          >
            <defs>
              <linearGradient id="glow" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#10b981" stopOpacity=".25" />
                <stop offset="1" stopColor="#10b981" stopOpacity="0" />
              </linearGradient>
            </defs>
            {[30, 90, 150, 210, 270].map((y) => (
              <line
                key={y}
                x1="0"
                x2="1000"
                y1={y}
                y2={y}
                className="grid-line"
              />
            ))}
            <path d={`${svgData.weightPath} L1000 280 L0 280Z`} fill="url(#glow)" />
            <path d={svgData.weightPath} className="weight-line" />
            <path d={svgData.glutePath} className="glute-line" />
            {svgData.gluteDots.map((dot, idx) => (
              <circle
                key={idx}
                cx={dot.x}
                cy={dot.y}
                r="5"
                className="dot-glute"
              />
            ))}
          </svg>
          <div className="x-labels">
            <span>REGISTROS RECIENTES SINC DE SUPABASE</span>
          </div>
        </div>
      </section>

      {/* MODALES PESTAÑA 3 */}
      {weightModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm space-y-4 rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">Registrar Peso Corporal</h3>
              <button onClick={() => setWeightModal(false)} className="text-slate-400 hover:text-white">
                <Icon name="close" size={18} />
              </button>
            </div>
            <form onSubmit={handleSaveWeight} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Peso Corporal (KG)</label>
                <input
                  required
                  type="number"
                  step="0.1"
                  placeholder="Ej: 68.5"
                  value={weightInput}
                  onChange={(e) => setWeightInput(e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>
              <div className="flex items-center justify-end gap-2 border-t border-slate-800 pt-3">
                <button type="button" onClick={() => setWeightModal(false)} className="rounded-xl bg-slate-800 px-4 py-2 font-semibold text-slate-300">
                  Cancelar
                </button>
                <button type="submit" className="rounded-xl bg-emerald-500 px-4 py-2 font-semibold text-slate-950">
                  Guardar Peso
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {measureModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm space-y-4 rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">Registrar Medida Corporal</h3>
              <button onClick={() => setMeasureModal(false)} className="text-slate-400 hover:text-white">
                <Icon name="close" size={18} />
              </button>
            </div>
            <form onSubmit={handleSaveMeasurement} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Zona Corporal</label>
                <select
                  value={measureForm.zone || "Glúteos/Cadera"}
                  onChange={(e) => setMeasureForm({ ...measureForm, zone: e.target.value })}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
                >
                  <option value="Glúteos/Cadera">Glúteos/Cadera</option>
                  <option value="Cintura">Cintura</option>
                  <option value="Muslos">Muslos</option>
                  <option value="Brazos">Brazos</option>
                  <option value="Pecho">Pecho</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Medida (CM)</label>
                <input
                  required
                  type="number"
                  step="0.1"
                  placeholder="Ej: 101.4"
                  value={measureForm.measurement_cm || ""}
                  onChange={(e) => setMeasureForm({ ...measureForm, measurement_cm: parseFloat(e.target.value) || 0 })}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>
              <div className="flex items-center justify-end gap-2 border-t border-slate-800 pt-3">
                <button type="button" onClick={() => setMeasureModal(false)} className="rounded-xl bg-slate-800 px-4 py-2 font-semibold text-slate-300">
                  Cancelar
                </button>
                <button type="submit" className="rounded-xl bg-emerald-500 px-4 py-2 font-semibold text-slate-950">
                  Guardar Medida
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {habitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm space-y-4 rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">Nuevo Hábito / Suplemento</h3>
              <button onClick={() => setHabitModal(false)} className="text-slate-400 hover:text-white">
                <Icon name="close" size={18} />
              </button>
            </div>
            <form onSubmit={handleSaveHabit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Nombre</label>
                <input
                  required
                  type="text"
                  placeholder="Ej: Creatina 5g"
                  value={habitForm.name || ""}
                  onChange={(e) => setHabitForm({ ...habitForm, name: e.target.value })}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Objetivo Diario / Cantidad</label>
                <input
                  type="text"
                  placeholder="Ej: 5g, 3.0L, +120g"
                  value={habitForm.target_daily || ""}
                  onChange={(e) => setHabitForm({ ...habitForm, target_daily: e.target.value })}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>
              <div className="flex items-center justify-end gap-2 border-t border-slate-800 pt-3">
                <button type="button" onClick={() => setHabitModal(false)} className="rounded-xl bg-slate-800 px-4 py-2 font-semibold text-slate-300">
                  Cancelar
                </button>
                <button type="submit" className="rounded-xl bg-emerald-500 px-4 py-2 font-semibold text-slate-950">
                  Guardar Hábito
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  )
}

function WorkoutDrawer({
  open,
  close,
  activeRoutine,
  sets,
  onSaveWorkout,
}: {
  open: boolean
  close: () => void
  activeRoutine: GymRoutine | null
  sets: { kg: string; reps: string; rpe: string }[]
  onSaveWorkout: (notes: string) => void
}) {
  const [seconds, setSeconds] = useState(90)
  const [running, setRunning] = useState(false)
  const [notes, setNotes] = useState("")

  useEffect(() => {
    if (!running || seconds <= 0) return
    const timer = window.setInterval(() => setSeconds((s) => s - 1), 1000)
    return () => window.clearInterval(timer)
  }, [running, seconds])

  return (
    <>
      <button
        type="button"
        aria-label="Cerrar panel"
        className={`backdrop ${open ? "show" : ""}`}
        onClick={close}
      />
      <aside className={`drawer ${open ? "open" : ""}`}>
        <div className="drawer-top">
          <div>
            <span>SESIÓN ACTIVA</span>
            <h2>{activeRoutine?.title || "Pliometría & Potencia"}</h2>
          </div>
          <button type="button" onClick={close}>
            <Icon name="close" size={20} />
          </button>
        </div>
        <div className="workout-status">
          <span className="pulse-dot" /> Entrenamiento en curso <b>00:24:18</b>
        </div>
        <section className="rest-block">
          <span>DESCANSO ENTRE SERIES</span>
          <div className="timer-ring">
            <svg viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="52" />
              <circle cx="60" cy="60" r="52" className="progress-ring" />
            </svg>
            <div>
              <b>
                {String(Math.floor(seconds / 60)).padStart(2, "0")}:
                {String(seconds % 60).padStart(2, "0")}
              </b>
              <span>RESTANTE</span>
            </div>
          </div>
          <div className="timer-actions">
            <button type="button" onClick={() => setSeconds(90)}>
              90s
            </button>
            <button
              type="button"
              className="timer-play"
              onClick={() => setRunning(!running)}
            >
              <Icon name={running ? "pause" : "play"} size={20} />
            </button>
            <button type="button" onClick={() => setSeconds(120)}>
              120s
            </button>
          </div>
        </section>
        <section className="current-exercise">
          <span>EJERCICIO 01 / 03</span>
          <h3>Hip Thrust con barra</h3>
          <p>{sets.length} series de trabajo · Registrado en tiempo real</p>
          <div>
            {sets.map((s, idx) => (
              <span key={idx} className={idx === 0 ? "active" : ""}>
                {String(idx + 1).padStart(2, "0")}
                <i>
                  {s.kg}kg × {s.reps}
                </i>
              </span>
            ))}
          </div>
        </section>
        <section className="notes">
          <div>
            <span>NOTAS & SENSACIONES</span>
            <small>
              <i /> Sincroniza con Obsidian
            </small>
          </div>
          <textarea
            placeholder="¿Cómo se siente el cuerpo hoy? Técnica, molestias, energía..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </section>
        <div className="drawer-footer">
          <Button
            className="save"
            onClick={() => {
              onSaveWorkout(notes)
              close()
            }}
          >
            <Icon name="check" /> Guardar entrenamiento en Supabase
          </Button>
          <p>
            <i /> Tus cambios se guardan automáticamente
          </p>
        </div>
      </aside>
    </>
  )
}

export default function GymPage() {
  const [active, setActive] = useState("gym")
  const [drawer, setDrawer] = useState(false)
  const [activeRoutine, setActiveRoutine] = useState<GymRoutine | null>(null)

  const [routines, setRoutines] = useState<GymRoutine[]>([])
  const [loading, setLoading] = useState(true)

  const [sets, setSets] = useState([
    { kg: "85", reps: "10", rpe: "8" },
    { kg: "87.5", reps: "8", rpe: "8.5" },
    { kg: "87.5", reps: "8", rpe: "9" },
  ])

  // Modal para Crear/Editar Rutina
  const [routineModalOpen, setRoutineModalOpen] = useState(false)
  const [editingRoutine, setEditingRoutine] = useState<GymRoutine | null>(null)
  const [routineFormData, setRoutineFormData] = useState<Partial<GymRoutine>>({
    day_of_week: 1,
    title: "",
    training_type: "Fuerza & Hipertrofia",
    estimated_duration_min: 60,
    target_focus: "",
    accent_color: "emerald",
  })

  const loadRoutines = async () => {
    setLoading(true)
    const data = await fetchWeeklyRoutines()
    setRoutines(data)
    setLoading(false)
  }

  useEffect(() => {
    loadRoutines()
  }, [])

  const handleOpenCreateModal = () => {
    setEditingRoutine(null)
    setRoutineFormData({
      day_of_week: 1,
      title: "",
      training_type: "Fuerza & Hipertrofia",
      estimated_duration_min: 60,
      target_focus: "",
      accent_color: "emerald",
    })
    setRoutineModalOpen(true)
  }

  const handleOpenEditModal = (routine: GymRoutine) => {
    setEditingRoutine(routine)
    setRoutineFormData(routine)
    setRoutineModalOpen(true)
  }

  const handleSaveRoutineForm = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!routineFormData.title) return

    if (editingRoutine?.id) {
      await updateGymRoutine(editingRoutine.id, routineFormData)
    } else {
      await createGymRoutine(routineFormData as GymRoutine)
    }

    setRoutineModalOpen(false)
    loadRoutines()
  }

  const handleDeleteRoutineItem = async (id: string) => {
    if (confirm("¿Estás seguro de eliminar esta rutina?")) {
      await deleteGymRoutine(id)
      loadRoutines()
    }
  }

  const handleOpenDrawerWithRoutine = (routine?: GymRoutine) => {
    if (routine) {
      setActiveRoutine(routine)
    } else if (routines.length > 0) {
      setActiveRoutine(routines[0])
    } else {
      setActiveRoutine(defaultWeek[0])
    }
    setDrawer(true)
  }

  const handleSaveActiveWorkout = async (notes: string) => {
    if (activeRoutine?.id) {
      await updateGymRoutine(activeRoutine.id, { is_completed: true })
    }

    for (let i = 0; i < sets.length; i++) {
      const s = sets[i]
      await logGymSet({
        exercise_id: "hip-thrust-default",
        routine_id: activeRoutine?.id,
        set_number: i + 1,
        weight_kg: parseFloat(s.kg) || 0,
        reps: parseInt(s.reps) || 0,
        rpe: parseFloat(s.rpe) || 8,
        notes: notes,
      } as GymSetLog)
    }

    alert("¡Entrenamiento sincronizado y guardado con éxito en Supabase!")
    loadRoutines()
  }

  return (
    <div className="app-shell">
      <Header
        active={active}
        setActive={setActive}
        openDrawer={() => handleOpenDrawerWithRoutine()}
        openRoutineModal={handleOpenCreateModal}
      />
      {active === "gym" && (
        <GymView
          openDrawer={handleOpenDrawerWithRoutine}
          routines={routines}
          loading={loading}
          onOpenCreate={handleOpenCreateModal}
          onOpenEdit={handleOpenEditModal}
          onDelete={handleDeleteRoutineItem}
          sets={sets}
          setSets={setSets}
        />
      )}
      {active === "tkd" && <TkdView />}
      {active === "body" && <BodyView />}
      <WorkoutDrawer
        open={drawer}
        close={() => setDrawer(false)}
        activeRoutine={activeRoutine}
        sets={sets}
        onSaveWorkout={handleSaveActiveWorkout}
      />

      {/* MODAL CREAR / EDITAR RUTINA */}
      {routineModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md space-y-4 rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">
                {editingRoutine ? "Editar Rutina" : "Nueva Rutina Semanal"}
              </h3>
              <button
                type="button"
                onClick={() => setRoutineModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <Icon name="close" size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveRoutineForm} className="space-y-4 text-xs">
              <div>
                <label className="mb-1 block font-medium text-slate-400">
                  Título de la Rutina
                </label>
                <input
                  required
                  type="text"
                  placeholder="Ej: Pliometría & Potencia de Cadera"
                  value={routineFormData.title || ""}
                  onChange={(e) =>
                    setRoutineFormData({ ...routineFormData, title: e.target.value })
                  }
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block font-medium text-slate-400">
                    Día de la Semana
                  </label>
                  <select
                    value={routineFormData.day_of_week || 1}
                    onChange={(e) =>
                      setRoutineFormData({
                        ...routineFormData,
                        day_of_week: parseInt(e.target.value),
                      })
                    }
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
                  >
                    {DAYS.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.day}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1 block font-medium text-slate-400">
                    Tipo
                  </label>
                  <select
                    value={routineFormData.training_type || "Fuerza & Hipertrofia"}
                    onChange={(e) =>
                      setRoutineFormData({
                        ...routineFormData,
                        training_type: e.target.value,
                      })
                    }
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
                  >
                    {filters
                      .filter(([f]) => f !== "Todos")
                      .map(([f]) => (
                        <option key={f} value={f}>
                          {f}
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block font-medium text-slate-400">
                    Duración (min)
                  </label>
                  <input
                    type="number"
                    value={routineFormData.estimated_duration_min || 60}
                    onChange={(e) =>
                      setRoutineFormData({
                        ...routineFormData,
                        estimated_duration_min: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="mb-1 block font-medium text-slate-400">
                    Enfoque Muscular
                  </label>
                  <input
                    type="text"
                    placeholder="Ej: Glúteos · Femoral"
                    value={routineFormData.target_focus || ""}
                    onChange={(e) =>
                      setRoutineFormData({
                        ...routineFormData,
                        target_focus: e.target.value,
                      })
                    }
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 border-t border-slate-800 pt-3">
                <button
                  type="button"
                  onClick={() => setRoutineModalOpen(false)}
                  className="rounded-xl bg-slate-800 px-4 py-2 font-semibold text-slate-300 hover:bg-slate-700"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-emerald-500 px-4 py-2 font-semibold text-slate-950 hover:bg-emerald-400"
                >
                  {editingRoutine ? "Guardar Cambios" : "Crear Rutina"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}