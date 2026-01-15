export default function AuthHeader({ title, subtitle }) {
  return (
    <div className="mb-6">
      <h1 className="text-2xl sm:text-3xl font-semibold mb-2">
        {title}
      </h1>
      {subtitle && (
        <p className="text-sm text-[var(--color-text-muted)]">
          {subtitle}
        </p>
      )}
    </div>
  );
}
