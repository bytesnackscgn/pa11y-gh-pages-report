<script setup>
import Pa11yResults from './components/Pa11yResults.vue';
import pa11yResults from './reports/report.json';


</script>

<template>
  <div class="min-h-screen bg-gray-800">
    <header class="container mx-auto px-4 py-6 lg:px-12">
        <h1 class="text-3xl font-bold text-white">
			Accessibility Report
		</h1>
    </header>
    <main class="container mx-auto px-4 py-6 lg:px-12">
		<Pa11yResults  :results="pa11yResults" />
    </main>
  </div>
</template>
