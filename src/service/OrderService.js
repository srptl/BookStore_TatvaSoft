import axios from "axios";
import { url } from "../constant";

const ENDPOINT = `${url}api/order`;

const placeOrder = async (order) => {
  const url = `${ENDPOINT}`;
  return axios
    .post(url, order)
    .then((res) => {
      return res;
    })
    .catch((e) => {
      return Promise.reject(e);
    });
};

const orderService = { placeOrder };

export default orderService;