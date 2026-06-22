"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CircuitBoard, Code2 } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

type ProductType = "Software" | "Hardware";

const products = [
  {
    name: "LXMSTR",
    type: "Software" as const,
    summary:
      "EtherCAT master stack for real-time control of distributed I/O and motion devices.",
    href: "/products/lxmstr",
    image: "/products/lxmstr.svg",
    icon: Code2,
  },
  {
    name: "LXDIO33-16",
    type: "Hardware" as const,
    summary:
      "3.3 V EtherCAT digital I/O PCB module — 16-channel digital I/O for industrial and robotics applications.",
    href: "/products/lxdio33-16",
    image: "/products/lxdio33-16.svg",
    icon: CircuitBoard,
  },
];

const categories: ProductType[] = ["Software", "Hardware"];

export function ProductCatalog() {
  const [category, setCategory] = useState<ProductType>("Software");

  const filtered = products.filter((product) => product.type === category);

  return (
    <div className="space-y-8">
      <div className="flex justify-center gap-4">
        {categories.map((item) => (
          <Button
            key={item}
            type="button"
            size="lg"
            variant={category === item ? "default" : "secondary"}
            onClick={() => setCategory(item)}
            className={cn(
              "min-w-[10rem] px-8 text-base",
              category !== item && "bg-muted",
            )}
          >
            {item}
          </Button>
        ))}
      </div>

      {filtered.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2">
          {filtered.map((product) => {
            const Icon = product.icon;
            return (
              <Link key={product.name} href={product.href}>
                <Card className="h-full overflow-hidden transition-colors hover:border-primary/40">
                  <div className="relative aspect-[16/9] bg-muted">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                  <CardHeader>
                    <div className="mb-2 flex items-center justify-between">
                      <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <Icon className="h-5 w-5" />
                      </div>
                      <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium">
                        {product.type}
                      </span>
                    </div>
                    <CardTitle>{product.name}</CardTitle>
                    <CardDescription>{product.summary}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <span className="inline-flex items-center gap-1 text-sm font-medium text-primary">
                      View product
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      ) : (
        <p className="text-muted-foreground">
          No {category.toLowerCase()} products listed yet.
        </p>
      )}
    </div>
  );
}
