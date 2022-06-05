declare interface Date {
  change(unit: "year" | "month" | "day", quantity: number): Date;
  clone(): Date;
}

declare interface String {
  normalizeQuery(): string;
}
