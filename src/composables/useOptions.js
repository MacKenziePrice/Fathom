import { ref } from 'vue'

// State is defined outside the function, so it's created only once and shared across all components that use this composable.
const trades = ref([])
const isLoading = ref(false)
const hasFetched = ref(false)

// This is the composable function
export function useOptions() {
  const fetchOptions = async () => {
    // Don't fetch if we're already fetching or have already fetched the data
    if (isLoading.value || hasFetched.value) {
      return
    }

    isLoading.value = true
    try {
      const response = await fetch('/db/options.json')
      if (!response.ok) {
        throw new Error('Failed to fetch options.json')
      }
      trades.value = await response.json()
      hasFetched.value = true
    } catch (error) {
      console.error("Could not fetch options.js data:", error)
      trades.value = []
    } finally {
      isLoading.value = false
    }
  }

  return {
    trades,
    isLoading,
    fetchOptions
  }
}