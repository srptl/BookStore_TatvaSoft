import React, { useEffect, useMemo, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { headerStyle } from "./HeaderStyle";
import List from "@material-ui/core/List";
import AppBar from "@material-ui/core/AppBar";
import ListItem from "@material-ui/core/ListItem";
import cartIcon from "../assets/images/cart.png";
import searchIcon from "../assets/images/search.png";
import { TextField, Button } from "@material-ui/core";
import Shared from "../utils/shared";
import { useAuthContext } from "../context/auth";
import { RoutePaths } from "../utils/enum";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import bookService from "../service/BookService";
import { useCartContext } from "../context/cart";
import cartService from "../service/CartService";

const Header = () => {
  const classes = headerStyle();
  const authContext = useAuthContext();
  const cartContext = useCartContext();
  // const [open, setOpen] = useState(false);
  const open = false;
  const [query, setquery] = useState("");
  const [bookList, setbookList] = useState([]);
  const [openSearchResult, setOpenSearchResult] = useState(false);

  const navigate = useNavigate();

  // for  mobile menu
  const openMenu = () => {
    document.body.classList.toggle("open-menu");
  };

  const items = useMemo(() => {
    return Shared.NavigationItems.filter(
      (item) =>
        !item.access.length || item.access.includes(authContext.user.roleId)
    );
  }, [authContext.user]);

  const logOut = () => {
    authContext.signOut();
    cartContext.emptyCart();
  };

  const searchBook = async () => {
    const res = await bookService.searchBook(query);
    setbookList(res.data.result);
  };

  const search = () => {
    document.body.classList.add("search-results-open");
    searchBook();
    setOpenSearchResult(true);
  };

  const addToCart = (book) => {
    if (!authContext.user.id) {
      navigate(RoutePaths.Login);
      toast.error("Please login before adding books to cart");
    } else {
      Shared.addToCart(book, authContext.user.id).then((res) => {
        if (res.error) {
          toast.error(res.error);
        } else {
          toast.success("Item added in cart");
          cartContext.updateCart();
        }
      });
    }
  };

  
  const [itemsInCart, setItemsInCart] = useState(0);
  const updateCart = (updatedCartList) => {
      cartService.getList(authContext.user.id).then((res) => setItemsInCart(res.data.result.length));
  };

  useEffect(() => {
    updateCart()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cartService.getList(authContext.user.id)]);

  return (
    <div className={classes.headerWrapper}>
      <AppBar className="site-header" id="header" position="static">
        <div
          className="top-header"
          style={{ display: open ? "none" : "block" }}
        ></div>
        <div className="bottom-header">
          <div className="container">
            <div className="header-wrapper">
              <div
                className="logo-wrapper">
                <NavLink to="/"
                  // className="site-logo"
                  style={{
                    color: "black"
                  }}
                  title="logo">
                  {/* <img src={siteLogo} alt="logo" /> */}
                  <h1>Book Store</h1>
                </NavLink>
              </div>
              <div className="nav-wrapper">
                <div className="top-right-bar">
                  <List className="top-nav-bar">
                    {!authContext.user.id && (
                      <>
                        <ListItem>
                          <NavLink to={RoutePaths.Login} title="Login">
                            Login
                          </NavLink>
                        </ListItem>
                        <ListItem>
                          <NavLink to={RoutePaths.Register} title="Register">
                            Register
                          </NavLink>
                        </ListItem>
                      </>
                    )}
                    {items.map((item, index) => (
                      <ListItem key={index}>
                        <NavLink to={item.route} title={item.name}>
                          {item.name}
                        </NavLink>
                      </ListItem>
                    ))}
                  </List>
                  <List className="cart-country-wrap">
                    <ListItem className="cart-link">
                      <NavLink to="/cart" title="Cart">
                        <img src={cartIcon} alt="cart.png" />
                        <span>{itemsInCart}</span>
                        Cart
                      </NavLink>
                    </ListItem>
                    <ListItem className="hamburger" onClick={openMenu}>
                      <span></span>
                    </ListItem>
                  </List>

                  {authContext.user.id && (
                    <List className="right">
                      <Button onClick={() => logOut()} variant="outlined">
                        Log out
                      </Button>
                    </List>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          className="search-overlay"
          onClick={() => {
            setOpenSearchResult(false);
            document.body.classList.remove("search-results-open");
          }}
        ></div>
        <div className="header-search-wrapper">
          <div className="container">
            <div className="header-search-outer">
              <div className="header-search-inner">
                <div className="text-wrapper">
                  <TextField
                    id="text"
                    name="text"
                    placeholder="What are you looking for..."
                    variant="outlined"
                    value={query}
                    onChange={(e) => setquery(e.target.value)}
                  />

                  {openSearchResult && (
                    <>
                      <div className="product-listing">
                        {bookList?.length === 0 && (
                          <p className="no-product">No product found</p>
                        )}

                        {/* <p className="loading">Loading....</p> */}
                        <List className="related-product-list">
                          {bookList?.length > 0 &&
                            bookList.map((item, i) => {
                              return (
                                <ListItem key={i}>
                                  <div className="inner-block">
                                    <div className="left-col">
                                      <span className="title">{item.name}</span>
                                      <p>{item.description}</p>
                                    </div>
                                    <div className="right-col">
                                      <span className="price">
                                        {item.price}
                                      </span>
                                      <Link onClick={() => addToCart(item)}>
                                        Add to cart
                                      </Link>
                                    </div>
                                  </div>
                                </ListItem>
                              );
                            })}
                        </List>
                      </div>
                    </>
                  )}
                </div>
                <Button
                  type="submit"
                  className="green-btn btn"
                  variant="contained"
                  color="primary"
                  disableElevation
                  onClick={search}
                >
                  <em>
                    <img src={searchIcon} alt="search" />
                  </em>
                  Search
                </Button>
              </div>
            </div>
          </div>
        </div>
      </AppBar>
    </div>
  );
};

export default Header;
