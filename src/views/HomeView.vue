<template>
  <div>
    <Positions :positions="portfolioData" class="mx-auto w-[1280px]"/>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Positions from '@/components/Positions.vue'

// This reactive ref will hold the array of position objects
const portfolioData = ref([])

// This function would fetch data from your NodeJS backend
async function fetchPortfolioData() {
  console.log("Fetching portfolio data...")
  // Replace with your actual API call
  // Simulating a fetch with example data after a short delay
  await new Promise(resolve => setTimeout(resolve, 500)) // Simulate network delay
  portfolioData.value = [
    { id: 1, ticker: 'AAPL', longShort: 'Long', entryDate: '2024-01-15', entryPrice: 170.50, exitDate: null, exitPrice: null, return: 0.15 },
    { id: 2, ticker: 'MSFT', longShort: 'Long', entryDate: '2023-11-01', entryPrice: 300.00, exitDate: '2024-03-20', exitPrice: 410.25, return: 0.3675 },
    { id: 3, ticker: 'GOOG', longShort: 'Long', entryDate: '2024-02-10', entryPrice: 140.00, exitDate: null, exitPrice: null, return: 0.08 },
    { id: 4, ticker: 'TSLA', longShort: 'Short', entryDate: '2024-02-01', entryPrice: 220.00, exitDate: '2024-04-01', exitPrice: 180.00, return: 0.1818 }
  ]
   console.log("Portfolio data loaded:", portfolioData.value)
}

onMounted(() => {
  fetchPortfolioData()
})

// You would also add logic here for real-time updates,
// which would modify the `portfolioData.value` array.

</script>

<style scoped>
</style>