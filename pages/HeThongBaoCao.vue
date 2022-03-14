<template>
  <v-container fluid>

    <!--Destop-->
    <SplitterPage value="500" gutter-size="6" v-if="!$vuetify.breakpoint.mobile">
      <template v-slot:panel1>
        <v-card flat width="100%">
          <v-card-actions>
            <v-spacer/>
            <v-btn small color="primary" @click="GetData">
              <v-icon left>mdi-refresh</v-icon>
              Làm mới
            </v-btn>
          </v-card-actions>
          <DxTreeView
            width="100%"
            id="treeview"
            ref="treeViewRef"
            :items="items"
            data-structure="plain"
            parent-id-expr="parent_id"
            key-expr="report_id"
            display-expr="name"
            :search-enabled="true"
            search-mode="contains"
            @item-click="onTreeViewItemClick"
            @item-context-menu="treeViewItemContextMenu"
          />
        </v-card>
      </template>

      <template v-slot:panel2="{ right }">
        <v-container id="blah">
          <NuxtChild/>
        </v-container>
      </template>
    </SplitterPage>

    <div v-if="$vuetify.breakpoint.mobile">
      <v-card flat width="100%">
        <v-card-actions>
          <v-spacer/>
          <v-btn small color="primary" @click="GetData">
            <v-icon left>mdi-refresh</v-icon>
            Làm mới
          </v-btn>
        </v-card-actions>
        <DxTreeView
          width="100%"
          ref="treeViewRef"
          :items="items"
          data-structure="plain"
          parent-id-expr="parent_id"
          key-expr="report_id"
          display-expr="name"
          :search-enabled="true"
          search-mode="contains"
          @item-click="onTreeViewItemClick"
          @item-context-menu="treeViewItemContextMenu"
        />
      </v-card>

      <v-container id="blah">
        <NuxtChild/>
      </v-container>
    </div>




    <DxContextMenu
      :items="contextMenuItems"
      @item-click="contextMenuItemClick"
    />
  </v-container>
</template>
<style scoped></style>

<script>
import {
  DxTreeList,
  DxEditing,
  DxColumn,
  DxValidationRule,
  DxLookup,
  DxSelection,
  DxSearchPanel
} from "devextreme-vue/tree-list";
import DxTreeView from "devextreme-vue/tree-view";
import DxContextMenu from "devextreme-vue/context-menu";
import {env} from "echarts/core";

export default {
  middleware: "auth",
  head: {
    link: [
      {
        rel: "stylesheet",
        src: "~/assets/css/stimulsoft.viewer.office2013.whiteblue.css",
        type: "text/css"
      }
    ]
  },

  components: {
    DxSearchPanel,
    DxTreeList,
    DxEditing,
    DxColumn,
    DxValidationRule,
    DxLookup,
    DxSelection,
    DxTreeView,
    DxContextMenu
    //
  },
  data() {
    return {
      contextMenuItems: [
        {id: "expand", text: "Expand all"},
        {id: "collapse", text: "Collapse all"}
      ],
      items: [],
      active: [],
      open: [],
      search: null,
      expandedRowKeys: [],
      selectedRowKeys: [],
      selected: {}
    };
  },
  computed: {
    filter() {
      return this.caseSensitive
        ? (item, search, textKey) => item[textKey].indexOf(search) > -1
        : undefined;
    }
  },
  created() {
    this.$store.commit("setTilePage", "Hệ thống báo cáo");
    this.GetData();

  },
  mounted() {
    setTimeout(() => {
      this.$refs.treeViewRef.instance.expandAll();
    }, 2000)
  },
  methods: {
    treeViewItemContextMenu(e) {
      this.selectedTreeItem = e.itemData;
    },
    onTreeViewItemClick({itemData}) {
      if (itemData.path) {
        if (this.$route.fullPath !== itemData.path) {
          this.$store.commit("SET_LOADING", true);
          let pathGo = this.localePath(itemData.path);
          this.$router.replace({path: pathGo});
          this.$store.commit("SET_LOADING", false);
        }
      }
    },
    contextMenuItemClick(e) {
      switch (e.itemData.id) {
        case "expand": {
          console.log(this.$refs.treeViewRef.instance);
          this.$refs.treeViewRef.instance.expandAll();
          break;
        }
        case "collapse": {
          this.$refs.treeViewRef.instance.collapseAll();
          break;
        }
      }
    },
    LogTest(e) {

    },
    async GetData() {
      const user = this.$store.state.auth.user;

      let par = {
        phanQuyenId: this.user.phan_quyen_id
      };

      if (process.env.DU_AN_CODE) {
        par.duAnCode = process.env.DU_AN_CODE;
      }
      if (process.env.DU_AN_ID) {
        par.duAnId = process.env.DU_AN_ID;
      }

      await this.$services.report
        .apiReportTheoPhanQuyen(par)
        .then(res => {
          this.items = res.data.data;

          this.expandedRowKeys = res.data.data.map(x => {
            return x.report_id;
          });
        })
        .catch(err => {
          console.log(err);
        });
    },
    ShowBaoCao(e) {
      this.selected = e.row.data;
    }
  }
};
</script>
