<template>
    <Bar :data="chartData" :options="chartOptions" />
  </template>
  
  <script setup>
  import { Bar } from 'vue-chartjs'
  defineProps({
    chartData: Object,
    chartOptions: Object
  })
  </script>