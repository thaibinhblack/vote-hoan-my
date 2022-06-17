const SERVICE = '/votesafety/v1/ket-qua'

export default function makeServices(axios) {
  return {
    apiSaveKetQua (data) {
      return axios.post(`${SERVICE}`, data)
    }
  }
}