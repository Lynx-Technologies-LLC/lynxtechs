import { SectionHeader } from "@/components/sections/SectionHeader";

const steps = [
  {
    step: "01",
    title: "Architecture",
    description: "Network topology, cycle-time budgeting, and slave selection for your application.",
  },
  {
    step: "02",
    title: "Design & build",
    description: "Custom PCB design or off-the-shelf Lynx modules integrated into your system.",
  },
  {
    step: "03",
    title: "Validation",
    description: "Lab bring-up, timing analysis, and integration with LXMASTER or your master stack.",
  },
  {
    step: "04",
    title: "Production",
    description: "Design-for-manufacturing support, documentation, and ongoing engineering.",
  },
];

export function ProcessSteps() {
  return (
    <section className="border-y border-border bg-muted/20 py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          label="How we work"
          title="From concept to deployed real-time hardware"
          className="mb-16"
        />

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((item) => (
            <div key={item.step} className="relative">
              <span className="text-5xl font-bold text-border">{item.step}</span>
              <h3 className="mt-4 text-lg font-semibold">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
