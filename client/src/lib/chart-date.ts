export const toUTCDate = (s: string) => {
    const d = new Date(s);
    return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), 1));
  };
  
  export const firstOfMonthUTC = (d: Date) =>
    new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), 1));
  
  export const addMonthsUTC = (d: Date, delta: number) =>
    new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + delta, 1));
  
  export const normalizeToMonthISO = (isoDateOrEom: string) => {
    const [y, m] = isoDateOrEom.split("-").map(Number);
    return new Date(Date.UTC(y, m - 1, 1)).toISOString().slice(0, 10);
  };
  