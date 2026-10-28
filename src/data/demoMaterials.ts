import type { MaterialDefinition } from "../types/project";

// Временные данные для проверки расчётного движка.
// Это демонстрационные значения, не реальные товары и цены OMA.
export const demoMaterials: MaterialDefinition[] = [
  {
    id: "demo-wall-paint",
    name: "Демонстрационная краска для стен",
    surface: "walls",
    unit: "л",
    coverageM2PerUnit: 10,
    pricePerUnit: 12,
  },
  {
    id: "demo-floor-covering",
    name: "Демонстрационное напольное покрытие",
    surface: "floor",
    unit: "м²",
    coverageM2PerUnit: 1,
    pricePerUnit: 25,
  },
];