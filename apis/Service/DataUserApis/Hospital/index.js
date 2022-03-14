const SERVICE = "/auth/v1/hospital";

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
    apiUpdateInfo(item) {
      const par = JSON.stringify(item);
      const config = {
        headers: {"content-type": "application/json"}
      };
      return axios.put(`${SERVICE}/hospital-info`, par, config);
    },
    apiDeletebyId(par) {
      return axios.delete(`${SERVICE}?hospitalId=${par}`);
    },
    apiGetAll(par) {
      return axios.get(`${SERVICE}`, {
        params: par
      });
    },
    apiGetById(id) {
      return axios.get(`${SERVICE}/${id}`);
    },
    apiGetbyReportDisplay() {
      return axios.get(`${SERVICE}/report`);
    },
    apiGetAllByListId(par) {
      return axios.get(`${SERVICE}/query`, {
        params: par
      });
    },
    apiGetAllByTaiKhoanId(par) {
      return axios.get(`${SERVICE}/auth`, {
        params: par
      });
    },

  };
}
