<template>
  <div>
    <h1 class="section-title">Performance</h1>
    <div class="bg-positions-dark h-[500px] p-1">
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
        color: '#FFFFFF'
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
          let label = context.dataset.label || ''
          if (label) {
            label += ': '
          }
          if (context.parsed.y !== null) {
            label += formatPercent(context.parsed.y)
          }
          return label
        }
      }
    }
  },
  scales: {
    x: {
      grid: {
        display: false
      },
      ticks: {
        color: '#FFFFFF'
      }
    },
    y: {
      beginAtZero: false,
      grid: {
        display: false
      },
      ticks: {
        callback: (value) => formatPercent(value),
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
  
  // --- Label Generation (New Logic) ---
  const labels = []
  const seenQuarters = new Set()
  
  // Create a map of the last date for each quarter
  const lastDateOfQuarter = new Map()
  history.forEach(entry => {
    const date = new Date(entry.date)
    const year = date.getFullYear()
    const quarter = Math.floor(date.getMonth() / 3) + 1
    const quarterId = `${year}-Q${quarter}`
    lastDateOfQuarter.set(quarterId, entry.date) // Keep overwriting until the last date for that quarter is stored
  })

  // Now create the labels array: either a quarter label or an empty string
  history.forEach(entry => {
    const date = new Date(entry.date)
    const year = date.getFullYear()
    const quarter = Math.floor(date.getMonth() / 3) + 1
    const quarterId = `${year}-Q${quarter}`
    const quarterLabel = `Q${quarter} ${String(year).slice(-2)}`
    
    // Is this entry the last one for its quarter? If so, use the label.
    if (entry.date === lastDateOfQuarter.get(quarterId)) {
      labels.push(quarterLabel)
    } else {
      labels.push('') // Otherwise, use an empty string
    }
  })
  
  chartData.value = {
    labels: labels,
    datasets: [
      {
        label: 'Fathom',
        backgroundColor: 'rgba(255, 255, 255, 1)',
        borderColor: '#432dd7',
        data: portfolioPerfData
      },
      {
        label: 'SPY',
        backgroundColor: 'rgba(245, 166, 35, 0.2)',
        borderColor: '#FFFFFF',
        data: benchmarkPerfData
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