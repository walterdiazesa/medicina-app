export interface TestItem {
  name: string;
  assign: string; // "=" | "<"
  value: string;
  range?: { item: number; between: { from: number; to: number } };
}

export interface Test {
  id?: string;
  labId: string;
  patientId: string;
  sex: "Masculino" | "Femenino" | "No especificado";
  date: Date;
  tests: TestItem[];
}
