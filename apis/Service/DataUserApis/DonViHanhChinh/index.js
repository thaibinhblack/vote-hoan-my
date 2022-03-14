const resource = "donvihanhchinh";
const SERVICE = "/auth/v1";

export default function makeServices(axios) {
  return {
    apiDonViHanhChinh_TheoCap(id) {
      return axios.get(`${SERVICE}/${resource}/cap/${id}`);
    },
    apiDonViHanhChinh_ParentId(id) {
      return axios.get(`${SERVICE}/${resource}/parentid/${id}`);
    }
  };
}
