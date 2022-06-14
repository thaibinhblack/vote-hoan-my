const SERVICE = '/phien-ban-khao-sat'

export default function makeServices(axios) {
  return {
    apiGetPhienBanKhaoSat (params) {
      return axios.get(`${SERVICE}`, { params })
    },

    apiGetPhienBanById (id) {
      return axios.get(`${SERVICE}/${id}`)
    },

    apiCreatePhienBanKhaoSat (data) {
      return axios.post(`${SERVICE}`, data)
    },

    apiUpdatePhienBanKhaoSat (data) {
      return axios.put(`${SERVICE}`, data)
    },

    apiDeletePhienBan (data) {
      return axios.put(`${SERVICE}/delete`, data)
    },
  }
}