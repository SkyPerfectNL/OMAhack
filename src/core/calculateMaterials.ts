import type {
  AvailabilityStatus,
  CalculatedMaterial,
  CatalogProduct,
  PriceStatus,
  ProjectCalculationInput,
  Surface,
} from "../types/project";

const numberFromText = (value: string): number[] =>
  (value.match(/\d+(?:[.,]\d+)?/g) ?? [])
    .map((part) => Number(part.replace(",", ".")))
    .filter((number) => Number.isFinite(number) && number > 0);

function getCoverageRange(value: CatalogProduct["coverage_m2_per_l"]): { min: number; max: number } | null {
  if (typeof value === "number" && Number.isFinite(value) && value > 0) {
    return { min: value, max: value };
  }
  if (typeof value !== "string" || !value.trim()) return null;
  const numbers = numberFromText(value);
  if (numbers.length === 0) return null;
  if (numbers.length === 1) return { min: numbers[0], max: numbers[0] };
  return { min: Math.min(numbers[0], numbers[1]), max: Math.max(numbers[0], numbers[1]) };
}

/** Читает литраж только из pack_size либо названия товара. Не угадывает массу в кг как литры. */
function getPackLitres(product: CatalogProduct): number | null {
  const source = `${product.pack_size ?? ""} ${product.name}`;
  const match = source.match(/(\d+(?:[.,]\d+)?)\s*(?:л\.?|л\b|литр(?:а|ов)?\b|l\b)/i);
  if (!match) return null;
  const litres = Number(match[1].replace(",", "."));
  return Number.isFinite(litres) && litres > 0 ? litres : null;
}

function isInteriorPaint(product: CatalogProduct): boolean {
  const text = `${product.name} ${product.category ?? ""} ${product.intended_use ?? ""}`.toLowerCase();
  const paint = /краск|paint|farbe|str.?ahlendweiss/.test(text);
  const interior = /интерьер|внутрен|стен|потол|кухн|ванн|жилых помещ|interior|indoors/i.test(text);
  const exclude = /радиатор|фасад|наружн|автомобил|металл(?!.*интерьер)/i.test(text);
  return paint && interior && !exclude;
}

function productMatchesTask(product: CatalogProduct, task: ProjectCalculationInput["task"]): boolean {
  const text = `${product.name} ${product.category ?? ""} ${product.intended_use ?? ""}`.toLowerCase();
  switch (task) {
    case "paint-room":
      return isInteriorPaint(product);
    case "bathroom":
      return /ванн|сануз|плитк|гидроизоляц|влаг|грунтовк|шпакл/i.test(text);
    case "kitchen":
      return /кухн|интерьерн.*краск|грунтовк|шпакл/i.test(text);
    case "apartment":
    case "house":
      return /краск|грунтовк|шпакл|плитк|обо|лента маляр|валик|кисть|шпател|укрыв|плёнк|пленк/i.test(text);
    case "other":
    case null:
    default:
      return false;
  }
}

function priceStatus(product: CatalogProduct): PriceStatus {
  if (typeof product.price !== "number" || !Number.isFinite(product.price) || product.price <= 0) {
    return "unknown";
  }
  return product.price_verified === true ? "known" : "unverified";
}

function availabilityStatus(product: CatalogProduct): AvailabilityStatus {
  if (product.availability_verified !== true) return "unknown";
  const value = product.availability;
  if (value === true || (typeof value === "string" && /^(instock|in_stock|available|в наличии)$/i.test(value.trim()))) {
    return "in_stock";
  }
  if (value === false || (typeof value === "string" && /^(outofstock|out_of_stock|unavailable|нет в наличии)$/i.test(value.trim()))) {
    return "out_of_stock";
  }
  return "unknown";
}

function targetSurfaceArea(input: ProjectCalculationInput, surface: Surface): number {
  const { lengthM, widthM, heightM } = input.room;
  if (surface === "floor") return lengthM * widthM;
  if (surface === "ceiling") return lengthM * widthM;
  return 2 * (lengthM + widthM) * heightM;
}

function makeMaterial(product: CatalogProduct, input: ProjectCalculationInput): CalculatedMaterial {
  const coverage = getCoverageRange(product.coverage_m2_per_l);
  const packLitres = getPackLitres(product);
  const wastePercent = Math.max(0, input.room.wastePercent ?? 10);
  const coats = Math.max(1, Math.floor(input.coats ?? 1));
  const area = targetSurfaceArea(input, "walls") * (1 + wastePercent / 100) * coats;
  let quantityMin: number | null = null;
  let quantityMax: number | null = null;
  let note = "";

  if (coverage && packLitres) {
    // Максимальный расход получается при минимальном покрытии; округление — до целых упаковок.
    quantityMin = Math.ceil((area / coverage.max) / packLitres);
    quantityMax = Math.ceil((area / coverage.min) / packLitres);
    quantityMin = Math.max(1, quantityMin);
    quantityMax = Math.max(quantityMin, quantityMax);
  } else {
    const missing: string[] = [];
    if (!coverage) missing.push("не указан расход в м²/л");
    if (!packLitres) missing.push("не удалось определить объём упаковки в литрах");
    note = `Количество не рассчитано: ${missing.join("; ")}.`;
  }

  if (input.room.wallCondition === "needs-prep" || input.room.wallCondition === "severe") {
    note = [note, "Подготовительные материалы нужно уточнить отдельно по состоянию стен."].filter(Boolean).join(" ");
  }
  if (input.task !== "paint-room") {
    note = [note, "Товар найден по категории/описанию задачи; количество не рассчитывается автоматически для этого типа ремонта."].filter(Boolean).join(" ");
    quantityMin = null;
    quantityMax = null;
  }

  const pStatus = priceStatus(product);
  const totalPriceMin = quantityMin !== null && pStatus !== "unknown" ? quantityMin * product.price! : null;
  const totalPriceMax = quantityMax !== null && pStatus !== "unknown" ? quantityMax * product.price! : null;
  if (pStatus === "unverified") {
    note = [note, "Цена указана в локальном каталоге, но не отмечена как подтверждённая."].filter(Boolean).join(" ");
  } else if (pStatus === "unknown") {
    note = [note, product.price_note || "Цена OMA неизвестна; в смету не включена."].filter(Boolean).join(" ");
  }

  const canCalculate = quantityMin !== null && quantityMax !== null;
  return {
    productId: product.id,
    materialId: product.id,
    name: product.name,
    unit: "упак.",
    quantity: quantityMin === quantityMax ? quantityMin : null,
    quantityMin,
    quantityMax,
    unitPrice: typeof product.price === "number" && product.price > 0 ? product.price : null,
    totalPriceMin,
    totalPriceMax,
    priceStatus: pStatus,
    availabilityStatus: availabilityStatus(product),
    calculationStatus: canCalculate ? "calculated" : "insufficient-data",
    surface: "walls",
    note: note || undefined,
  };
}

/** Подбирает только записи переданного каталога OMA; демо-справочник не используется. */
export function calculateMaterials(
  input: ProjectCalculationInput,
  catalog: CatalogProduct[],
): CalculatedMaterial[] {
  if (!catalog.length || !input.task) return [];
  return catalog
    .filter((product) => product && typeof product.id === "string" && typeof product.name === "string")
    .filter((product) => productMatchesTask(product, input.task))
    .map((product) => makeMaterial(product, input))
    .sort((a, b) => {
      // Сначала позиции с рассчитанным количеством, после — позиции с недостающими данными.
      if (a.calculationStatus !== b.calculationStatus) return a.calculationStatus === "calculated" ? -1 : 1;
      if (a.priceStatus !== b.priceStatus) {
        const rank: Record<PriceStatus, number> = { known: 0, unverified: 1, unknown: 2 };
        return rank[a.priceStatus] - rank[b.priceStatus];
      }
      return a.name.localeCompare(b.name, "ru");
    });
}

export { getCoverageRange, getPackLitres };
