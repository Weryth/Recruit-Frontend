<template>
  <Pie :data="chartData" :options="chartOptions" />
</template>

<script setup>
import { Pie } from 'vue-chartjs'
defineProps({
  chartData: Object,
  chartOptions: Object,
})
</script>
