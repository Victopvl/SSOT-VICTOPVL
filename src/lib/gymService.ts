import { supabase } from './supabase'

// ==========================================
// TYPES & INTERFACES
// ==========================================

export interface GymRoutine {
  id?: string
  domain_id?: string
  title: string
  training_type: string
  day_of_week: number
  week_start_date?: string
  estimated_duration_min?: number
  target_focus?: string
  accent_color?: string
  is_completed?: boolean
  created_at?: string
  gym_exercises?: GymExercise[]
}

export interface GymExercise {
  id?: string
  routine_id?: string
  name: string
  category: string
  target_sets?: number
  target_reps?: string
  rest_seconds?: number
  position?: number
}

export interface GymSetLog {
  id?: string
  exercise_id: string
  routine_id?: string
  log_date?: string
  set_number: number
  weight_kg: number
  reps: number
  rpe?: number
  notes?: string
}

export interface TkdProfile {
  id?: string
  domain_id?: string
  belt_grade: string
  dan_gup?: string
  academy_name?: string
  weight_category?: string
  current_macrocycle?: string
  next_tournament_date?: string
  updated_at?: string
}

export interface TkdPoomsae {
  id?: string
  poomsae_name: string
  category?: string
  mastery_percentage: number
  technique_notes?: string
}

export interface TkdCompetition {
  id?: string
  event_name: string
  event_date: string
  competition_type?: string
  city_location?: string
  result_medal?: string
  technical_review?: string
}

export interface TkdGoal {
  id?: string
  title: string
  description?: string
  target_date?: string
  category?: string
  is_completed?: boolean
}

export interface BodyWeightLog {
  id?: string
  log_date?: string
  weight_kg: number
  notes?: string
}

export interface BodyMeasurementLog {
  id?: string
  log_date?: string
  zone: string
  measurement_cm: number
  notes?: string
}

export interface Habit {
  id?: string
  name: string
  type?: string
  target_daily?: string
  is_active?: boolean
}

export interface HabitDailyLog {
  id?: string
  habit_id: string
  log_date?: string
  completed: boolean
  numeric_value?: number
}

// ==========================================
// 1. GYM & PROGRAMACIÓN SEMANAL (CRUD)
// ==========================================

export async function fetchWeeklyRoutines(weekStartDate?: string) {
  let query = supabase
    .from('gym_routines')
    .select('*, gym_exercises(*)')
    .order('day_of_week', { ascending: true })

  if (weekStartDate) {
    query = query.eq('week_start_date', weekStartDate)
  }

  const { data, error } = await query
  if (error) console.error('Error al obtener rutinas:', error)
  return data || []
}

export async function createGymRoutine(routine: GymRoutine) {
  const { data, error } = await supabase
    .from('gym_routines')
    .insert([routine])
    .select()
  if (error) console.error('Error al crear rutina:', error)
  return data?.[0]
}

export async function updateGymRoutine(id: string, updates: Partial<GymRoutine>) {
  const { data, error } = await supabase
    .from('gym_routines')
    .update(updates)
    .eq('id', id)
    .select()
  if (error) console.error('Error al actualizar rutina:', error)
  return data?.[0]
}

export async function deleteGymRoutine(id: string) {
  const { error } = await supabase.from('gym_routines').delete().eq('id', id)
  if (error) console.error('Error al eliminar rutina:', error)
  return !error
}

// ==========================================
// 2. EJERCICIOS Y REGISTRO DE SOBRECARGA (CRUD)
// ==========================================

export async function fetchExercisesByRoutine(routineId: string) {
  const { data, error } = await supabase
    .from('gym_exercises')
    .select('*')
    .eq('routine_id', routineId)
    .order('position', { ascending: true })
  if (error) console.error('Error al obtener ejercicios:', error)
  return data || []
}

export async function createGymExercise(exercise: GymExercise) {
  const { data, error } = await supabase
    .from('gym_exercises')
    .insert([exercise])
    .select()
  if (error) console.error('Error al crear ejercicio:', error)
  return data?.[0]
}

export async function deleteGymExercise(id: string) {
  const { error } = await supabase.from('gym_exercises').delete().eq('id', id)
  if (error) console.error('Error al eliminar ejercicio:', error)
  return !error
}

export async function logGymSet(setLog: GymSetLog) {
  const { data, error } = await supabase
    .from('gym_sets')
    .insert([setLog])
    .select()
  if (error) console.error('Error al registrar serie:', error)
  return data?.[0]
}

export async function fetchPreviousSetLogs(exerciseId: string) {
  const { data, error } = await supabase
    .from('gym_sets')
    .select('*')
    .eq('exercise_id', exerciseId)
    .order('log_date', { ascending: false })
    .order('set_number', { ascending: true })
    .limit(10)
  if (error) console.error('Error al obtener marcas anteriores:', error)
  return data || []
}

// ==========================================
// 3. TAEKWONDO WT: PERFIL MARCIAL
// ==========================================

export async function fetchTkdProfile() {
  const { data, error } = await supabase
    .from('tkd_profile')
    .select('*')
    .limit(1)
    .maybeSingle()
  if (error) console.error('Error al obtener perfil TKD:', error)
  return data
}

export async function upsertTkdProfile(profile: Partial<TkdProfile>) {
  const { data, error } = await supabase
    .from('tkd_profile')
    .upsert([{ id: profile.id, ...profile, updated_at: new Date().toISOString() }])
    .select()
  if (error) console.error('Error al actualizar perfil TKD:', error)
  return data?.[0]
}

// ==========================================
// 4. TAEKWONDO WT: REPERTORIO DE POOMSAES (CRUD)
// ==========================================

export async function fetchTkdPoomsaes() {
  const { data, error } = await supabase
    .from('tkd_poomsaes')
    .select('*')
    .order('mastery_percentage', { ascending: false })
  if (error) console.error('Error al obtener poomsaes:', error)
  return data || []
}

export async function createTkdPoomsae(poomsae: TkdPoomsae) {
  const { data, error } = await supabase
    .from('tkd_poomsaes')
    .insert([poomsae])
    .select()
  if (error) console.error('Error al crear poomsae:', error)
  return data?.[0]
}

export async function updateTkdPoomsae(id: string, updates: Partial<TkdPoomsae>) {
  const { data, error } = await supabase
    .from('tkd_poomsaes')
    .update(updates)
    .eq('id', id)
    .select()
  if (error) console.error('Error al actualizar poomsae:', error)
  return data?.[0]
}

export async function deleteTkdPoomsae(id: string) {
  const { error } = await supabase.from('tkd_poomsaes').delete().eq('id', id)
  if (error) console.error('Error al eliminar poomsae:', error)
  return !error
}

// ==========================================
// 5. TAEKWONDO WT: TORNEOS & COMPETENCIAS (CRUD)
// ==========================================

export async function fetchTkdCompetitions() {
  const { data, error } = await supabase
    .from('tkd_competitions')
    .select('*')
    .order('event_date', { ascending: false })
  if (error) console.error('Error al obtener torneos:', error)
  return data || []
}

export async function createTkdCompetition(competition: TkdCompetition) {
  const { data, error } = await supabase
    .from('tkd_competitions')
    .insert([competition])
    .select()
  if (error) console.error('Error al crear torneo:', error)
  return data?.[0]
}

export async function updateTkdCompetition(id: string, updates: Partial<TkdCompetition>) {
  const { data, error } = await supabase
    .from('tkd_competitions')
    .update(updates)
    .eq('id', id)
    .select()
  if (error) console.error('Error al actualizar torneo:', error)
  return data?.[0]
}

export async function deleteTkdCompetition(id: string) {
  const { error } = await supabase.from('tkd_competitions').delete().eq('id', id)
  if (error) console.error('Error al eliminar torneo:', error)
  return !error
}

// ==========================================
// 6. TAEKWONDO WT: OBJETIVOS DEPORTIVOS (CRUD)
// ==========================================

export async function fetchTkdGoals() {
  const { data, error } = await supabase
    .from('tkd_goals')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) console.error('Error al obtener objetivos TKD:', error)
  return data || []
}

export async function createTkdGoal(goal: TkdGoal) {
  const { data, error } = await supabase
    .from('tkd_goals')
    .insert([goal])
    .select()
  if (error) console.error('Error al crear objetivo TKD:', error)
  return data?.[0]
}

export async function toggleTkdGoal(id: string, isCompleted: boolean) {
  const { data, error } = await supabase
    .from('tkd_goals')
    .update({ is_completed: isCompleted })
    .eq('id', id)
    .select()
  if (error) console.error('Error al cambiar estado de objetivo:', error)
  return data?.[0]
}

export async function deleteTkdGoal(id: string) {
  const { error } = await supabase.from('tkd_goals').delete().eq('id', id)
  if (error) console.error('Error al eliminar objetivo:', error)
  return !error
}

// ==========================================
// 7. RECOMPOSICIÓN CORPORAL & MEDIDAS (CRUD & CHART DATA)
// ==========================================

export async function logBodyWeight(weightKg: number, date?: string, notes?: string) {
  const logDate = date || new Date().toISOString().split('T')[0]
  const { data, error } = await supabase
    .from('body_weight_logs')
    .upsert([{ log_date: logDate, weight_kg: weightKg, notes }], { onConflict: 'log_date' })
    .select()
  if (error) console.error('Error al registrar peso:', error)
  return data?.[0]
}

export async function fetchRecentBodyWeightLogs(limit = 10) {
  const { data, error } = await supabase
    .from('body_weight_logs')
    .select('*')
    .order('log_date', { ascending: false })
    .limit(limit)
  if (error) console.error('Error al obtener registros de peso:', error)
  return data || []
}

export async function logBodyMeasurement(measurement: BodyMeasurementLog) {
  const { data, error } = await supabase
    .from('body_measurement_logs')
    .insert([measurement])
    .select()
  if (error) console.error('Error al registrar medida corporal:', error)
  return data?.[0]
}

export async function fetchMeasurementLogsByZone(zone?: string) {
  let query = supabase
    .from('body_measurement_logs')
    .select('*')
    .order('log_date', { ascending: false })

  if (zone) {
    query = query.eq('zone', zone)
  }

  const { data, error } = await query
  if (error) console.error('Error al obtener medidas corporales:', error)
  return data || []
}

// ==========================================
// 8. HÁBITOS & SUPLEMENTACIÓN DIARIA (CRUD)
// ==========================================

export async function fetchActiveHabits() {
  const { data, error } = await supabase
    .from('habits')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: true })
  if (error) console.error('Error al obtener hábitos:', error)
  return data || []
}

export async function createHabit(habit: Habit) {
  const { data, error } = await supabase
    .from('habits')
    .insert([habit])
    .select()
  if (error) console.error('Error al crear hábito:', error)
  return data?.[0]
}

export async function deleteHabit(id: string) {
  const { error } = await supabase.from('habits').delete().eq('id', id)
  if (error) console.error('Error al eliminar hábito:', error)
  return !error
}

export async function logDailyHabit(habitId: string, completed: boolean, date?: string, numericValue?: number) {
  const logDate = date || new Date().toISOString().split('T')[0]
  const { data, error } = await supabase
    .from('habit_daily_logs')
    .upsert([{ habit_id: habitId, log_date: logDate, completed, numeric_value: numericValue }], { onConflict: 'habit_id,log_date' })
    .select()
  if (error) console.error('Error al registrar check-in de hábito:', error)
  return data?.[0]
}

export async function fetchDailyHabitLogs(date?: string) {
  const logDate = date || new Date().toISOString().split('T')[0]
  const { data, error } = await supabase
    .from('habit_daily_logs')
    .select('*, habits(*)')
    .eq('log_date', logDate)
  if (error) console.error('Error al obtener check-ins del día:', error)
  return data || []
}