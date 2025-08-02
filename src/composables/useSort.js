import { computed, ref, toRef } from 'vue'

export function useSort(data) {
  // Default values
  const sortDirection = ref('asc')
  const sortKey = ref('ticker')

  const sortBy = (key) => {
    if (sortKey.value === key) {
      sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
    } else {
      sortDirection.value = 'asc'
      sortKey.value = key
    }
  }

  const sortedData = computed(() => {
    const dataToSort = toRef(data)
    if (!dataToSort.value) return []

    const sorted = [...dataToSort.value]

    sorted.sort((a, b) => {
      const first = a[sortKey.value]
      const second = b[sortKey.value]
      let comparison = 0

      if (typeof first === 'number' && typeof second === 'number') {
        comparison = first - second
      } else if (sortKey.value === 'entryDate') {
        comparison = new Date(first) - new Date(second)
      } else {
        comparison = String(first).localeCompare(String(second))
      }

      return sortDirection.value === 'asc' ? comparison : -comparison
    })

    return sorted
  })

  return {
    sortBy,
    sortDirection,
    sortKey,
    sortedData
  }
}