const SERVICE = '/votesafety/v1/nhan-vien'

export default function makeServices(axios) {
  return {
    apiGetNhanVien (params) {
      return axios.get(`${SERVICE}/thong-tin-nhan-vien`, { params })
    }
  }
}