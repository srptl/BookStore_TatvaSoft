import axios from "axios";
import { url } from "../constant";

const ENDPOINT = `${url}api/category`;

const getAll = async (params) => {
  let url = `${ENDPOINT}/all`;
  if (params) {
    url = `${ENDPOINT}`;
  }
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

const deleteCategory = async (id) => {
    const url = `${ENDPOINT}?id=${id}`;
    return axios.delete(url).then((res) => {
        return res;
    });
};

const save = async (data) => {
    if (data.id) {
        const url = `${ENDPOINT}`;
        return axios.put(url, data).then((res) => {
            return res.data.detail;
        });
    } else {
        const url = `${ENDPOINT}`;
        return axios.post(url, data).then((res) => {
            return res.data.detail;
        });
    }
};

const categoryService = { getAll, getById, deleteCategory, save };

export default categoryService;
