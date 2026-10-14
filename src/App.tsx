import { useState } from "react"
import Sidebar from "./components/Sidebar"
import TasksPage from "./pages/TasksPage"
import GymPage from "./pages/GymPage"

export default function App() {
  const [currentPage, setCurrentPage] = useState<"tasks" | "gym">("gym")

  return (
    <div className="flex min-h-screen bg-[#090d16] text-slate-100 font-sans">
      {/* Menú Lateral Global */}
      <Sidebar 
        currentPage={currentPage} 
        onSelectPage={(page) => setCurrentPage(page as "tasks" | "gym")} 
      />

      {/* Área de Contenido Principal */}
      <div className="flex-1 min-w-0 overflow-x-hidden">
        {currentPage === "tasks" && <TasksPage />}
        {currentPage === "gym" && <GymPage />}
      </div>
    </div>
  )
}