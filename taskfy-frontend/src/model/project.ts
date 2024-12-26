import { User } from "./user";

export interface Project {
  id: number;
  name: string;
  allocatedHours: number;
  consumedHours: number;
  status: "CLOSED" | "ACTIVE";
  admin: User;
}
