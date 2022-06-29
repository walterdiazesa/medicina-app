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

Date.prototype.format = function (format: "DD/MM/YYYY HH:MM A") {
  if (format === "DD/MM/YYYY HH:MM A") {
    return this.toLocaleString(undefined, {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour12: true,
      hour: "2-digit",
      minute: "2-digit",
    });
  }
  return "";
};

String.prototype.normalizeQuery = function () {
  return this.normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s/g, " ")
    .toLowerCase();
};

export {};
