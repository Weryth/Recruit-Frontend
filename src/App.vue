<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { onMounted } from 'vue'
import BaseChart from '@/components/charts/BaseChart.vue'
import { useVacanciesStore } from '@/stores/vacancies'
import { useUsersStore } from '@/stores/users'
</script>

<template>
  <BaseChart />
  <RouterView />
</template>
