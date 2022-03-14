<template>
  <v-dialog v-model="dialog" persistent max-width="700">

    <v-card>
      <v-system-bar color="primary" lights-out window dark>
        <span class="font-weight-medium">Phân quyền</span>
        <v-spacer></v-spacer>

        <v-icon @click="close">mdi-close</v-icon>
      </v-system-bar>
      <ValidationObserver ref="observer" v-slot="{ validate,invalid, reset }">
        <v-card-text>
          <form>
            <DuAnCombobox v-model="itemEdit.du_an_id"/>
            <ValidationProvider v-slot="{ errors }" name="Tên phân quyền" rules="required">
              <v-text-field
                v-model="itemEdit.cap_do"
                :error-messages="errors"
                autocomplete="new"
                label="Tên phân quyền"
                required
                append-icon="mdi-account-edit"
              ></v-text-field>
            </ValidationProvider>
            <ValidationProvider v-slot="{ errors }" name="mặc định">
              <v-checkbox
                v-model="itemEdit.mac_dinh"
                :error-messages="errors"
                label="Mặc định khi tạo tài khoản domain"
                required

              ></v-checkbox>
            </ValidationProvider>
            <ValidationProvider v-slot="{ errors }" name="mặc định">
              <v-checkbox
                v-model="itemEdit.tinh_trang"
                :error-messages="errors"
                label="Tình trạng"

                required

              ></v-checkbox>
            </ValidationProvider>


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


extend('password', {
  params: ['target'],
  validate(value, {target}) {
    return value === target;
  },
  message: 'Mật khẩu nhập lại không trùng'
});


export default {
  components: {
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
    loadingVisible: false,
    duAnId: {
      type: Number,
      default: null,
      require: true,
    },
    //
    menu: {},
    dataEdit: {},
  },
  data() {
    return {
      viewPass: false,
      itemEdit: {
        tinh_trang: true
      }
    };
  },
  created() {
    if (this.dataEdit) {
      this.itemEdit = this.dataEdit;
    }

    if (this.addNew) {
      this.itemEdit.tinh_trang = true;
      this.itemEdit.mac_dinh = false;
    }


  },
  methods: {
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


      if (!this.itemEdit.phan_quyen_id) {

        await this.$services.phanquyen
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
      if (this.itemEdit.phan_quyen_id) {
        await this.$services.phanquyen
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
