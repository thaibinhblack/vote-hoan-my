const SERVICE = '/votesafety/v1/phien-ban-khao-sat'

export default function makeServices(axios) {
  return {
    apiGetPhienBanKhaoSat (params) {
      return axios.get(`${SERVICE}`, { params })
    },

    apiGetPhienBanById (params) {
      return axios.get(`${SERVICE}/${params.id}/${params.language}`,)
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

    apiDeletePhienBanById (id) {
      return axios.delete(`${SERVICE}/${id}`)
    }
  }
}