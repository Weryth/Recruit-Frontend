<template>
  <PageHeader title="Главная страница" />
  <el-button id="button" @click="generatePDF">Экспорт в PDF</el-button>

  <el-card class="box-card">
    <template #header>
      <div class="card-header">
        <span>Статистика</span>
      </div>
    </template>

    <div ref="pdfBlock" class="pdf-content">
      <div v-if="isReady">
        <div class="one-chart-container">
          <BarChart class="chart" id="bar" :chart-data="dataBar" :chart-options="optionsBar" />
        </div>
        <div class="one-chart-container">
          <PieChart id="pie" :chart-data="dataPie" :chart-options="optionsPie" />
        </div>
      </div>
      <div v-else>
        <el-skeleton rows="5" animated />
      </div>
    </div>
  </el-card>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
import PageHeader from '@/components/PageHeader.vue'
import BarChart from '@/components/charts/BarChart.vue'
import PieChart from '@/components/charts/PieChart.vue'

import { useRouter } from 'vue-router'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import { useStatsStore } from '@/stores/stats'

const statsStore = useStatsStore()
const isReady = ref(false) // флаг готовности данных

// Инициализация данных графика после загрузки
const dataBar = reactive({
  labels: [
    'Янв',
    'Фев',
    'Мар',
    'Апр',
    'Май',
    'Июнь',
    'Июль',
    'Авг',
    'Сент',
    'Окт',
    'Нояб',
    'Декабрь',
  ],
  datasets: [
    {
      label: 'Кандидаты в вашей зоне ответственности',
      backgroundColor: '#409EFF',
      data: [], // сначала пусто
    },
  ],
})

const dataPie = reactive({
  labels: [],
  datasets: [
    {
      label: 'Распределение по статусам',
      data: [],
      backgroundColor: [],
      hoverOffset: 10,
    },
  ],
})

onMounted(async () => {
  await statsStore.getStats()

  dataBar.datasets[0].data = statsStore.mounth

  // Обновляем данные для круговой диаграммы
  dataPie.labels = statsStore.statuses.statuses
  dataPie.datasets[0].data = statsStore.statuses.datas
  dataPie.datasets[0].backgroundColor = statsStore.statuses.colour

  isReady.value = true
})

const optionsBar = reactive({
  responsive: true,
  plugins: {
    legend: { display: false },
    title: { display: true, text: 'Кандидаты в вашей зоне ответственности' },
  },
})

const optionsPie = reactive({
  responsive: true,
  plugins: {
    legend: { position: 'bottom' },
    title: { display: true, text: 'Распределение ваших кандидатов па статусам' },
  },
})

const pdfBlock = ref(null)

const generatePDF = async () => {
  const el = pdfBlock.value
  if (!el) return

  const canvas = await html2canvas(el, { scale: 2, useCORS: true })
  const imgData = canvas.toDataURL('image/png')
  const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' })

  const pdfWidth = pdf.internal.pageSize.getWidth()
  const pdfHeight = pdf.internal.pageSize.getHeight()

  // Получаем размеры изображения
  const imgProps = pdf.getImageProperties(imgData)
  const imgWidth = imgProps.width
  const imgHeight = imgProps.height

  // Вычисляем масштаб, чтобы изображение максимально вписалось в страницу, сохраняя пропорции
  const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight)

  const imgScaledWidth = imgWidth * ratio
  const imgScaledHeight = imgHeight * ratio

  // Центрируем изображение по горизонтали и вертикали
  const x = (pdfWidth - imgScaledWidth) / 2
  const y = (pdfHeight - imgScaledHeight) / 2

  pdf.addImage(imgData, 'PNG', x, y, imgScaledWidth, imgScaledHeight)
  pdf.save('report.pdf')
}

// Загрузка данных при монтировании
onMounted(async () => {
  await statsStore.getStats() // дожидаемся загрузки
  dataBar.datasets[0].data = statsStore.mounth // только после загрузки
  isReady.value = true // рендерим графики
})

const router = useRouter()
const selectedRoute = ref(null)
</script>
