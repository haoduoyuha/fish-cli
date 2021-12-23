// 通过 axios 处理请求
const axios = require("axios");

axios.interceptors.response.use(
  (res) => {
    console.log("success");
    return res.data;
  },
  (err) => {
    console.log("err");
  }
);

module.exports = axios;
