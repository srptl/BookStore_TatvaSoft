import React, { useEffect, useState } from 'react'
import cartService from '../../service/CartService'
import { useAuthContext } from '../../context/auth'
import { toast } from "react-toastify";
import { cartStyle } from "./style";
import { Typography, Button, Link } from "@material-ui/core";
import orderService from "../../service/OrderService";
import Shared from "../../utils/shared";
import { useNavigate } from "react-router-dom";

function Cart() {
  const classes = cartStyle();
  const navigate = useNavigate();
  const authContext = useAuthContext();
  // const CartContext = useCartContext();
  const [cartData, setCartData] = useState([]);
  const [itemsInCart, setItemsInCart] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);

  const emptyCart = () => {
    setCartData([]);
  };

  const updateCart = (updatedCartList) => {
    if (updatedCartList) {
      setCartData(updatedCartList);
    } else if (authContext.user.id) {
      cartService.getList(authContext.user.id).then((res) => setCartData(res.data.result));
    }
  };

  useEffect(() => {
    updateCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authContext.user.id]);

  useEffect(() => {
    setItemsInCart(cartData.length);
    getTotalPrice(cartData);
  }, [cartData]);

  const getTotalPrice = (itemList) => {
    let totalPrice = 0;
    itemList.forEach((item) => {
      const itemPrice = item.quantity * parseInt(item.book.price);
      totalPrice = totalPrice + itemPrice;
    });
    setTotalPrice(totalPrice);
  };

  const removeItem = (id) => {
    try {
      const res = cartService.removeItem(id);
      if (res) {
        toast.success("Removed successfully")
        updateCart();
      }
    } catch (error) {
      toast.error("Something went wrong!");
    }
  };

  const updateQuantity = (cartItem, inc) => {
    const currentCount = cartItem.quantity;
    const quantity = inc ? currentCount + 1 : currentCount - 1;
    if (quantity === 0) {
      toast.error("Item quantity should not be zero");
      return;
    }

    try {
      const res =  cartService.updateItem({
        id: cartItem.id,
        userId: cartItem.userId,
        bookId: cartItem.book.id,
        quantity,
      });
      if (res) {
        const updatedCartList = cartData.map((item) =>
          item.id === cartItem.id ? { ...item, quantity } : item
        );
        updateCart(updatedCartList);
        const updatedPrice =
          totalPrice +
          (inc
            ? parseInt(cartItem.book.price)
            : -parseInt(cartItem.book.price));
        setTotalPrice(updatedPrice);
      }
    } catch (error) {
      toast.error("Something went wrong!");
    }
  };

  const placeOrder = async () => {
    if (authContext.user.id) {
      // const userCart = await cartService.getList(authContext.user.id);
      if (cartData.length) {
        try {
          let cartIds = cartData.map((element) => element.id);
          const newOrder = {
            userId: authContext.user.id,
            cartIds,
          };
          const res = await orderService.placeOrder(newOrder);
          if (res) {
            updateCart();
            navigate("/");
            toast.success(Shared.messages.ORDER_SUCCESS);
          }
        } catch (error) {
          toast.error(`Order cannot be placed ${error}`);
        }
      } else {
        toast.error("Your cart is empty");
      }
    }
  };


  return (
    
    <div className={classes.cartWrapper}>
      <div className="container">
        <Typography variant="h1">Cart page</Typography>
        <div className="cart-heading-block">
          <Typography variant="h2">
            My Shopping Bag (
            {cartData.length}
            Items)
          </Typography>
          <div className="total-price">Total price: {totalPrice}</div>
        </div>
        <div className="cart-list-wrapper">
          {cartData.map((cartData) => {
            return (
              <div className="cart-list-item" key={cartData.id}>
                <div className="cart-item-img">
                  <Link>
                    <img src={cartData.book.base64image} alt="dummy-pic" />
                  </Link>
                </div>
                <div className="cart-item-content">
                  <div className="cart-item-top-content">
                    <div className="cart-item-left">
                      <p className="brand">{cartData.book.name}</p>
                      <Link>Cart item name</Link>
                    </div>
                    <div className="price-block">
                      <span className="current-price">
                        MRP &#8377; {cartData.book.price}
                      </span>
                    </div>
                  </div>
                  <div className="cart-item-bottom-content">
                    <div className="qty-group">
                      <Button
                        className="btn pink-btn"
                        onClick={() => {
                          updateQuantity(cartData, true)
                        }
                        }
                      >
                        +
                      </Button>
                      <span className="number-count">{cartData.quantity}</span>
                      <Button
                        className="btn pink-btn"
                        onClick={() => {
                          updateQuantity(cartData, false)
                        }}
                      >
                        -
                      </Button>
                    </div>
                    <Link onClick={() => {
                      removeItem(cartData.id)
                    }}>Remove</Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div 
        
        className="btn-wrapper">
          <button
          style={{
            backgroundColor:"#f14d54"
          }}
          onClick={placeOrder}
          >
            Place order
          </button>
        </div>
      </div>
    </div>
  )
}

export default Cart