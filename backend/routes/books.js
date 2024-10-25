import express from "express"
import Book from "../models/Book.js"
import BookCategory from "../models/BookCategory.js"

const router = express.Router()

/* Get all books in the db */

// const updateBookCategories = async () => {
//     try {
//         // Fetch all books with populated category data
//         const books = await Book.find({}).populate('categories');

//         for (let book of books) {
//             // For each book, loop through its categories
//             for (let category of book.categories) {
//                 // Find the corresponding category and update its books array
//                 await BookCategory.findByIdAndUpdate(
//                     category._id,
//                     {
//                         $addToSet: { books: book._id }, // Add the book if not already in the array
//                     },
//                     { new: true, upsert: true } // Upsert creates the document if it doesn't exist
//                 );
//             }
//         }

//         console.log('Categories updated successfully with books!');
//     } catch (error) {
//         console.error('Error updating categories with books:', error);
//     }
// };

router.get("/allbooks", async (req, res) => {
    try {
        let query = Book.find({});

        // Populate categories if requested
        if (req.query.categories === 'true') {
            query = query.populate("categories", "categoryName");
        }

        // Populate transactions if requested
        if (req.query.transactions === 'true') {
            query = query.populate("transactions");
        }

        // Filter by category if category ID is provided
        if (req.query.category) {
            query = query.where("categories").equals(req.query.category);
        }
        // updateBookCategories();
        query.sort({ createdAt: -1 });
        // Execute the query
        const books = await query.exec();
        res.status(200).json(books);
    } catch (err) {
        return res.status(504).json(err);
    }
});


/* Get Book by book Id */
router.get("/getbook/:id", async (req, res) => {
    try {
        let query = Book.findById(req.params.id);

        if (req.query.categories === 'true') {
            query = query.populate("categories", "categoryName");
        }

        // Populate transactions if requested
        if (req.query.transactions === 'true') {
            query = query.populate("transactions");
        }
        const book = await query.exec();
        res.status(200).json(book)
    }
    catch {
        return res.status(500).json(err)
    }
})

/* Get books by category name*/
router.get("/", async (req, res) => {
    const category = req.query.category
    try {
        const books = await BookCategory.findOne({ categoryName: category }).populate("books")
        res.status(200).json(books)
    }
    catch (err) {
        return res.status(504).json(err)
    }
})

/* Adding book */
router.post("/addbook", async (req, res) => {
    if (req.body.isAdmin) {
        try {
            const newbook = await new Book({
                bookImage:req.body.bookImage,
                bookName: req.body.bookName,
                alternateTitle: req.body.alternateTitle,
                author: req.body.author,
                bookCountAvailable: req.body.bookCountAvailable,
                language: req.body.language,
                publisher: req.body.publisher,
                year:req.body.year,
                bookStatus: req.body.bookSatus,
                categories: req.body.categories
            })
            const book = await newbook.save()
            await BookCategory.updateMany(
                { '_id': { $in: book.categories } },
                { $addToSet: { books: book._id } }   // Use $addToSet to avoid duplicates
            );
            res.status(200).json(book)
        }
        catch (err) {
            res.status(504).json(err)
        }
    }
    else {
        return res.status(403).json("You dont have permission to delete a book!");
    }
})

/* Update book */
router.put("/updatebook/:id", async (req, res) => {
    if (req.body.isAdmin) {
        try {
            const bookId = req.params.id;
            const updatedBook = await Book.findByIdAndUpdate(bookId, {
                $set: req.body,
            });

            if (req.body.categories) {
                // Iterate over each category ID and add the book to the category's books array
                for (let categoryId of req.body.categories) {
                    await BookCategory.findByIdAndUpdate(
                        categoryId,
                        { $addToSet: { books: bookId } },  // Add to set to avoid duplicates
                    );
                }
            }

            res.status(200).json("Book details and categories updated successfully");
        }
        catch (err) {
            res.status(504).json(err);
        }
    }
    else {
        return res.status(403).json("You don't have permission to update this book!");
    }
});

/* Remove book  */
router.delete("/removebook/:id", async (req, res) => {
    console.log(req.body.isAdmin)
    if (req.body.isAdmin) {
        try {
            const _id = req.params.id
            const book = await Book.findOne({ _id })
            await book.remove()
            await BookCategory.updateMany({ '_id': book.categories }, { $pull: { books: book._id } });
            res.status(200).json("Book has been deleted");
        } catch (err) {
            return res.status(504).json(err);
        }
    } else {
        return res.status(403).json("You dont have permission to delete a book!");
    }
})

export default router