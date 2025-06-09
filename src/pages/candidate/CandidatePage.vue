<template>
  <PageHeader title="Кандидат"> </PageHeader>
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
      :data="usersStore.users"
      @row-click="openCard"
      hiddenFields="[]"
      :contextActions="[
        { label: 'Редактировать', value: 'edit' },
        { label: 'Удалить', value: 'delete' },
      ]"
      :fieldLabels="{
        id: 'Системный ID Вакансии',
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
      }"
    />
  </div>

  <DynamicCard
    v-if="selectedData"
    title="Кандидат"
    :data="selectedData"
    :field-overrides="[
      { key: 'id', type: 'readonly' },
      { key: 'statusID', type: 'selector', catalog: 'statuses', required: true },
      { key: 'physicalFaceID', type: 'selector', catalog: 'physicalFaces', required: true },
      { key: 'updatedAt', label: 'Дата обновления', type: 'date' },
      { key: 'createdAt', label: 'Дата создания', type: 'date' },
      { key: 'firsName', type: 'readonly' },
      { key: 'lastname', type: 'readonly' },
      { key: 'familia', type: 'readonly' },
      { key: 'fullname', type: 'readonly' },
      { key: 'inn', type: 'readonly' },
      { key: 'passport', type: 'readonly' },
      { key: 'snils', type: 'readonly' },
      { key: 'vacancyId', type: 'selector', catalog: 'vacancies', required: true },
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

import { useUsersStore } from '@/stores/users'
import { onMounted, ref, watch } from 'vue'
import { createCandidate } from '@/api/candidate'
import { useRoute } from 'vue-router'
import { updateCandidate } from '@/api/users'
const route = useRoute()

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
    statusID: null,
    physicalFaceID: null,
    vacancyId: null,
  }
  selectedType.value = 'create-candidate' // если нужно
}

function openCard(row) {
  selectedData.value = row
  selectedType.value = 'user' // можно определить по структуре row или из таблицы
}

async function onUpdate(data) {
  if (selectedType.value == 'create-candidate') {
    await createCandidate(data)
    selectedData.value = null
    usersStore.getUsers()
    return
  }
  
  await updateCandidate(data)
  
  // await fetch('/api/update', {
  //   method: 'POST',
  //   body: JSON.stringify(),
  //   headers: { 'Content-Type': 'application/json' },
  // })
  selectedData.value = null
  usersStore.getUsers()
}

const usersStore = useUsersStore()

onMounted(() => {
  usersStore.getUsers()
})

const onSearch = () => {
  usersStore.getUsers(searchQuery.value, selectedRecruiter.value)
}
</script>
