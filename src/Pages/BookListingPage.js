import React, { useEffect, useMemo, useState } from "react";
import { defaultFilter } from "../constant";
import { Pagination } from "@material-ui/lab";
import bookService from "../service/BookService";
import categoryService from "../service/CategoriesService";
import shared from "../utils/shared";
import { toast } from "react-toastify";
import { useAuthContext } from "../context/auth";
import { useCartContext } from "../context/cart";

export const BookListing = () => {
  const [bookResponse, setBookResponse] = useState({
    pageIndex: 0,
    pageSize: 10,
    totalPages: 1,
    items: [],
    totalItems: 0,
  });
  const [categories, setCategories] = useState([]);
  const [sortBy, setSortBy] = useState();
  const [filters, setFilters] = useState(defaultFilter);
  const authContext = useAuthContext();
  const cartContext = useCartContext();

  useEffect(() => {
    getAllCategories();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (filters.keyword === "") delete filters.keyword;
      searchAllBooks({ ...filters });
    }, 500);
    return () => clearTimeout(timer);
  }, [filters]);

  const searchAllBooks = (filters) => {
    bookService.getAll(filters).then((res) => {
      setBookResponse(res.data.result);
    });
  };
  const getAllCategories = async () => {
    await categoryService.getAll().then((res) => {
      if (res) {
        setCategories(res.data.result);
      }
    });
  };
  
  const books = useMemo(() => {
    const bookList = [...bookResponse.items];
    if (bookList) {
      bookList.forEach((element) => {
        element.category = categories.find(
          (a) => a.id === element.categoryId
        )?.name;
      });
      return bookList;
    }
    return [];
  }, [categories, bookResponse]);

  const sortBooks = (e) => {
    setSortBy(e.target.value);
    const bookList = [...bookResponse.items];

    bookList.sort((a, b) => {
      if (a.name < b.name) {
        return e.target.value === "a-z" ? -1 : 1;
      }
      if (a.name > b.name) {
        return e.target.value === "a-z" ? 1 : -1;
      }
      return 0;
    });
    setBookResponse({ ...bookResponse, items: bookList });
  };

  const addToCart = (book) => {
    shared.addToCart(book, authContext.user.id).then((res) => {
      if (res.error) {
        toast.error(res.message);
      } else {
        toast.success(res.message);
        cartContext.updateCart();
      }
    });
  };

  return (
    <>
      <div className="container">
        <div className="book-list-head">
          <div className="row">
            <div className="col-3">
              <p className="book-listing-text">
                Book Listing Total - {bookResponse.totalItems} items
              </p>
            </div>
            <div className="col-9 d-flex justify-content-end mb-3">
              <input
                className=" Book-list-search"
                // className="Book-list-search "
                name="text"
                id="text"
                placeholder="Type to search..."
                onChange={(e) => {
                  setFilters({
                    ...filters,
                    keyword: e.target.value,
                    pageIndex: 1,
                  });
                }}
              />
              <div className="sortby">Sort by</div>
              <select
                className="sortby-select"
                onChange={sortBooks}
                value={sortBy}
              >
                <option value="a-z"> a - z</option>
                <option value="z-a"> z - a</option>
              </select>
            </div>
          </div>
          <div className=" row">
            {books.map((book, index) => (
              <div
                className="card col-3 ms-3 me-3 mt-4"
                style={{ width: "258px" }}
                key={index}
              >
                <img
                  src={book.base64image}
                  className="card-img-top mt-3"
                  style={{ height: "190px" }}
                  alt="img"
                />
                <div className="card-body">
                  <h5 className="card-title">{book.name}</h5>
                  <p className="card-text">{book.category}</p>
                  <p className="card-text">{book.description}</p>
                  <p className="price">MRP &#8377; {book.price}</p>
                  <button
                    className="add-cart-btn"
                    type="submit"
                    onClick={() =>addToCart(book)}
                  >
                    Add to cart
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="pagination-wrapper">
            <Pagination
              count={bookResponse.totalPages}
              page={filters.pageIndex}
              onChange={(e, newPage) => {
                setFilters({ ...filters, pageIndex: newPage });
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
};
