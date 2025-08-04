import { onMounted, ref, watch } from 'vue'

export function useToggleOptions({ getEquities, getOptions }) {
  const equities = ref([])
  const options = ref([])
  const view = ref('equities')

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
    equities,
    options,
    view,
  }
}
