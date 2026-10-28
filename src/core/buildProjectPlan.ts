import catalogJson from "../data/omaCatalog.json";
import type { CatalogProduct, ProjectCalculationInput, ProjectPlan, ProjectStep, Surface } from "../types/project";
import { calculateEstimate } from "./calculateEstimate";
import { calculateMaterials } from "./calculateMaterials";

const OMA_CATALOG = catalogJson as CatalogProduct[];

function round2(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

function createSteps(input: ProjectCalculationInput): ProjectStep[] {
  const steps: ProjectStep[] = [
    { id: "protect", title: "Подготовить помещение", description: "Освободить рабочую зону и защитить мебель, пол и участки, которые не ремонтируются." },
  ];

  if (input.room.wallCondition === "needs-prep" || input.room.wallCondition === "severe") {
    steps.push({ id: "prepare-surfaces", title: "Подготовить поверхности", description: "Проверить основание, удалить непрочные участки и подобрать грунтовку/шпаклёвку по состоянию стены и инструкции производителя." });
  }

  switch (input.task) {
    case "paint-room":
      steps.push(
        { id: "prime", title: "Загрунтовать стены при необходимости", description: "Выбрать грунтовку, совместимую с основанием и краской, по инструкции производителя." },
        { id: "paint", title: "Покрасить стены", description: `Нанести ${Math.max(1, Math.floor(input.coats ?? 1))} слой(я) согласно инструкции выбранной краски; расход уточнить по упаковке.` },
      );
      break;
    case "bathroom":
      steps.push(
        { id: "inspect-moisture", title: "Проверить влажные зоны", description: "Уточнить тип основания, гидроизоляцию и совместимость материалов для ванной." },
        { id: "finish", title: "Выполнить отделку", description: "Выбирать плиточные, гидроизоляционные и отделочные материалы только после проверки требований помещения." },
      );
      break;
    case "kitchen":
      steps.push({ id: "finish-kitchen", title: "Выполнить отделку кухни", description: "Подобрать покрытия с учётом влажной уборки, основания и зоны использования." });
      break;
    case "apartment":
    case "house":
      steps.push({ id: "plan-zones", title: "Разделить ремонт на зоны", description: "Рассчитывать материалы отдельно для каждой комнаты и каждого типа поверхности." });
      break;
    default:
      steps.push({ id: "clarify", title: "Уточнить задачу", description: input.taskNote.trim() || "Уточнить тип работ, поверхности и требуемые материалы." });
  }

  if (input.room.needsSpecialist) {
    steps.push({ id: "specialist", title: "Привлечь специалиста", description: "Проверить сложные работы и требования к основанию до покупки материалов." });
  }
  return steps;
}

function surfaceArea(input: ProjectCalculationInput, surface: Surface): number {
  const { lengthM, widthM, heightM } = input.room;
  switch (surface) {
    case "floor":
    case "ceiling":
      return lengthM * widthM;
    case "walls":
      // Четыре стены: две длиной L и две шириной W. Окна и двери не вычитаются.
      return 2 * (lengthM + widthM) * heightM;
    default:
      return 0;
  }
}

/** Главная функция расчётного ядра. Использует только записи переданного каталога OMA. */
export function buildProjectPlan(
  input: ProjectCalculationInput,
  catalog: CatalogProduct[] = OMA_CATALOG,
): ProjectPlan {
  const dimensions = [input.room.lengthM, input.room.widthM, input.room.heightM];
  const warnings: string[] = [];

  if (dimensions.some((value) => !Number.isFinite(value) || value <= 0)) {
    warnings.push("Размеры помещения должны быть положительными числами.");
  }
  if (input.room.wastePercent !== undefined && (!Number.isFinite(input.room.wastePercent) || input.room.wastePercent < 0 || input.room.wastePercent > 100)) {
    warnings.push("Процент запаса должен быть в диапазоне от 0 до 100.");
  }
  if (!input.task) warnings.push("Тип задачи не выбран.");

  const validInput = dimensions.every((value) => Number.isFinite(value) && value > 0);
  const safeInput: ProjectCalculationInput = {
    ...input,
    room: {
      ...input.room,
      wastePercent: input.room.wastePercent ?? 10,
    },
    coats: Math.max(1, Math.floor(input.coats ?? 1)),
  };

  const floorAreaM2 = validInput ? round2(surfaceArea(safeInput, "floor")) : 0;
  const wallAreaM2 = validInput ? round2(surfaceArea(safeInput, "walls")) : 0;
  const ceilingAreaM2 = validInput ? round2(surfaceArea(safeInput, "ceiling")) : 0;
  const materials = validInput ? calculateMaterials(safeInput, catalog) : [];
  const estimate = calculateEstimate(materials);

  warnings.push(...estimate.warnings);
  if (safeInput.task === "paint-room" && validInput && materials.every((item) => item.calculationStatus !== "calculated")) {
    warnings.push("В каталоге нет подходящей краски с одновременно известными расходом и литражом упаковки; количество не вычислено.");
  }
  if (safeInput.task !== "paint-room" && safeInput.task !== null) {
    warnings.push("Для выбранного типа ремонта пока нет полного количественного расчёта материалов: каталог содержит товары, но данных недостаточно для безопасного расчёта всех работ.");
  }

  return {
    input: safeInput,
    room: safeInput.room,
    floorAreaM2,
    wallAreaM2,
    ceilingAreaM2,
    materials,
    estimate,
    steps: createSteps(safeInput),
    warnings: [...new Set(warnings)],
  };
}

export default buildProjectPlan;
