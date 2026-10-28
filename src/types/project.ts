/** Общие типы проекта и расчётного ядра OMAHack. */

export type TaskId =
  | "paint-room"
  | "bathroom"
  | "kitchen"
  | "apartment"
  | "house"
  | "other";

export type RoomKind = "room" | "bathroom" | "other";

export type WallCondition = "good" | "needs-prep" | "severe";

export type StyleId =
  | "scandinavian"
  | "minimal"
  | "modern"
  | "loft"
  | "classic"
  | "custom";

export type BudgetTier = "economy" | "comfort" | "premium";

export type Surface = "floor" | "walls" | "ceiling" | "general";

export type PriceStatus = "known" | "unverified" | "unknown";

export type AvailabilityStatus =
  | "in_stock"
  | "out_of_stock"
  | "unknown";

export type EstimateStatus = "complete" | "partial" | "unavailable";

export type CalculationStatus = "calculated" | "insufficient-data";

export type RoomInput = {
  lengthM: number;
  widthM: number;
  heightM: number;
  /** Процент запаса на отходы: 10 означает 10%. */
  wastePercent?: number;
  kind?: RoomKind;
  wallCondition?: WallCondition;
  needsSpecialist?: boolean;
};

/** Данные, которые собирает мастер проекта. */
export type ProjectCalculationInput = {
  task: TaskId | null;
  taskNote: string;
  room: RoomInput;
  style: StyleId | null;
  customStyle: string;
  paletteId: string | null;
  budget: BudgetTier;
  /** Число слоёв покрытия. */
  coats?: number;
};

/** Структура записи каталога OMA. Названия полей совпадают с JSON. */
export type CatalogProduct = {
  id: string;
  name: string;
  price: number | null;
  currency?: string | null;
  price_note?: string | null;
  category?: string | null;
  pack_size?: string | null;
  coverage_m2_per_l?: string | number | null;
  intended_use?: string | null;
  availability?: string | boolean | null;
  source?: string | null;
  product_url?: string | null;
  reference_price?: number | null;
  reference_price_currency?: string | null;
  /** Цена подтверждена в источнике. */
  price_verified?: boolean;
  /** Наличие подтверждено в источнике. */
  availability_verified?: boolean;
  [key: string]: unknown;
};

/** Совместимость с прежней моделью материалов. */
export type MaterialDefinition = {
  id: string;
  name: string;
  surface: Surface;
  unit: string;
  coverageM2PerUnit: number;
  pricePerUnit: number;
};

/** Количество и стоимость одной позиции материала. */
export type MaterialQuantity = {
  materialId: string;
  name: string;
  unit: string;
  /** null — недостаточно данных для расчёта. */
  quantity: number | null;
  unitPrice: number | null;
  quantityMin?: number | null;
  quantityMax?: number | null;
  priceStatus?: PriceStatus;
  availabilityStatus?: AvailabilityStatus;
  note?: string;
};

/** Результат расчёта материала из каталога. */
export type CalculatedMaterial = MaterialQuantity & {
  productId: string;
  quantityMin: number | null;
  quantityMax: number | null;
  totalPriceMin: number | null;
  totalPriceMax: number | null;
  priceStatus: PriceStatus;
  availabilityStatus: AvailabilityStatus;
  calculationStatus: CalculationStatus;
  surface: Surface;
};

/** Строка сметы. */
export type EstimateLine = MaterialQuantity & {
  totalPrice: number | null;
  totalPriceMin?: number | null;
  totalPriceMax?: number | null;
};

/** Итоговая смета проекта. */
export type Estimate = {
  items: EstimateLine[];
  /** Итог доступен только для полной сметы с подтверждёнными ценами. */
  total: number | null;
  /** Сумма позиций с подтверждёнными ценами. */
  knownSubtotal: number;
  /** Ориентировочная сумма по числовым ценам каталога. */
  indicativeSubtotal: number | null;
  currency: string;
  status: EstimateStatus;
  warnings: string[];
};

/** Этап работы над проектом. */
export type ProjectStep = {
  id: string | number;
  title: string;
  description: string;
};

/** Полный результат расчёта проекта. */
export type ProjectPlan = {
  input: ProjectCalculationInput;
  room: RoomInput;
  floorAreaM2: number;
  wallAreaM2: number;
  ceilingAreaM2: number;
  materials: CalculatedMaterial[];
  estimate: Estimate;
  steps: ProjectStep[];
  warnings: string[];
};