// Размеры помещения и запас материала
export type RoomInput = {
  lengthM: number;
  widthM: number;
  heightM: number;
  wastePercent: number;
};

// Поверхность, для которой нужен материал
export type Surface = "floor" | "walls";

// Описание материала из каталога
export type MaterialDefinition = {
  id: string;
  name: string;
  surface: Surface;
  unit: string;
  coverageM2PerUnit: number;
  pricePerUnit: number;
};

// Расчётное количество необходимого материала
export type MaterialQuantity = {
  materialId: string;
  name: string;
  unit: string;
  quantity: number;
  unitPrice: number;
};

// Одна строка сметы
export type EstimateLine = MaterialQuantity & {
  totalPrice: number;
};

// Вся смета
export type Estimate = {
  items: EstimateLine[];
  total: number;
};

// Один этап работ
export type ProjectStep = {
  id: number;
  title: string;
  description: string;
};

// Полный результат планирования
export type ProjectPlan = {
  room: RoomInput;
  floorAreaM2: number;
  wallAreaM2: number;
  materials: MaterialQuantity[];
  estimate: Estimate;
  steps: ProjectStep[];
};