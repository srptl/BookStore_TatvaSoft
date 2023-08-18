import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Login from "../Pages/Login";
import Register from "../Pages/Register";
import { RoutePaths } from "../utils/enum";
import { useAuthContext } from "../context/auth";
import { BookListing } from "../Pages/BookListingPage";
import Book from "../Pages/book";
import EditBook from '../Pages/book/editBook/index';
import User from "../Pages/User/User";
import EditUser from './../Pages/User/editUser/index';
import UpdateProfile from "../Pages/update-profile";
import Category from "../Pages/category";
import EditCategory from "../Pages/category/editCategory";
import Cart from "../Pages/cart";

export const MainNavigation = () => {
  const authContext = useAuthContext();
  const Redirect = <Navigate to={RoutePaths.Login} />;

  return (
    <Routes>
      {/* <Route path="/" element={<Login />} /> */}
      <Route exact path={RoutePaths.Login} element={<Login />} />
      <Route exact path={RoutePaths.Register} element={<Register />} />
      <Route exact path={RoutePaths.BookListing} element={<BookListing />} />
      <Route
        exact
        path={RoutePaths.Book}
        element={authContext.user.id ? <Book /> : Redirect}
      />
      <Route
        exact
        path={RoutePaths.EditBook}
        element={authContext.user.id ? <EditBook /> : Redirect}
      />
      <Route
        exact
        path={RoutePaths.AddBook}
        element={authContext.user.id ? <EditBook /> : Redirect}
      />
      <Route
        exact
        path={RoutePaths.User}
        element={authContext.user.id ? <User /> : Redirect}
      />
      <Route
        exact
        path={RoutePaths.EditUser}
        element={authContext.user.id ? <EditUser /> : Redirect}
      />
      <Route
        exact
        path={RoutePaths.UpdateProfile}
        element={authContext.user.id ? <UpdateProfile /> : Redirect}
      />
      <Route
        exact
        path={RoutePaths.Category}
        element={authContext.user.id ? <Category /> : Redirect}
      />
      <Route
        exact
        path={RoutePaths.EditCategory}
        element={authContext.user.id ? <EditCategory /> : Redirect}
      />
      <Route
        exact
        path={RoutePaths.AddCategory}
        element={authContext.user.id ? <EditCategory /> : Redirect}
      />
      <Route
        exact
        // path={"/demo"}
        path={RoutePaths.Cart}
        element={authContext.user.id ? <Cart /> : Redirect}
      />

    </Routes>

  );
};
