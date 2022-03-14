const resource = "menu";
const SERVICE = "/auth/v1";

export default function makeServices(axios) {
  return {
    apiInsert(item) {
      const par = JSON.stringify(item);
      return axios.post(`${SERVICE}/${resource}`, par, {
        headers: {
          "content-type": "application/json"
        }
      });
    },
    apiInsertFromDuAn(item) {
      const par = JSON.stringify(item);
      return axios.post(`${SERVICE}/${resource}/clone`, par, {
        headers: {
          "content-type": "application/json"
        }
      });
    },
    apiUpdate(item) {
      const par = JSON.stringify(item);
      const config = {
        headers: {"content-type": "application/json"}
      };
      return axios.put(`${SERVICE}/${resource}`, par, config);
    },
    apiDeletebyId(par) {
      return axios.delete(`${SERVICE}/${resource}/${par}`);
    },
    apiGetAll() {
      return axios.get(`${SERVICE}/${resource}`);
    },

    apiGetbyId(id) {
      return axios.get(`${SERVICE}/${resource}/id/${id}`);
    },
    apiMenuTheoPhanQuyenId(phanQuyenId) {
      return axios.get(
        `${SERVICE}/${resource}/phan-quyen?phanQuyenId=${phanQuyenId}`
      );
    },
    getMenuByDuanId(id) {
      return axios.get(
        `${SERVICE}/${resource}/du-an?duAnId=${id}`
      );
    },
    apiMenuTheoPhanQuyenIdAndDuAnId(par) {
      return axios.get(`${SERVICE}/${resource}/phan-quyen`, {
        params: par,
      });
    },
    apiCheckRole(par) {
      return axios.get(`${SERVICE}/${resource}/check-role`, {
        params: par
      });
    },
  };
}
