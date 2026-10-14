import { useEffect, useState, type ReactNode } from "react"
import {
  fetchWeeklyRoutines,
  createGymRoutine,
  updateGymRoutine,
  deleteGymRoutine,
  logGymSet,
  type GymRoutine,
  type GymSetLog,
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

const poomsaes = [
  { name: "Koryo", value: 85, note: "Posiciones y ritmo por pulir" },
  { name: "Taegeuk 8 Jang", value: 94, note: "Dominio competitivo" },
  { name: "Keumgang", value: 68, note: "Reforzar equilibrio" },
  { name: "Taegeuk 7 Jang", value: 97, note: "Técnica consolidada" },
]

function TkdView() {
  const [goals, setGoals] = useState([false, true, false])
  return (
    <main className="page">
      <section className="martial-banner">
        <div className="belt-symbol">
          <span />
          <span />
        </div>
        <div>
          <span className="red-eyebrow">PERFIL MARCIAL · WORLD TAEKWONDO</span>
          <h1>
            Cinturón Rojo <small>2° Gup / 1er Dan</small>
          </h1>
          <p>Academia Central Taekwondo WT</p>
        </div>
        <div className="profile-data">
          <span>
            CATEGORÍA<b>−57 kg Kyorugi</b>
          </span>
          <span>
            MACROCICLO ACTUAL
            <b>
              <Icon name="flame" /> Preparación Pre-Competitiva
            </b>
          </span>
          <span>
            PRÓXIMO EVENTO<b>En 32 días</b>
          </span>
        </div>
      </section>
      <div className="tkd-grid">
        <section className="card poomsae-card">
          <SectionTitle
            eyebrow="DOMINIO TÉCNICO"
            title="Repertorio de Poomsaes"
            detail="Ver repertorio completo"
          />
          <div className="poomsae-list">
            {poomsaes.map((item) => (
              <div className="poomsae-row" key={item.name}>
                <div className="rank">品</div>
                <div>
                  <h3>
                    {item.name}
                    <span>Poomsae Tradicional</span>
                  </h3>
                  <p>{item.note}</p>
                  <div className="progress">
                    <i style={{ width: `${item.value}%` }} />
                  </div>
                </div>
                <b>{item.value}%</b>
              </div>
            ))}
          </div>
        </section>
        <section className="card competitions">
          <SectionTitle
            eyebrow="CALENDARIO WT"
            title="Torneos & Participaciones"
          />
          <div className="timeline">
            <div className="event upcoming">
              <i />
              <span>24 JUN · 2026</span>
              <h3>Campeonato Nacional WT 2026</h3>
              <p>Combate Kyorugi · Bogotá</p>
              <b>PRÓXIMO</b>
            </div>
            <div className="event">
              <i />
              <span>18 MAR · 2026</span>
              <h3>Open Regional Capital</h3>
              <p>Combate Kyorugi · −57 kg</p>
              <b className="silver">2° PLATA</b>
              <blockquote>
                Análisis: mejorar anticipación de Bandal Chagi con pie
                adelantado.
              </blockquote>
            </div>
            <div className="event">
              <i />
              <span>09 NOV · 2025</span>
              <h3>Copa Distrital WT</h3>
              <p>Kyorugi individual</p>
              <b className="gold">1° ORO</b>
            </div>
          </div>
        </section>
        <section className="card goals">
          <SectionTitle
            eyebrow="ROAD TO BLACK BELT"
            title="Objetivos deportivos"
          />
          {[
            "Clasificar al Campeonato Nacional WT",
            "Completar Taegeuk 8 con precisión >90%",
            "Perfeccionar Nerio Chagi a la cabeza",
          ].map((goal, i) => (
            <button
              type="button"
              key={goal}
              onClick={() => setGoals(goals.map((g, n) => (n === i ? !g : g)))}
              className={goals[i] ? "checked" : ""}
            >
              <i>{goals[i] && <Icon name="check" size={13} />}</i>
              <span>
                {goal}
                <small>
                  {i === 0
                    ? "Meta prioritaria · Junio 2026"
                    : "Desarrollo técnico"}
                </small>
              </span>
              <Icon name="arrow" />
            </button>
          ))}
          <Button variant="secondary">
            <Icon name="plus" /> Nuevo objetivo
          </Button>
        </section>
      </div>
    </main>
  )
}

function MetricCard({
  icon,
  label,
  value,
  suffix,
  detail,
  accent,
}: {
  icon: IconName
  label: string
  value: string
  suffix: string
  detail: string
  accent: string
}) {
  return (
    <article className={`metric-card ${accent}`}>
      <div className="metric-icon">
        <Icon name={icon} />
      </div>
      <span>{label}</span>
      <h2>
        {value}
        <small>{suffix}</small>
      </h2>
      <p>{detail}</p>
      <div className="metric-progress">
        <i />
      </div>
    </article>
  )
}

function BodyView() {
  const [habits, setHabits] = useState([true, true, false])
  return (
    <main className="page">
      <section className="hero-line">
        <div>
          <div className="eyebrow">
            <span className="pulse-dot" /> RECOMPOSICIÓN · FASE 03
          </div>
          <h1>
            Construye fuerza. <span>Mide el cambio.</span>
          </h1>
          <p>Composición corporal orientada a rendimiento y potencia.</p>
        </div>
        <div className="goal-chip">
          <Icon name="target" />
          <span>
            OBJETIVO ACTUAL<b>−57 kg · Septiembre</b>
          </span>
        </div>
      </section>
      <div className="metrics-grid">
        <MetricCard
          icon="activity"
          label="PESO CORPORAL ACTUAL"
          value="68.5"
          suffix="kg"
          detail="−1.2 kg este mes · Meta 62 kg"
          accent="green"
        />
        <MetricCard
          icon="trending"
          label="MEDIDA GLÚTEO / CADERA"
          value="101.4"
          suffix="cm"
          detail="+2.8 cm desde línea base"
          accent="purple"
        />
        <article className="metric-card habits">
          <div className="metric-icon">
            <Icon name="flame" />
          </div>
          <span>SUPLEMENTACIÓN & HÁBITOS</span>
          <h2>
            2 <small>/ 3 completados</small>
          </h2>
          {[
            "Creatina 5g",
            "Proteína (+120g)",
            "Agua intra-entreno (2.5L / 3L)",
          ].map((item, i) => (
            <button
              type="button"
              key={item}
              onClick={() =>
                setHabits(habits.map((h, n) => (n === i ? !h : h)))
              }
            >
              <i className={habits[i] ? "active" : ""}>
                {habits[i] && <Icon name="check" size={11} />}
              </i>
              {item}
            </button>
          ))}
        </article>
      </div>
      <section className="card chart-card">
        <div className="chart-head">
          <div>
            <span>PROGRESO CORPORAL</span>
            <h2>Tendencia de métricas</h2>
          </div>
          <div className="legend">
            <span>
              <i className="weight" /> Peso corporal
            </span>
            <span>
              <i className="glute" /> Medida glúteo
            </span>
            <button type="button">
              Últimos 6 meses <Icon name="chevron" />
            </button>
          </div>
        </div>
        <div className="chart">
          <div className="y-labels">
            <span>105</span>
            <span>100</span>
            <span>95</span>
            <span>90</span>
            <span>85</span>
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
            <path
              d="M0 70 C120 78 140 92 230 105 S380 130 470 150 S650 165 730 190 S880 205 1000 230 L1000 280 L0 280Z"
              fill="url(#glow)"
            />
            <path
              d="M0 70 C120 78 140 92 230 105 S380 130 470 150 S650 165 730 190 S880 205 1000 230"
              className="weight-line"
            />
            <path
              d="M0 215 C100 205 150 205 230 185 S390 175 470 145 S630 130 730 105 S900 85 1000 55"
              className="glute-line"
            />
            {[0, 230, 470, 730, 1000].map((x, i) => (
              <circle
                key={x}
                cx={x}
                cy={[215, 185, 145, 105, 55][i]}
                r="5"
                className="dot-glute"
              />
            ))}
          </svg>
          <div className="x-labels">
            <span>DIC</span>
            <span>ENE</span>
            <span>FEB</span>
            <span>MAR</span>
            <span>ABR</span>
            <span>MAY</span>
          </div>
        </div>
      </section>
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