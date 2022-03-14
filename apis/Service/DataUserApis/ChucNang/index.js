const resource = "chuc-nang";
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
    apiChucNangTheoPhanQuyenId(phanQuyenId) {
      return axios.get(
        `${SERVICE}/${resource}/phan-quyen?phanQuyenId=${phanQuyenId}`
      );
    },
    getChucNangByDuanId(id) {
      return axios.get(
        `${SERVICE}/${resource}/du-an?duAnId=${id}`
      );
    },
    apiChucNangTheoPhanQuyenIdAndDuAnId(phanQuyenId, duAnId) {
      return axios.get(
        `${SERVICE}/${resource}/phan-quyen?phanQuyenId=${phanQuyenId}&duAnId=${duAnId}`
      );
    },
    apiCheckRole(par) {
      return axios.get(`${SERVICE}/${resource}/check-role`, {
        params: par
      });
    },
  };
}
