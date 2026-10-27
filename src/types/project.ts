export type Priority = "economy" | "speed" | "comfort";

export type ProjectInput = {
  roomArea: number;
  wallArea: number;
  ceilingHeight: number;
  budget: number;
  priority: Priority;
};

export type MaterialLine = {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  totalPrice: number;
};

export type ProjectStep = {
  id: string;
  title: string;
  description: string;
  durationDays: number;
};

export type ProjectResult = {
  materials: MaterialLine[];
  steps: ProjectStep[];
  estimatedDays: number;
  totalMaterialsCost: number;
  notes: string[];
};
