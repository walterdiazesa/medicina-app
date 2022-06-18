import { Lab } from "../Lab";
import { Patient } from "../Patient";
import { User } from "../User";

export interface TestItem {
  name: string;
  assign: string; // "=" | "<"
  value: string;
  range?: { item: number; between: { from: number; to: number } };
}

export interface Test {
  id?: string;
  labId: string;
  lab?: Lab;
  issuerId: string;
  issuer?: User;
  validatorId: string | null;
  validator?: User;
  patientId: string;
  patient?: Patient;
  sex: "Masculino" | "Femenino" | "No especificado";
  remark?: { text: string; by: string } | null;
  date: Date;
  tests: TestItem[];
}
