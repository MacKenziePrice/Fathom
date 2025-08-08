<template>
  <div class="w-[1280px]">
    <Heading class="pb-10 pt-5"/>
    <About class="pb-15"/>
    <Chart class="pb-15"/>
    <Current :equities="openEquities" :options="openOptions" class="pb-15"/>
    <Previous :equities="closedEquities" :options="closedOptions" class="pb-15"/>
  </div>
</template>

<script setup>
import { calculatePositionWeight, calculateReturnPercent } from '@/utils/calculations.js'
import { computed, onMounted, ref } from 'vue'
import { usePortfolioData } from '@/composables/usePortfolioData.js'
import About from '@/components/About.vue'
import Chart from '@/components/Chart.vue'
import Current from '@/components/Current.vue'
import Heading from '@/components/Heading.vue'
import Previous from '@/components/Previous.vue'

const { equitiesData, optionsData, isLoading, loadData } = usePortfolioData()

const closedEquities = computed(() => equitiesData.value.filter(p => p.exitDate !== null))
const closedOptions = computed(() => optionsData.value.filter(p => p.exitDate !== null))
const openEquities = computed(() => equitiesData.value.filter(p => p.exitDate === null))
const openOptions = computed(() => optionsData.value.filter(p => p.exitDate === null))
const allClosedPositions = computed(() => [...closedEquities.value, ...closedOptions.value])

onMounted(() => {
  loadData()
})
</script>