import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Bookdetails.css';
import { useParams } from 'react-router-dom';

function BookDetails({ bookId }) {
  const API_URL = process.env.REACT_APP_API_URL;
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await axios.get(`${API_URL}api/books/getbook/${id}`,
            {
                params:{
                    categories: true, 
                    transactions: false
                }
            }
        );
        setBook(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching book data:", err);
        setError("Failed to load book data.");
        setLoading(false);
      }
    };

    fetchBook();
  }, [API_URL, bookId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!book) {
    return <div>No book found</div>;
  }

  return (
    <div className="book-details-container">
        <div className='book-details'>
            <div className="book-image">
                <img src={book.bookImage} alt={book.bookName} />
            </div>
            <div className="book-info">
                <div className='book-title'>
                    <h2 className='book-alter-name'>{book.alternateTitle}</h2>
                    <h2 className='book-name'>{book.bookName}</h2>
                    <h2 className='book-author'>{book.author}</h2>
                </div>
                <div className='categories'>
                    {
                        book.categories.map((cat,index)=>{
                            return (
                            <div key = {index}className='category'>
                                {cat.categoryName}
                            </div>)
                        })
                    }
                </div>
                <div className='book-sub-info'>
                    <div className='key'>
                        <p>Publisher</p>
                        <p>Language</p>
                        <p>Year</p>
                    </div>
                    <div className='value'>
                        <p>{book.publisher == ""? 'N/A':book.publisher}</p>
                        <p>{book.language == ""? 'N/A':book.language}</p>
                        <p>{book.year ?? 'N/A'}</p>
                    </div>
                </div>

                </div>
        </div>
        <div className="book-summary">
            <h3>Summary</h3>
            <p style={{margin:'8px 0px'}}>{book.summary == ''?'Summary Not Available':book.summary}</p>
        </div>

        <button className='download' onClick={()=>alert(`Downloading... ${book.bookName}`)}>
            Download PDF
        </button>
    </div>
  );
}

export default BookDetails;
