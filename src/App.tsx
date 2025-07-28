import { Outlet } from "react-router-dom"
import Sidebar from "./components/sidebar"


function App() {
  return (
    <div className="w-screen max-w-screen flex h-screen overflow-hidden">
      {/* Sidebar fixa à esquerda */}
      <Sidebar />

      <div className="flex flex-col w-full ml-[270px]">
    
        <div className="p-4  overflow-auto h-full border border-white">
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default App
