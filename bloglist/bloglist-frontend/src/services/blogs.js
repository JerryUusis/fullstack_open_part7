import axios from "axios";
const baseUrl = "/api/blogs";

let token = null;

const setToken = (newToken) => {
  token = `Bearer ${newToken}`;
};

const getAll = async () => {
  try {
    const request = await axios.get(baseUrl);
    return request.data;
  } catch (error) {
    console.error(error);
  }
};

const create = async (newObject) => {
  try {
    const config = {
      headers: { Authorization: token },
    };

    const response = await axios.post(baseUrl, newObject, config);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const update = async (newObject) => {
  try {
    const response = await axios.put(`${baseUrl}/${newObject.id}`, newObject);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const deleteBlog = async (id) => {
  try {
    const config = {
      headers: { Authorization: token },
    };
    const response = await axios.delete(`${baseUrl}/${id}`, config);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export default { getAll, create, setToken, update, deleteBlog };
