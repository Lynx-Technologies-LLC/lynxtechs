const stats = [
  { value: "EtherCAT", label: "Deterministic fieldbus" },
  { value: "μs", label: "Cycle-time precision" },
  { value: "16-ch", label: "Digital I/O per module" },
  { value: "Linux", label: "Embedded master targets" },
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
