export type EquipmentStatus =
  | "AVAILABLE"
  | "RESERVED"
  | "RENTED"
  | "MAINTENANCE"
  | "UNAVAILABLE";

export type Category = {
  name: string;
  slug: string;
  description: string;
  image: string;
  icon: string;
  url?: string;
  seoTitle: string;
  metaDescription: string;
};

export type Equipment = {
  id: number;
  slug: string;
  title: string;
  category: string;
  brand: string;
  model: string;
  year: number;
  city: string;
  region: string;
  priceDay: number;
  priceWeek: number;
  status: EquipmentStatus;
  rating: number;
  operator: boolean;
  delivery: boolean;
  sponsored?: boolean;
  image: string;
  companySlug: string;
  companyName: string;
  description: string;
  specs: string[];
};

export type ClientRequest = {
  id: string;
  machine: string;
  city: string;
  dateRange: string;
  budgetDay: number;
  contact: string;
  status: "OPEN" | "QUOTED" | "RESERVED";
};

export type DashboardMetric = {
  label: string;
  value: string;
  helper: string;
};

export type RentalHistoryItem = {
  id: string;
  equipmentTitle: string;
  companyName: string;
  city: string;
  period: string;
  total: number;
  status: "COMPLETED" | "ONGOING" | "RESERVED" | "CANCELLED";
  image: string;
};

export type Company = {
  slug: string;
  name: string;
  city: string;
  region: string;
  logo: string;
  rating: number;
  equipmentCount: number;
  description: string;
};
