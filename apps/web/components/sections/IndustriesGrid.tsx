import { Factory, Bot, Cpu } from "lucide-react";

import { SectionHeader } from "@/components/sections/SectionHeader";

const industries = [
  {
    icon: Bot,
    title: "Robotics",
    description: "End-effector I/O, motion interfaces, and real-time control for robotic cells.",
  },
  {
    icon: Factory,
    title: "Industrial automation",
    description: "Factory-floor I/O expansion, PLC alternatives, and deterministic machine control.",
  },
  {
    icon: Cpu,
    title: "Embedded systems",
    description: "Linux and embedded targets running EtherCAT master software and custom hardware.",
  },
];

export function IndustriesGrid() {
  return (
    <section className="py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          label="Applications"
          title="Where teams deploy Lynx technology"
          description="Real-time hardware and software for industries that cannot compromise on timing."
          className="mb-16"
        />

        <div className="grid gap-6 md:grid-cols-3">
          {industries.map((industry) => {
            const Icon = industry.icon;
            return (
              <div
                key={industry.title}
                className="group rounded-2xl border border-border p-8 transition-colors hover:border-foreground/30 hover:bg-muted/30"
              >
                <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl border border-border bg-muted">
                  <Icon className="h-6 w-6" strokeWidth={1.5} />
                </div>
                <h3 className="text-xl font-semibold">{industry.title}</h3>
                <p className="mt-3 leading-relaxed text-muted-foreground">
                  {industry.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
