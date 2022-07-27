import { Lab } from "../Lab";
import { Patient } from "../Patient";
import { User } from "../User";

export interface TestItem {
  name: string;
  assign: string; // "=" | "<"
  value: string;
  range?: { item: number; between: { from: number; to: number } };
}

export const TestCategory = {
  DRYCHEM: "DRYCHEM",
  TCUSTOM: "TCUSTOM",
  HEMA: "HEMA",
} as const;

export type TestCategory = typeof TestCategory[keyof typeof TestCategory];

export type TestCategoryDict = {
  [key in TestCategory]: { text: string; color: string };
};

export interface Test {
  id?: string;
  customId: number;
  labId: string;
  lab?: Lab;
  issuerId: string;
  issuer?: User;
  validatorId: string | null;
  validator?: User;
  validated: Date;
  patientId: string;
  patient?: Patient;
  remark?: { text: string; by: string } | null;
  date: Date;
  category: TestCategory;
  tests: TestItem[];
}
