import { useState } from "react";
import "./App.css";
import BarraLateral from "./components/layout/BarraLateral";
import VistaUsuarios from "./modules/usuarios/VistaUsuarios";
import VistaProyectos from "./modules/proyectos/VistaProyectos";
import VistaTareas from "./modules/tareas/VistaTareas";
import VistaHistorico from "./modules/historico/VistaHistorico";
import VistaEnConstruccion from "./components/VistaEnConstruccion";

export default function App() {
  const [vista, setVista] = useState("Usuarios");

  return (
    <div className="layout">
      <BarraLateral vista={vista} setVista={setVista} />

      <main className="content">
        {vista === "Usuarios" ? (
          <VistaUsuarios />
        ) : vista === "Proyectos" ? (
          <VistaProyectos />
        ) : vista === "Tareas" ? (
          <VistaTareas />
        ) : vista === "Histórico" ? (
          <VistaHistorico />
        ) : (
          <VistaEnConstruccion vista={vista} />
        )}
      </main>
    </div>
  );
}
