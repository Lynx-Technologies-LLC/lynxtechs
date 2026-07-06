const stats = [
  { value: "1–2 yrs → weeks", label: "Electronics design timeline" },
  { value: "Zero firmware", label: "Hard real-time, no firmware stack" },
  { value: "Drop-in modules", label: "No EtherCAT IP development" },
  { value: "NASA · FANUC · Toyota", label: "Trusted by industry leaders" },
];

export function StatsBar() {
  return (
    <section className="border-b border-border bg-foreground text-background">
      <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-white/10 md:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="px-6 py-10 text-center sm:px-8">
            <p className="text-2xl font-bold tracking-tight sm:text-3xl">
              {stat.value}
            </p>
            <p className="mt-2 text-sm text-white/60">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
