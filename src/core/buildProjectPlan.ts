import type {
  RoomInput,
  ProjectPlan,
} from "../types/project";

import { demoMaterials } from "../data/demoMaterials";
import { calculateMaterials } from "./calculateMaterials";
import { calculateEstimate } from "./calculateEstimate";

export function buildProjectPlan(
  room: RoomInput,
): ProjectPlan {
  // 1. Рассчитываем количество материалов
  const materials = calculateMaterials(
    room,
    demoMaterials,
  );

  // 2. Рассчитываем стоимость материалов
  const estimate = calculateEstimate(materials);

  // 3. Рассчитываем площади помещения
  const floorAreaM2 =
    room.lengthM * room.widthM;

  const wallAreaM2 =
    2 *
    (room.lengthM + room.widthM) *
    room.heightM;

  // 4. Формируем последовательность работ
  const steps = [
    {
      id: 1,
      title: "Подготовить помещение",
      description:
        "Освободить рабочую зону и защитить поверхности.",
    },
    {
      id: 2,
      title: "Подготовить и покрасить стены",
      description:
        "Подготовить стены и выполнить покраску.",
    },
    {
      id: 3,
      title: "Уложить напольное покрытие",
      description:
        "Подготовить основание и уложить покрытие.",
    },
  ];

  // 5. Собираем всё в один объект
  return {
    room,
    floorAreaM2,
    wallAreaM2,
    materials,
    estimate,
    steps,
  };
}