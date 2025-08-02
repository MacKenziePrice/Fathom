<template>
  <div>
    <h1 class="section-title">Performance</h1>
    <div class="bg-positions-dark h-[500px] p-1 rounded-lg">
      <Line :data="chartData" :options="chartOptions" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { formatPercent } from '@/utils/calculations.js'
import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

const historyData = ref([])
const chartData = ref({ labels: [], datasets: [] })
const chartOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      labels: {
        color: '#FFFFFF',
        usePointStyle: true,
      },
      position: 'top',
    },
    title: {
      color: '#FFFFFF',
      display: true,
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
        title: function(tooltipItems) {
          const date = new Date(tooltipItems[0].label)

          return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })
        }
      },
      displayColors: false
    }
  },
  scales: {
    x: {
      grid: {
        display: false
      },
      ticks: {
        color: '#FFFFFF',
        callback: function(value, index, ticks) {
          const label = this.chart.data.labels[index]
          const labels = this.chart.data.labels
          const currentDate = new Date(labels[index])

          // If there's no next label, it's the last point, so show it
          if (!labels[index + 1]) {
            return currentDate.toLocaleDateString('en-US', { month: 'short', year: '2-digit' })
          }

          const nextDate = new Date(labels[index + 1])

          // If the next data point is in a different month, show the current label
          if (currentDate.getMonth() !== nextDate.getMonth()) {
            return currentDate.toLocaleDateString('en-US', { month: 'short', year: '2-digit' })
          } else {
            return null
          }
        }
      }
    },
    y: {
      beginAtZero: false,
      grid: {
        display: false
      },
      ticks: {
        callback: (value) => `${Math.round(value)}%`, // Rounds to a whole number
        color: '#FFFFFF'
      }
    }
  }
})

// Function to process the raw history into a format Chart.js understands
function processDataForChart(history) {
  if (history.length < 2) return

  const firstPortfolioValue = history[0].portfolioValue
  const firstBenchmarkValue = history[0].benchmarkValue
  const portfolioPerfData = history.map(item => ((item.portfolioValue - firstPortfolioValue) / firstPortfolioValue) * 100)
  const benchmarkPerfData = history.map(item => ((item.benchmarkValue - firstBenchmarkValue) / firstBenchmarkValue) * 100)
  const dailyLabels = history.map(item => item.date)
  
  chartData.value = {
    labels: dailyLabels,
    datasets: [
      {
        label: 'Fathom',
        borderColor: '#432dd7',
        data: portfolioPerfData,
        pointBackgroundColor: '#432dd7',
        pointHitRadius: 15,  
        pointHoverRadius: 0,
        pointRadius: 0
      },
      {
        label: 'SPY',
        borderColor: '#FFFFFF',
        data: benchmarkPerfData,
        pointBackgroundColor: '#FFFFFF',
        pointHitRadius: 15,
        pointHoverRadius: 0,
        pointRadius: 0
      }
    ]
  }
}

async function fetchHistory() {
  try {
    const response = await fetch('/db/history.json')
    historyData.value = await response.json()
    processDataForChart(historyData.value)
  } catch (error) {
    console.error("Could not fetch performance history:", error)
  }
}

onMounted(() => {
  fetchHistory()
})
</script>