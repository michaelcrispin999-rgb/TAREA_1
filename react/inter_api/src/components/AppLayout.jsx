export default function AppLayout({ vista, setVista, children }) {
  return (
    <div className="layout">
      <aside className="sidebar">
        <h2>Menú</h2>
        {children}
      </aside>
    </div>
  );
}
