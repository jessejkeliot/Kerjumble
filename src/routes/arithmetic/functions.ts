import type { Operator } from "./+page";

export function doOperator(n1: number, n2:number, operator: string): number{
    if(operator=="+"){
        return n1 + n2;
    }
    if(operator=="-"){
        return n1 - n2;
    }
    if(operator=="•"){
        return n1 * n2;
    }
    if(operator=="÷"){
        return n1 / n2;
    }
    return 0;
}

export const operators: Operator[] = [{ name: "Addition", on: true, range: [1, 100, 1, 100], symbol: "+", process: (n1: number, n2: number) => n1+n2},
    { name: "Subtraction", on: true, range: [1, 100, 1, 100], symbol: "-", process: (n1: number, n2: number) => n1-n2 },
    { name: "Multiplication", on: true, range: [2, 12, 2, 100], symbol: "•", process: (n1: number, n2: number) => n1*n2},
    { name: "Division", on: true, range: [2, 12, 2, 100], symbol: "÷", process: (n1: number, n2: number) => n1/n2 },
  ]