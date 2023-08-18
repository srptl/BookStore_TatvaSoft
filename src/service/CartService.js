import axios from "axios";
import { url } from "../constant";

const ENDPOINT = `${url}api/cart`;

const add = async (data) => {
    const url = `${ENDPOINT}`;
    return axios
        .post(url, data)
        .then((res) => {
            return res.data.result;
        })
        .catch((e) => {
            return Promise.reject(e.response);
        });
};

const getList = async (id) => {
    const url = `${ENDPOINT}?userId=${id}`;
    return axios.get(url).then((res) => {
        return res;
    });
};

const updateItem = async (data) => {
    const url = `${ENDPOINT}`;
    return axios
        .put(url, data)
        .then((res) => {
            return res.data.result;
        })
        .catch((e) => {
            return Promise.reject(e);
        });
};

const removeItem = async (id) => {
    const url = `${ENDPOINT}?id=${id}`;
    return axios
        .delete(url)
        .then((res) => {
            return res.data.result;
        })
        .catch((e) => {
            return e;
        });
};

const cartService = { add, getList, updateItem, removeItem };

export default cartService;
