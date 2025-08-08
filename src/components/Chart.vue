<template>
  <div>
    <h1 class="section-title">Performance</h1>
    <div class="bg-positions-darker h-[400px] rounded-xs">
      <Line :data="chartData" :options="chartOptions" />
    </div>
  </div>
</template>

<script setup>
import 'chartjs-adapter-date-fns'
import annotationPlugin from 'chartjs-plugin-annotation'
import { formatPercent } from '@/utils/calculations.js'
import { Line } from 'vue-chartjs'
import { onMounted, ref } from 'vue'
import { Chart as ChartJS, Legend, LineElement, LinearScale, PointElement, TimeScale, Title, Tooltip } from 'chart.js'

ChartJS.register(annotationPlugin, Legend, LineElement, LinearScale, PointElement, TimeScale, Title, Tooltip)

const annotationsConfig = ref([])
const historyData = ref([])
const chartData = ref({ labels: [], datasets: [] })
const chartOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    annotation: { annotations: annotationsConfig },
    legend: {
      display: false,
      labels: {
        color: '#FFFFFF',
        usePointStyle: true,
      },
      position: 'top',
    },
    title: {
      color: '#FFFFFF',
      display: true,
      font: { size: 14 },
      text: 'Fathom vs. the S&P 500 Since Inception'
    },
    tooltip: {
      callbacks: {
         label: function(context) {
          const datasetLabel = context.dataset.label || ''
          let valueLabel = ''

          if (context.parsed.y !== null) {
            valueLabel = formatPercent(context.parsed.y)
          }

          return `${datasetLabel}: ${valueLabel}`
        },
        labelTextColor: function(context) {
          const datasetIndex = context.datasetIndex // Get index of dataset being hovered

          if (datasetIndex === 0) {
            return '#ad46ff' // 'Fathom' color
          } else if (datasetIndex === 1) {
            return '#FFFFFF' // 'SPY' color
          }
        },
        title: function(tooltipItems) {
          const date = new Date(tooltipItems[0].label)

          return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })
        }
      },
      displayColors: false,
      titleColor: '#FFFFFF'
    }
  },
  scales: {
    x: {
      border: { display: false },
      grid: { display: false },
      ticks: {
        autoSkip: true,
        color: '#FFFFFF',
        font: { size: 14 },
        maxRotation: 0,
        callback: function(value) {
          const date = new Date(value)

          if (date.getMonth() === 0) {
            return date.getFullYear()
          } else {
            const quarter = `Q${Math.floor(date.getMonth() / 3) + 1}`
            return quarter
          }
        }
      },
      time: {
        tooltipFormat: 'MMM d, yyyy',
        unit: 'quarter',
      },
      type: 'time'
    },
    y: {
      beginAtZero: false,
      border: { display: false },
      display: false,
      grid: { display: false },
      ticks: {
        callback: (value) => `${Math.round(value)}`, // Rounds to a whole number
        color: '#FFFFFF'
      }
    }
  }
})

async function fetchHistory() {
  try {
    const response = await fetch('/db/history.json')
    historyData.value = await response.json()

    processChartData(historyData.value)
    annotationsConfig.value = getYearlyShading(historyData.value)

  } catch (error) {
    console.error("Could not fetch performance history:", error)
  }
}

function getYearlyShading(history) {
  if (!history || history.length < 2) {
    return []
  }

  const annotations = []
  const colorEven = 'rgb(50, 60, 70)'
  const colorOdd = 'rgb(55, 65, 75)'

  let currentYear = new Date(history[0].date).getFullYear()
  let yearStartDate = history[0].date

  for (let i = 1; i < history.length; i++) {
    const date = new Date(history[i].date)
    const year = date.getFullYear()

    if (year !== currentYear) {
      annotations.push({
        backgroundColor: (currentYear % 2 !== 0) ? colorOdd : colorEven,
        borderColor: 'transparent',
        drawTime: 'beforeDatasetsDraw',
        xMax: history[i - 1].date,
        xMin: yearStartDate,
        type: 'box',
      })
      
      currentYear = year
      yearStartDate = history[i].date
    }
  }

  annotations.push({
    backgroundColor: (currentYear % 2 !== 0) ? colorOdd : colorEven,
    borderColor: 'transparent',
    drawTime: 'beforeDatasetsDraw',
    xMax: history[history.length - 1].date,
    xMin: yearStartDate,
    type: 'box'
  })

  return annotations
}

// Function to process the raw history into a format Chart.js understands
function processChartData(history) {
  if (history.length < 2) return

  const dailyLabels = history.map(item => item.date)
  const firstBenchmarkValue = history[0].benchmarkValue
  const firstPortfolioValue = history[0].portfolioValue
  const benchmarkPerfData = history.map(item => ({ x: item.date, y: ((item.benchmarkValue - firstBenchmarkValue) / firstBenchmarkValue) * 100 }))
  const portfolioPerfData = history.map(item => ({ x: item.date, y: ((item.portfolioValue - firstPortfolioValue) / firstPortfolioValue) * 100 }))
  
  chartData.value = {
    datasets: [
      {
        borderColor: '#ad46ff',
        data: portfolioPerfData,
        label: 'Fathom',
        pointBackgroundColor: '#ad46ff',
        pointHitRadius: 15,  
        pointHoverRadius: 0,
        pointRadius: 0
      },
      {
        borderColor: '#FFFFFF',
        data: benchmarkPerfData,
        label: 'SPY',
        pointBackgroundColor: '#FFFFFF',
        pointHitRadius: 15,
        pointHoverRadius: 0,
        pointRadius: 0
      }
    ],
    labels: dailyLabels,
  }
}

onMounted(() => {
  fetchHistory()
})
</script>