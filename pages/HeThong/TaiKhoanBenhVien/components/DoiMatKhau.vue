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
            <v-col>
              <ValidationProvider v-slot="{ errors }" name="Tên tài khoản" rules="required">
                <v-text-field
                  v-model="itemEdit.ten_tai_khoan"
                  :error-messages="errors"
                  label="Tên tài khoản"
                  required
                  append-icon="mdi-account-edit"
                  readonly
                  disabled
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
                  readonly
                  disabled
                />
              </ValidationProvider>

              <ValidationProvider
                v-slot="{ errors }"
                name="Mật khẩu"
                rules="required"
              >
                <v-text-field
                  :name="Math.random()"
                  @click:append="viewPass = !viewPass "
                  :autocomplete="false"
                  append-icon="visibility"
                  :error-messages="errors" v-model="itemEdit.mat_khau"
                  label="Mật khẩu"
                  :type="viewPass ? 'text':'password'"
                  browser-autocomplete="new-password"
                  autocomplete="new-password"
                />
              </ValidationProvider>

              <ValidationProvider v-slot="{ errors }" name="Mật khẩu nhập lại" rules="required">
                <v-text-field
                  :name="Math.random()"
                  @click:append="viewPass = !viewPass"
                  autocomplete="new-password"
                  append-icon="visibility"
                  :error-messages="errors"
                  v-model="itemEdit.confirm"
                  label="Mật khẩu nhập lại"
                  browser-autocomplete="new-password"
                  :type="viewPass ? 'text':'password'"
                />
              </ValidationProvider>

            </v-col>


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
import notify from "devextreme/ui/notify"
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
    dataEdit: {
      default: null
    },
  },
  data() {
    return {
      viewPass: false,
      itemEdit: {
        tinh_trang: true,
        mat_khau: "",
        confirm: "",
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

      if (this.itemEdit.mat_khau !== this.itemEdit.confirm) {
        notify("Mật khẩu nhập lại không đúng", "error");
        return;
      }

      if (this.itemEdit.tai_khoan_id) {
        let dataTaiKhoan = {
          tai_khoan_id: this.itemEdit.tai_khoan_id,
          mat_khau: this.mat_khau,
        }
        await this.$services.auth
          .apiDoiMatKhau(dataTaiKhoan)
          .then(res => {

            if (res.status === 200) {
              notify("Đổi khẩu khẩu thành công!");
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


    },
  }
};
</script>
<style lang="css" scoped>

</style>
