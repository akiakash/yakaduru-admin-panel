// types.ts

interface TourData {
  name: string;
  price: number;
  overview: string;
  includes: string;
  expectations: string;
}

export interface TourResponse {
  success: boolean;
  message: string;
  data: TourData | TourData[] | null;
}

export interface Tour {
  id: string;
  name: string;
  price: number;
  overview: string[];
  includes: string[];
  expectations: string[];
  image: string[];
  createdAt: string;
  updatedAt: string;
}
