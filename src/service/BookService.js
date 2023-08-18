import axios from "axios";
import { url } from "../constant";

const ENDPOINT = `${url}api/book`;

const searchBook = async (keyword) => {
  const url = `${ENDPOINT}/search?keyword=${keyword}`;
  return axios.get(url).then((res) => {
    return res;
  });
};
const getAll = async (params) => {
  const url = `${ENDPOINT}`;
  return axios.get(url, { params }).then((res) => {
    return res;
  });
};
const getById = async (id) => {
  const url = `${ENDPOINT}/byId?id=${id}`;
  return axios.get(url).then((res) => {
    return res;
  });
};

const deleteBook = async (id) => {
  const url = `${ENDPOINT}?id=${id}`;
  return axios.delete(url).then((res) => {
    return res;
  });
};
const save = async (data) => {
  if (data.id) {
    const url = `${ENDPOINT}`;
    return axios.put(url, data).then((res) => {
      return res;
    });
  } else {
    const url = `${ENDPOINT}`;
    return axios.post(url, data).then((res) => {
      return res;
    });
  }
};

const bookService = { searchBook , deleteBook ,getAll ,getById ,save};

export default bookService;
