import {v4 as random_id} from "uuid";
import {Book, Books} from "./book.interface";
import * as fs from "node:fs";

let books = loadBooks();

function loadBooks() : Books {
    try {
        const data = fs.readFileSync("./books.json", "utf-8")
        return JSON.parse(data)
    } catch (error) {
        console.log(`Error ${error}`)
        return {}
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
export const findAll = async (): Promise<Book[]> => Object.values(books);
export const findOne = async (id: string): Promise<Book> => books[id];

export const findByTitle = async (title: string): Promise<Book | null> => {
    const allBooks = await findAll();
    const book = allBooks.find(result => result.title === title);
    if (!book) return null;
    return book;
};

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

    books[id] = book;
    saveBooks();
    return book;
}

export const update = async (id: string, updateValues: Book): Promise<Book | null> => {
    const bookExists = await findOne(id);
    if (!bookExists) return null;
    books[id] = {
        ...bookExists,
        ...updateValues
    }

    saveBooks();

    return books[id];
}

export const remove = async (id: string): Promise<null | void> => {
    const bookExists = await findOne(id);
    if (!bookExists) return null;
    delete books[id];
    saveBooks();
}
