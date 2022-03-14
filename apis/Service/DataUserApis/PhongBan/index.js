const SERVICE = "/auth/v1"
const resource = "phong-ban"


export default function makeServices(axios) {
    return {
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
                headers: { 'content-type': 'application/json' }
            }
            return axios.put(`${SERVICE}/${resource}`, par, config);
        },
        apiDeletebyId(par) {
            return axios.delete(`${SERVICE}/${resource}/${par}`);
        },
        apiGetAll() {
            return axios.get(`${SERVICE}/${resource}`);
        },
        apiGetById(id) {
            return axios.get(`${SERVICE}/${resource}/${id}`);
        },
        apiGetPhongBanCombobox() {
            return axios.get(`${SERVICE}/${resource}/combobox`);
        },
        apiGetPhongBanByToken() {
          return axios.get(`${SERVICE}/${resource}/by-token`);
        },

    }
}
