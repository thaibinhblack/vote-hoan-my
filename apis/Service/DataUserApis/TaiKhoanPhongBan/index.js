const SERVICE = "/auth/v1/tai-khoan-phong-ban";

export default function makeServices(axios) {
  return {
    apiInsert(item) {
      const par = JSON.stringify(item);
      return axios.post(`${SERVICE}`, par, {
        headers: {
          "content-type": "application/json"
        }
      });
    },
    apiInsertArray(item) {
      const par = JSON.stringify(item);
      return axios.post(`${SERVICE}/array`, par, {
        headers: {
          "content-type": "application/json"
        }
      });
    },
    apiUpdate(item) {
      const par = JSON.stringify(item);
      const config = {
        headers: { "content-type": "application/json" }
      };
      return axios.put(`${SERVICE}`, par, config);
    },
    apiDeletebyId(par) {
      return axios.delete(`${SERVICE}/${par}`);
    },
    apiDeletebyTaiKhoanId(par) {
      return axios.delete(`${SERVICE}/${par}/tai-khoan-id`);
    },
    apiGetAll() {
      return axios.get(`${SERVICE}`);
    },
    apiGetById(id) {
      return axios.get(`${SERVICE}/${id}`);
    },
    apiGetByTaiKhoanId(id) {
      return axios.get(`${SERVICE}/${id}/tai-khoan-id`);
    },
  };
}
