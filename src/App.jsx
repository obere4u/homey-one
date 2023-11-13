import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Header from "./components/Header";
import Offers from "./pages/Offers";
import SignIn from "./pages/SignIn";
import ForgotPassword from "./pages/ForgotPassword";
import PrivateRoute from "./components/PrivateRoute";
import Profile from "./pages/Profile";
import CreateListing from "./pages/CreateListing";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import EditListing from "./pages/EditListing";
import Listing from "./pages/Listing";
import Category from "./pages/Category";
import SignUp from "./pages/SignUp";

function App() {
  return (
    <>
      <Router>
        <Header />
        <Routes>
          <Route
            path="/"
            element={<Home />}
          />

          {/* Profile Routes */}
          <Route
            path="/profile/*"
            element={<PrivateRoute />}
          >
            <Route
              index
              element={<Profile />}
            />
          </Route>

          {/* Authentication Routes */}
          <Route
            path="/sign-in"
            element={<SignIn />}
          />
          <Route
            path="/sign-up"
            element={<SignUp />}
          />
          <Route
            path="/forgot-password"
            element={<ForgotPassword />}
          />

          {/* Other Routes */}
          <Route
            path="/offers"
            element={<Offers />}
          />
          <Route
            path="/category/:categoryName"
            element={<Category />}
          />
          <Route
            path="/category/:categoryName/:listingId"
            element={<Listing />}
          />

          {/* Create Listing Route */}
          <Route
            path="/create-listing/*"
            element={<PrivateRoute element={<CreateListing />} />}
          />

          {/* Edit Listing Route */}
          <Route
            path="/edit-listing/:listingId/*"
            element={<PrivateRoute element={<EditListing />} />}
          />
        </Routes>
      </Router>
      <ToastContainer
        position="top-center"
        autoClose={1500}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </>
  );
}

export default App;
