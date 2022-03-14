const SERVICE = "/auth/v1/chuc-danh"

export default function makeServices(axios) {
  return {
    apiGetChucDanhAll() {
      return axios.get(`${SERVICE}`);
    },
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
      return axios.delete(`${SERVICE}/${par}`);
    },
    apiGetAll(par) {
      return axios.get(`${SERVICE}`, {
        params: par,
      });
    },
    apiGetById(id) {
      return axios.get(`${SERVICE}/${id}`);
    },
  }
}
