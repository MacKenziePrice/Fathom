<template>
  <div class="w-[1280px]">
    <Heading class="pb-10 pt-5"/>
    <About class="pb-15"/>
    <Current :positions="openPositions" class="pb-15"/>
    <Chart class="pb-15"/>
    <Previous :positions="closedPositions" class="pb-15"/>
  </div>
</template>

<script setup>
import { calculatePositionWeight, calculateReturnPercent } from '@/utils/calculations.js'
import { computed, onMounted, ref } from 'vue'
import About from '@/components/About.vue'
import Chart from '@/components/Chart.vue'
import Current from '@/components/Current.vue'
import Heading from '@/components/Heading.vue'
import Previous from '@/components/Previous.vue'

const portfolioData = ref([]) // This reactive ref will hold the array of position objects
const openPositions = computed(() => portfolioData.value.filter(position => position.exitDate === null))
const closedPositions = computed(() => portfolioData.value.filter(position => position.exitDate !== null))

async function processPortfolioData () {
  console.log("Fetching unified portfolio data...")
  try {
    const response = await fetch('/db/positions.json') // Fetch the single, complete positions file

    if (!response.ok) {
      throw new Error(`Could not fetch positions.json: ${response.status}`)
    }

    const positions = await response.json()
    const openPositions = positions.filter(p => p.exitDate === null && p.currentPrice && p.shares)

    // Calculate total portfolio value (for weights)
    const totalPortfolioValue = openPositions.reduce((sum, position) => {
      const positionValue = position.shares * position.currentPrice
      return sum + positionValue
    }, 0)

    // Calculate return percentage. The data is already combined, so only the 'returnPercent' field is needed.
    const displayData = positions.map(position => {
      
      const returnPercent = (position.exitDate === null)
        ? calculateReturnPercent(position.currentPrice, position.entryPrice) // If the position is OPEN, use currentPrice.        
        : calculateReturnPercent(position.exitPrice, position.entryPrice) // If the position is CLOSED, use exitPrice.

        // Calculate weights
        let portfolioWeight = null
        if (position.exitDate === null && position.currentPrice && position.shares) {
          const positionValue = position.shares * position.currentPrice
          portfolioWeight = calculatePositionWeight(positionValue, totalPortfolioValue)
        }

      return {
        ...position,
        portfolioWeight,
        returnPercent
      }
    })
    
    portfolioData.value = displayData // Update the component's state
    console.log("Final display data:", portfolioData.value)

  } catch (error) {
    console.error("Error fetching or processing portfolio data:", error)
    portfolioData.value = []
  }
}

onMounted(() => {
  processPortfolioData ()
})
</script>

<style scoped>
</style>