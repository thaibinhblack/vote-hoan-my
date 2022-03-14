const SERVICE = "/auth/v1/phan-quyen"

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
        headers: {'content-type': 'application/json'}
      }
      return axios.put(`${SERVICE}`, par, config);
    },
    apiDeletebyId(par) {
      return axios.delete(`${SERVICE}/id/${par}`);
    },
    apiGetAll(par) {
      return axios.get(`${SERVICE}`, {params: par});
    },
    apiGetByAdmin(par) {

      return axios.get(`${SERVICE}/admin/${params}`);
    },

  }
}
