import {Router} from "express";

import {
    getBookById,
    getBooks,
    addBook,
    updateBook,
    deleteBook,
} from "./book.controller";


const router = Router();

// @ts-ignore
router.get('/books', getBooks);
// @ts-ignore
router.get('/books/:id', getBookById);
// @ts-ignore
router.post('/books/add', addBook);
// @ts-ignore
router.post('/books/update/:id', updateBook);
// @ts-ignore
router.post('/books/delete/:id', deleteBook);

export default router;