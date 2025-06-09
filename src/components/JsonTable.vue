<template>
  <el-table class="json-table" :data="data" border style="width: 100%">
    <el-table-column
      v-for="(col, index) in autoColumns"
      :key="index || 'new'"
      :prop="col.prop"
      :label="col.label"
      :width="col.width || 200"
    />
  </el-table>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  data: {
    type: Array,
    required: true,
  },
  columns: {
    type: Array,
    default: () => [],
  },
  hiddenFields: {
    type: Array,
    default: () => [],
  },
  fieldLabels: {
    type: Object,
    default: () => ({}),
  },
})

const autoColumns = computed(() => {
  if (props.columns.length > 0) return props.columns
  if (!props.data || !props.data.length) return []

  return Object.keys(props.data[0])
    .filter((key) => !props.hiddenFields.includes(key))
    .map((key) => ({
      prop: key,
      label: props.fieldLabels[key] || key.charAt(0).toUpperCase() + key.slice(1),
    }))
})
</script>
