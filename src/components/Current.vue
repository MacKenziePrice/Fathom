<template>
  <div>
    <h1 class="text-4xl font-bold text-center">Current Positions</h1>
    <table class="table-fixed text-[18px] text-left w-full">
      <thead class="bg-purple-500">
        <tr class="border-t-4 table-border-b" >
          <th scope="col" class="w-[150px] h-[50px] p-[10px] border-l-4 table-border-r">Ticker</th>
          <th scope="col" class="w-[150px] h-[50px] p-[10px] table-border-r">Long/Short</th>
          <th scope="col" class="w-[150px] h-[50px] p-[10px] table-border-r">Entry Date</th>
          <th scope="col" class="w-[150px] h-[50px] p-[10px] table-border-r">Entry Price</th>
          <th scope="col" class="w-[150px] h-[50px] p-[10px] table-border-r">Current Price</th>
          <th scope="col" class="w-[150px] h-[50px] p-[10px] table-border-r">Change</th>
          <th scope="col" class="w-[150px] h-[50px] p-[10px] table-border-r">Weight</th>
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
            {{ formatCurrency(position.entryPrice, position.currency) }}
          </td>
          <td class="w-[150px] h-[50px] p-[10px] table-border-r">
            {{ formatCurrency(position.currentPrice, position.currency) }}
          </td>
          <td class="w-[150px] h-[50px] p-[10px] table-border-r">
            {{ formatPercent(position.returnPercent) }}
          </td>
          <td :class="['w-[150px] h-[50px] p-[10px] table-border-r']">
            {{ formatPercent(position.portfolioWeight) }}
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
import { formatCurrency, formatPercent } from '@/utils/calculations.js'

defineProps({
  positions: {
    type: Array,
    required: true
  }
})
</script>