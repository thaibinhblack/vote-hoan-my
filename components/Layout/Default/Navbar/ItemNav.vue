<template>
  <div>
    <v-list-item
      v-if="!item.children || item.children === 0"
      router
      exact
      :to="localePath(item.path)"
      @click.stop="ClickItem"
    >
      <v-list-item-icon>
        <v-icon>{{ item.icon }}</v-icon>
      </v-list-item-icon>
      <v-list-item-title>{{ item.menu_name }}</v-list-item-title>
    </v-list-item>

    <v-list-group
      v-if="item.children && item.children.length"
      :prepend-icon="item.icon"
      no-action
      :sub-group="item.cap > 1"
    >
      <template v-slot:activator>
        <v-list-item-title>{{ lang === 'en' ? item.menu_name_english : item.menu_name }}</v-list-item-title>
      </template>

      <v-list-item v-show="getMenu(item.children).length > 0">
        <ItemNav
          v-for="menu in getMenu(item.children)"
          :key="menu.id"
          :item="menu"
        >
        </ItemNav>
      </v-list-item>

      <v-list-item
        v-for="crud in getMenu2(item.children)"
        :key="crud.id"
        :to="localePath(crud.path)"
        @click.stop="ClickItem"
      >
        <v-list-item-title
          v-if="!crud.children || crud.children === 0"
        >
          {{ lang === 'en' ? crud.menu_name_english : crud.menu_name }}
        </v-list-item-title>
        <v-list-item-action v-if="!crud.children || crud.children === 0">
          <v-icon v-text="crud.icon"></v-icon>
        </v-list-item-action>
      </v-list-item>
    </v-list-group>
  </div>
</template>

<script>
import {mapState} from "vuex";

export default {
  name: "ItemNav",
  computed: {
    ...mapState({
      drawer: state => state.drawer
    }),
    lang() {
      return this.$i18n.getLocaleCookie();
    },
  },
  components: {},
  props: {
    item: Object
  },
  methods: {
    getMenu(item) {
      let datarMenu = item.filter(menu => {
        return menu.children && menu.children.length > 0;
      });
      datarMenu = _.sortBy(datarMenu, ['order_by']);
      return datarMenu;

    },
    getMenu2(item) {
      let datarMenu = item.filter(menu => {
        return menu.children == null || menu.children.length === 0;
      });
      datarMenu = _.sortBy(datarMenu, ['order_by']);
      return datarMenu;
    },
    ClickItem() {
      this.$store.commit("SET_DRAWER", !this.drawer);
    }
  }
};
</script>
