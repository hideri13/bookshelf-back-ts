import { Request, Response } from 'express';
import * as db from "./book.db";
import {Book, Books} from "./book.interface";
import {StatusCodes} from "http-status-codes";

export const getBooks = async (req: Request, res: Response) => {
    try {
        const allBooks : Book[] = await db.findAll();
        if (!allBooks) {
            return res.status(StatusCodes.NOT_FOUND).json({error: "No books Found"});
        }
        return res.status(StatusCodes.OK).json({
            totalCount: allBooks.length,
            books: allBooks
        });
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error: error})
    }

};

export const getBookById = async (req: Request, res: Response) => {
    try {
        const book : Book = await db.findOne(req.params.id);
        if (!book) return res.status(StatusCodes.NOT_FOUND).json({error : `Book not found!`});
        return res.status(StatusCodes.OK).json({book})
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error: error})
    }
};

export const addBook = async (req: Request, res: Response) => {
    try {
        const { author, title, genre, date, description } = req.body;
        if (!author || !title || !genre || !date || !description) {
            return res.status(StatusCodes.BAD_REQUEST).json({error : "Please provide all parameters!"});
        }
        const book = await db.findByTitle(title);
        if (book) {
            return res.status(StatusCodes.BAD_REQUEST).json({error : `This title already exists!`});
        }
        const newBook : Book | null = await db.create(req.body);
        return res.status(StatusCodes.OK).json({msg: "Book added successfully", book: newBook});
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error: error})
    }
};

export const updateBook = async (req: Request, res: Response) => {
    try {
        const { author, title, genre, date, description } = req.body;
        const book = await db.findOne(req.params.id);
        if (!author || !title || !genre || !date || !description ) {
            return res.status(StatusCodes.BAD_REQUEST).json({error : "Please provide all parameters!"});
        }
        if (!book) {
            return res.status(StatusCodes.NOT_FOUND).json({error : `No book with id ${req.params.id}`});
        }
        const updateBook = await db.update(req.params.id, req.body);
        return res.status(StatusCodes.OK).json({msg: "Updated successfully", book: updateBook});
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error: error})
    }
};

export const deleteBook = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const book = await db.findOne(req.params.id);
        if (!book) {
            return res.status(StatusCodes.NOT_FOUND).json({error : "Book does not exist!"});
        }

        await db.remove(id);

        return res.status(StatusCodes.OK).json({msg: "Book deleted successfully"});

    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error: error})
    }
};