import type {
  RoomInput,
  MaterialDefinition,
  MaterialQuantity,
} from "../types/project";

export function calculateMaterials(
  room: RoomInput,
  catalog: MaterialDefinition[],
): MaterialQuantity[] {
  const { lengthM, widthM, heightM, wastePercent } = room;

  // Проверяем размеры помещения
  const dimensions = [lengthM, widthM, heightM];
  if (
    dimensions.some(
      (value) => !Number.isFinite(value) || value <= 0,
    )
  ) {
    throw new Error("Размеры помещения должны быть положительными числами");
  }

  // Проверяем процент запаса
  if (
    !Number.isFinite(wastePercent) ||
    wastePercent < 0 ||
    wastePercent > 100
  ) {
    throw new Error("Запас материала должен быть от 0 до 100%");
  }

  // Рассчитываем площади поверхностей
  const floorArea = lengthM * widthM;
  const wallArea = 2 * (lengthM + widthM) * heightM;

  // Учитываем запас материала
  const wasteMultiplier = 1 + wastePercent / 100;

  // Рассчитываем количество каждого материала
  return catalog.map((material) => {
    if (
      !Number.isFinite(material.coverageM2PerUnit) ||
      material.coverageM2PerUnit <= 0
    ) {
      throw new Error(
        `Некорректный расход материала: ${material.name}`,
      );
    }

    const area =
      material.surface === "floor"
        ? floorArea
        : wallArea;

    const quantity = Math.ceil(
      (area * wasteMultiplier) /
        material.coverageM2PerUnit,
    );

    return {
      materialId: material.id,
      name: material.name,
      unit: material.unit,
      quantity,
      unitPrice: material.pricePerUnit,
    };
  });
}