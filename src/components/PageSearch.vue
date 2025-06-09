<template>
  <div class="search_container">
    <el-form :inline="true" :model="form" class="search-form" @submit.prevent="onSearch">
      <el-form-item>
        <el-input v-model="form.query" placeholder="Введите запрос" clearable />
      </el-form-item>
      <el-form-item v-if="showRecruiterSelect">
        <el-select
          v-model="form.recruiter"
          placeholder="Все рекрутеры"
          clearable
          style="width: 200px"
        >
          <el-option v-for="r in recruiters" :key="r.id" :label="r.name" :value="r.id" />
        </el-select>
      </el-form-item>
      <el-form-item class="submit-button">
        <el-button type="primary" @click="onSearch">Поиск</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { reactive } from 'vue'

import { ref } from 'vue'

import { useUsersStore } from '@/stores/users'

const emit = defineEmits(['update:search', 'update:recruiter', 'submit'])

const form = reactive({
  query: '',
  recruiter: null,
})

defineProps({
  showRecruiterSelect: { type: Boolean, default: true },
})

import { useCatalogStore } from '@/stores/catalogStore'

const catalogStore = useCatalogStore()
const { recruiters } = storeToRefs(catalogStore)

const usersStore = useUsersStore()

function onSearch() {
  // Обновляем родительские значения
  emit('update:search', form.query)
  emit('update:recruiter', form.recruiter)

  // Вызываем обработчик поиска в родителе
  emit('submit')
}
</script>
