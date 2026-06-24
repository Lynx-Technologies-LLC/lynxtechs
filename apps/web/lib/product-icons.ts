import { CircuitBoard, Code2, type LucideIcon } from "lucide-react";

import type { Product } from "@/lib/product-types";

const productTypeIcons: Record<Product["type"], LucideIcon> = {
  Software: Code2,
  Hardware: CircuitBoard,
};

export function getProductTypeIcon(type: Product["type"]): LucideIcon {
  return productTypeIcons[type];
}
