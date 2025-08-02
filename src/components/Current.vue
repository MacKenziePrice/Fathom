<template>
  <div>
    <h1 class="section-title">Current Positions</h1>
    <table class="table-fixed text-[18px] text-left w-full">
      <thead class="bg-purple-500 cursor-pointer">
        <tr>
          <th @click="sortBy('ticker')" scope="col" class="w-[150px] h-[50px] p-[10px] table-border-b table-border-r">
            Ticker <span v-if="sortKey === 'ticker'">{{ sortDirection === 'asc' ? '▲' : '▼' }}</span>
          </th>
          <th @click="sortBy('longShort')" scope="col" class="w-[150px] h-[50px] p-[10px] table-border-b table-border-l-r">
            Long/Short <span v-if="sortKey === 'longShort'">{{ sortDirection === 'asc' ? '▲' : '▼' }}</span>
          </th>
          <th @click="sortBy('entryDate')" scope="col" class="w-[150px] h-[50px] p-[10px] table-border-b table-border-l-r">
            Entry Date <span v-if="sortKey === 'entryDate'">{{ sortDirection === 'asc' ? '▲' : '▼' }}</span>
          </th>
          <th @click="sortBy('entryPrice')" scope="col" class="w-[150px] h-[50px] p-[10px] table-border-b table-border-l-r">
            Entry Price <span v-if="sortKey === 'entryPrice'">{{ sortDirection === 'asc' ? '▲' : '▼' }}</span>
          </th>
          <th @click="sortBy('currentPrice')" scope="col" class="w-[150px] h-[50px] p-[10px] table-border-b table-border-l-r">
            Current Price <span v-if="sortKey === 'currentPrice'">{{ sortDirection === 'asc' ? '▲' : '▼' }}</span>
          </th>
          <th @click="sortBy('returnPercent')" scope="col" class="w-[150px] h-[50px] p-[10px] table-border-b table-border-l-r">
            Change <span v-if="sortKey === 'returnPercent'">{{ sortDirection === 'asc' ? '▲' : '▼' }}</span>
          </th>
          <th @click="sortBy('portfolioWeight')" scope="col" class="w-[150px] h-[50px] p-[10px] table-border-b table-border-l">
            Weight <span v-if="sortKey === 'portfolioWeight'">{{ sortDirection === 'asc' ? '▲' : '▼' }}</span>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(position, index) in sortedData"
            :key="position.id || index"
            :class="[ index % 2 === 0 ? 'bg-positions-dark' : 'bg-positions-darker' ]"
        >
          <td :class="[ 'w-[150px] h-[50px] p-[10px] table-border-r', { 'table-border-b-t': index !== positions.length - 1 }]">{{ position.ticker }}</td>
          <td :class="[ 'w-[150px] h-[50px] p-[10px] table-border-l-r', { 'table-border-b-t': index !== positions.length - 1 }]">{{ position.longShort }}</td>
          <td :class="[ 'w-[150px] h-[50px] p-[10px] table-border-l-r', { 'table-border-b-t': index !== positions.length - 1 }]">{{ position.entryDate }}</td>
          <td :class="[ 'w-[150px] h-[50px] p-[10px] table-border-l-r', { 'table-border-b-t': index !== positions.length - 1 }]">{{ position.currentPrice }}</td>
          <td :class="[ 'w-[150px] h-[50px] p-[10px] table-border-l-r', { 'table-border-b-t': index !== positions.length - 1 }]">{{ formatCurrency(position.entryPrice, position.currency) }}</td>
          <td :class="[ 'w-[150px] h-[50px] p-[10px] table-border-l-r', { 'table-border-b-t': index !== positions.length - 1 }]">{{ formatPercent(position.returnPercent) }}</td>
          <td :class="[ 'w-[150px] h-[50px] p-[10px] table-border-l', { 'table-border-b-t': index !== positions.length - 1 }]">{{ formatPercent(position.portfolioWeight) }}</td>
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
import { computed, ref, toRefs } from 'vue'
import { formatCurrency, formatPercent } from '@/utils/calculations.js'
import { useSort } from '@/composables/useSort.js'

const props = defineProps({
  positions: {
    type: Array,
    required: true
  }
})

const { positions } = toRefs(props)
const { sortBy, sortDirection, sortKey, sortedData } = useSort(positions)
</script>