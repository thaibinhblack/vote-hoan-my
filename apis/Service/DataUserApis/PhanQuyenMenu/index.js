const resource = "phan-quyen-menu";
const SERVICE = "/auth/v1";

export default function makeServices(axios) {
  return {
    apiInsert(item) {
      const par = JSON.stringify(item);
      return axios.post(`${SERVICE}/${resource}`, par, {
        headers: {
          "content-type": "application/json",
        },
      });
    },
    apiGetByPhanQuyenIdAndDuAnId(par) {
      return axios.get(`${SERVICE}/${resource}`, {
        params: par
      });
    },
  };
}
