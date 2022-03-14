<template>
  <v-container fluid>
    <SplitterPage value="800" gutter-size="6">
      <template v-slot:panel1>
        <DanhMucTaiKhoan @RowSelectChange="onChonPhanQuyen"/>
      </template>

      <template v-slot:panel2="{ right }">
        <v-row no-gutters style="margin-left: 20px">
          <v-col class="m-5" cols="10">
            <v-row no-gutters>
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
            </v-row>
            <DxTreeList
              @initialized="saveInstance"
              ref="treeListBaoCao"
              id="baoCaoTree"
              :data-source="dataHospital"
              :column-auto-width="true"
              :show-row-lines="true"
              :show-borders="true"
              :expanded-row-keys="expandedRowKeys"
              :selected-row-keys.sync="selectedRowKeys"
              key-expr="hospital_id"
              parent-id-expr="parent_id"

            >
              <DxSearchPanel :width="300" :visible="true"/>
              <DxHeaderFilter :visible="true"/>
              <DxSelection mode="multiple"/>

              <DxColumn
                :width="300"
                caption="Tên bệnh viện"
                data-field="name"
              />
              <!-- End Column Table -->
            </DxTreeList>
          </v-col>
        </v-row>

      </template>
    </SplitterPage>
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

import {
  DxColumn,
  DxEditing,
  DxLookup,
  DxSelection,
  DxTreeList,
  DxValidationRule,
  DxSearchPanel,
  DxHeaderFilter
} from "devextreme-vue/tree-list";

import notify from "devextreme/ui/notify";
import {DxLoadPanel} from "devextreme-vue/load-panel";
import DanhMucPhanQuyen from "~/components/Templates/PhanQuyen/DanhMucPhanQuyen";
import DuAnCombobox from "~/components/Templates/DuAn/DuAnCombobox";
import DanhMucTaiKhoan from "~/components/Templates/TaiKhoan/DanhMucTaiKhoan";
import CheckError from "~/utils/handlerErro";



export default {
  middleware: ["auth", "check-role"],
  components: {
    DanhMucTaiKhoan,
    DuAnCombobox,
    DxTreeList,
    DxEditing,
    DxColumn,
    DxValidationRule,
    DxLookup,
    DxLoadPanel,
    DxSelection,
    DanhMucPhanQuyen, DxSearchPanel, DxHeaderFilter
  },
  data() {
    return {
      tab: {},
      benhVienTree: {},
      baoCaoTree: {},
      expandedRowKeys: [],
      loadingVisible: false,
      duAnId: null,
      //data api
      dataMenu: [],
      dataHospital: [],
      expandedRowKeysBaoCao: [],
      duAnData: [],
      selectedRowKeys: [],

      danhSachChon: {}
    };
  },
  created() {
    this.$store.commit("setTilePage", "Phân quyền tài khoản - bệnh viện ");
  },
  methods: {
    saveInstance(e) {
      this.benhVienTree = e.component;
    },

    getDanhSachBenhVienChon(data) {
      let dataReponse = []
      data.map(x => {
        dataReponse.push(x.hospital_id);

        if (x.children) {
          dataReponse = dataReponse.concat(this.getDanhSachBenhVienChon(x.children));
        }
      });
      return dataReponse;
    },

    async onChonPhanQuyen(e) {
      this.danhSachChon.tai_khoan_id = e.tai_khoan_id;

      this.GetDataTreeListSelect();

    },
    async GetDataTreeListSelect() {

      if (!this.danhSachChon.tai_khoan_id) {
        notify("Vui lòng chọn nhóm!");
        return;
      }

      if (this.dataMenu.length === 0 || this.dataHospital) {
        await this.GetData();
      }


      this.selectedRowKeys = null;
      this.$services.taikhoanhospital
        .apiGetByTaiKhoanId(this.danhSachChon.tai_khoan_id)
        .then(async res => {
          if (res.status === 200) {
            if (res.data.data) {
              this.selectedRowKeys = this.getDanhSachBenhVienChon(res.data.data);

              console.log(this.selectedRowKeys);

            }
          }
        })
        .catch(err => {
          CheckError(err);
        });


    },
    async SaveData() {
      if (!this.danhSachChon || !this.danhSachChon.tai_khoan_id) {
        notify("Chưa chọn tài khoản cần cập nhật!");
        return;
      }

      this.loadingVisible = true;


      this.danhSachChon.danh_sach_benh_vien = this.selectedRowKeys;
      await this.$services.taikhoanhospital
        .apiInsert(this.danhSachChon)
        .then(res => {
          if (res.status === 200) {
            notify("Lưu phân quyền thành công!");
          }

        })
        .catch(err => {
          CheckError(err);
        });


      this.loadingVisible = false;
    },
    async GetData() {
      await this.$services.hospital.apiGetAll()
        .then(res => {
          if (res.status === 200) {
            this.dataHospital = res.data.data;

            this.expandedRowKeys = this.dataHospital.map(x => x.hospital_id);
          }


        }).catch(err => {
          CheckError(err);
        });


    }
  }
};
</script>

<style scoped>
#baoCaoTree {
  width: 100%;
}

</style>
