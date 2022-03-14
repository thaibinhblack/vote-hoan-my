const SERVICE = "/auth/v1/tai-khoan-hospital";

export default function makeServices(axios) {
  return {
    apiInsert(item) {
      const par = JSON.stringify(item);
      return axios.post(`${SERVICE}`, par, {
        headers: {
          "content-type": "application/json",
        },
      });
    },
    apiGetByTaiKhoanId(id) {
      return axios.get(`${SERVICE}/${id}/tai-khoan-id`);
    },
  };
}
