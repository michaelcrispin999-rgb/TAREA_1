import { useState, useEffect } from "react";
import "./App.css";
import BarraLateral from "./components/BarraLateral";
import VistaUsuarios from "./components/VistaUsuarios";
import VistaProyectos from "./components/VistaProyectos";
import VistaTareas from "./components/VistaTareas";
import VistaHistorico from "./components/VistaHistorico";
import VistaEnConstruccion from "./components/VistaEnConstruccion";
import api from "./services/api";

export default function App() {
  const [vista, setVista] = useState("Usuarios");
  const [usuarios, setUsuarios] = useState([]);
  const [proyectos, setProyectos] = useState([]);
  const [tareas, setTareas] = useState([]);
  const [usuarioModal, setUsuarioModal] = useState({
    open: false,
    modo: "crear",
    data: { nombre: "", email: "", activo: true },
    id: null,
  });
  const [proyectoModal, setProyectoModal] = useState({
    open: false,
    modo: "crear",
    data: { nombre: "", descripcion: "" },
    id: null,
  });
  const [tareaModal, setTareaModal] = useState({
    open: false,
    modo: "crear",
    data: {
      descripcion: "",
      idProyecto: "",
      idUsuarioAsignado: "",
      estado: "por_asignar",
    },
    id: null,
  });

  const cargarUsuarios = async () => {
    try {
      const { data } = await api.get("/usuarios");
      setUsuarios(data);
    } catch (error) {
      console.error("Error al cargar usuarios:", error);
    }
  };

  const cargarProyectos = async () => {
    try {
      const { data } = await api.get("/proyectos");
      setProyectos(data);
    } catch (error) {
      console.error("Error al cargar proyectos:", error);
    }
  };

  const cargarTareas = async () => {
    try {
      const { data } = await api.get("/tareas");
      setTareas(data);
    } catch (error) {
      console.error("Error al cargar tareas:", error);
    }
  };

  useEffect(() => {
    cargarUsuarios();
    cargarProyectos();
    cargarTareas();
  }, []);

  const agregarUsuario = async () => {
    const nombre = prompt("Ingrese el nombre");
    if (!nombre) return;

    const email = prompt("Ingrese el correo");
    if (!email) return;

    try {
      await api.post("/usuarios", { nombre, email });
      cargarUsuarios();
    } catch (error) {
      console.error("Error al agregar usuario:", error);
      alert("Error al agregar usuario");
    }
  };

  const eliminarUsuario = async (id) => {
    const confirmar = window.confirm(
      "¿Seguro que quieres eliminar este usuario?"
    );

    if (!confirmar) return;

    try {
      await api.delete(`/usuarios/${id}`);
      cargarUsuarios();
    } catch (error) {
      console.error("Error al eliminar usuario:", error);
      alert(
        error.response?.data?.message ||
          "No se puede eliminar el usuario porque tiene relaciones"
      );
    }
  };

  const editarUsuario = async (usuario) => {
    const nombre = prompt("Nuevo nombre:", usuario.nombre);
    if (!nombre) return;

    const email = prompt("Nuevo correo:", usuario.email);
    if (!email) return;

    try {
      await api.patch(`/usuarios/${usuario.id}`, { nombre, email });
      cargarUsuarios();
    } catch (error) {
      console.error("Error al editar usuario:", error);
      alert("Error al editar usuario");
    }
  };

  const agregarProyecto = async () => {
    const nombre = prompt("Ingrese el nombre del proyecto");
    if (!nombre) return;

    const descripcion = prompt("Ingrese la descripción");
    if (!descripcion) return;

    try {
      await api.post("/proyectos", { nombre, descripcion });
      cargarProyectos();
    } catch (error) {
      console.error("Error al agregar proyecto:", error);
      alert("Error al agregar proyecto");
    }
  };

  const editarProyecto = async (proyecto) => {
    const nombre = prompt("Nuevo nombre:", proyecto.nombre);
    if (!nombre) return;

    const descripcion = prompt("Nueva descripción:", proyecto.descripcion);
    if (!descripcion) return;

    try {
      await api.patch(`/proyectos/${proyecto.id}`, { nombre, descripcion });
      cargarProyectos();
    } catch (error) {
      console.error("Error al editar proyecto:", error);
      alert("Error al editar proyecto");
    }
  };

  const eliminarProyecto = async (id) => {
    const confirmar = window.confirm(
      "¿Seguro que quieres eliminar este proyecto?"
    );

    if (!confirmar) return;

    try {
      await api.delete(`/proyectos/${id}`);
      cargarProyectos();
    } catch (error) {
      console.error("Error al eliminar proyecto:", error);
      alert("Error al eliminar proyecto");
    }
  };

  const agregarTarea = async (tarea) => {
    try {
      const payload = {
        descripcion: tarea.descripcion,
        idProyecto: Number(tarea.idProyecto),
        estado: tarea.estado,
      };

      if (tarea.idUsuarioAsigna !== "") {
        payload.idUsuarioAsigna = Number(tarea.idUsuarioAsigna);
      }

      if (tarea.idUsuarioAsignado !== "") {
        payload.idUsuarioAsignado = Number(tarea.idUsuarioAsignado);
      }

      console.log("Crear tarea payload", payload);
      await api.post("/tareas", payload);
      cargarTareas();
    } catch (error) {
      console.error("Error al crear tarea:", error);
      console.error(error.response?.data);
      alert(
        error.response?.data?.message ||
          JSON.stringify(error.response?.data) ||
          "Error al crear tarea"
      );
    }
  };

  const editarTarea = async (id, tarea) => {
    try {
      const payload = {
        descripcion: tarea.descripcion,
        estado: tarea.estado,
      };

      const idUsuarioAsignado = Number(tarea.idUsuarioAsignado);
      if (!Number.isNaN(idUsuarioAsignado) && tarea.idUsuarioAsignado !== "") {
        payload.idUsuarioAsignado = idUsuarioAsignado;
      }

      console.log("Editar tarea payload", id, payload);
      await api.patch(`/tareas/${id}`, payload);
      cargarTareas();
    } catch (error) {
      console.error("Error al editar tarea:", error);
      console.error(error.response?.data);
      alert(
        error.response?.data?.message ||
          JSON.stringify(error.response?.data) ||
          "Error al editar tarea"
      );
    }
  };

  const eliminarTarea = async (id) => {
    const confirmar = window.confirm(
      "¿Seguro que quieres eliminar esta tarea?"
    );
    if (!confirmar) return;

    try {
      await api.delete(`/tareas/${id}`);
      cargarTareas();
    } catch (error) {
      console.error("Error al eliminar tarea:", error);
      alert("Error al eliminar tarea");
    }
  };

  return (
    <div className="layout">
      <BarraLateral vista={vista} setVista={setVista} />

      <main className="content">
        {vista === "Usuarios" ? (
          <VistaUsuarios
            usuarios={usuarios}
            agregarUsuario={agregarUsuario}
            editarUsuario={editarUsuario}
            eliminarUsuario={eliminarUsuario}
          />
        ) : vista === "Proyectos" ? (
          <VistaProyectos
            proyectos={proyectos}
            agregarProyecto={agregarProyecto}
            editarProyecto={editarProyecto}
            eliminarProyecto={eliminarProyecto}
          />
        ) : vista === "Tareas" ? (
          <VistaTareas
            tareas={tareas}
            proyectos={proyectos}
            usuarios={usuarios}
            agregarTarea={agregarTarea}
            editarTarea={editarTarea}
            eliminarTarea={eliminarTarea}
          />
        ) : vista === "Histórico" ? (
          <VistaHistorico proyectos={proyectos} />
        ) : (
          <VistaEnConstruccion vista={vista} />
        )}
      </main>
    </div>
  );
}
