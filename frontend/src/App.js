import Home from './Pages/Home';
import Signin from './Pages/Signin';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import MemberDashboard from './Pages/Dashboard/MemberDashboard/MemberDashboard.js';
import Allbooks from './Pages/Allbooks';
import Header from './Components/Header';
import AdminDashboard from './Pages/Dashboard/AdminDashboard/AdminDashboard.js';
import { useContext, useEffect } from "react";
import { AuthContext } from "./Context/AuthContext.js";
import BookDetails from './Pages/Bookdetails.jsx';

function App() {
  const { user } = useContext(AuthContext);

  useEffect(() => {}, [user]);

  return (
    <Router>
      <Header user={user} />
      <div className="App">
        <Routes>
          {/* Home Route */}
          <Route path="/" element={<Home />} />

          {/* Sign In Route */}
          <Route
            path="/signin"
            element={
              user ? (
                user.isAdmin ? (
                  <Navigate to="/dashboard@admin" />
                ) : (
                  <Navigate to="/dashboard@member" />
                )
              ) : (
                <Signin />
              )
            }
          />

          {/* Member Dashboard Route */}
          <Route
            path="/dashboard@member"
            element={
              user ? (
                user.isAdmin === false ? (
                  <MemberDashboard />
                ) : (
                  <Navigate to="/" />
                )
              ) : (
                <Navigate to="/" />
              )
            }
          />

          {/* Admin Dashboard Route */}
          <Route
            path="/dashboard@admin"
            element={
              user ? (
                user.isAdmin === true ? (
                  <AdminDashboard />
                ) : (
                  <Navigate to="/" />
                )
              ) : (
                <Navigate to="/" />
              )
            }
          />

          {/* All Books Route */}
          <Route path="/books" element={<Allbooks />} />
          <Route path="/books/:id" element={<BookDetails />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
