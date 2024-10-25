import React, { useEffect, useState ,useContext} from 'react';
import { AuthContext } from '../Context/AuthContext';
import './bookCard.css'
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from '@mui/icons-material/Edit';
import BookIcon from '@mui/icons-material/Book';
import { useNavigate } from 'react-router-dom';

function BookCard({ book, onEditClick, onDeleteClick}) {
  const [isAdmin, setIsAdmin] = useState(false);
  const { user } = useContext(AuthContext);
  useEffect(() => {
    if (user?.isAdmin=== true) {
      setIsAdmin(true);
    }
  }, [user]);

  const navigate = useNavigate();

  const handleClick = () => {
    // Navigate to the book details page when the image is clicked
    navigate(`/books/${book._id}`);
  };

  return (
    <div className="book-card">
        <div className='image-card-container'>
            <img src={book.bookImage} alt={book.bookName} />
        </div>
      <div className="book-card-body">
        <p className="book-card-category">{book.categories[0]?.categoryName}</p>
        <p className="book-card-title">{book.bookName}</p>
        <p className="book-card-author">{book.author}</p>
        <div className="book-card-actions">
          <Tooltip title="book">
              <IconButton onClick={handleClick}>
                <BookIcon fontSize='small' className='btn-icons'/>
              </IconButton>
          </Tooltip>
          
          {isAdmin && (
            <>
              <Tooltip title="card-edit">
                  <IconButton onClick={() => onEditClick(book)}>
                      <EditIcon fontSize='small' className='btn-icons'/>
                  </IconButton>
              </Tooltip>
              <Tooltip title="Delete">
                  <IconButton onClick={() => onDeleteClick(book)}>
                      <DeleteIcon fontSize='small'  className='btn-icons delete' />
                  </IconButton>
              </Tooltip>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default BookCard;
