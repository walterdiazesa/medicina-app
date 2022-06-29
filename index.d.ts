declare interface Date {
  change(unit: "year" | "month" | "day", quantity: number): Date;
  clone(): Date;
  diff(date: Date, unit: "year"): number;
  format(format: "DD/MM/YYYY HH:MM A"): string;
}

declare interface String {
  normalizeQuery(): string;
}
