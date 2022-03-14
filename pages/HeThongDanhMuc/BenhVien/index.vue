<template>
  <v-container>
    <v-row align="center" justify="start">
      <v-col lg="8" cols="12">
        <v-btn
          v-if="!editData"
          @click.stop="openFormThemMoi()"
          tile
          color="primary"

        >
          <v-icon left>mdi-pencil</v-icon>
          Thêm mới
        </v-btn>

        <v-btn
          v-if="!editData"
          @click="GetData"
          tile
          dark
          color="green"
        >
          <v-icon left>mdi-refresh</v-icon>
          Nạp dữ liệu
        </v-btn>


      </v-col>


    </v-row>


    <DxDataGrid
      :remote-operations="false"
      :allow-column-reordering="true"
      :row-alternation-enabled="true"
      :show-borders="true"
      :show-column-lines="true"
      :allow-column-resizing="true"
      column-resizing-mode="widget"
      :data-source="dataTable"
    >
      <DxColumn
        data-field="hospital_id"
        caption="Menu"
        data-type="string"
        alignment="center"
        cell-template="menuTemplet"
        width="200"
      />

      <DxColumn
        data-field="name"
        caption="Tên bệnh viện"
        data-type="string"
        width="400"

      />

      <DxColumn
        data-field="enable"
        caption="Enable"
        width="200"
      />


      <template #menuTemplet="item">
        <div>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-icon v-on="on" v-bind="attrs" color="primary" @click="openFormEdit(item)">create</v-icon>
            </template>
            <span>Chỉnh sửa</span>
          </v-tooltip>

          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-icon v-on="on" v-bind="attrs" color="red" @click="openFormDelete(item)">delete</v-icon>
            </template>
            <span>Delete</span>
          </v-tooltip>


        </div>
      </template>

    </DxDataGrid>

    <DiaglogDeleteItem :data="dataDeleteQuestion" :dialog.sync="dialogDelete" @sussess="deleteData"/>

    <!--Hiện vòng quay đợi dữ liệu loading!!-->
    <dx-load-panel
      :visible.sync="loadingVisible"
      :show-indicator="true"
      :show-pane="true"
      :shading="true"
      :close-on-outside-click="false"
      shading-color="rgba(0,0,0,0.4)"
    />

    <LoaiHangHoaEdit :data-edit="dataEdit" @success="GetData" :dialog.sync="dialogThemMoi" v-if="dialogThemMoi"/>
  </v-container>
</template>
<script>

import {
  DxColumn,
  DxDataGrid,
  DxGrouping,
  DxGroupPanel,
  DxPager,
  DxPaging,
  DxSearchPanel
} from 'devextreme-vue/data-grid';
import {DxLoadPanel} from "devextreme-vue/load-panel";


import MenuEdit from "~/pages/HeThongDanhMuc/Menu/components/MenuEdit";
import DuAnCombobox from "~/components/Templates/DuAn/DuAnCombobox";
import LoaiHangHoaEdit from "~/pages/HeThongDanhMuc/BenhVien/components/BenhVienEdit";
import DiaglogDeleteItem from "~/components/Base/DiaglogDeleteItem";
import {confirm} from "devextreme/ui/dialog";

export default {
  middleware: "auth",
  components: {
    DiaglogDeleteItem,
    LoaiHangHoaEdit,
    DuAnCombobox,
    MenuEdit,

    //
    DxLoadPanel,
    //devextream grid-table
    DxDataGrid,
    DxColumn,
    DxGrouping,
    DxGroupPanel,
    DxPager,
    DxPaging,
    DxSearchPanel

  },

  computed: {},
  data() {
    return {
      expandedRowKeys: [1],
      loadingVisible: false,
      editData: false,
      allowUpdating: false,
      popupOptions: {
        title: "Menu",
        showTitle: true
      },
      dataGridInstance: null,
      dialogThemMoi: false,
      dialogDelete: false,
      dataDeleteQuestion: {},
      //data
      dataTable: [],
      dataEdit: null,


    };
  },
  created() {

    this.$store.commit("setTilePage", "Danh mục bệnh viện");
    this.GetData();
  },
  methods: {
    gridRowEdit(e) {
      console.log(e)
    },
    openFormThemMoi() {
      this.dataEdit = null;
      this.dialogThemMoi = true;

    },
    openFormEdit(item) {

      this.dataEdit = item.data.row.data;
      this.dialogThemMoi = true;

    },
    async openFormDelete(item) {

      let itemDelete = item.data.row.data;
      let result = await confirm("Bạn muốn xóa bệnh viện : <b>" + itemDelete.name + "</b>", "Xóa dữ liệu");
      if (result) {
        await this.onDeleteData(itemDelete.hospital_id);
      }


    },
    async deleteData(id) {
      await this.$services.hospital.apiDeletebyId(id)
        .then(res => {

          console.log(res);
          this.dialogDelete = false;
          this.GetData();

        })
        .catch(e => {

        })


    },
    async GetData() {
      this.loadingVisible = true;

      await this.$services.hospital
        .apiGetAll()
        .then(res => {
          if (res.status === 200) {
            this.dataTable = res.data.data;

          }
        })
        .catch(err => {
          console.log(err);
        });
      this.loadingVisible = false;
    }
  }
};
</script>

<style scoped>


</style>
