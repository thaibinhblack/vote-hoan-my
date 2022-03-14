<template>
  <v-dialog v-model="dialog" persistent max-width="800">

    <v-card>
      <v-system-bar color="primary" lights-out window dark>
        <span class="font-weight-medium">Loại hàng hóa</span>
        <v-spacer></v-spacer>

        <v-icon @click="close">mdi-close</v-icon>
      </v-system-bar>
      <ValidationObserver ref="observer" v-slot="{ invalid ,validate, reset }">
        <v-card-text>

          <form>
            <ValidationProvider v-slot="{ errors }" name="Tên bệnh viện" rules="required">
              <v-text-field
                v-model="itemEdit.name"
                :counter="10"
                :error-messages="errors"
                label="Tên bệnh viện"

                required
                prepend-icon="book"

              ></v-text-field>
            </ValidationProvider>

            <v-checkbox class="ml-5" v-model="itemEdit.enable" label="Enable"/>


          </form>

        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn :disabled="invalid" @click="saveData" color="red" dark class="ma-2">
            <v-icon dark left>save</v-icon>
            Lưu
          </v-btn>
          <v-btn dark color="primary" class="ma-2 white--text" @click="close">
            <v-icon dark left>close</v-icon>
            Đóng
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


  import MenuCombobox from "~/components/Templates/Menu/MenuCombobox";
  import DuAnCombobox from "~/components/Templates/DuAn/DuAnCombobox";

  export default {
    components: {
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
      loadingVisible: false,
      //
      dataEdit: {},
    },
    data() {
      return {
        itemEdit: {
          tao_ma_tai_san: false,
          tam_ngung: false,
        }
      };
    },
    created() {
      console.log("---------------created--------------")
      if (this.dataEdit) {
        this.itemEdit = this.dataEdit;
      }

    },

    updated() {

      console.log("---------------updated--------------")


      // if(this.dataEdit !=null && this.dataEdit !== "undefined") {
      //
      //
      // }
    },

    methods: {

      close() {
        this.$emit("update:dialog", false);
        this.$emit("CloseForm", true);
      },
      saveData() {

        // check co id thi cap nhat
        if (this.itemEdit.hospital_id) {
          this.$services.hospital.apiUpdate(this.itemEdit)
            .then(res => {
              this.$emit("success", res.data);
              this.close()
            })
            .catch(err => {

            })
        }

        // thêm mới
        if (!this.itemEdit.hospital_id) {
          this.$services.hospital.apiInsert(this.itemEdit)
            .then(res => {

              if (res.status === 200) {
                this.$emit("success", res.data.data);
                this.close()
              }

            })
            .catch(err => {

            })
        }
      }
    }
  };
</script>
<style lang="css" scoped>

</style>
