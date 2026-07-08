export default function BarraLateral({ vista, setVista }) {
  const secciones = ["Usuarios", "Proyectos", "Tareas", "Histórico"];

  return (
    <aside className="sidebar">
      <h2>Menú</h2>
      {secciones.map((seccion) => (
        <div
          key={seccion}
          className={`nav-item ${vista === seccion ? "active" : ""}`}
          onClick={() => setVista(seccion)}
        >
          {seccion}
        </div>
      ))}
    </aside>
  );
}
