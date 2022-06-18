Date.prototype.change = function (
  unit: "year" | "month" | "day",
  quantity: number
) {
  switch (unit) {
    case "year":
      this.setFullYear(this.getFullYear() + quantity);
      break;
    case "month":
      this.setMonth(this.getMonth() + quantity);
      break;
    case "day":
      this.setDate(this.getDate() + quantity);
      break;
  }
  return this;
};

Date.prototype.clone = function () {
  return new Date(+this);
};

Date.prototype.diff = function (date, unit) {
  const diff_ms = date.getTime() - this.getTime();
  return Math.abs(new Date(diff_ms).getUTCFullYear() - 1970);
};

String.prototype.normalizeQuery = function () {
  return this.normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s/g, " ")
    .toLowerCase();
};

export {};
