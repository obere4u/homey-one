import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Header from "./components/Header";
import Offers from "./pages/Offers";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import ForgotPassword from "./pages/ForgotPassword";
import  PrivateRoute from "./components/PrivateRoute";
import Profile from "./pages/Profile";
import CreateListing from "./pages/CreateListing";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import EditListing from "./pages/EditListing";



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
          <Route
            path="/profile"
            element={<PrivateRoute />}
          >
            <Route
              path="/profile"
              element={<Profile />}
            />
          </Route>
          {/* secures the profile path */}
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
          <Route
            path="/offers"
            element={<Offers />}
          />
          <Route path="/create-listing" element={<PrivateRoute />}>
            <Route
              path="/create-listing"
              element={<CreateListing />}
            />
          </Route>
          <Route path="/edit-listing" element={<PrivateRoute />}>
            <Route
              path="/edit-listing/:listingId"
              element={<EditListing />}
            />
          </Route>
          {/* secures the create listing  path */}
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

export default App
