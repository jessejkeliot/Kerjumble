export function doOperator(n1: number, n2:number, operator: string): number{
    if(operator=="+"){
        return n1 + n2;
    }
    if(operator=="-"){
        return n1 - n2;
    }
    if(operator=="*"){
        return n1 * n2;
    }
    if(operator=="/"){
        return n1 / n2;
    }
    return 0;
}