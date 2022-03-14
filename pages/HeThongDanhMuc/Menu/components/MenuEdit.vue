<template>
  <v-dialog v-model="dialog" persistent max-width="800">

    <v-card>
      <v-system-bar color="primary" lights-out window dark>
        <span class="font-weight-medium">Thêm mới Menu</span>
        <v-spacer></v-spacer>

        <v-icon @click="close">mdi-close</v-icon>
      </v-system-bar>
      <ValidationObserver ref="observer" v-slot="{ validate,invalid, reset }">
        <v-card-text>

          <form>
            <DuAnCombobox :read-only="false" v-model="itemEdit.du_an_id" label="Dự án" required :du-an-id="duAnId"/>
            <ValidationProvider v-slot="{ errors }" name="Menu name" rules="required">
              <v-text-field
                v-model="itemEdit.menu_name"
                :error-messages="errors"
                label="Menu name"
                required
                prepend-icon="book"

              ></v-text-field>
            </ValidationProvider>

            <ValidationProvider v-slot="{ errors }" name="Menu name english" rules="required">
              <v-text-field
                v-model="itemEdit.menu_name_english"
                :error-messages="errors"
                label="Menu name english"
                required
                prepend-icon="book"

              ></v-text-field>
            </ValidationProvider>

            <v-text-field
              v-model="itemEdit.path"
              label="Menu path"
              prepend-icon="input"
            ></v-text-field>


            <v-row align="center" justify="start">
              <v-col cols="6">

                <ValidationProvider v-slot="{ errors }" name="Icon" rules="required">
                  <v-text-field
                    v-model="itemEdit.icon"
                    :error-messages="errors"
                    label="Menu Icon"
                    required
                    prepend-icon="mdi-chart-donut"

                  ></v-text-field>
                </ValidationProvider>
              </v-col>
              <v-col cols="6">
                <v-row>
                  <v-icon>{{ itemEdit.icon }}</v-icon>
                  <v-text-field
                    class="ml-3"
                    v-model.number="itemEdit.order_by"
                    label="Order by"
                    type="number"
                  />
                </v-row>

              </v-col>


            </v-row>
            <MenuCombobox :value.sync="itemEdit.parent_id" label="Menu cấp trên" :du-an-id="duAnId"/>
            <v-checkbox label="Tình trạng"  v-model="itemEdit.enable"/>
            <v-textarea
              v-model.number="itemEdit.mo_ta"
              label="Mô tả"
              prepend-icon="input"
              rows="2"
            />
          </form>

        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" class="ma-2 white--text" @click="close">
            <v-icon dark left>close</v-icon>
            Đóng
          </v-btn>
          <v-btn dark @click="saveData" color="error" class="ma-2">
            <v-icon dark :disabled="invalid" left>save</v-icon>
            Lưu
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
      itemEdit: {
        tao_ma_tai_san: false,
        tam_ngung: false,
      }
    };
  },
  created() {
    if (this.dataEdit) {
      this.itemEdit = this.dataEdit;
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
      if (this.itemEdit.menu_id) {
        this.$services.menu.apiUpdate(this.itemEdit)
          .then(res => {
            this.$emit("success", res.data);
            this.close()
          })
          .catch(err => {

          })
      }

      // thêm mới
      if (!this.itemEdit.menu_id) {
        this.$services.menu.apiInsert(this.itemEdit)
          .then(res => {

            if (res.status === 200) {
              this.$emit("success", res.data.data);
              this.close()
            }

          })
          .catch(err => {

          })
      }
    },
  }
};
</script>
<style lang="css" scoped>

</style>
