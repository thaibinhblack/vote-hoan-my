const SERVICE = '/votesafety/v1/cau-hoi'

export default function makeServices(axios) {
  return {
    apiCreateCauHoi (data) {
      return axios.post(`${SERVICE}`, data)
    },

    apiGetCauHoi (params) {
      return axios.get(`${SERVICE}`, { params })
    },

    apiUpdateCauHoi (data) {
      return axios.put(`${SERVICE}`, data)
    },

    apiDeleteCauHoi (id) {
      return axios.delete(`${SERVICE}/${id}`)
    }
  }
}