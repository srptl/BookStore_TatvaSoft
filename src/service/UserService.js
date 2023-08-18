import axios from "axios";
import { url } from "../constant";

const ENDPOINT = `${url}api/user`;

const getAllUser = async (params) => {
    const url = `${ENDPOINT}`;
    return axios.get(url , {params}).then((res) => {
        return res;
      });
}
const deleteUser = async (id) => {
    const url = `${ENDPOINT}?id=${id}`;
    return axios.delete(url).then((res) => {
      return res;
    });
  };

  const getUserById = async (id) => {
    const url = `${ENDPOINT}/byId?id=${id}`;
    return axios.get(url).then((res) => {
      return res;
    });
  };

  const update = async (data) => {
    const url = `${ENDPOINT}`;
    return axios.put(url, data).then((res) => {
      return res;
    })
  }

  const getAllRoles = async () => {
    const url = `${ENDPOINT}/roles`;
    return axios.get(url).then((res) => {return res})
  }

const userService = {getAllUser , deleteUser ,getUserById , getAllRoles , update};

export default userService;