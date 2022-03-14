<template>
  <v-container fill-height>
    <v-card class="mx-auto">
      <v-card-title>
        Thông báo
      </v-card-title>
      <v-card-text>
        <h1 class="green--text">Bạn không có quyền truy cập chức năng này</h1>
        <v-row align="center" justify="center">
          <v-btn class="ma-2 mt-5" @click="QuayLaiTrangCu" large color="error">
            <v-icon left>mdi-folder-home-outline</v-icon>
            Quay lại trang chủ
          </v-btn>
        </v-row>

      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
export default {
  methods: {
    QuayLaiTrangCu() {
      this.$router.push("/");
    }
  }
}
</script>

<style scoped>

</style>
