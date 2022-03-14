<template>
  <v-container>
    <v-row align="center" justify="start">
      <v-col lg="4" cols="12">
        <DuAnCombobox label="Dự án" :value.sync="duAnId" @onSelectionChanged="GetData"/>
      </v-col>
      <v-col lg="8" cols="12">

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
          @click.stop="duAnId ? diaglogChonDuAn = true : diaglogChonDuAn = false"
          tile
          color="primary"
        >
          <v-icon left>add</v-icon>
          Thêm mới từ dự án
        </v-btn>
      </v-col>
    </v-row>
    <v-dialog width="500" v-model="diaglogChonDuAn">
      <v-card>
        <v-card-title>Chọn dự án cần sao chép</v-card-title>
        <v-card-text>
          <DuAnCombobox label="Dự án" :value.sync="duAnSaoChepId"/>
          {{ duAnSaoChepId }}
          <span> Sao chép menu dự án đến: <b>
            {{ duAnSelect && duAnSelect.ten_du_an ? duAnSelect.ten_du_an : '' }}</b></span>
        </v-card-text>
        <v-card-actions>
          <v-spacer/>
          <v-btn @click="diaglogChonDuAn = false" color="primary">Đóng</v-btn>
          <v-btn @click="onClickTaoMoiTuDuAn" color="error">Tạo mới</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <DxTreeList
      id="menus"
      :data-source="dataTable"
      :column-auto-width="true"
      :show-row-lines="true"
      :show-borders="true"
      :expanded-row-keys="expandedRowKeys"
      key-expr="menu_id"
      parent-id-expr="parent_id"
      @row-removing="onDeleteData"
      :allowColumnResizing="true"
      column-resizing-mode="widget"

    >
      <dx-column data-field="menu_name" caption="Menu name"/>
      <dx-column data-field="menu_name_english" caption="Menu name"/>
      <dx-column data-field="path" caption="path"></dx-column>
      <dx-column
        data-field="icon"
        alignment="center"
        cell-template="iconTemplate"
        caption="icon"
      />
      <dx-column data-field="order_by" data-type="number" caption="Order by"/>
      <dx-column data-field="mota" caption="Mô tả"/>
      <dx-column data-field="enable" data-type="boolean" caption="Tình trạng"/>
      <DxColumn
        data-field="menu_id"
        caption="Menu"
        data-type="string"
        alignment="center"
        cell-template="menuTemplet"
      />
      <template #iconTemplate="{ data }">
        <div v-if="data.value">
          <v-icon>{{ data.value }}</v-icon>
        </div>
      </template>
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
              <v-icon v-on="on" v-bind="attrs" color="red" @click="onClickRowDelete(item)">delete</v-icon>
            </template>
            <span>Delete</span>
          </v-tooltip>
        </div>
      </template>
      <!-- End Column Table -->
    </DxTreeList>

    <MenuEdit
      @success="GetData"
      :dataEdit="dataEdit"
      :du-an-id="duAnId"
      :dialog.sync="dialogEdiMenu"
      v-if="dialogEdiMenu"
    />

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
import {DxColumn, DxEditing, DxLookup, DxTreeList, DxValidationRule} from "devextreme-vue/tree-list";

import notify from "devextreme/ui/notify";
import {DxLoadPanel} from "devextreme-vue/load-panel";


import MenuEdit from "~/pages/HeThongDanhMuc/Menu/components/MenuEdit";
import DuAnCombobox from "~/components/Templates/DuAn/DuAnCombobox";
import DiaglogDeleteItem from "~/components/Base/DiaglogDeleteItem";
import CheckError from "~/utils/handlerErro";
import {confirm} from 'devextreme/ui/dialog';

export default {
  middleware: "auth",
  components: {
    DiaglogDeleteItem,
    DuAnCombobox,
    MenuEdit,
    DxTreeList,
    DxEditing,
    DxColumn,
    DxValidationRule,
    DxLookup,
    DxLoadPanel
  },
  watch: {
    modelThang(val) {
      this.GetData();
    },
    modelNam(val) {
      this.GetData();
    }
  },

  computed: {},
  data() {
    return {
      expandedRowKeys: [1],
      loadingVisible: false,
      editData: false,
      allowUpdating: false,
      diaglogChonDuAn: false,
      popupOptions: {
        title: "Menu",
        showTitle: true
      },
      //data api
      dataEdit: null,
      duAnSelect: null,
      duAnId: null,
      duAnSaoChepId: null,
      dataTable: [],
      duAnData: [],
      dataGridInstance: null,
      dialogEdiMenu: false,
      dataDeleteQuestion: {},
      dialogDelete: false,
    };
  },
  created() {
    this.$store.commit("setTilePage", "Danh mục menu");
  },
  methods: {
    openFormThemMoi() {
      this.dataEdit = {};
      this.dataEdit.order_by = Math.max(...this.dataTable.map(o => o.order_by), 0);
      this.dialogEdiMenu = true;
    },
    openFormEdit(item) {
      this.dataEdit = item.data.row.data;
      this.dialogEdiMenu = true;
    },
    async onClickRowDelete(item) {
      let itemDelete = item.data.row.data;
      let result = await confirm("Bạn muốn xóa menu : <b>" + itemDelete.menu_name + "</b>", "Xóa dữ liệu");
      if (result) {
        await this.onDeleteData(itemDelete.menu_id);
      }

    },
    async onDeleteData(id) {
      await this.$services.menu
        .apiDeletebyId(id)
        .then(res => {
          notify("Xóa thành công");
          this.GetData();
        })
        .catch(err => {
          notify("Lỗi cập nhật dữ liệu", "error", 3000);
          console.log(err);
        });

    },
    async onClickTaoMoiTuDuAn() {
      let par = {
        from_du_an_id: this.duAnSaoChepId,
        to_du_an_id: this.duAnId,
      }

      try {
        let result = await this.$services.menu.apiInsertFromDuAn(par);
        console.log(result);
        this.GetData();
        this.diaglogChonDuAn = false;
      } catch (err) {
        CheckError(err)
      }


    },
    ThemMoi() {
      this.dataGridInstance.addRow();
    },
    async SaveData() {
      this.numUpdate = 0;
      this.loadingVisible = true;
      await this.dataGridInstance.saveEditData().then(res => {
        this.loadingVisible = false;
      });

      this.editData = false;
      this.allowUpdating = false;
    },
    async GetData(e) {
      if (e) {
        this.duAnSelect = e;
      }

      if (!this.duAnId) {
        return notify("Chưa chọn dư án!", "error")
      }


      this.loadingVisible = true;
      await this.$services.duan
        .apiGetAll()
        .then(res => {
          this.duAnData = res.data.data;
        })
        .catch(err => {
          CheckError(err);
        });

      await this.$services.menu
        .getMenuByDuanId(this.duAnId)
        .then(res => {

          this.dataTable = res.data.data.map(x => {
            if (!x.parent_id) {
              x.parent_id = 0;
            }
            ;
            return x;
          });
        })
        .catch(err => {
          CheckError(err);
        });


      this.loadingVisible = false;
    }
  }
};
</script>

<style scoped>


</style>
