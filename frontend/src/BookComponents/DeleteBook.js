import React, {useState } from 'react'
import "../Pages/Dashboard/AdminDashboard/AdminDashboard.css"
import './DeleteBook.css'
import axios from "axios"

import { Spinner } from 'react-bootstrap'
function DeleteBook({ isOpen, onClose, book, onSave }) {
    const API_URL = process.env.REACT_APP_API_URL
    const [isLoading, setIsLoading] = useState(false)

    if (!isOpen) return null;
    /* Adding book function */
    const DelBook = async (e) => {
        e.preventDefault()
        setIsLoading(true)
        try {
            await axios.delete(API_URL + "api/books/removebook/"+book._id,{data:{isAdmin:true}}).then(
                response => {
                    setIsLoading(false)
                    onSave();
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
        <div className='del-overlay'>
            { isLoading?<Spinner/>:
            <div className='del-content'>
                <p className='text'>Are You Sure You Want to remove the book <span className='book'>{book.bookName}</span></p>
                <div className='buttons'>
                    <button className="del-confirm-btn del-btn" disabled={isLoading} onClick={DelBook}>CONFIRM</button>
                    <button className="del-cancel-btn del-btn" onClick={onClose}>CANCEL</button>
                </div>
            </div>
            }
        </div>
    )
}

export default DeleteBook;