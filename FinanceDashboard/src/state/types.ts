export interface Day {
  id: string;
  date: string;
  revenue: number;
  expenses: number;
}

export interface Month {
  expenses: number;
  id: string;
  month: string;
  nonOperationalExpenses: number;
  operationalExpenses: number;
  revenue: number;
}

export interface ExpensesByCategory {
  salaries: number;
  services: number;
  supplies: number;
}

export interface GetKpisResponse {
  id: string;
  expensesByCategory: ExpensesByCategory;
  monthlyData: Array<Month>;
  dailyData: Array<Day>;
  totalExpenses: number;
  totalProfit: number;
  totalRevenue: number;
  __v: number;
  _id: string;
  createdAt: string;
  updatedAt: string;
}

export interface GetProductsResponse {
  id: string;
  _id: string;
  price: number;
  expense: number;
  transactions: Array<string>;
  __v: number;
  createdAt: string;
  updatedAt: string;
}

export interface GetTransactionsResponse {
  _id: string;
  buyer: string;
  amount: number;
  productIds: Array<string>;
  __v: number;
  createdAt: string;
  updatedAt: string;
}

