<template>
  <v-container>
    <v-row>
      <v-col cols="4">
        <span class="headline text-left">Danh mục báo cáo</span>
      </v-col>
    </v-row>

    <v-row justify="center" align="center">
      <v-col cols="12">
        <v-btn
          v-if="!editData"
          @click.stop="ThemMoi()"
          tile
          outlined
          color="primary"
        >
          <v-icon left>mdi-pencil</v-icon>
          Thêm mới
        </v-btn>
        <v-btn
          v-if="editData"
          @click.stop="SaveData"
          class="ma-1"
          tile
          dark
          color="red darken-3"
        >
          <v-icon left>mdi-content-save</v-icon>
          Lưu
        </v-btn>
        <v-btn
          v-if="!editData"
          class="ma-1"
          @click="GetData"
          dark
          tile
          color="secondary"
        >
          <v-icon left>mdi-refresh</v-icon>
          Làm mới
        </v-btn>

        <v-btn
          v-if="editData"
          class="ma-1"
          @click="DisableChange"
          dark
          tile
          color="blue"
        >
          <v-icon left>mdi-keyboard-return</v-icon>
          Hủy chỉnh sửa
        </v-btn>
        <v-btn
          v-if="!editData"
          @click="ExportData(dataSource)"
          tile
          dark
          color="indigo"
        >
          <v-icon left>mdi-application-export</v-icon>
          Xuất dữ liệu
        </v-btn>
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

    <DxTreeList
      @initialized="saveGridInstance"
      id="menus"
      :data-source="dataTable"
      :column-auto-width="true"
      :show-row-lines="true"
      :show-borders="true"
      :expanded-row-keys="expandedRowKeys"
      key-expr="dm_report_id"
      parent-id-expr="parent_id"
      @row-updated="onRowUpdated"
      @init-new-row="onRowNewRow"
      @row-inserted="onRowInserted"
      @row-removing="onRowRemoving"
      :on-editor-preparing="onEditorPreparing"
    >
      <dx-editing
        :allow-updating="true"
        :allow-deleting="true"
        mode="popup"
        :popup="popupOptions"
      ></dx-editing>

      <dx-column data-field="name" caption="Report name">
        <DxValidationRule type="required"/>
      </dx-column>

      <dx-column data-field="parent_id" caption="Cấp trên">
        <dx-lookup
          :show-clear-button="true"
          :data-source="dataTable"
          value-expr="dm_report_id"
          display-expr="name"
        />
      </dx-column>

      <dx-column data-field="report_code" caption="Report code"></dx-column>

      <dx-column
        data-field="tam_ngung"
        data-type="boolean"
        caption="Tạm ngưng"
      />

      <!-- End Column Table -->
    </DxTreeList>
  </v-container>
</template>
<script>
  //Devexpress
  import {DxTextBox} from "devextreme-vue";
  import {
    DxTreeList,
    DxEditing,
    DxColumn,
    DxValidationRule,
    DxLookup
  } from "devextreme-vue/tree-list";

  import notify from "devextreme/ui/notify";
  import {DxLoadPanel} from "devextreme-vue/load-panel";

  import {mapState} from "vuex";

  export default {
    middleware: "auth",
    components: {
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
        popupOptions: {
          title: "Menu",
          showTitle: true

          //position: { my: "top", at: "center", of: window }
        },
        //data api
        dataTable: [],
        duAnData: [],
        //
        dataGridInstance: null
      };
    },
    created() {
      this.GetData();
    },
    methods: {
      passwordComparison() {
        console.log(this.itemUpdate);
        return this.itemUpdate.mat_khau;
      },
      onToolbarPreparing(e) {
        const toolbarItems = e.toolbarOptions.items;
        toolbarItems.forEach(function (item) {
          if (item.name === "saveButton" || item.name === "revertButton") {
            item.visible = false;
          }
        });
      },
      onEditorPreparing(e) {
        e.editorOptions.showClearButton = true;
      },
      async onRowRemoving(e) {


        if (e.cancel === false) {
          const dataRemove = e.data;

          await this.$services.reports
            .apiDeletebyId(dataRemove.dm_report_id)
            .then(res => {
              notify("Xóa thành công");
            })
            .catch(err => {
              notify("Lỗi cập nhật dữ liệu", "error", 3000);
              console.log(err);
            });
        }
      },
      async onRowInserted(e) {
        let dataInsert = e.data;
        dataInsert.dm_report_id = null;
        await this.$services.reports
          .apiInsert(dataInsert)
          .then(res => {
            notify("Thêm thành công");
          })
          .catch(err => {
            notify("Lỗi cập nhật dữ liệu", "error", 3000);
            console.log(err);
          });

        await this.GetData();
      },
      async onRowUpdated(e) {
        const dataUpdate = e.data;

        await this.$services.reports
          .apiUpdate(dataUpdate)
          .then(res => {
            notify("Cập nhật thành công");
          })
          .catch(err => {
            notify("Lỗi cập nhật dữ liệu", "error", 3000);
            console.log(err);
          });
        await this.GetData();
      },
      onRowNewRow(e) {
        e.data.enable = true;
        e.data.ismobile = false;
      },
      saveGridInstance: function (e) {
        this.dataGridInstance = e.component;
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
      DisableChange() {
        this.dataGridInstance.cancelEditData();
        this.editData = false;
        this.allowUpdating = false;
      },
      async ExportData(DataExport) {
        await this.$services.uploadfile
          .apiGetFileUploadByCode("danhmuctaikhoan")
          .then(res => {
            const url = res.data.link;
            if (url) this.$Utils.Export.ExportExelWithTemplet(DataExport, url);
            else
              notify(
                "Lỗi lấy templet báo cáo, vui lòng liên hệ IT!",
                "warning",
                3000
              );
          })
          .catch(res => {
            console.log(res);
            notify(
              "Lỗi cập nhật:" + item.data.dm_chi_so_hoat_dong.ten_chi_so,
              "warning",
              500
            );
          });
      },
      async GetData() {
        this.loadingVisible = true;

        await this.$services.reports
          .apiGetAll()
          .then(res => {
            this.dataTable = res.data.data;
            this.expandedRowKeys = res.data.data.map(x => {
              return x.dm_report_id;
            });
          })
          .catch(err => {
            console.log(err);
          });

        this.loadingVisible = false;
      }
    }
  };
</script>

<style>
  #gridContainer {
    height: 600px;
    width: 100%;
    padding: 0 20px 0 20px;
  }

  .toolbar-label,
  .toolbar-label > b {
    font-size: 16px;
  }

  .dx-data-row .cell-highlighted {
    background-color: rgb(243, 243, 161);
    font-weight: bold;
    color: black;
  }

  .dx-header-row .cell-highlighted {
    color: white;
    background-color: brown;
  }

  .dx-header-row > td[role="columnheader"] > div.dx-datagrid-text-content {
    font-weight: bold;
    color: black;
  }
</style>
