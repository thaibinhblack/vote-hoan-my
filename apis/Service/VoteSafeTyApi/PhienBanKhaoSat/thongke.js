const SERVICE = '/votesafety/v1/thong-ke'

export default function makeServices(axios) {
  return {
    apiGetThongKeKhaoSat (params) {
      return axios.get(`${SERVICE}/${params.id}`, { params })
    },
  }
}
