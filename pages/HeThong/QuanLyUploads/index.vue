<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <span class="headline text-left">Upload service</span>
      </v-col>
    </v-row>

    <v-row justify="start" align="center">
      <v-col lg="5">
        <v-btn
          v-if="!editData"
          @click.stop="OpenUploadFile"
          tile
          outlined
          color="primary"
        >
          <v-icon left>mdi-pencil</v-icon>
          Upload file
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

    <dx-data-grid
      @initialized="saveGridInstance"
      id="gridContainer"
      :show-borders="true"
      :remote-operations="true"
      :data-source="dataTable"
      :word-wrap-enabled="true"
      :column-auto-width="true"
      :focused-row-enabled="true"
      key-expr="upload_file_id"
      @row-updated="onRowUpdated"
      @init-new-row="onRowNewRow"
      @row-inserted="onRowInserted"
      @row-removing="onRowRemoving"
    >
      <!-- config -->
      <dx-paging :page-size="12"/>
      <dx-pager
        :show-page-size-selector="true"
        :allowed-page-sizes="[8, 12, 20, 100]"
      />
      <dx-keyboard-navigation
        :edit-on-key-press="true"
        enter-key-action="moveFocus"
        enter-key-direction="column"
      />
      <dx-scrolling mode="infinite"/>
      <dx-paging :enabled="false"/>
      <dx-search-panel :visible="true" :width="240" placeholder="Search..."/>

      <DxEditing :allow-deleting="true" :use-icons="true" mode="row"/>
      <DxColumn :width="110" :buttons="editButtons" type="buttons"/>

      <dx-column
        alignment="center"
        :width="70"
        data-field="upload_file_id"
        caption="ID"
      />
      <dx-column data-field="file_name_save" caption="File server name"/>
      <dx-column data-field="file_name" caption="File name"/>
      <dx-column data-field="file_path" caption="File path"/>
      <dx-column data-field="file_size" caption="File Size"/>
      <dx-column data-field="file_type" caption="File type"/>
      <dx-column data-field="type" caption="Type"/>
      <dx-column data-field="code" caption="Code"/>
      <DxColumn :calculate-cell-value="GeLinkUploads" caption="Link"/>

      <!-- End Column Table -->
    </dx-data-grid>

    <!-- Popup chọn ngày tính tồn kho -->

    <DxPopupForm
      :visible.sync="popupVisible"
      :drag-enabled="false"
      :close-on-outside-click="true"
      :show-title="true"
      :max-width="700"
      :max-height="500"
      title="Tính tồn đầu kỳ"
    >
      <form
        id="form"
        ref="upload-form"
        @submit="UploadFileToServer"
        action=""
        enctype="multipart/form-data"
      >
        <h3>Chọn file cần uploads</h3>
        <div class="dx-fieldset">
          <div class="dx-field">
            <div class="dx-field-label">Code name:</div>
            <DxTextBox
              v-model="dataUploads.code"
              name="code"
              data-field="code"
              class="dx-field-value"
            />
          </div>
        </div>
<!--        <div class="dx-fieldset">-->
<!--          <div class="dx-field">-->
<!--            <div class="dx-field-label">Type:</div>-->
<!--            <DxTextBox-->
<!--              v-model="dataUploads.type"-->
<!--              name="type"-->
<!--              data-field="type"-->
<!--              class="dx-field-value"-->
<!--            />-->
<!--          </div>-->
<!--        </div>-->
        <div class="fileuploader-container">
          <DxFileUploader
            select-button-text="Select file"
            label-text=""
            upload-mode="useForm"
            data-field="upload_file"
            v-model="fileUploadData"
            @value-changed="OnValueChanged"
          />
        </div>

        <DxButton
          class="button-upload"
          text="Upload file"
          type="success"
          @click="UploadFileToServer"
        />
      </form>
    </DxPopupForm>

    <!-- End popup -->
  </v-container>
</template>
<script>
  import {DxTextBox, DxMenu} from "devextreme-vue";
  import {DxFileUploader} from "devextreme-vue/file-uploader";
  import {DxLoadPanel} from "devextreme-vue/load-panel";

  import {
    DxDataGrid,
    DxColumn,
    DxPaging,
    DxEditing,
    DxLookup,
    DxExport,
    DxSelection,
    DxKeyboardNavigation,
    DxScrolling,
    DxSorting,
    DxPopup,
    DxPosition,
    DxForm as DxFormGrid,
    DxPager,
    DxSearchPanel
  } from "devextreme-vue/data-grid";

  import DxForm, {
    DxItem as DxItemForm,
    DxRequiredRule,
    DxCompareRule,
    DxSimpleItem,
    DxLabel,
    DxAsyncRule,
    DxButtonItem
  } from "devextreme-vue/form";
  import {DxCheckBox, DxSelectBox, DxDateBox, DxButton} from "devextreme-vue";
  import DxToolbar, {DxItem} from "devextreme-vue/toolbar";
  import notify from "devextreme/ui/notify";
  import {DxNumberBox} from "devextreme-vue/number-box";

  import {mapState} from "vuex";
  import {DxPopup as DxPopupForm} from "devextreme-vue/popup";

  function getNewFileName() {
    return "ChiSoHoatDong_" + new Date().getTime();
  }

  export default {
    middleware: "auth",
    components: {
      DxDateBox,
      DxTextBox,
      DxDataGrid,
      DxColumn,
      DxPaging,
      DxEditing,
      DxLookup,
      DxCheckBox,
      DxSelectBox,
      DxExport,
      DxSelection,
      DxKeyboardNavigation,
      DxToolbar,
      DxItem,
      DxNumberBox,
      DxScrolling,
      DxSorting,
      DxLoadPanel,
      DxPopup,
      DxPosition,
      DxItemForm,
      DxRequiredRule,
      DxSimpleItem,
      DxLabel,
      DxAsyncRule,
      DxCompareRule,
      DxPager,
      DxSearchPanel,
      DxMenu,
      DxPopupForm,
      DxButton,
      DxForm,
      DxFormGrid,
      DxButtonItem,
      DxFileUploader
    },
    watch: {},

    computed: {},
    data() {
      return {
        editButtons: [
          "delete",
          {
            hint: "Clone",
            icon: "copy",
            color: "red",
            visible: this.isCloneIconVisible,
            onClick: this.copyLinkClick
          }
        ],
        dateBoxOptions: {
          showClearButton: true,
          useMaskBehavior: true,
          displayFormat: "dd/MM/yyyy"
        },
        loadingVisible: false,
        editData: false,
        allowUpdating: false,
        popupVisible: false,
        // par

        dataUploads: {
          code: "",
          type: "",
          file: null
        },
        //data api
        dataTable: [],
        fileUploadData: [],

        //
        dataGridInstance: null,
        itemUpdate: {},
        dataMenu: [
          {
            id: "1",
            name: "Chức năng",
            items: [
              {
                id: "1_1",
                name: "Tính tồn đầu kỳ"
              },
              {
                id: "1_2",
                name: "Đồng bộ danh mục dược"
              }
            ]
          }
        ]
      };
    },
    created() {
      this.GetData();
    },
    methods: {
      copyLinkClick(e) {
        console.log("TCL: copyLinkClick -> e", e);
        const link = this.GeLinkUploads(e.row.data);
        this.$clipboard(link);
        notify("Đã copy link!");
      },
      GeLinkUploads(data) {
        return [data.server, data.link_file].join("");
      },
      OnValueChanged(e) {
        this.dataUploads.file = e.value[0];
      },
      async UploadFileToServer(e) {
        this.loadingVisible = true;
        let formData = new FormData();
        formData.append("code", this.dataUploads.code);
        formData.append("type", this.dataUploads.type);
        formData.append("file", this.dataUploads.file);
        formData.append("server", "http://117.2.81.250:8090/upload-service");

        await this.$services.uploadfile
          .apiUploadFile(formData)
          .then(res => {
            notify("Upload thành công");
            this.popupVisible = false;
          })
          .catch(err => {
            notify("Lỗi cập nhật dữ liệu", "error", 3000);
            console.log(err);
          });
        this.loadingVisible = false;
        this.GetData();
      },
      OpenUploadFile() {
        this.popupVisible = true;
      },
      onToolbarPreparing(e) {
        const toolbarItems = e.toolbarOptions.items;
        toolbarItems.forEach(function (item) {
          if (item.name === "saveButton" || item.name === "revertButton") {
            item.visible = false;
          }
        });
      },
      async onRowRemoving(e) {
        if (e.cancel === false) {
          const dataRemove = e.data;
          console.log("TCL: onRowRemoving -> dataRemove", dataRemove);

          await this.$services.uploadfile
            .apiDeletebyId(dataRemove.upload_file_id)
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
        const dataInsert = e.data;
        dataInsert.id = null;

        this.GetData();
      },
      async onRowUpdated(e) {
      },
      onRowNewRow(e) {
        this.fileUploadData =[];
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
      async GetData() {
        this.loadingVisible = true;

        await this.$services.uploadfile
          .apiGetAll()
          .then(res => {
            this.dataTable = res.data.data;
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
    font-size: 12px;
    font-weight: bold;
    color: black;
  }

  .dx-menu .dx-menu-item-has-text.dx-menu-item-has-submenu .dx-menu-item-text {
    color: darkred;
    font-weight: bold;
  }

  .button-upload {
    float: right;
    padding-left: 10px;
  }

  .dx-icon-trash:before {
    color: red;
  }

  .dx-icon-copy:before {
    color: blue;
  }
</style>
