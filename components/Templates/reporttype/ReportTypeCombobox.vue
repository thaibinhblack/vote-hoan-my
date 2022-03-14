<template>
  <v-autocomplete
    :items="items"
    :label="label ? label: this.$t('reportType.name')"
    :error-messages="errorsMessage"
    :readonly="readOnly"
    :prepend-icon="prependIcon"
    :append-icon="appendIcon"
    :clearable="clearable"
    v-model="select"
    :full-width="fullWidth"
    item-text="name"
    item-value="id"
    @change="onSelectionChanged"
    :loading="loading"
    :auto-select-first="autoSelectFirst"
    :solo="solo"
    :dense="isDense"
    return-object
    :outlined="outlined"
  />
</template>

<script>

import CheckError from "~/utils/handlerErro";

export default {
  props: {
    outlined: {
      type: Boolean,
      default: false
    },
    fullWidth: {
      type: Boolean,
      default: false
    },
    label: {
      type: String,
      default: null,
      require: true,
    },
    code: {
      type: String,
      default: null,
    },
    value: {
      type: Number,
      default: null,
      require: true,
    },
    clearable: {
      type: Boolean,
      default: true
    },

    valid: {
      type: Boolean,
      default: true
    },
    required: {
      type: Boolean,
      default: false
    },
    prependIcon: {
      type: String,
    },
    appendIcon: {
      type: String,
    },
    readOnly: {
      type: Boolean,
      default: false
    },
    width: {
      type: Number,
      default: 200,
    },
    autoSelectFirst: {
      type: Boolean,
      default: false,
    },
    solo: {
      type: Boolean,
      default: false,
    },
    isDense: {
      type: Boolean,
      default: false,
    },
    errorsMessage: {
      type: String,
      default: null,
    }
  },
  computed: {},
  data() {
    return {
      loading: false,
      search: null,
      select: null,
      items: [],
    }
  },

  async created() {
    this.GetData();

    if (this.value) {
      this.select = this.value;
    }
    if (this.readOnly) {
      this.clearable = false;
    }
  },
  methods: {
    GetData() {
      this.loading = true;
      this.$services.reporttype.apiGetAll()
        .then(res => {
          if (res.status === 200) {
            this.items = res.data.data;
            if (this.code) {
              if (this.items.length > 0) {
                let item = _.filter(this.items, x => x.code === this.code);
                if (item) {
                  this.select = item[0].id;
                  this.updatePropsData(this.select);
                }

              }


            }
          }
        })
        .catch(err => {
          CheckError(err);
        });
      this.loading = false;
    },
    updatePropsData(e) {
      this.$emit("update:value", e);
      this.$emit("update:input", e);
      this.$emit("input", e);
    },
    onSelectionChanged(e) {
      if (e) {
        this.updatePropsData(e.id);
        this.$emit('onSelectionChanged', e)
      }
      if (!e) {
        this.updatePropsData(null);
        this.$emit('onSelectionChanged', null)
      }

    }

  },

}
</script>

<style lang="scss">


</style>
