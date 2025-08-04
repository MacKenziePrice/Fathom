<template>
  <div>
    <h1 class="section-title">Previous Positions</h1>
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
          <th @click="sortBy('entryPrice')" scope="col" class="w-[150px] h-[50px] p-[10px] table-border-b table-border-l">
            Entry Price <span v-if="sortKey === 'entryPrice'">{{ sortDirection === 'asc' ? '▲' : '▼' }}</span>
          </th>
          <th @click="sortBy('exitDate')" scope="col" class="w-[150px] h-[50px] p-[10px] table-border-b table-border-l">
            Exit Date <span v-if="sortKey === 'exitDate'">{{ sortDirection === 'asc' ? '▲' : '▼' }}</span>
          </th>
          <th @click="sortBy('exitPrice')" scope="col" class="w-[150px] h-[50px] p-[10px] table-border-b table-border-l">
            Exit Price <span v-if="sortKey === 'exitPrice'">{{ sortDirection === 'asc' ? '▲' : '▼' }}</span>
          </th>
          <th @click="sortBy('returnPercent')" scope="col" class="w-[150px] h-[50px] p-[10px] table-border-b table-border-l">
            Return <span v-if="sortKey === 'returnPercent'">{{ sortDirection === 'asc' ? '▲' : '▼' }}</span>
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
          <td :class="[ 'w-[150px] h-[50px] p-[10px] table-border-r', { 'table-border-b-t': index !== positions.length - 1 }]">{{ position.longShort }}</td>
          <td :class="[ 'w-[150px] h-[50px] p-[10px] table-border-r', { 'table-border-b-t': index !== positions.length - 1 }]">{{ position.entryDate }}</td>
          <td :class="[ 'w-[150px] h-[50px] p-[10px] table-border-r', { 'table-border-b-t': index !== positions.length - 1 }]">{{ formatCurrency(position.entryPrice, position.currency) }}</td>
          <td :class="[ 'w-[150px] h-[50px] p-[10px] table-border-r', { 'table-border-b-t': index !== positions.length - 1 }]">{{ position.exitDate }}</td>
          <td :class="[ 'w-[150px] h-[50px] p-[10px] table-border-r', { 'table-border-b-t': index !== positions.length - 1 }]">{{ formatCurrency(position.exitPrice, position.currency) }}</td>
          <td :class="[ 'w-[150px] h-[50px] p-[10px] table-border-l', { 'table-border-b-t': index !== positions.length - 1 }]">{{ formatPercent(position.returnPercent) }}</td>
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
import { useToggleOptions } from '@/composables/useToggleOptions'

const props = defineProps({
  positions: {
    type: Array,
    required: true
  }
})

const { positions } = toRefs(props)
const { sortBy, sortDirection, sortKey, sortedData } = useSort(positions)

const { equities, options, view } = useToggleOptions({
  getEquities: () => positions.value.filter(p => p.type === 'equity'),
  getOptions: () => positions.value.filter(p => p.type === 'option')
})

const currentData = computed(() =>
  view.value === 'equities' ? equities.value : options.value
)

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

// Example: Get color based on return value
function getReturnColor(returnValue) {
    if (returnValue === null || returnValue === undefined) return '';
    return returnValue >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400';
}
</script>