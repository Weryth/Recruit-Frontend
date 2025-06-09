<template>
  <PageHeader title="Вакансии"> </PageHeader>
  <PageSearch
    v-model:search="searchQuery"
    v-model:recruiter="selectedRecruiter"
    @submit="onSearch"
  />
  <div class="vork-area">
    <el-button @click="createRecord" type="primary" circle>
      <el-icon><Plus /></el-icon>
    </el-button>
    <JsonTable
      :key="route.fullPath"
      :data="vacanciesStore.vacancies"
      @row-click="openCard"
      :hiddenFields="['Candidates', 'Candidate']"
      :fieldLabels="{
        id: 'Системный ID Вакансии',
        updatedAt: 'Дата последнего обновления',
        createdAt: 'Дата создания',
        vacancyName: 'Наименование вакансии',
        vacancyDesc: 'Описание вакансии',
        pay: 'ЗП',
        valute: 'Валюта оплаты',
        user_id: 'ID рекрутера',
      }"
    />
  </div>

  <DynamicCard
    v-if="selectedData"
    title="Вакансии"
    :data="selectedData"
    :field-overrides="[
      { key: 'id', type: 'readonly' },
      { key: 'statusID', type: 'selector', catalog: 'statuses' },
      { key: 'physicalFaceID', type: 'selector', catalog: 'physicalFaces' },
      { key: 'updatedAt', type: 'readonly' },
      { key: 'createdAt', type: 'readonly' },
      { key: 'Candidates', label: 'Кандидаты', previewField: 'fullname', type: 'array-preview' },
      { key: 'fullnames', type: 'readonly' },
      { key: 'valute', type: 'selector', catalog: 'valutes' },
      { key: 'user_id', type: 'selector', catalog: 'recruiters' },
    ]"
    :fieldLabels="{
      id: 'Системный ID',
      updatedAt: 'Дата последнего обновления',
      createdAt: 'Дата создания',
      statusID: 'Системный id статуса',
      physicalFaceID: 'Системный id физического лица',
      vacancyId: 'Системный id вакансии',
      valute: 'Валюта оплаты',
      firsName: 'Имя',
      lastname: 'Отчество',
      familia: 'Фамилия',
      inn: 'ИНН',
      passport: 'Паспорт',
      snils: 'СНИЛС',
      vacancyName: 'Наименование вакансии',
      vacancyDesc: 'Описание вакансии',
      pay: 'ЗП',
      user_id: 'Рекрутер',
    }"
    @update="onUpdate"
    @close="selectedData = null"
  />

  <div></div>
</template>

<script setup lang="ts">
import { Plus } from '@element-plus/icons-vue'
import JsonTable from '@/components/JsonTable.vue'
import PageHeader from '@/components/PageHeader.vue'
import PageSearch from '@/components/PageSearch.vue'
import DynamicCard from '@/components/DynamicCard.vue'

import { useVacanciesStore } from '@/stores/vacancies'
import { onMounted, ref, watch } from 'vue'
import { createCandidate } from '@/api/candidate'
import { useRoute } from 'vue-router'
import { createVacancy, updateVacancy } from '@/api/vacancies'
const route = useRoute()
const vacanciesStore = useVacanciesStore()

const searchQuery = ref('')
const selectedRecruiter = ref('')

const selectedData = ref(null)
const selectedType = ref('')

const fieldOverrides = [
  { key: 'id', type: 'readonly' },
  { key: 'recruiter', type: 'catalog', catalog: 'recruiters' },
]

function createRecord() {
  selectedData.value = {
    vacancyName: null,
    vacancyDesc: null,
    pay: 0,
    valute: 'RUB',
  }
  selectedType.value = 'create-vacancy' // если нужно
}

function openCard(row) {
  selectedData.value = row
  selectedType.value = 'user' // можно определить по структуре row или из таблицы
}

async function onUpdate(data) {
  if (selectedType.value == 'create-vacancy') {
    await createVacancy(data)
    selectedData.value = null
    vacanciesStore.getVacancies()
    return
  }
  await updateVacancy(data)
  // await fetch('/api/update', {
  //   method: 'POST',
  //   body: JSON.stringify(),
  //   headers: { 'Content-Type': 'application/json' },
  // })
  selectedData.value = null
  vacanciesStore.getVacancies()
}
vacanciesStore.getVacancies()
watch(
  () => route.fullPath,
  () => {
    vacanciesStore.getVacancies()
  },
)

const onSearch = () => {
  vacanciesStore.getVacancies(searchQuery.value, selectedRecruiter.value)
}
</script>
