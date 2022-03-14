<template>
  <v-container class="body" fluid fill-height>
    <v-row justify="center">
      <v-card min-width="500px">
        <v-system-bar
          color="blue darken-2"
          dark
        />
        <v-card-title class="justify-center red--text ">
          Vui lòng nhập nhật thông tin nhân viên
        </v-card-title>
        <v-card-text>
          <NhanVienCombobox class="mt-5" :value.sync="parDuLieuLieu.nhan_vien_id"></NhanVienCombobox>
        </v-card-text>
        <v-card-actions class="justify-center mb-5">
          <v-btn dark color="primary" @click="CapNhatThongTin()">
            <v-icon left>
              mdi-content-save
            </v-icon>
            Cập nhật thông tin
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-row>
  </v-container>
</template>

<script>
  import notify from "devextreme/ui/notify";
  import NhanVienCombobox from "~/components/Templates/NhanVien/NhanVienCombobox";

  export default {
    middleware: ['auth'],
    name: "ThongTinNhanVien",
    layout: "public",


    data() {
      return {
        parDuLieuLieu: {},
      }
    },
    created() {
      // if (this.user.nhan_vien_su_dung) {
      //   // console.log("---------push thong tin /------------")
      //   // return this.$router.push("/")
      // }
    },
    components: {
      NhanVienCombobox

    },
    methods: {
      async CapNhatThongTin() {

        if (!this.parDuLieuLieu.nhan_vien_id) {

          notify("Chưa chọn thông tin cần cập nhật!", "error")
          return;
        }

        await this.$services.auth.apiUpdateNhanVienSuDung(this.parDuLieuLieu).then(async res => {

          console.log(res);

          notify("Cập nhật thành công!");
          await this.$auth.fetchUser();
          await this.$store.dispatch(
            "getMenuLeftByPhanQuyenId",
            this.user.dm_phan_quyen_id
          );


          console.log(this.user)

          console.log("push home")
          return this.$router.push("/");

        }).catch(res => {
          console.log(res);
          notify(
            "Lỗi cập nhật!!",
            "warning",
            500
          );
        });
      },
    }
  }
</script>

<style scoped lang="scss">
  .body {
    background-color: #2b2b2b;
  }

</style>
