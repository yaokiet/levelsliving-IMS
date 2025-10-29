export type MonthDataPoint = {
    date: string;             // "YYYY-MM-DD" first-of-month or EOM normalized
    quantity?: number;
    prediction?: number;
  };
  