import type {
  MaterialQuantity,
  Estimate,
} from "../types/project";

export function calculateEstimate(
  materials: MaterialQuantity[],
): Estimate {
  const items = materials.map((material) => {
    if (
      !Number.isFinite(material.unitPrice) ||
      material.unitPrice < 0
    ) {
      throw new Error(
        `Некорректная цена материала: ${material.name}`,
      );
    }

    const totalPrice = Math.round(
      (material.quantity * material.unitPrice +
        Number.EPSILON) *
        100,
    ) / 100;

    return {
      ...material,
      totalPrice,
    };
  });

  const total = Math.round(
    (items.reduce(
      (sum, item) => sum + item.totalPrice,
      0,
    ) +
      Number.EPSILON) *
      100,
  ) / 100;

  return {
    items,
    total,
  };
}