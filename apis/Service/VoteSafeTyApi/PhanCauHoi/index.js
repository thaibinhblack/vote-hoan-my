const SERVICE = '/votesafety/v1/phan-cau-hoi'

export default function makeServices(axios) {
  return {
    apiCreatePhanCauHoi (data) {
      return axios.post(`${SERVICE}`, data)
    },

    apiGetPhanCauHoi (params) {
      return axios.get(`${SERVICE}`, { params })
    },

    apiUpdatePhanCauHoi(data) {
      return axios.put(`${SERVICE}`, data)
    },

    apiDeletePhanCauHoi(id) {
      return axios.delete(`${SERVICE}/${id}`)
    }
  }
}