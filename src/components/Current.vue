<template>
  <div>
    <h1 class="section-title">Current Positions</h1>
    <div class="pb-[2px]">
      <div class="border-white inline-flex overflow-hidden rounded-xs text-[12px]">
        <button @click="view = 'equities'" class="cursor-pointer px-4 py-2" :class="view === 'equities' ? 'bg-purple-500' : 'bg-positions-darker'">Equities</button>
        <button @click="view = 'options'" class="cursor-pointer px-4 py-2" :class="view === 'options' ? 'bg-purple-500' : 'bg-positions-darker'">Options</button>
      </div>
    </div>
    <table class="table-fixed text-[18px] text-left w-full">
      <thead class="bg-purple-500 cursor-pointer">
        <tr>
          <th v-for="column in columns" @click="sortBy(column.key)" :key="column.key" scope="col" class="w-[150px] h-[50px] p-[10px] border-b-2 border-l-2 border-main-background border-r-2 first:border-l-0 last:border-r-0">
            {{ column.label }} <span v-if="sortKey === column.key">{{ sortDirection === 'asc' ? '▲' : '▼' }}</span>
          </th>
        </tr>
      </thead>
      <tbody>
        <template v-for="(position, index) in sortedData" :key="position.ticker || index">
          <tr @click="toggleNotes(position.ticker)" class="border-b-2 border-main-background last:border-b-0" :class="[ index % 2 === 0 ? 'bg-positions-dark' : 'bg-positions-darker', 'cursor-pointer' ]">
            <td v-for="column in columns" :key="column.key" class="w-[150px] h-[50px] p-[10px] border-l-2 border-main-background border-r-2 first:border-l-0 last:border-r-0" :class="column.key === 'returnPercent' ? getReturnColor(position.returnPercent) : ''">
              {{ column.format ? column.format(position[column.key], position) : position[column.key] }}
            </td>
          </tr>
          <tr v-if="note === position.ticker" :class="[ index % 2 === 0 ? 'bg-positions-dark' : 'bg-positions-darker' ]">
            <td :colspan="columns.length" class="cursor-pointer p-2 text-[14px]">
              <p>{{ position.description }}</p>
            </td>
          </tr>
        </template>
        <tr v-if="!sortedData || sortedData.length === 0">
          <td :colspan="columns.length" class="py-1 text-center">
            No {{ view }} to display.
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { formatCurrency, formatPercent, getReturnColor } from '@/utils/calculations.js'
import { useSort } from '@/composables/useSort.js'
import { useTradeTable } from '@/composables/useTradeTable.js'

const props = defineProps({
  equities: { type: Array, required: true },
  options: { type: Array, required: true }
})

const equityColumns = [
  { key: 'ticker', label: 'Ticker' },
  { key: 'longShort', label: 'Long/Short' },
  { key: 'entryDate', label: 'Entry Date' },
  { key: 'entryPrice', label: 'Entry Price', format: (val, item) => formatCurrency(val, item.currency) },
  { key: 'currentPrice', label: 'Current Price', format: (val, item) => formatCurrency(val, item.currency) },
  { key: 'returnPercent', label: 'Change', format: formatPercent },
  { key: 'portfolioWeight', label: 'Weight', format: formatPercent }
]

const optionColumns = [
  { key: 'ticker', label: 'Ticker' },
  { key: 'type', label: 'Type' },
  { key: 'strikePrice', label: 'Strike', format: (val, item) => formatCurrency(val, item.currency) },
  { key: 'expiryDate', label: 'Expiry' },
  { key: 'entryPrice', label: 'Entry Premium', format: (val, item) => formatCurrency(val, item.currency) },
  { key: 'currentPrice', label: 'Current Premium', format: (val, item) => formatCurrency(val, item.currency) },
  { key: 'returnPercent', label: 'Change', format: formatPercent }
]

const columns = computed(() => view.value === 'equities' ? equityColumns : optionColumns)

const { note, sortedData, sortBy, sortDirection, sortKey, toggleNotes, view } = useTradeTable(props)
</script>