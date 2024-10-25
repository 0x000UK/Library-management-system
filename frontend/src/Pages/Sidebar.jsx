// Sidebar.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Sidebar.css";

function Sidebar({ onCategorySelect }) {
  const API_URL = process.env.REACT_APP_API_URL;
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(API_URL + "api/categories/allcategories");
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, [API_URL]);

  return (
    <div className="sidebar-comp">
      <h3>Categories</h3>
      <ul className="category-list">
        <li onClick={() => onCategorySelect(null,"All Books")}>All Books</li>
        {categories.map((category) => (
          <li key={category._id} onClick={() => onCategorySelect(category._id, category.categoryName)}>
            {category.categoryName} ({category.books.length})
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Sidebar;
