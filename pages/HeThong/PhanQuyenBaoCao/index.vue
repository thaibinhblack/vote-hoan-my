<template>
  <v-container fluid>
    <v-row class="mx-auto" align="center" justify="center">
      <v-col xs="12" sm="12" md="4" xl="4" lg="4">
        <DuAnCombobox :value.sync="duAnId" label="Dự án" @onSelectionChanged="onSelectionDuAnChanged"/>
      </v-col>
      <v-col xs="12" sm="12" md="8" lg="8" xl="8">
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
      </v-col>
    </v-row>
    <v-row class="mx-auto">
      <v-col cols="4">
        <DanhMucPhanQuyen @RowSelectChange="onChonPhanQuyen"/>
      </v-col>
      <v-col>
        <DxTreeList
          style="height: 600px"
          id="treePhanQuyen"
          ref="treePhanQuyen"
          :data-source="dataReport"
          :column-auto-width="true"
          :show-row-lines="true"
          :show-borders="true"
          :expanded-row-keys="expandedRowKeysReport"
          :selected-row-keys.sync="selectedRowKeysReport"
          key-expr="report_id"
          parentIdExpr="parent_id"
        >
          <DxSelection mode="multiple"/>

          <dx-column data-field="name" caption="Report name"/>

          <dx-column data-field="du_an_id" caption="Dự án">
            <dx-lookup
              :show-clear-button="true"
              :data-source="duAnData"
              value-expr="du_an_id"
              display-expr="ten_du_an"
            />
          </dx-column>
          <dx-column data-field="path" caption="path"></dx-column>
          <dx-column
            data-field="icon"
            alignment="center"
            cell-template="iconTemplate"
            caption="icon"
          />

          <dx-column
            data-field="enable"
            data-type="boolean"
            caption="Tình trạng"
          />

          <template #iconTemplate="{ data }">
            <div v-if="data.value">
              <v-icon>{{ data.value }}</v-icon>
            </div>
          </template>

          <!-- End Column Table -->
        </DxTreeList>

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
export default {
  // middleware: ["auth", "check-role"],
  components: {
    DuAnCombobox,
    DxTreeList,
    DxEditing,
    DxColumn,
    DxValidationRule,
    DxLookup,
    DxLoadPanel,
    DxSelection,
    DanhMucPhanQuyen
  },
  data() {
    return {
      tab: {},


      expandedRowKeysReport: [],
      loadingVisible: false,
      duAnId: null,
      //data api
      dataReport: [],
      dataChucNang: [],
      dataBaoCao: [],
      expandedRowKeysBaoCao: [],
      expandedRowKeysChucNang: [],
      duAnData: [],
      selectedRowKeysReport: [],
      selectedRowKeysChucNang: [],
      selectedRowKeysBaoCao: [],
      dsPhanQuyen: {},
      parFilter: {}

    };
  },
  created() {
    this.$store.commit("setTilePage", "Phân quyền nhóm ");
    this.duAnId = parseInt(process.env.DU_AN_ID);
  },
  methods: {
    getDanhSachReportChon(data) {
      let dataReponse = []
      data.map(x => {
        dataReponse.push(x.report_id);

        if (x.children) {
          dataReponse = dataReponse.concat(this.getDanhSachReportChon(x.children));
        }
      });
      return dataReponse;
    },
    getDanhSachChucNangChon(data) {
      let dataReponse = []
      data.map(x => {
        dataReponse.push(x.chuc_nang_id);

        if (x.children) {
          dataReponse = dataReponse.concat(this.getDanhSachChucNangChon(x.children));
        }
      });
      return dataReponse;
    },
    getDanhSachBaoCaoChon(data) {

      let dataReponse = []

      data.map(x => {
        dataReponse.push(x.id)
        if (x.children) {
          dataReponse = dataReponse.concat(this.getDanhSachBaoCaoChon(x.children));
        }
      });
      return dataReponse;
    },
    onSelectionDuAnChanged(e) {
      this.parFilter.duAnId = e && e.du_an_id ? e.du_an_id : null;
      this.GetDataPhanQuyen(this.parFilter.duAnId, this.parFilter.phanQuyenId);
    },
    onChonPhanQuyen(e) {
      this.parFilter.phanQuyenId = e && e.phan_quyen_id ? e.phan_quyen_id : null;
      this.GetDataPhanQuyen(this.parFilter.duAnId, this.parFilter.phanQuyenId);
    },
    GetDataTreeListSelect() {
      this.GetDataPhanQuyen(this.parFilter.duAnId, this.parFilter.phanQuyenId);
    },
    async GetDataPhanQuyen(duAnId, phanQuyenId) {
      if (!duAnId || !phanQuyenId) {
        return;
      }

      if (this.dataReport.length === 0 || this.dataBaoCao) {
        await this.GetData();
      }

      const par = {
        duAnId: duAnId,
        phanQuyenId: phanQuyenId
      }
      this.selectedRowKeysReport = null;
      this.$services.phanquyenreport
        .apiGetByPhanQuyenIdAndDuAnId(par)
        .then(async res => {
          if (res.status === 200) {
            if (res.data.data) {
              this.selectedRowKeysReport = this.getDanhSachReportChon(res.data.data);
            }
          }
        })
        .catch(err => {
          console.log(err);
        });


    },
    async SaveData() {
      if (!this.parFilter || !this.parFilter.phanQuyenId) {
        notify("Chưa chọn phân quyền cần cập nhật!");
        return;
      }


      if (!this.parFilter.duAnId) {
        notify("Chưa chọn dự án cần cập nhật!");
        return;
      }
      this.loadingVisible = true;

      const dataSave = {
        phan_quyen_id: this.parFilter.phanQuyenId,
        du_an_id: this.parFilter.duAnId,
        danh_sach_report: this.selectedRowKeysReport,
      }
      await this.$services.phanquyenreport
        .apiInsert(dataSave)
        .then(res => {
          if (res.status === 200) {

            if (res.data.data) {
              this.selectedRowKeys = this.getDanhSachReportChon(res.data.data);
            }

            if (!res.data.data) {
              this.selectedRowKeys = null;
            }

          }

        })
        .catch(err => {
          console.log(err);
        });

      this.loadingVisible = false;
    },
    async GetData() {
      if (!this.duAnId) {
        return notify("Chưa chọn dư án!", "error")
      }
      await this.$services.duan
        .apiGetAll()
        .then(res => {
          this.duAnData = res.data.data;
        })
        .catch(err => {
          console.log(err);
        });

      await this.$services.report
        .getReportByDuanId(this.duAnId)
        .then(res => {
          let dataReportApi = res.data.data;
          if (dataReportApi.length > 0) {
            dataReportApi.map(x => {
              if (!x.parent_id) {
                x.parent_id = 0;
              }
              return x;
            });
          }

          this.dataReport = dataReportApi;
          this.expandedRowKeysReport = this.dataReport.map(x => x.report_id);
        })
        .catch(err => {
          console.log(err);
        });

      await this.$services.chucnang
        .getChucNangByDuanId(this.duAnId)
        .then(res => {
          this.dataChucNang = res.data.data;
          this.expandedRowKeysChucNang = this.dataReport.map(x => x.chu_nang_id);
        })
        .catch(err => {
          console.log(err);
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
