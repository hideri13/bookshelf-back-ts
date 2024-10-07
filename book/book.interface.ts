export interface Book {
    id: string;
    author: string;
    title: string;
    genre: string;
    date: string;
    description: string;
}

export type Books = Map<string, Book>;
