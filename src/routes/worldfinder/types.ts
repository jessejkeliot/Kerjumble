export interface Country {
    name: Name;
    flags: Flags;
    population: number;
}

export interface Flags {
    png: string;
    svg: string;
    alt: string;
}
export interface Name {
    common: string;
    official: string;
}