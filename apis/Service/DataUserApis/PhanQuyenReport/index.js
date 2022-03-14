const SERVICE = "/auth/v1/phan-quyen-report";

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
    apiUpdate(item) {
      const par = JSON.stringify(item);
      const config = {
        headers: {"content-type": "application/json"}
      };
      return axios.put(`${SERVICE}`, par, config);
    },
    apiDeletebyId(par) {
      return axios.delete(`${SERVICE}/id/${par}`);
    },
    apiGetAll() {
      return axios.get(`${SERVICE}`);
    },
    apiGetById(id) {
      return axios.get(`${SERVICE}/id/${id}`);
    },
    apiUpdatePhanQuyen(item) {
      const par = JSON.stringify(item);
      const config = {
        headers: {"content-type": "application/json"}
      };
      return axios.post(
        `${SERVICE}/update-phan-quyen`,
        par,
        config
      );
    },
    apiGetByPhanQuyenIdAndDuAnId(par) {
      return axios.get(`${SERVICE}`, {
        params: par
      });
    },
  };
}
