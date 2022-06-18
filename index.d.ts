declare interface Date {
  change(unit: "year" | "month" | "day", quantity: number): Date;
  clone(): Date;
  diff(date: Date, unit: "year"): number;
}

declare interface String {
  normalizeQuery(): string;
}
