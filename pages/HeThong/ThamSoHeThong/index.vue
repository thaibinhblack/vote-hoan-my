<template>
  <v-container>
    <v-row justify="center" align="center">
      <v-col cols="12">
        <v-btn
          v-if="!editData"
          @click.stop="ThemMoi()"
          tile

          color="primary"
        >
          <v-icon left>mdi-pencil</v-icon>Thêm mới
        </v-btn>
        <v-btn
          v-if="editData"
          @click="SaveData"
          class="ma-1"
          tile
          dark
          color="red darken-3"
        >
          <v-icon left>mdi-content-save</v-icon>Lưu
        </v-btn>
        <v-btn
          v-if="!editData"
          class="ma-1"
          @click="NapDuLieu"
          dark
          tile
          color="secondary"
        >
          <v-icon left>mdi-refresh</v-icon>Làm mới
        </v-btn>

        <v-btn
          v-if="editData"
          class="ma-1"
          @click="DisableChange"
          dark
          tile
          color="accent"
        >
          <v-icon left>mdi-keyboard-return</v-icon>Hủy chỉnh sửa
        </v-btn>

      </v-col>
    </v-row>

    <DxDataGrid
      id="gridContainer"
      @initialized="saveGridInstance"
      :data-source="dataSource"
      :allow-column-reordering="true"
      :show-borders="true"
      key-expr="id"
      @toolbar-preparing="onToolbarPreparing($event)"
      @row-inserted="onRowInserted"
      @row-updating="onRowUpdating"
      @row-removed="onRowRemoved"
      :allow-column-resizing="true"
      :row-alternation-enabled="true"
      :word-wrap-enabled="true"
      :remote-operations="false"
      column-resizing-mode="widget"
    >
      <DxPaging :enabled="true" />
      <DxEditing
        :allow-updating="true"
        :allow-deleting="true"
        :allow-adding="true"
        mode="row"
      />

      <DxColumn data-field="ma_tham_so" caption="Mã tham số" />
      <DxColumn data-field="ten_tham_so" caption="Tên tham số" />
      <DxColumn data-field="gia_tri" caption="Giá trị" />
      <DxColumn data-field="dien_giai" dataType="dxTextArea" caption="Diễn giải" />

    </DxDataGrid>
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
import DxButton from "devextreme-vue/button";
import {
  DxDataGrid,
  DxColumn,
  DxEditing,
  DxPaging,
  DxLookup
} from "devextreme-vue/data-grid";

import { DxLoadPanel } from "devextreme-vue/load-panel";
import { mapState } from "vuex";
import notify from "devextreme/ui/notify";
import 'devextreme-vue/text-area';

export default {
  middleware: 'auth',
  components: {
    DxDataGrid,
    DxColumn,
    DxEditing,
    DxPaging,
    DxButton,
    DxLookup,
    DxLoadPanel
  },
  watch: {
    "$route.query": "$fetch"
  },
  async created() {
    await this.NapDuLieu();
  },
  computed: {
    ...mapState({
      dataSource: state => _.cloneDeep(state.ThamSoHeThongs.thamSoHeThongs),
      sussess: state => state.success
    })
  },
  data() {
    return {
      dataGridInstance: {},
      editData: false,
      loadingVisible: false
    };
  },
  methods: {
    saveGridInstance: function(e) {
      console.log("e", e);
      this.dataGridInstance = e.component;
    },

    onToolbarPreparing(e) {
      var toolbarItems = e.toolbarOptions.items;
      toolbarItems.forEach(function(item) {
        if (item.name == "saveButton" || item.name == "revertButton") {
          item.visible = false;
        }
      });
    },
    DisableChange() {
      this.dataGridInstance.cancelEditData();
      this.editData = false;
      this.allowUpdating = false;
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
    ThemMoi() {
      this.dataGridInstance.addRow();
      this.editData = true;
    },
    async onRowInserted(e) {
      await this.$store.dispatch("ThamSoHeThongs/add", e.data);
    },

    async onRowUpdating(e) {
      let itemNew = Object.assign(e.oldData, e.newData);
      await this.$store.dispatch("ThamSoHeThongs/update", itemNew);
    },
    async onRowRemoved(e) {
      if (e.data.id) {
        await this.$store.dispatch("ThamSoHeThongs/Remove", e.data.id);
      }
    },

    async NapDuLieu() {
      await this.$store.dispatch("ThamSoHeThongs/getAll");
    }
  }
};
</script>
<style>
#events {
  background-color: rgba(191, 191, 191, 0.15);
  padding: 20px;
  margin-top: 20px;
}

#events > div {
  padding-bottom: 5px;
}

#events > div:after {
  content: "";
  display: table;
  clear: both;
}

#events #clear {
  float: right;
}

#events .caption {
  float: left;
  font-weight: bold;
  font-size: 115%;
  line-height: 115%;
  padding-top: 7px;
}

#events ul {
  list-style: none;
  max-height: 100px;
  overflow: auto;
  margin: 0;
}

#events ul li {
  padding: 7px 0;
  border-bottom: 1px solid #dddddd;
}

#events ul li:last-child {
  border-bottom: none;
}
</style>
