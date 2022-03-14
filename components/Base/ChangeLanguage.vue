<template>
  <v-dialog v-model="dialog" persistent max-width="400">
    <v-card>
      <v-card-title>
        {{ $t("languageSelect") }}
      </v-card-title>
      <v-card-text>
        <v-select
          v-model="langSelect"
          :items="availableLocales"
          item-text="name"
          item-value="code"
          :label="$t('languageSelect')"
          append-icon="mdi-flag-variant"
          @input="onSelectLangInputChange"
        />
      </v-card-text>
      <v-card-actions>
        <v-spacer/>
<!--        <v-btn color="secondary" class="mr-2 ml-10" dark @click="close">-->
<!--          {{ $t("button.close") }}-->
<!--          <v-icon right dark>mdi-close</v-icon>-->
<!--        </v-btn>-->
        <v-btn color="primary" @click="onCLickOk">
          {{ $t("button.ok") }}
          <v-icon right>
            mdi-check
          </v-icon>
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "ChangeLanguage",
  props: {
    dialog: {
      type: Boolean,
      default: false,
    },

  },
  data() {
    return {
      langSelect: null,
    }
  },
  computed: {
    availableLocales() {
      return this.$i18n.locales;
    },
  },
  created() {
    this.langSelect = this.$i18n.getLocaleCookie();
  },
  methods: {
    close() {
      this.$emit("update:dialog", false);
    },
    onCLickOk(){
      location.reload();
      this.close();
    },
    async onSelectLangInputChange(e) {
      await this.$i18n.setLocaleCookie(e);
      await this.$i18n.setLocale(e);

    }
  }

}
</script>

<style scoped>

</style>
