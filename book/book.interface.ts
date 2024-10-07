export interface Book {
    id: string;
    author: string;
    title: string;
    genre: string;
    date: string;
    description: string;
}

// export interface Books {
//     [key: string]: Book;
// }

export type Books = Map<string, Book>;
