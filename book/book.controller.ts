import {Request, Response} from 'express';
import * as db from "./book.db";
import {Book} from "./book.interface";
import {StatusCodes} from "http-status-codes";
import {getBooksPage} from "./book.db";

export const getBooks = async (req: Request, res: Response) => {
    if (req.query.page ?? req.query.size ?? 0) {
        return getPage(req, res);
    } else {
        return getAllBooks(req, res);
    }

};
export const getAllBooks = async (req: Request, res: Response) => {
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
}
export const getPage = async (req: Request, res: Response) => {
    try {
        const { page, size } = req.query;
        if (!page || !size) {
            return res.status(StatusCodes.BAD_REQUEST).json({error : "Please provide all parameters!"});
        }
        const [totalCount, books] = await getBooksPage(+page, +size);
        if (!books) {
            res.status(StatusCodes.NOT_FOUND).json({error : `No books found!`});
        }
        return res.status(StatusCodes.OK).json({
            totalCount: totalCount,
            books: books
        })
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error: error});
    }
}

export const getBookById = async (req: Request, res: Response) => {
    try {
        const book : Book | undefined = await db.findOne(req.params.id);
        if (!book) return res.status(StatusCodes.NOT_FOUND).json({error : `Book not found!`});
        return res.status(StatusCodes.OK).json(book)
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
        await db.create(req.body);
        return res.status(StatusCodes.OK).json({msg: "Book added successfully"});
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
        await db.update(req.params.id, req.body);
        return res.status(StatusCodes.OK).json({msg: "Updated successfully"});
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