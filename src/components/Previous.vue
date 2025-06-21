<template>
  <div>
    <h1 class="text-4xl font-bold text-center">Previous Positions</h1>
    <table class="table-fixed text-[18px] text-left w-full">
      <thead class="bg-purple-500">
        <tr class="border-t-4 table-border-b" >
          <th scope="col" class="w-[150px] h-[50px] p-[10px] border-l-4 table-border-r">Ticker</th>
          <th scope="col" class="w-[150px] h-[50px] p-[10px] table-border-r">Long/Short</th>
          <th scope="col" class="w-[150px] h-[50px] p-[10px] table-border-r">Entry Date</th>
          <th scope="col" class="w-[150px] h-[50px] p-[10px] table-border-r">Entry Price</th>
          <th scope="col" class="w-[150px] h-[50px] p-[10px] table-border-r">Exit Date</th>
          <th scope="col" class="w-[150px] h-[50px] p-[10px] table-border-r">Exit Price</th>
          <th scope="col" class="w-[150px] h-[50px] p-[10px] table-border-r">Change</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(position, index) in positions"
            :key="position.id || index"
            :class="[
              index % 2 === 0 ? 'bg-positions-dark' : 'bg-positions-darker',
              'border-l-4 table-border-b'
            ]"
        >
          <td class="w-[150px] h-[50px] p-[10px] table-border-r">
            {{ position.ticker }}
          </td>
          <td class="w-[150px] h-[50px] p-[10px] table-border-r">
            {{ position.longShort }}
          </td>
          <td class="w-[150px] h-[50px] p-[10px] table-border-r">
            {{ position.entryDate }}
          </td>
          <td class="w-[150px] h-[50px] p-[10px] table-border-r">
            {{ position.entryPrice }}
          </td>
          <td class="w-[150px] h-[50px] p-[10px] table-border-r">
            {{ position.exitDate }}
          </td>
          <td class="w-[150px] h-[50px] p-[10px] table-border-r">
            {{ position.exitPrice }}
          </td>
          <td :class="['w-[150px] h-[50px] p-[10px] table-border-r', getReturnColor(position.return)]">
             {{ position.returnPercent }}
          </td>
        </tr>
        <tr v-if="!positions || positions.length === 0">
           <td :colspan="7" class="py-4 text-center text-gray-500">
               No positions to display.
           </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'

defineProps({
  positions: {
    type: Array,
    required: true
  }
})

// Example: Format date (you might use a library like date-fns or moment.js)
function formatDate(dateString) {
  if (!dateString) return ''
  const options = { year: '2-digit', month: 'numeric', day: 'numeric' }

  try {
      return new Date(dateString).toLocaleDateString(undefined, options)
  } catch (e) {
      return dateString; // Return original if formatting fails
  }
}

// Example: Format currency
function formatCurrency(value) {
  if (value === null || value === undefined) return ''
   // Basic formatting, adjust currency symbol and precision as needed
  return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' })
}

// Example: Format return (e.g., percentage)
function formatReturn(value) {
    if (value === null || value === undefined) return 'N/A';
    // Assuming return is a decimal value (e.g., 0.10 for 10%)
    return (value * 100).toFixed(2) + '%';
}

// Example: Get color based on return value
function getReturnColor(returnValue) {
    if (returnValue === null || returnValue === undefined) return '';
    return returnValue >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400';
}
</script>

<style scoped>
</style>