import {v4 as random_id} from "uuid";
import {Book, Books} from "./book.interface";
import * as fs from "node:fs";

let books : Books = loadBooks();

function loadBooks() : Books {
    try {
        const data = fs.readFileSync("./books.json", "utf-8")
        return new Map<string, Book>(Object.entries(JSON.parse(data)));
    } catch (error) {
        console.log(`Error ${error}`)
        return new Map<string, Book>;
    }
}

function saveBooks (): void {
    try {
        fs.writeFileSync("./books.json", JSON.stringify(books), "utf-8")
        //console.log(`Books data saved successfully!`)
    } catch (error) {
        console.log(`Error : ${error}`)
    }
}
export const findAll = async (): Promise<Book[]> => Array.from(books.values());
export const findOne = async (id: string): Promise<Book | undefined> => books.get(id);

export const findByTitle = async (title: string): Promise<Book | null> => {
    const allBooks = await findAll();
    const book = allBooks.find(result => result.title === title);
    if (!book) return null;
    return book;
};

export const getBooksPage = async (pageNumber: number, pageSize: number): Promise<[number, Book[]]> => {
    let totalCount: number = books.size;
    let start: number = pageNumber * pageSize;
    return [totalCount, Array.from(books.values()).slice(start, start + pageSize)];
}

export const create = async (bookData: Book): Promise<Book | null> => {
    let id = random_id();

    let check_user = await findOne(id);

    while (check_user) {
        id = random_id();
        check_user = await findOne(id);
    }

    const book : Book = {
        id : id,
        author: bookData.author,
        title: bookData.title,
        genre: bookData.genre,
        date: bookData.date,
        description: bookData.description
    };

    books.set(id, book);
    saveBooks();
    return book;
}

export const update = async (id: string, updateValues: Book): Promise<Book | null> => {
    const bookExists = await findOne(id);
    if (!bookExists) return null;
    books.set(id, updateValues);

    saveBooks();

    return books.get(id)!;
}

export const remove = async (id: string): Promise<null | void> => {
    const bookExists = await findOne(id);
    if (!bookExists) return null;
    books.delete(id);
    saveBooks();
}
