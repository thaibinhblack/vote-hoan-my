<template>

  <ValidationProvider :name="label" rules="required" :invalid="valid" v-slot="{errors}"
                      :rules="required ? 'required':''">
    <v-autocomplete :items="items"
                    :label="label"
                    item-value="hospital_id"
                    item-text="name"
                    cache-items
                    :error-messages="errors"
                    :readonly="readOnly"
                    :prepend-icon="icon"
                    v-model="select"
                    :clearable="clearable"
                    @change="onSelectionChanged"
    >
    </v-autocomplete>

  </ValidationProvider>

</template>


<script>
import {mapState, mapActions} from "vuex"

export default {
  props: {
    label: {
      type: String,
      default: "Hospital",
      require: true,
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
    icon: {
      type: String,
      default: "archive",
      require: true,
    },
    readOnly: {
      type: Boolean,
      default: false
    },

  },
  computed: {
    ...mapState({})
  },
  data() {
    return {
      loading: false,
      search: null,
      select: null,
      items: [],
    }
  },
  watch: {
    search(val) {
      // val && val !== this.select && this.querySelections(val)
    },
  },
  async created() {
    this.GetData();
  },
  methods: {
    GetData() {
      this.loading = true;
      if (this.phanQuyen) {
        this.$services.hospital.apiGetAllByTaiKhoanId()
          .then(res => {
            if (res.status === 200) {
              this.items = res.data.data;
            }

            if (this.value) {
              this.select = this.items.filter(x => x.hospital_id === this.value)[0];
            }

          })
          .catch(err => {
            console.log(err)
          });
      }
      if (!this.phanQuyen) {
        this.$services.hospital.apiGetAll()
          .then(res => {
            if (res.status === 200) {
              this.items = res.data.data;
            }

            if (this.value) {
              this.select = this.items.filter(x => x.hospital_id === this.value)[0];
            }

          })
          .catch(err => {
            console.log(err)
          });
      }

      this.loading = false;
    },
    seachQuery(item, queryText, itemText) {

      if (item) {
        return (
          item.ten_benh_vien.toLowerCase().includes(queryText.toLowerCase())
        );
      }

    },
    //...mapActions(['DuAn/getComboboxData']),
    onSelectionChanged(e) {
      if (e) {
        this.$emit("update:value", e);
        this.$emit('onSelectionChanged', e)
      }

      if (!e) {
        this.$emit("update:value", null);
        this.$emit('onSelectionChanged', null)
      }

    }

  },

}
</script>

<style lang="scss">


</style>
