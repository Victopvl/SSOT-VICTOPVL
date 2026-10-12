import { supabase } from './supabase'

export async function fetchInitialData() {
  const { data: domains } = await supabase.from('domains').select('*').order('position')
  const { data: tasks } = await supabase.from('tasks').select('*').order('created_at', { ascending: true })
  const { data: types } = await supabase.from('task_types').select('name')

  return {
    domains: domains || [],
    tasks: tasks || [],
    taskTypes: types?.map((t) => t.name) || [],
  }
}

export async function toggleTaskInDb(taskId: number, completed: boolean) {
  await supabase.from('tasks').update({ completed }).eq('id', taskId)
}

export async function deleteTaskFromDb(taskId: number) {
  await supabase.from('tasks').delete().eq('id', taskId)
}

export async function createTaskInDb(taskData: any) {
  const { data, error } = await supabase.from('tasks').insert([taskData]).select()
  if (error) console.error('Error al crear tarea:', error)
  return data?.[0]
}

export async function createTypeInDb(typeName: string) {
  await supabase.from('task_types').insert([{ name: typeName }])
}