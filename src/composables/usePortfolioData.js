import { calculatePositionWeight, calculateReturnPercent } from '@/utils/calculations.js'
import { ref } from 'vue'

async function fetchEquities() {
  const response = await fetch('/db/positions.json')
  if (!response.ok) throw new Error('Failed to fetch positions')
  return await response.json()
}

async function fetchOptions() {
  const response = await fetch('/db/options.json')
  if (!response.ok) throw new Error('Failed to fetch options')
  return await response.json()
}

function processEquities(rawEquities) {
  const openPositions = rawEquities.filter(p => p.exitDate === null && p.currentPrice && p.shares)
  const totalPortfolioValue = openPositions.reduce((sum, p) => sum + (p.shares * p.currentPrice), 0)

  return rawEquities.map(position => {
    const returnPercent = (position.exitDate === null) ? calculateReturnPercent(position.currentPrice, position.entryPrice) : calculateReturnPercent(position.exitPrice, position.entryPrice)
    
    let portfolioWeight = null

    if (position.exitDate === null && position.currentPrice && position.shares) {
      const positionValue = position.shares * position.currentPrice
      portfolioWeight = calculatePositionWeight(positionValue, totalPortfolioValue)
    }
    
    return { ...position, portfolioWeight, returnPercent }
  })
}

export function usePortfolioData() {
  const equitiesData = ref([])
  const optionsData = ref([])
  const isLoading = ref(true)

  const loadData = async () => {
    isLoading.value = true
    try {
      const [rawEquities, rawOptions] = await Promise.all([
        fetchEquities(),
        fetchOptions()
      ])
      
      equitiesData.value = processEquities(rawEquities)
      optionsData.value = rawOptions
    } catch (error) {
      console.error("Failed to fetch portfolio data:", error)
    } finally {
      isLoading.value = false
    }
  }

  return {
    equitiesData,
    optionsData,
    isLoading,
    loadData
  }
}