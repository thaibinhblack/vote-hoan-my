<template>
  <v-dialog v-model="dialog" persistent max-width="700">

    <v-card>
      <v-system-bar color="primary" lights-out window dark>
        <span class="font-weight-medium">Tài khoản</span>
        <v-spacer></v-spacer>

        <v-icon @click="close">mdi-close</v-icon>
      </v-system-bar>
      <ValidationObserver ref="observer" v-slot="{ validate,invalid, reset }">
        <v-card-text>
          <form>
            <v-row>
              <v-col>
                <ValidationProvider v-slot="{ errors }" name="Tên tài khoản" rules="required">
                  <v-text-field
                    v-model="itemEdit.ten_tai_khoan"
                    :error-messages="errors"
                    label="Tên tài khoản"
                    required
                    append-icon="mdi-account-edit"
                    :disabled="readonly"
                  />
                </ValidationProvider>

                <ValidationProvider v-slot="{ errors }" name="Tên hiển thị" rules="required">
                  <v-text-field
                    :name="Math.random()"
                    v-model="itemEdit.display_name"
                    :error-messages="errors"
                    label="Tên hiển thị"
                    autocomplete="new-password"
                    required
                    append-icon="mdi-account-circle"

                  />
                </ValidationProvider>


                <ValidationProvider
                  v-if="addNew"
                  v-slot="{ errors }"
                  name="Mật khẩu"
                  rules="required|password:@confirm"
                >
                  <v-text-field
                    :name="Math.random()"
                    @click:append="viewPass = !viewPass "
                    autocomplete="new-password"
                    append-icon="visibility"
                    :error-messages="errors" v-model="itemEdit.mat_khau"
                    label="Mật khẩu"
                    :type="viewPass ? 'text':'password'"
                  />
                </ValidationProvider>

                <ValidationProvider v-if="addNew" v-slot="{ errors }" name="confirm" rules="required">
                  <v-text-field
                    :name="Math.random()"
                    @click:append="viewPass = !viewPass"
                    autocomplete="new-password"
                    append-icon="visibility"
                    :error-messages="errors"
                    v-model="itemEdit.confirmation"
                    label="Mật khẩu nhập lại"
                    :type="viewPass ? 'text':'password'"
                  />
                </ValidationProvider>


              </v-col>
              <v-col>
                <nhom-phan-quyen-compobox
                  label="Nhóm phân quyền"
                  append-icon="mdi-comment-account"
                  :value.sync="itemEdit.nhom_phan_quyen"
                  :du-an-code="getDuAnCode()"
                />
                <ValidationProvider v-slot="{ errors }" name="Bệnh viện" rules="required">
                  <benh-vien-combobox
                    append-icon="mdi-hospital-building"
                    required
                    :errors-messages="errors[0]"
                    :value.sync="itemEdit.hospital_id"
                    read-only
                    :clearable="false"

                  />
                </ValidationProvider>
                <v-text-field
                  append-icon="title"
                  v-model="itemEdit.title"
                  label="Title"
                />
                <v-text-field
                  append-icon="room"
                  v-model="itemEdit.department"
                  label="Department"
                />
                <v-text-field
                  append-icon="phone"
                  v-model="itemEdit.phone_number"
                  label="Số điện thoại"
                />
                <v-text-field
                  append-icon="email"
                  v-model="itemEdit.email"
                  label="Email"
                />

                <v-checkbox label="Đang hoạt động" v-model="itemEdit.tinh_trang"/>
              </v-col>
            </v-row>


          </form>

        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn dark color="primary" class="ma-2 white--text" @click="close">
            <v-icon dark left>close</v-icon>
            Đóng
          </v-btn>

          <v-btn @click="saveData" dark color="red" class="ma-2 white--text">
            <v-icon dark left>save</v-icon>
            Lưu thông tin
          </v-btn>

        </v-card-actions>
      </ValidationObserver>
    </v-card>

    <dx-load-panel
      :visible.sync="loadingVisible"
      :show-indicator="true"
      :show-pane="true"
      :shading="true"
      :close-on-outside-click="false"
      shading-color="rgba(0,0,0,0.4)"
    />
  </v-dialog>
</template>
<script>
import {DxLoadPanel} from "devextreme-vue/load-panel";
import {
  DxDataGrid,
  DxColumn,
  DxLookup,
  DxEditing,
  DxSelection
} from "devextreme-vue/data-grid";

import notify from "devextreme/ui/notify"


import MenuCombobox from "~/components/Templates/Menu/MenuCombobox";
import DuAnCombobox from "~/components/Templates/DuAn/DuAnCombobox";
import BenhVienCombobox from "~/components/Templates/BenhVien/BenhVienCombobox";
import PhanQuyenCompobox from "~/components/Templates/PhanQuyen/PhanQuyenCompobox";
import {extend} from 'vee-validate';
import NhanVienCombobox from "~/components/Templates/NhanVien/NhanVienCombobox";
import NhomPhanQuyenCompobox from "~/components/Templates/PhanQuyen/NhomPhanQuyenCompobox";


extend('password', {
  params: ['target'],
  validate(value, {target}) {
    return value === target;
  },
  message: 'Mật khẩu nhập lại không trùng'
});


export default {
  components: {
    NhomPhanQuyenCompobox,
    NhanVienCombobox,
    PhanQuyenCompobox,
    BenhVienCombobox,
    DuAnCombobox,
    MenuCombobox,
    DxDataGrid,
    DxColumn,
    DxLoadPanel,
    DxLookup,
    DxEditing,
    DxSelection
  },
  props: {
    dialog: false,
    addNew: true,
    readonly: false,
    loadingVisible: false,
    duAnId: {
      type: Number,
      default: null,
      require: true,
    },
    //
    menu: {},
    dataEdit: {
      default: null
    },
  },
  data() {
    return {
      viewPass: false,
      itemEdit: {
        tinh_trang: true,
        phone_number: '',
      }
    };
  },
  created() {
    if (this.dataEdit) {
      this.itemEdit = this.dataEdit;
    }
    if (!this.dataEdit) {
      this.khoiTaoDuLieu();
    }

  },
  methods: {
    getDuAnCode() {
      return process.env.DU_AN_CODE;
    },
    khoiTaoDuLieu() {
      console.log("------khoiTaoDuLieu------")
      this.itemEdit = {
        hospital_id: this.user.hospital.hospital_id,
        tinh_trang: true,
      }
    },
    close() {
      this.$emit("update:dialog", false);
      this.$emit("CloseForm", true);
    },
    async saveData() {

      const isValid = await this.$refs.observer.validate();
      if (!isValid) {

        notify("Vui lòng nhập đầy đủ thông tin", "error");
        return;
      }


      // check co id thi cap nhat


      if (!this.itemEdit.tai_khoan_id) {

        await this.$services.auth
          .apiInsert(this.itemEdit)
          .then(res => {

            if (res.status === 200) {
              notify("Thêm mới thành công!");
              this.$emit("success");
              this.close();
            }

          })
          .catch(err => {

            const mes = err.response.data.message;

            if (mes) {
              notify(mes, "error");
            }

          });
      }

      // thêm mới
      if (this.itemEdit.tai_khoan_id) {
        await this.$services.auth
          .apiUpdate(this.itemEdit)
          .then(res => {

            if (res.status === 200) {
              notify("cập nhật thành công!")
              this.$emit("success");
              this.close();
            }
          })
          .catch(err => {
            notify("Lỗi cập nhật dữ liệu", "error", 3000);
            console.log(err);
          });
      }
    },
  }
};
</script>
<style lang="css" scoped>

</style>
