import { Availability } from "./availability";

export interface Employee {
  id: number;
  name: string;
  email: string;
  availability: Availability[];
}
