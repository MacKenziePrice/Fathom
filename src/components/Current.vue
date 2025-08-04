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
        <template v-for="(position, index) in sortedData" :key="position.ticker || index">
          <tr @click="toggleDescription(position.ticker)" :class="[ index % 2 === 0 ? 'bg-positions-dark' : 'bg-positions-darker', 'cursor-pointer' ]">
            <td :class="[ 'w-[150px] h-[50px] p-[10px] table-border-r', { 'table-border-b-t': index !== positions.length - 1 }]">{{ position.ticker }}</td>
            <td :class="[ 'w-[150px] h-[50px] p-[10px] table-border-l-r', { 'table-border-b-t': index !== positions.length - 1 }]">{{ position.longShort }}</td>
            <td :class="[ 'w-[150px] h-[50px] p-[10px] table-border-l-r', { 'table-border-b-t': index !== positions.length - 1 }]">{{ position.entryDate }}</td>
            <td :class="[ 'w-[150px] h-[50px] p-[10px] table-border-l-r', { 'table-border-b-t': index !== positions.length - 1 }]">{{ position.currentPrice }}</td>
            <td :class="[ 'w-[150px] h-[50px] p-[10px] table-border-l-r', { 'table-border-b-t': index !== positions.length - 1 }]">{{ formatCurrency(position.entryPrice, position.currency) }}</td>
            <td :class="[ 'w-[150px] h-[50px] p-[10px] table-border-l-r', { 'table-border-b-t': index !== positions.length - 1 }]">{{ formatPercent(position.returnPercent) }}</td>
            <td :class="[ 'w-[150px] h-[50px] p-[10px] table-border-l', { 'table-border-b-t': index !== positions.length - 1 }]">{{ formatPercent(position.portfolioWeight) }}</td>
          </tr>
          <tr v-if="activeTrade === position.ticker" :class="[ index % 2 === 0 ? 'bg-positions-dark' : 'bg-positions-darker' ]">
            <td :colspan="7" class="cursor-pointer p-2 text-[14px]">
              <p>{{ position.description }}</p>
            </td>
          </tr>
        </template>
        <tr v-if="!positions || positions.length === 0">
          <td :colspan="7" class="py-1 text-center">
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
import { useToggleOptions } from '@/composables/useToggleOptions'

const props = defineProps({
  positions: {
    type: Array,
    required: true
  }
})

const activeTrade = ref(null)
const { positions } = toRefs(props)
const { sortBy, sortDirection, sortKey, sortedData } = useSort(positions)

const { equities, options, view } = useToggleOptions({
  getEquities: () => positions.value.filter(p => p.type === 'equity'),
  getOptions: () => positions.value.filter(p => p.type === 'option')
})

const currentData = computed(() =>
  view.value === 'equities' ? equities.value : options.value
)

function toggleDescription(positionId) {
  if (activeTrade.value === positionId) {
    activeTrade.value = null
  } else {
    activeTrade.value = positionId
  }
}
</script>