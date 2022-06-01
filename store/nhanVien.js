export const state = () => ({
  users: [
    {
      user_id: 1,
      fullname: 'Nguyễn Thái Bình',
      benhvien_id: 'BVHM-TPHCM'
    },
    {
      user_id: 2,
      fullname: 'Anh Út',
      benhvien_id: 'BVHM-CT'
    },
    {
      user_id: 3,
      fullname: 'Anh Nguyên',
      benhvien_id: 'BVHM-DL'
    },
  ],
  danhSachNhanVien: []
});

export const actions = {
  async getNhanVien({ commit }) {
    await this.$services.nhanvien
      .apiGetAllNhanVienCombobox()
      .then(res => {
        if (res.data.code === 200) {
          commit("setDanhSachNhanVien", res.data.data);
        }
      })
      .catch(err => {
        console.log(err);
      });
  },

  queryNhanVien: ({ dispatch }, benhvien_id) => {
    return new Promise((resolve, reject) => {
      const users = [
        {
          user_id: 1,
          fullname: 'Nguyễn Thái Bình',
          benhvien_id: 'BVHM-TPHCM'
        },
        {
          user_id: 2,
          fullname: 'Anh Út',
          benhvien_id: 'BVHM-CT'
        },
        {
          user_id: 3,
          fullname: 'Anh Nguyên',
          benhvien_id: 'BVHM-CT'
        },
      ]

      const result = users.filter((item) => item.benhvien_id === benhvien_id)
      resolve(result)
    })
  }
};

export const mutations = {
  setDanhSachNhanVien(state, data) {
    state.danhSachNhanVien = data;
  }
};

export const getters = {
  getDanhsachNhanVien(state) {
    return state.danhSachNhanVien;
  }
};
