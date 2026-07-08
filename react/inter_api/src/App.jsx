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

  const abrirModalCrearUsuario = () => {
    setUsuarioModal({
      open: true,
      modo: "crear",
      data: { nombre: "", email: "", activo: true },
      id: null,
    });
  };

  const abrirModalEditarUsuario = (usuario) => {
    setUsuarioModal({
      open: true,
      modo: "editar",
      data: {
        nombre: usuario.nombre || "",
        email: usuario.email || "",
        activo: usuario.activo ?? true,
      },
      id: usuario.id,
    });
  };

  const cerrarModalUsuario = () => {
    setUsuarioModal((prev) => ({ ...prev, open: false }));
  };

  const handleUsuarioChange = (field, value) => {
    setUsuarioModal((prev) => ({
      ...prev,
      data: {
        ...prev.data,
        [field]: value,
      },
    }));
  };

  const submitUsuario = async (event) => {
    event.preventDefault();

    const { nombre, email, activo } = usuarioModal.data;
    if (!nombre.trim()) {
      alert("Ingrese el nombre del usuario.");
      return;
    }

    if (!email.trim()) {
      alert("Ingrese el correo electrónico del usuario.");
      return;
    }

    try {
      if (usuarioModal.modo === "crear") {
        await api.post("/usuarios", { nombre, email, activo });
      } else {
        await api.patch(`/usuarios/${usuarioModal.id}`, {
          nombre,
          email,
          activo,
        });
      }

      cargarUsuarios();
      cerrarModalUsuario();
    } catch (error) {
      console.error("Error al guardar usuario:", error);
      alert("Error al guardar usuario");
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

  const abrirModalCrearProyecto = () => {
    setProyectoModal({
      open: true,
      modo: "crear",
      data: { nombre: "", descripcion: "" },
      id: null,
    });
  };

  const abrirModalEditarProyecto = (proyecto) => {
    setProyectoModal({
      open: true,
      modo: "editar",
      data: {
        nombre: proyecto.nombre || "",
        descripcion: proyecto.descripcion || "",
      },
      id: proyecto.id,
    });
  };

  const cerrarModalProyecto = () => {
    setProyectoModal((prev) => ({ ...prev, open: false }));
  };

  const handleProyectoChange = (field, value) => {
    setProyectoModal((prev) => ({
      ...prev,
      data: {
        ...prev.data,
        [field]: value,
      },
    }));
  };

  const submitProyecto = async (event) => {
    event.preventDefault();

    const { nombre, descripcion } = proyectoModal.data;
    if (!nombre.trim()) {
      alert("Ingrese el nombre del proyecto.");
      return;
    }

    if (!descripcion.trim()) {
      alert("Ingrese la descripción del proyecto.");
      return;
    }

    try {
      if (proyectoModal.modo === "crear") {
        await api.post("/proyectos", { nombre, descripcion });
      } else {
        await api.patch(`/proyectos/${proyectoModal.id}`, {
          nombre,
          descripcion,
        });
      }

      cargarProyectos();
      cerrarModalProyecto();
    } catch (error) {
      console.error("Error al guardar proyecto:", error);
      alert("Error al guardar proyecto");
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
            abrirModalCrearUsuario={abrirModalCrearUsuario}
            abrirModalEditarUsuario={abrirModalEditarUsuario}
            eliminarUsuario={eliminarUsuario}
          />
        ) : vista === "Proyectos" ? (
          <VistaProyectos
            proyectos={proyectos}
            abrirModalCrearProyecto={abrirModalCrearProyecto}
            abrirModalEditarProyecto={abrirModalEditarProyecto}
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

      {usuarioModal.open && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>
                {usuarioModal.modo === "crear"
                  ? "Crear nuevo usuario"
                  : "Editar usuario"}
              </h2>
              <button className="btn btn-icon" onClick={cerrarModalUsuario}>
                X
              </button>
            </div>

            <form onSubmit={submitUsuario}>
              <label>
                Nombre
                <input
                  type="text"
                  value={usuarioModal.data.nombre}
                  placeholder="Nombre"
                  onChange={(event) =>
                    handleUsuarioChange("nombre", event.target.value)
                  }
                />
              </label>

              <label>
                Correo electrónico
                <input
                  type="email"
                  value={usuarioModal.data.email}
                  placeholder="ejemplo@gmail.com"
                  onChange={(event) =>
                    handleUsuarioChange("email", event.target.value)
                  }
                />
              </label>

              <label>
                Estado
                <select
                  value={usuarioModal.data.activo ? "activo" : "inactivo"}
                  onChange={(event) =>
                    handleUsuarioChange(
                      "activo",
                      event.target.value === "activo"
                    )
                  }
                >
                  <option value="activo">Activo</option>
                  <option value="inactivo">Inactivo</option>
                </select>
              </label>

              <div className="modal-actions">
                <button type="button" className="btn" onClick={cerrarModalUsuario}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  Guardar usuario
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {proyectoModal.open && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>
                {proyectoModal.modo === "crear"
                  ? "Nuevo proyecto"
                  : "Editar proyecto"}
              </h2>
              <button className="btn btn-icon" onClick={cerrarModalProyecto}>
                X
              </button>
            </div>

            <form onSubmit={submitProyecto}>
              <label>
                Nombre
                <input
                  type="text"
                  value={proyectoModal.data.nombre}
                  placeholder="    "
                  onChange={(event) =>
                    handleProyectoChange("nombre", event.target.value)
                  }
                />
              </label>

              <label>
                Descripción
                <input
                  type="text"
                  value={proyectoModal.data.descripcion}
                  placeholder="   "
                  onChange={(event) =>
                    handleProyectoChange("descripcion", event.target.value)
                  }
                />
              </label>

              <div className="modal-actions">
                <button type="button" className="btn" onClick={cerrarModalProyecto}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  Guardar proyecto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
