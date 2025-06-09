<template>
  <PageHeader title="Панель администратора" />
  <div class="admin-page">
    <!-- Показатели -->
    <el-card>
      <el-row :gutter="20" justify="space-between">
        <el-col :span="6">
          <div class="stat-card">
            <span class="label">Рекрутеры</span>
            <strong class="value">{{ stats.recruiters }}</strong>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="stat-card">
            <span class="label">Вакансии</span>
            <strong class="value">{{ stats.vacancies }}</strong>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="stat-card">
            <span class="label">Физические лица</span>
            <strong class="value">{{ stats.persons }}</strong>
          </div>
        </el-col>
      </el-row>
    </el-card>

    <!-- Табы -->
    <el-tabs v-model="activeTab" type="card">
      <!-- Вкладка: Статусы -->
      <el-tab-pane label="Статусы" name="statuses">
        <div class="flex justify-end mb-2">
          <el-button type="primary" @click="addStatus">Добавить статус</el-button>
        </div>
        <el-table :data="statuses" border style="width: 100%">
          <el-table-column prop="id" label="ID Cтатуса" />
          <el-table-column prop="name" label="Название статуса" />
        </el-table>
      </el-tab-pane>

      <!-- Вкладка: Рекрутеры -->
      <el-tab-pane label="Рекрутеры" name="recruiters">
        <div class="flex justify-end mb-2">
          <el-button type="success" @click="registerRecruiter"
            >Зарегистрировать рекрутера</el-button
          >
        </div>
        <el-table :data="recruiters" border style="width: 100%">
          <el-table-column prop="id" label="ID Рекрутера" />
          <el-table-column prop="name" label="Имя" />
        </el-table>
      </el-tab-pane>
    </el-tabs>
  </div>
  <DynamicCard
    v-if="selectedData"
    title=""
    :data="selectedData"
    :field-overrides="[
      { key: 'id', type: 'readonly' },
      { key: 'statusID', type: 'selector', catalog: 'statuses', required: true },
      { key: 'pfId', type: 'selector', catalog: 'physicalFaces', required: true },
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
      statusName: 'Наименование статуса',
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
      pfId: 'ID Физического лица',
    }"
    @update="onUpdate"
    @close="selectedData = null"
  />
</template>

<script setup lang="ts">
import PageHeader from '@/components/PageHeader.vue'
import DynamicCard from '@/components/DynamicCard.vue'
import { useCatalogStore } from '@/stores/catalogStore'
import { ref } from 'vue'
import { createStatus } from '@/api/statuses'

const catalogStore = useCatalogStore()

const stats = ref({
  recruiters: catalogStore.recruiters.length,
  vacancies: catalogStore.vacancies.length,
  persons: catalogStore.physicalFaces.length,
})

const selectedData = ref(null)
const selectedType = ref('')

const activeTab = ref('statuses')

async function onUpdate(data) {
  if (selectedType.value == 'create-status') {
    await createStatus(data)
    //await createCandidate(data)
  }
  if (selectedType.value == 'create-recruter') {
    await createRecruiter(data)
  }
  // await fetch('/api/update', {
  //   method: 'POST',
  //   body: JSON.stringify(),
  //   headers: { 'Content-Type': 'application/json' },
  // })
  selectedData.value = null
  //usersStore.getUsers()
  catalogStore.initCatalogs()
}

//const usersStore = useUsersStore()
import { computed } from 'vue'
import { createRecruiter } from '@/api/users'

const statuses = computed(() => catalogStore.statuses)
const recruiters = computed(() => catalogStore.recruiters)

function addStatus() {
  console.log('Добавить статус')
  selectedData.value = {
    statusName: null,
    statusDesc: null,
  }
  selectedType.value = 'create-status'
}

function registerRecruiter() {
  console.log('Зарегистрировать рекрутера')
  selectedData.value = {
    email: null,
    password: null,
    pfId: null,
  }
  selectedType.value = 'create-recruter'
}
</script>

<style scoped>
.admin-page {
  padding: 10px;
  margin-top: 10px;
  margin-left: auto;
  width: 98%;
  height: 600px;
  display: flex;
  border-radius: 10px;
  background-color: white;
  overflow: auto;
}

.el-button {
  margin-bottom: 10px;
}
.el-tabs {
  width: 80%;
}
.el-row {
  display: block;
}
.stat-card {
  width: 100px;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
}
.stat-card .label {
  font-size: 14px;
  color: #909399;
}
.stat-card .value {
  display: block;
  font-size: 24px;
  color: #303133;
  margin-top: 4px;
}
</style>
