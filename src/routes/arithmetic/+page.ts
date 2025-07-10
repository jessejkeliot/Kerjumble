export const ssr = false;
export const prerender = true;

export type questionSetting = {
    name: string;
    on: boolean;
    r: [number, number, number, number];
    symbol: "+" | "-" | "•" | "÷";
}

export type Symbol = questionSetting["symbol"];

export type Operator = {
    name: string;
    on: boolean;
    range: [number, number, number, number];
    symbol: "+" | "-" | "•" | "÷";
    process: (n1: number, n2: number) => number;
}
export type Question = {
    num1: number;
    num2: number;
    answer: number;
    symbol: string;
}
