const resource = "chuc-vu"
const SERVICE = "/auth/v1"

export default function makeServices(axios) {
    return {
        apiGetChucVuAll() {
            return axios.get(`${SERVICE}/${resource}`);
        },
        apiInsert(item) {
            const par = JSON.stringify(item);
            return axios.post(`${SERVICE}/${resource}`, par, {
                headers: {
                    "content-type": "application/json"
                }
            });
        },
        apiUpdate(item) {
            const par = JSON.stringify(item);
            const config = {
                headers: {'content-type': 'application/json'}
            }
            return axios.put(`${SERVICE}/${resource}`, par, config);
        },
        apiDeletebyId(par) {
            return axios.delete(`${SERVICE}/${resource}/${par}`);
        },
        apiGetAll(par) {
            return axios.get(`${SERVICE}/${resource}`, {
                params: par,
            });
        },
        apiGetById(id) {
            return axios.get(`${SERVICE}/${resource}/${id}`);
        },
    }
}
