const SERVICE = '/dap-an'

export default function makeServices(axios) {
  return {
    apiCreateDapAn (data) {
      return axios.post(`${SERVICE}`, data)
    },

    apiGetDapAn (params) {
      return axios.get(`${SERVICE}`, { params })
    },

    apiUpdateDapAn (data) {
      return axios.put(`${SERVICE}`, data)
    },

    apiDeleteDapAn (id) {
      return axios.delete(`${SERVICE}/${id}`)
    }
  }
}