import React, { useEffect, useState } from 'react'
import "../Pages/Dashboard/AdminDashboard/AdminDashboard.css"
import './EditBook.css'
import axios from "axios"
// import { AuthContext } from '../../../../Context/AuthContext'
import { Dropdown } from 'semantic-ui-react'
import { Spinner } from 'react-bootstrap'
function EditBook({ isOpen, onClose, book, onSave }) {
    const API_URL = process.env.REACT_APP_API_URL
    const [isLoading, setIsLoading] = useState(false)
    // const { user } = useContext(AuthContext)

    const [bookName, setBookName] = useState(book.bookName)
    const [bookImage, setBookImage] = useState(book.bookImage)
    const [alternateTitle, setAlternateTitle] = useState(book.alternateTitle)
    const [author, setAuthor] = useState(book.author)
    const [bookCountAvailable, setBookCountAvailable] = useState(book.bookCountAvailable)
    const [language, setLanguage] = useState(book.language)
    const [publisher, setPublisher] = useState(book.publisher)
    const [summary, setSummary] = useState(book.summary)
    const [year, setYear] = useState(book.year)
    const [allCategories, setAllCategories] = useState([])
    const [selectedCategories, setSelectedCategories] = useState(book.categories)


    /* Fetch all the Categories */
    useEffect(() => {
        const getAllCategories = async () => {
            try {
                const response = await axios.get(API_URL + "api/categories/allcategories")
                const all_categories = await response.data.map(category => (
                    { value: `${category._id}`, text: `${category.categoryName}` }
                ))
                setAllCategories(all_categories)
            }
            catch (err) {
                console.log(err)
            }
        }
        getAllCategories()
    }, [API_URL])

    if (!isOpen) return null;
    /* Adding book function */
    const updateBook = async (e) => {
        e.preventDefault()
        setIsLoading(true)
        const BookData = {
            bookImage:bookImage,
            bookName: bookName,
            alternateTitle: alternateTitle,
            author: author,
            bookCountAvailable: bookCountAvailable,
            language: language,
            publisher: publisher,
            year:year,
            summary : summary,
            categories: selectedCategories,
            isAdmin:true
        }
        try {
            await axios.put(API_URL + "api/books/updatebook/"+book._id, BookData).then(
                response => {
                    setIsLoading(false)
                    onSave(BookData);
                }
            ).catch(err => 
                console.log("error \n",err)
            )
        }
        catch (err) {
            console.log("error occured \n",err)
        }
    }
    return (
        <div className='overlay'>
            { isLoading?<Spinner/>:
            <div>
            <div className='content'>
            <p className="dashboard-option-title">Update</p>
            <div className="dashboard-title-line"></div>
            <form className='addbook-form' onSubmit={updateBook}>

                <label className="edit-label" htmlFor="bookImage">Book Image Link<span className="required-field">*</span></label><br />
                <input placeholder = {book.bookImage} className="edit-input" type="text" name="bookImage" value={bookImage} onChange={(e) => { setBookImage(e.target.value) }} required></input><br />

                <label className="edit-label" htmlFor="bookName">Book Name<span className="required-field">*</span></label><br />
                <input placeholder={book.bookNme} className="edit-input" type="text" name="bookName" value={bookName} onChange={(e) => { setBookName(e.target.value) }} required></input><br />

                <label className="edit-label" htmlFor="alternateTitle">AlternateTitle</label><br />
                <input placeholder={book.alternateTitle} className="edit-input" type="text" name="alternateTitle" value={alternateTitle} onChange={(e) => { setAlternateTitle(e.target.value) }}></input><br />

                <label className="edit-label" htmlFor="author">Author Name<span className="required-field">*</span></label><br />
                <input placeholder={book.auther} className="edit-input" type="text" name="author" value={author} onChange={(e) => { setAuthor(e.target.value) }} required></input><br />

                <label className="edit-label" htmlFor="language">Language</label><br />
                <input placeholder={book.language} className="edit-input" type="text" name="language" value={language} onChange={(e) => { setLanguage(e.target.value) }}></input><br />

                <label className="edit-label" htmlFor="publisher">Publisher</label><br />
                <input placeholder={book.publisher} className="edit-input" type="text" name="publisher" value={publisher} onChange={(e) => { setPublisher(e.target.value) }}></input><br />
                
                <label className="edit-label" htmlFor="year">Year</label><br />
                <input placeholder={book.year} className="edit-input" type="text" name="year" value={year??0} onChange={(e) => { setYear(e.target.value) }}></input><br />

                <label className="edit-label" htmlFor="copies">No.of Copies Available<span className="required-field">*</span></label><br />
                <input placeholder={book.bookCountAvailable} className="edit-input" type="number" name="copies" value={bookCountAvailable??0} onChange={(e) => { setBookCountAvailable(e.target.value) }} required></input><br />

                <label className="edit-label" htmlFor="categories">Categories<span className="required-field">*</span></label><br />
                <div className="semanticdropdown">
                    <Dropdown
                        placeholder='Category'
                        fluid
                        multiple
                        search
                        selection
                        options={allCategories}
                        value={selectedCategories}
                        onChange={(event, value) => setSelectedCategories(value.value)}
                    />
                </div>

                <label className="edit-label" htmlFor="summary">Summary</label><br />
                <textarea placeholder= { book.summary} className="edit-input" type="text" name="summary" value={summary} onChange={(e) => { setSummary(e.target.value) }}></textarea><br />

                <div className='buttons'>
                    <input className="addbook-submit" type="submit" value="SUBMIT" disabled={isLoading}></input>
                    <button className="edit-cancel" onClick={onClose}>CANCEL</button>
                </div>
            </form>
            </div>
            </div>}
        </div>
    )
}

export default EditBook;