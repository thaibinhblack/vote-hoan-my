<template>
  <v-container>
    <v-card max-width="800">
      <v-card-title class="black white--text" dark>
        Thông tin bệnh viện
      </v-card-title>
      <v-card-text>
        <v-text-field label="Tên bệnh viện" v-model="hospital.ten_benh_vien_chi_tiet"/>
        <v-text-field label="Địa chỉ" v-model="hospital.dia_chi"/>
        <v-text-field label="Số giấy phép hoạt động" v-model="hospital.so_giay_phep_hoat_dong"/>
        <v-text-field label="Tuyến trực thuộc" v-model="hospital.tuyen_truc_thuoc"/>
        <v-text-field label="Cơ quan chủ quản" v-model="hospital.co_quan_chu_quan"/>
        <v-text-field label="Hạng bệnh viện" v-model="hospital.hang_benh_vien"/>
        <v-text-field label="Loại bệnh viện" v-model="hospital.loai_benh_vien"/>

        <v-card-actions>
          <v-spacer/>
          <v-btn color="primary" @click="onClickCapNhat">
            <v-icon left> save</v-icon>
            Cập nhật thông tin
          </v-btn>
        </v-card-actions>
      </v-card-text>

    </v-card>
  </v-container>
</template>

<script>
import CheckError from "~/utils/handlerErro";
import notify from "devextreme/ui/notify";

export default {

  data() {
    return {
      hospital: {}
    }
  },
  created() {
    this.$store.commit("setTilePage", "Cập nhật thông tin bệnh viện")
    this.GetData();
  },
  methods: {
    async GetData() {
      try {
        let hospitalUser = this.user.hospital;
        console.log(hospitalUser)
        if (hospitalUser) {
          let res = await this.$services.hospital.apiGetById(hospitalUser.hospital_id);
          this.hospital = res.data.data;
        }


      } catch (err) {
        CheckError(err)
      }
    },
    async onClickCapNhat(e) {
      try {
        let res = await this.$services.hospital.apiUpdateInfo(this.hospital);
        notify("Cập nhật thành công");

      } catch (err) {
        CheckError(err)
      }
    }
  }
}
</script>

<style scoped>

</style>
