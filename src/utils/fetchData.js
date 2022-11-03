import axios from "axios";

export const getAPI = async (url, token) => {
  const res = await axios.get(
    `https://chat-app-backend-althaf.herokuapp.com/api/${url}`,
    {
      headers: { Authorization: token },
    }
  );
  return res;
};

export const postAPI = async (url, post, token) => {
  const res = await axios.post(
    `https://chat-app-backend-althaf.herokuapp.com/api/${url}`,
    post,
    {
      headers: { Authorization: token },
    }
  );
  return res;
};