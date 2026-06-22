export type RoomType = {
  id: string;
  label: string;
};

export const ROOM_TYPES: RoomType[] = [
  { id: "any", label: "Any room type" },
  { id: "single", label: "Single room" },
  { id: "self-contain", label: "Self-contain" },
  { id: "two-in-room", label: "2-in-a-room" },
  { id: "three-in-room", label: "3-in-a-room" },
  { id: "flat", label: "Flat / apartment" },
];

export type BudgetOption = {
  id: string;
  label: string;
  maxPrice?: number;
};

export const BUDGET_OPTIONS: BudgetOption[] = [
  { id: "any", label: "Any budget" },
  { id: "80000", label: "Up to ₦80,000", maxPrice: 80000 },
  { id: "100000", label: "Up to ₦100,000", maxPrice: 100000 },
  { id: "120000", label: "Up to ₦120,000", maxPrice: 120000 },
  { id: "150000", label: "Up to ₦150,000", maxPrice: 150000 },
  { id: "200000", label: "Up to ₦200,000", maxPrice: 200000 },
  { id: "250000", label: "Up to ₦250,000", maxPrice: 250000 },
];

export function getRoomTypeLabel(id: string): string | undefined {
  return ROOM_TYPES.find((type) => type.id === id)?.label;
}

export function getBudgetLabel(id: string): string | undefined {
  return BUDGET_OPTIONS.find((option) => option.id === id)?.label;
}
