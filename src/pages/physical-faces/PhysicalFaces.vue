<template>
  <PageHeader title="Физические лица"> </PageHeader>
  <PageSearch
    v-model:search="searchQuery"
    v-model:recruiter="selectedRecruiter"
    @submit="onSearch"
    :showRecruiterSelect="false"
  />
  <div class="vork-area">
    <el-button @click="createRecord" type="primary" circle>
      <el-icon><Plus /></el-icon>
    </el-button>
    <JsonTable
      :key="route.fullPath"
      :data="pfStore.physicalFaces"
      @row-click="openCard"
      hiddenFields="['fullname']"
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
      }"
    />
  </div>

  <DynamicCard
    v-if="selectedData"
    title="Физическое лицо"
    :data="selectedData"
    :field-overrides="[
      { key: 'id', type: 'readonly' },
      { key: 'statusID', type: 'selector', catalog: 'statuses' },
      { key: 'physicalFaceID', type: 'selector', catalog: 'physicalFaces' },
      { key: 'updatedAt', type: 'readonly' },
      { key: 'createdAt', type: 'readonly' },
      { key: 'firsName', type: '' },
      { key: 'lastname', type: '' },
      { key: 'familia', type: '' },
      { key: 'fullname', type: 'hidden' },
      { key: 'inn', type: '' },
      { key: 'passport', type: '' },
      { key: 'snils', type: '' },
      { key: 'candidate', type: 'hidden' },
      { key: 'Candidates', label: 'Кандидаты', previewField: 'fullname', type: 'array-preview' },
      { key: 'vacancyId', type: 'selector', catalog: 'vacancies' },
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

import { usePFStore } from '@/stores/physicalFace'
import { onMounted, ref, watch } from 'vue'
import { createCandidate } from '@/api/candidate'
import { useRoute } from 'vue-router'
import { createPF, updatePF } from '@/api/physical-face'
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
    firsName: null,
    lastname: null,
    familia: null,
    inn: null,
    passport: null,
    snils: null,
  }
  selectedType.value = 'create-pf' // если нужно
}

function openCard(row) {
  selectedData.value = row
  selectedType.value = 'user' // можно определить по структуре row или из таблицы
}

async function onUpdate(data) {
  if (selectedType.value == 'create-pf') {
    await createPF(data)
    selectedData.value = null
    pfStore.getPF()
    return
  }
  await updatePF(data)
  // await fetch('/api/update', {
  //   method: 'POST',
  //   body: JSON.stringify(),
  //   headers: { 'Content-Type': 'application/json' },
  // })
  selectedData.value = null
  pfStore.getPF()
}

const pfStore = usePFStore()

onMounted(() => {
  pfStore.getPF()
})

const onSearch = () => {
  pfStore.getPF(searchQuery.value, selectedRecruiter.value)
}
</script>
