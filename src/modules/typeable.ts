import { type ComponentPublicInstance } from 'vue';

export interface ITypeable extends ComponentPublicInstance {
    next(params: string): boolean;
}

export interface ITypeArea extends ComponentPublicInstance {
    word: string,
    update: (target: number) => void,
    error: (target: number) => void
}