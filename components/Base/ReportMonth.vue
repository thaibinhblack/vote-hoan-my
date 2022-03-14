<template>

  <ValidationProvider :name="label" rules="required" :invalid="valid" v-slot="{errors}"
                      :rules="required ? 'required':''">
    <v-autocomplete :items="items"
                    :label="label"
                    item-value="id"
                    item-text="name"
                    cache-items
                    :error-messages="errors"
                    :prepend-icon="icon"
                    v-model="localState"
                    @change="onSelectionChanged"
    >
    </v-autocomplete>
  </ValidationProvider>
</template>


<script>

export default {
  props: {
    label: {
      type: String,
      default: "Tháng báo cáo",
      require: true,
    },
    value: {
      type: Number,
      default: new Date().getMonth() + 1,
      require: true,
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
      default: "mdi-calendar",
      require: true,
    }

  },
  computed: {
    localState: {
      get() {
        return this.value;
      },
      set(localState) {
        this.$emit("input", localState);
      },

    }
  },
  data() {
    return {
      loading: false,
      search: null,
      select: null,
      items: [
        {
          id: 1,
          name: "Tháng 1",
        },
        {
          id: 2,
          name: "Tháng 2",
        },
        {
          id: 3,
          name: "Tháng 3",
        },
        {
          id: 4,
          name: "Tháng 4",
        },
        {
          id: 5,
          name: "Tháng 5",
        },
        {
          id: 6,
          name: "Tháng 6",
        },
        {
          id: 7,
          name: "Tháng 7",
        },
        {
          id: 8,
          name: "Tháng 8",
        },
        {
          id: 9,
          name: "Tháng 9",
        },
        {
          id: 10,
          name: "Tháng 10",
        },
        {
          id: 11,
          name: "Tháng 11",
        },
        {
          id: 12,
          name: "Tháng 12",
        }
      ],
    }
  },
  async created() {
    this.$emit("update:value", new Date().getMonth() + 1);
    this.$emit("input", new Date().getMonth() + 1);
  },
  destroyed() {
    this.$emit("update:value", null);
    this.$emit('onSelectionChanged', null);
    this.$emit("input", null);
  },
  methods: {
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
