const SERVICE = "/auth/v1";
const resource = "danh-muc-du-an";

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
        headers: { "content-type": "application/json" }
      };
      return axios.put(`${SERVICE}/${resource}`, par, config);
    },
    apiDeletebyId(par) {
      return axios.delete(`${SERVICE}/${resource}/id/${par}`);
    },
    apiGetAll() {
      return axios.get(`${SERVICE}/${resource}`);
    },
    apiGetbyId(id) {
      return axios.get(`${SERVICE}/${resource}/id/${id}`);
    },

  };
}
