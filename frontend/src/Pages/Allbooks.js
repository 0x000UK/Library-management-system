import React, { useEffect, useState } from "react";
import axios from "axios"; 
import "./Allbooks.css";
import BookCard from "./bookCard";
import EditBook from "../BookComponents/EditBook";
import DeleteBook from "../BookComponents/DeleteBook";
import Sidebar from "./Sidebar";
import ViewSidebarIcon from '@mui/icons-material/ViewSidebar';
import CloseIcon from '@mui/icons-material/Close';

function Allbooks() {
  const API_URL = process.env.REACT_APP_API_URL;
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const booksPerPage = 20;
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categoryName, setCategoryName] = useState("All Books");
  const [isEditOpen, setEditOpen] = useState(false);
  const [isDeleteOpen, setDeleteOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [isSidebarVisible, setSidebarVisible] = useState(false); // Toggle sidebar

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async (categoryId = null) => {
    try {
      const params = { categories: true, transactions: false };
      if (categoryId) {
        params.category = categoryId;
      }
      const response = await axios.get(API_URL + "api/books/allbooks", { params });
      setFilteredBooks(response.data);
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  };

  const handleCategorySelect = (categoryId, categoryName) => {
    setSelectedCategory(categoryId);
    setCategoryName(categoryName);
    fetchBooks(categoryId);
    setSidebarVisible(false);
  };

  const handleEditClick = (book) => {
    setSelectedBook(book);
    setEditOpen(true);
  };

  const handleDeleteClick = (book) => {
    setSelectedBook(book);
    setDeleteOpen(true);
  };

  const handleSave = () => {
    setEditOpen(false);
    setDeleteOpen(false);
    fetchBooks(selectedCategory);
  };

  // Pagination logic
  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = filteredBooks.slice(indexOfFirstBook, indexOfLastBook);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="books-page">
      <button
        className="toggle-sidebar-btn"
        onClick={() => setSidebarVisible(!isSidebarVisible)}
      >
        {isSidebarVisible ? <CloseIcon/> : <ViewSidebarIcon/>}
      </button>

      <div className={`sidebar ${isSidebarVisible ? "active" : ""}`}>
        <Sidebar onCategorySelect={handleCategorySelect} />
      </div>

      <div className="books-content">
        <h2>{categoryName}</h2>
        <div className="books">
          {currentBooks.map((book, index) => (
            <BookCard 
              key={index} 
              book={book} 
              onEditClick={handleEditClick} 
              onDeleteClick={handleDeleteClick} 
            />
          ))}
        </div>
        <div className="pagination">
          {Array.from({ length: Math.ceil(filteredBooks.length / booksPerPage) }, (_, i) => (
            <button
              key={i + 1}
              className={currentPage === i + 1 ? "active" : ""}
              onClick={() => handlePageChange(i + 1)}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>
      {isEditOpen && (
        <EditBook
          isOpen={isEditOpen}
          onClose={() => setEditOpen(false)}
          onSave={handleSave}
          book={selectedBook}
        />
      )}
      {isDeleteOpen && (
        <DeleteBook
          isOpen={isDeleteOpen}
          onClose={() => setDeleteOpen(false)}
          onSave={handleSave}
          book={selectedBook}
        />
      )}
    </div>
  );
}

export default Allbooks;
