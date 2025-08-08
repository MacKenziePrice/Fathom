import { computed, ref } from 'vue'
import { useSort } from '@/composables/useSort.js'

export function useTradeTable(props) {
  const note = ref(null)
  const view = ref('equities')

  const toggleNotes = (id) => note.value = note.value === id ? null : id
  const toggleTradeType = computed(() => view.value === 'equities' ? props.equities : props.options)

  const { sortBy, sortDirection, sortKey, sortedData } = useSort(toggleTradeType)

  return {
    note,
    sortedData,
    sortBy,
    sortDirection,
    sortKey,
    toggleNotes,
    view
  }
}