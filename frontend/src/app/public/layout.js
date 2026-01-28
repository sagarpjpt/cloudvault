export default function PublicLayout({ children }) {
  return (
    <div
      className="min-h-screen bg-gradient-to-br"
      style={{ backgroundColor: "var(--color-bg-secondary)" }}
    >
      {children}
    </div>
  );
}
