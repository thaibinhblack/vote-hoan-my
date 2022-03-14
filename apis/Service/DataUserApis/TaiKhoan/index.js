const SERVICE = "/auth/v1/tai-khoan";

export default function makeServices(axios) {
  return {
    apiInsert(item) {
      const par = JSON.stringify(item);
      return axios.post(`${SERVICE}`, par, {
        headers: {
          "content-type": "application/json"
        }
      });
    },
    apiUpdate(item) {
      const par = JSON.stringify(item);
      const config = {
        headers: {"content-type": "application/json"}
      };
      return axios.put(`${SERVICE}`, par, config);
    },
    updatePhanQuyenNhom(data) {
      return axios.put(`${SERVICE}/phan-quyen-nhom`, data)
    },
    apiUpdateNhanVienSuDung(item) {
      const par = JSON.stringify(item);
      const config = {
        headers: {"content-type": "application/json"}
      };
      return axios.put(`${SERVICE}/nhan-vien-su-dung`, par, config);
    },
    apiDeletebyId(par) {
      return axios.delete(`${SERVICE}/id/${par}`);
    },
    apiGetAll(par) {
      return axios.get(`${SERVICE}`, {
        params: par
      });
    },
    apiGetById(id) {
      return axios.get(`${SERVICE}/${id}`);
    },
    login(par) {
      return axios.post(`${SERVICE}/login`, par, {
        headers: {
          "content-type": "application/json"
        }
      });
    },
    me() {
      return axios.get(`${SERVICE}/me`, {
        headers: {
          "content-type": "application/json"
        }
      });
    },
    refresh() {
      return axios.get(`${SERVICE}/tai-khoan/refresh`, {
        headers: {
          "content-type": "application/json"
        }
      });
    },
    apiTaiKhoanByUserName(par) {
      const params = {
        username: par
      };
      return axios.get(`${SERVICE}/username`, {params});
    },
    apiGetTaiKhoanHoTro() {
      return axios.get(`${SERVICE}/taikhoanhotro`);
    },

    apiDoiMatKhau(item) {
      const par = JSON.stringify(item);
      const config = {
        headers: {"content-type": "application/json"}
      };
      return axios.put(`${SERVICE}/doi-mat-khau`, par, config);
    },
  };
}
