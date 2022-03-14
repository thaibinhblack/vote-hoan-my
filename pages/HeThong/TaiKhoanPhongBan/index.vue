<template>
  <v-container fluid>

    <v-btn
      @click="GetData"
      tile
      dark
      color="green"
    >
      <v-icon left>mdi-refresh</v-icon>
      Nạp dữ liệu
    </v-btn>
    <v-btn @click.stop="SaveData" tile dark color="red darken-3">
      <v-icon left>mdi-content-save</v-icon>
      Lưu phân quyền
    </v-btn>
    <v-row class="mx-auto">

      <v-col cols="5">
        <DanhMucTaiKhoan @RowSelectChange="onChonPhanQuyen"></DanhMucTaiKhoan>
      </v-col>
      <v-col>
        <PhongBanTree
          ref="phongBantree"
          :selected.sync="dataSelected"
          :selected_key.sync="dataSelectedRowKey"
        />
      </v-col>

    </v-row>

    <dx-load-panel
      :visible.sync="loadingVisible"
      :show-indicator="true"
      :show-pane="true"
      :shading="true"
      :close-on-outside-click="false"
      shading-color="rgba(0,0,0,0.4)"
    />
  </v-container>
</template>
<script>

import {DxColumn, DxEditing, DxLookup, DxSelection, DxTreeList, DxValidationRule} from "devextreme-vue/tree-list";

import notify from "devextreme/ui/notify";
import {DxLoadPanel} from "devextreme-vue/load-panel";
import DanhMucPhanQuyen from "~/components/Templates/PhanQuyen/DanhMucPhanQuyen";
import DuAnCombobox from "~/components/Templates/DuAn/DuAnCombobox";
import DanhMucTaiKhoan from "~/components/Templates/TaiKhoan/DanhMucTaiKhoan";
import DanhMucPhongBan from "~/components/Templates/PhongBan/DanhMucPhongBan";
import PhongBanTree from "~/components/Templates/PhongBan/PhongBanTree";

export default {
  middleware: "auth",
  components: {
    PhongBanTree,
    DanhMucPhongBan,

    DanhMucTaiKhoan,
    DuAnCombobox,
    DxTreeList,
    DxEditing,
    DxColumn,
    DxValidationRule,
    DxLookup,
    DxLoadPanel,
    DxSelection,
    //grid
    DanhMucPhanQuyen
  },

  data() {
    return {
      expandedRowKeys: [],
      selectedRowKeys: [],
      loadingVisible: false,
      //data api
      dataGridInstance: null,
      taiKhoanSelect: {},
      dataSelected: {},
      dataSelectedRowKey: {},
      taiKhoanKhoData: []
    };
  },
  created() {
    this.$store.commit("setTilePage", "Phân quyền tài khoản - phòng ban");
  },
  methods: {
    async onChonPhanQuyen(e) {
      this.taiKhoanSelect = e;

      await this.$services.taikhoanphongban
        .apiGetByTaiKhoanId(this.taiKhoanSelect.tai_khoan_id)
        .then(res => {

          if (res.status === 200) {
            if (res.data.data) {
              this.dataSelectedRowKey = res.data.data.map(x => x.phong_ban_id);
              this.$refs.phongBantree.SetDataFocus(this.dataSelectedRowKey);
            }
          }

        })
        .catch(err => {
          console.log(err);
        });

    },
    async SaveData() {
      if (!this.taiKhoanSelect) {
        notify("Chưa chọn tài khoản cập nhật!");
        return;
      }


      this.loadingVisible = true;

      let dataAdd = [];

      this.dataSelected.forEach(x => {
        const taiKhoanKho = {
          phong_ban_id: x.phong_ban_id,
          tai_khoan_id: this.taiKhoanSelect.tai_khoan_id
        }

        dataAdd.push(taiKhoanKho);
      })


      await this.$services.taikhoanphongban
        .apiInsertArray(dataAdd)
        .then(res => {
          if (res.status === 200) {
            this.taiKhoanKhoData = res.data.data;
            notify("Lưu phân quyền thành công!");
          }
        })
        .catch(err => {
          console.log(err);
        });


      this.loadingVisible = false;
    },
    async GetData() {
      this.loadingVisible = true;


      this.loadingVisible = false;
    }
  }
};
</script>

<style></style>
