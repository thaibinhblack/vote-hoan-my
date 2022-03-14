<template>
  <v-container>
    <v-dialog v-model="dialog" persistent max-width="600">
      <v-card>
        <v-card-title>
          Bạn muốn xóa dữ liệu:

          <span style="color:blue">
            <b>{{ data.name }}</b>?
          </span>
        </v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" class="mr-2 ml-10" dark large @click="close">
            Hủy
            <v-icon right dark>mdi-close</v-icon>
          </v-btn>
          <v-btn dark large color="red darken-1" @click="sussess">
            Đồng ý
            <v-icon right>mdi-content-save-edit</v-icon>
          </v-btn>

          <!-- <v-btn color="error" class="mr-2 ml-10" @click="close">Reset Form</v-btn>

          <v-btn color="secondary" @click="sussess">Reset Validation</v-btn>-->
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>
<script>
  export default {
    props: {
      data: {},
      dialog: {
        default: false
      }
    },
    methods: {
      close() {
        this.$emit("update:dialog", false);
      },
      sussess() {
        this.$emit("sussess", this.data.id);
      }
    }
  };
</script>
