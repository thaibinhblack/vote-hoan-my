const SERVICE = "/auth/v1/report";

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
    apiInsertFromDuAn(item) {
      const par = JSON.stringify(item);
      return axios.post(`${SERVICE}/clone`, par, {
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
      return axios.delete(`${SERVICE}/${par}`);
    },
    apiGetAll() {
      return axios.get(`${SERVICE}`);
    },
    apiGetByQuery(par) {
      return axios.get(`${SERVICE}`, {
        params: par,
      });
    },
    apiGetbyId(id) {
      return axios.get(`${SERVICE}/id/${id}`);
    },
    apiReportTheoPhanQuyen(par) {
      return axios.get(`${SERVICE}/phan-quyen`, {
        params: par,
      });
    },

    getReportByDuanId(id) {
      return axios.get(
        `${SERVICE}?duAnId=${id}`
      );
    },
    apiReportTheoPhanQuyenIdAndDuAnId(par) {
      return axios.get(`${SERVICE}/phan-quyen`, {
        params: par,
      });
    },
    apiCheckRole(par) {
      return axios.get(`${SERVICE}/check-role`, {
        params: par
      });
    },
  };
}
