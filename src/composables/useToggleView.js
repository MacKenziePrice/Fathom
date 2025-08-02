// composables/useToggleView.js
import { ref, watch, onMounted } from 'vue'

export function useToggleView({ getEquities, getOptions }) {
  const view = ref('equities')
  const equities = ref([])
  const options = ref([])

  watch(view, () => {
    if (view.value === 'equities') {
      equities.value = getEquities()
    } else {
      options.value = getOptions()
    }
  })

  onMounted(() => {
    equities.value = getEquities()
  })

  return {
    view,
    equities,
    options
  }
}
