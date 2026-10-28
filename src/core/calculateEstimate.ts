import type { CalculatedMaterial, Estimate, EstimateLine, EstimateStatus } from "../types/project";

/** Строит смету из реальных позиций каталога. Неподтверждённые цены не считаются подтверждёнными. */
export function calculateEstimate(materials: CalculatedMaterial[]): Estimate {
  const items: EstimateLine[] = materials.map((material) => {
    const totalPrice =
      material.quantity !== null && material.unitPrice !== null && material.priceStatus === "known"
        ? material.quantity * material.unitPrice
        : null;
    return {
      materialId: material.materialId,
      name: material.name,
      unit: material.unit,
      quantity: material.quantity,
      quantityMin: material.quantityMin,
      quantityMax: material.quantityMax,
      unitPrice: material.unitPrice,
      priceStatus: material.priceStatus,
      availabilityStatus: material.availabilityStatus,
      note: material.note,
      totalPrice,
      totalPriceMin: material.totalPriceMin,
      totalPriceMax: material.totalPriceMax,
    };
  });

  const warnings: string[] = [];
  const quantitiesMissing = materials.some((item) => item.calculationStatus !== "calculated");
  const pricesUnknown = materials.some((item) => item.priceStatus === "unknown");
  const pricesUnverified = materials.some((item) => item.priceStatus === "unverified");
  const unavailableProducts = materials.some((item) => item.availabilityStatus === "out_of_stock");
  const allPricesConfirmed = materials.length > 0 && materials.every((item) => item.priceStatus === "known");
  const allQuantitiesCalculated = materials.length > 0 && materials.every((item) => item.calculationStatus === "calculated");

  if (materials.length === 0) warnings.push("В каталоге OMA не найдены подходящие товары для выбранной задачи.");
  if (quantitiesMissing) warnings.push("Для части товаров не хватает данных о расходе или размере упаковки.");
  if (pricesUnknown) warnings.push("У части товаров не указана цена OMA; эти позиции не включены в суммы.");
  if (pricesUnverified) warnings.push("Часть цен есть в локальном каталоге, но не подтверждена как актуальная.");
  if (unavailableProducts) warnings.push("В каталоге есть товары, отмеченные как отсутствующие в наличии.");

  const knownSubtotal = items.reduce((sum, item) => sum + (item.totalPrice ?? 0), 0);
  const pricedItems = materials.filter((item) => item.unitPrice !== null && item.priceStatus !== "unknown");
  const indicativeSubtotal = pricedItems.length > 0 && pricedItems.every((item) => item.quantity !== null)
    ? pricedItems.reduce((sum, item) => sum + item.quantity! * item.unitPrice!, 0)
    : null;

  let status: EstimateStatus = "unavailable";
  if (allPricesConfirmed && allQuantitiesCalculated && !unavailableProducts) status = "complete";
  else if (materials.length > 0 && pricedItems.length > 0) status = "partial";

  const total = status === "complete" ? knownSubtotal : null;
  if (status !== "complete" && materials.length > 0) {
    warnings.push("Общая итоговая стоимость не показана как подтверждённая: смета неполная или цены не подтверждены.");
  }

  return {
    items,
    total,
    knownSubtotal,
    indicativeSubtotal,
    currency: "BYN",
    status,
    warnings: [...new Set(warnings)],
  };
}
