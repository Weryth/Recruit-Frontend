<template>
  <div class="card-backdrop">
    <div v-drag class="card draggable-box">
      <h3>{{ title }}</h3>

      <el-form ref="formRef" :model="localData" label-width="120px" :rules="validationRules">
        <el-form-item v-for="field in fields" :key="field.key" :label="field.label">
          <!-- 🔒 READONLY поле -->
          <div
            v-if="field.type === 'readonly'"
            style="line-height: normal; padding: 8px 0; color: gray"
          >
            {{ localData[field.key] }}
          </div>

          <!-- 🙈 Скрытое поле -->
          <el-input
            v-else-if="field.type === 'hidden'"
            v-model="localData[field.key]"
            style="display: none"
          />

          <el-select
            v-else-if="field.type === 'catalog'"
            v-model="localData[field.key]"
            placeholder="Выберите"
            style="width: 100%"
          >
            <el-option
              v-for="item in catalogs[field.catalog] || []"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>

          <!-- 📂 Селектор из таблицы -->
          <div v-else-if="field.type === 'selector'" style="display: flex; gap: 8px">
            <el-input v-model="localData[field.key]" readonly />
            <el-button @click="openSelector(field.catalog, field.key)">Выбрать</el-button>
            <el-button @click="openDynamicCard(localData[field.key])">Открыть</el-button>
          </div>

          <!-- 📅 Дата -->
          <el-date-picker
            v-else-if="field.type === 'date'"
            v-model="localData[field.key]"
            type="date"
            placeholder="Выберите дату"
            format="DD.MM.YYYY"
            value-format="YYYY-MM-DD"
            style="width: 100%"
          />
          <!-- 📋 Массив объектов с предпросмотром -->
          <div
            v-else-if="field.type === 'array-preview'"
            style="display: flex; flex-direction: column; gap: 8px"
          >
            <el-card
              v-for="(item, index) in localData[field.key]"
              :key="index"
              class="hover-card"
              @click="openItemPreview(item)"
              style="cursor: pointer"
            >
              <div>
                {{ item[field.previewField || 'name'] || 'Объект ' + (index + 1) }}
              </div>
            </el-card>
          </div>

          <!-- ✏️ Обычный input -->
          <el-input v-else v-model="localData[field.key]" />
        </el-form-item>
      </el-form>

      <!-- Кнопки -->
      <div class="actions" style="margin-top: 16px">
        <el-button @click="$emit('close')">Закрыть</el-button>
        <el-button type="primary" :disabled="!changed" @click="validateAndSave">Изменить</el-button>
      </div>
    </div>

    <!-- 🔽 Диалог выбора -->
    <el-dialog v-model="selectorDialog.visible" title="Выбор значения">
      <el-table
        :data="catalogs[selectorDialog.catalogName] || []"
        @row-click="selectItem"
        highlight-current-row
        style="width: 100%"
      >
        <el-table-column prop="id" label="ID" />
        <el-table-column prop="name" label="Название" />
      </el-table>
    </el-dialog>

    <dynamic-card
      v-if="nestedCard.visible"
      :data="nestedCard.data"
      :fieldOverrides="nestedCard.fieldOverrides"
      @close="nestedCard.visible = false"
    />
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { reactive, computed, toRaw, ref } from 'vue'
import { getAnyRecord } from '@/api/catalog'

const formRef = ref(null)

const validationRules = computed(() => {
  const rules = {}
  fields.value.forEach((field) => {
    if (field.required) {
      rules[field.key] = [
        {
          required: true,
          message: `Поле "${field.label}" обязательно`,
          trigger: field.type === 'date' || field.type === 'catalog' ? 'change' : 'blur',
        },
      ]
    }
  })
  return rules
})

const nestedCard = reactive({
  visible: false,
  data: null,
  fieldOverrides: [],
})

function validateAndSave() {
  formRef.value.validate((valid) => {
    if (valid) {
      saveChanges()
    } else {
      console.log('Ошибка валидации')
    }
  })
}

function openItemPreview(item) {
  nestedCard.data = item
  nestedCard.fieldOverrides = Object.keys(item).map((key) => ({
    key,
    label: key,
    type: 'readonly',
  }))
  nestedCard.visible = true
}

async function openDynamicCard(key) {
  console.log('openDynamicCard called with', key)
  const data = await getAnyRecord(key)
  nestedCard.data = data
  nestedCard.fieldOverrides = [
    { key: 'id', type: 'readonly' },
    { key: 'statusID', type: 'readonly' },
    { key: 'physicalFaceID', type: 'readonly' },
    { key: 'updatedAt', type: 'readonly' },
    { key: 'createdAt', type: 'readonly' },
    { key: 'firsName', type: 'readonly' },
    { key: 'lastname', type: 'readonly' },
    { key: 'familia', type: 'readonly' },
    { key: 'fullname', type: 'readonly' },
    { key: 'inn', type: 'readonly' },
    { key: 'passport', type: 'readonly' },
    { key: 'snils', type: 'readonly' },
    { key: 'vacancyId', type: 'readonly' },
    { key: 'candidate', type: 'hidden' },
    { key: 'Candidates', type: 'readonly' },
    { key: 'vacancyId', type: 'readonly' },
    { key: 'valute', type: 'readonly' },
    { key: 'user_id', type: 'readonly' },
    { key: 'vacancyName', type: 'readonly' },
    { key: 'vacancyDesc', type: 'readonly' },
    { key: 'pay', type: 'readonly' },
  ]
  nestedCard.visible = true
}

const props = defineProps({
  data: Object,
  fieldOverrides: Array,
  type: String,
  title: String,
  fieldLabels: {
    type: Object,
    default: () => ({}),
  },
})
const emit = defineEmits(['close', 'update'])

const originalData = toRaw(props.data || {})
const localData = reactive({ ...originalData })

import { useCatalogStore } from '@/stores/catalogStore'

const catalogStore = useCatalogStore()
const catalogs = storeToRefs(catalogStore).getAll
// 🔖 Каталоги данных (для select и селектора)

// 🧠 Формируем поля для формы
const fields = computed(() => {
  const map = {}
  props.fieldOverrides?.forEach((f) => (map[f.key] = f))

  return Object.keys(originalData).map((key) => {
    const override = map[key] || {}
    return {
      key,
      type: 'input',
      label: override.label || props.fieldLabels[key] || key,
      ...override,
    }
  })
})

// 🟡 Проверка изменений
const changed = computed(() => fields.value.some((f) => localData[f.key] !== originalData[f.key]))

// 🧾 Заголовок карточки
const title = computed(() => props.title || localData.name || 'Объект')

// 📂 Селектор
const selectorDialog = reactive({
  visible: false,
  catalogName: '',
  targetKey: '',
})

function openSelector(catalogName, key) {
  console.log('Opening selector for catalog:', catalogName, 'with key:', key)
  selectorDialog.visible = true
  selectorDialog.catalogName = catalogName
  selectorDialog.targetKey = key
}

function selectItem(row) {
  localData[selectorDialog.targetKey] = row.id
  selectorDialog.visible = false
}

function saveChanges() {
  const updated = {}
  fields.value.forEach((f) => {
    updated[f.key] = localData[f.key]
  })
  emit('update', updated)
}
</script>
