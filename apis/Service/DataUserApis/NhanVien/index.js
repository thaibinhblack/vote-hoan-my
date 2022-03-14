const resource = "nhan-vien"
const SERVICE = "/auth/v1"

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
                headers: {'content-type': 'application/json'}
            }
            return axios.put(`${SERVICE}/${resource}`, par, config);
        },
        apiDeletebyId(par) {
            return axios.delete(`${SERVICE}/${resource}/id/${par}`);
        },
        apiGetAll(par) {
            return axios.get(`${SERVICE}/${resource}`, {
                params: par
            });
        },
        apiGetById(id) {
            return axios.get(`${SERVICE}/${resource}/id/${id}`);
        },
        apiNhanVienByUserName(par) {
            const params = {
                username: par
            };
            return axios.get(`${SERVICE}/${resource}/username`, {params});
        },
        apiGetDanhSachBacSi() {
            return axios.get(`${SERVICE}/${resource}/danhsachbacsi`);
        },
        apiGetDanhSachBacSiHopTac() {
            return axios.get(`${SERVICE}/${resource}/danhsachbacsihoptac`);
        },
        apiGetAllNhanVienCombobox() {
            return axios.get(`${SERVICE}/${resource}/combobox`);
        },
    }
}
