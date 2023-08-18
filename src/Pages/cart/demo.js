import React, { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { useAuthContext } from "../../context/auth";
import { cartStyle } from "./style";
import { Typography, Button, Link } from "@material-ui/core";
import cartService from "../../service/CartService";
import orderService from "../../service/OrderService";
import Shared from "../../utils/shared";
import { useNavigate } from "react-router-dom";

const Demo = () => {
    const initialCartDetails = {
        cartData: [],
        updateCart: () => { },
        emptyCart: () => { },
    };

    // const cartContext = createContext(initialCartDetails);
    const authContext = useAuthContext();
    const navigate = useNavigate();
    const [cartList, setCartList] = useState([]);
    const [itemsInCart, setItemsInCart] = useState(0);
    const [totalPrice, setTotalPrice] = useState(0);

    const classes = cartStyle();


    const CartWrapper = ({ children }) => {
        const [cartData, setCartData] = useState([]);

        const emptyCart = () => {
            setCartData([]);
        };

        const updateCart = (updatedCartList) => {
            if (updatedCartList) {
                setCartData(updatedCartList);
            } else if (authContext.user.id) {
                cartService.getList(authContext.user.id).then((res) => setCartData(res));
            }
        };

        useEffect(() => {
            updateCart();
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [authContext.user.id]);

        const getTotalPrice = (itemList) => {
            let totalPrice = 0;
            itemList.forEach((item) => {
                const itemPrice = item.quantity * parseInt(item.book.price);
                totalPrice = totalPrice + itemPrice;
            });
            setTotalPrice(totalPrice);
        };

        useEffect(() => {
            setCartList(cartData);
            setItemsInCart(cartData.length);
            getTotalPrice(cartData);
        }, [cartData]);

        const removeItem = async (id) => {
            try {
                const res = await cartService.removeItem(id);
                if (res) {
                    updateCart();
                }
            } catch (error) {
                toast.error("Something went wrong!");
            }
        };

        const updateQuantity = async (cartItem, inc) => {
            const currentCount = cartItem.quantity;
            const quantity = inc ? currentCount + 1 : currentCount - 1;
            if (quantity === 0) {
                toast.error("Item quantity should not be zero");
                return;
            }

            try {
                const res = await cartService.updateItem({
                    id: cartItem.id,
                    userId: cartItem.userId,
                    bookId: cartItem.book.id,
                    quantity,
                });
                if (res) {
                    const updatedCartList = cartList.map((item) =>
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
                const userCart = await cartService.getList(authContext.user.id);
                if (userCart.length) {
                    try {
                        let cartIds = userCart.map((element) => element.id);
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
                        My Shopping Bag ({cartList.length} Items)
                    </Typography>
                    <div className="total-price">Total price: {totalPrice}</div>
                </div>
                <div className="cart-list-wrapper">
                    {cartList.map((cartList) => {
                        return (
                            <div className="cart-list-item" key={cartList.id}>
                                <div className="cart-item-img">
                                    <Link>
                                        <img src={cartList.book.base64image} alt="dummy-pic" />
                                    </Link>
                                </div>
                                <div className="cart-item-content">
                                    <div className="cart-item-top-content">
                                        <div className="cart-item-left">
                                            <p className="brand">{cartList.book.name}</p>
                                            <Link>Cart item name</Link>
                                        </div>
                                        <div className="price-block">
                                            <span className="current-price">
                                                MRP &#8377; {cartList.book.price}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="cart-item-bottom-content">
                                        <div className="qty-group">
                                            <Button
                                                className="btn pink-btn"
                                                onClick={() => updateQuantity(cartList, true)}
                                            >
                                                +
                                            </Button>
                                            <span className="number-count">{cartList.quantity}</span>
                                            <Button
                                                className="btn pink-btn"
                                                onClick={() => updateQuantity(cartList, false)}
                                            >
                                                -
                                            </Button>
                                        </div>
                                        <Link onClick={() => removeItem(cartList.id)}>Remove</Link>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
                <div className="btn-wrapper">
                    <Button className="btn pink-btn" onClick={placeOrder}>
                        Place order
                    </Button>
                </div>
            </div>
        </div>
        )
    }
}
export default Demo;