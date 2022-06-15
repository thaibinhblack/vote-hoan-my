const SERVICE = '/votesafety/v1/nhan-vien-khao-sat'

export default function makeServices(axios) {
  return {
    apiCreateNhanVienKhaoSat (data) {
      return axios.post(`${SERVICE}`, data)
    },

    apiGetNhanVienKhaoSat (params) {
      return axios.get(`${SERVICE}`, { params })
    }
  }
}