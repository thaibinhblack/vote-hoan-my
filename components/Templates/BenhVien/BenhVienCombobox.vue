<template>
  <v-autocomplete
    :items="items"
    :label="label ? label: this.$t('hospital.name')"
    :error-messages="errorsMessages"
    :readonly="readOnly"
    :prepend-icon="prependIcon"
    :append-icon="appendIcon"
    :clearable="clearable"
    v-model="select"
    cache-items
    :fullWidth="fullWidth"
    item-text="name"
    item-value="hospital_id"
    @change="onSelectionChanged"
    :single-line="singleLine"
    :outlined="outlined"
    :dense="isDense"
    return-object
  />
</template>

<script>

export default {
  props: {
    isDense: {
      type: Boolean,
      default: false,
    },
    outlined: {
      type: Boolean,
      default: false
    },
    label: {
      type: String,
      default: "Hospital",
      require: true,
    },
    fullWidth: {
      type: Boolean,
      default: false,
    },
    phanQuyen: {
      type: Boolean,
      default: false
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
    duAnId: {
      type: Number,
      default: null,
      require: true,
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
    errorsMessages: {
      type: String,
      default: null
    },
    singleLine: {
      type: Boolean,
      default: false,
    },
    phongKham: {
      type: Boolean,
      default: null,
    }

  },
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
  },
  methods: {
    updatePropsData(e) {
      this.$emit("input", e);
      this.$emit("update:value", e);
      this.$emit("update:input", e);

    },
    GetData() {
      this.loading = true;
      if (this.phanQuyen) {
        let par = {}
        if (this.phongKham) {
          par.phongKham = this.phongKham;
        }
        this.$services.hospital.apiGetAllByTaiKhoanId(par)
          .then(res => {
            if (res.status === 200) {
              this.items = res.data.data;
            }

            if (this.value) {
              this.select = this.items.filter(x => x.hospital_id === this.value)[0];

              if (this.select)
                this.updatePropsData(this.select.hospital_id);
            }

          })
          .catch(err => {
            console.log(err)
          });
      }
      if (!this.phanQuyen) {

        let par = {}

        if (this.phongKham) {
          par.phongKham = this.phongKham;
        }

        this.$services.hospital.apiGetAll(par)
          .then(res => {
            if (res.status === 200) {
              this.items = res.data.data;
            }

            if (this.value) {
              this.select = this.items.filter(x => x.hospital_id === this.value)[0];
              this.updatePropsData(this.select.hospital_id);
            }

          })
          .catch(err => {
            console.log(err)
          });
      }

      this.loading = false;
    },
    onSelectionChanged(e) {
      if (e) {
        this.$emit('onSelectionChanged', e);
        this.updatePropsData(e.hospital_id);
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
