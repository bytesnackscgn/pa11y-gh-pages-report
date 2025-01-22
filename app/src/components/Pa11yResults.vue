<script setup>
import { computed, ref } from "vue";

const props = defineProps({
  results: {
    type: Object,
    required: true
  }
});

const totalViolations = computed(() => props.results.violations || 0);

const urlResults = computed(() => {
  return Object.entries(props.results.results || {}).map(([url, data]) => ({
    url,
    title: data.documentTitle,
    issues: data.issues,
    errorCount: data.issues.filter(issue => issue.type === 'error').length,
    warningCount: data.issues.filter(issue => issue.type !== 'error').length
  }));
});

const getHostname = (url) => {
	try{
		return new URL(url).hostname
	}catch(e) {
		return url
	}
};

// Add new computed property for sidebar navigation
const sidebarItems = computed(() => {
  return urlResults.value.map(site => ({
    path: getPathFromUrl(site.url),
    title: site.title,
    url: site.url,
    errorCount: site.errorCount,
    warningCount: site.warningCount
  }));
});

// Add new ref for selected item
const selectedUrl = ref(urlResults.value?.[0]?.url || null);

// Add new computed for selected result
const selectedResult = computed(() => {
  return urlResults.value.find(site => site.url === selectedUrl.value);
});

// Helper function to get path from URL
const getPathFromUrl = (url) => {
  try {
    const urlObj = new URL(url);
    return urlObj.pathname || '/';
  } catch(e) {
    return url;
  }
};
</script>

<template>
    <div class="flex gap-6">
      <!-- Sidebar -->
      <div class="w-64 bg-gray-800 rounded-lg p-4">
        <h2 class="text-white text-lg font-bold mb-4">Pages</h2>
        <div class="space-y-2">
          <div v-for="item in sidebarItems" 
               :key="item.url"
               @click="selectedUrl = item.url"
               class="cursor-pointer p-2 rounded hover:bg-gray-700"
               :class="{'bg-gray-700': selectedUrl === item.url}">
            <div class="text-white">{{ item.path }}</div>
            <div class="text-gray-400 text-sm line-clamp-1">{{ item.title }}</div>
            <div class="flex gap-2 mt-1 text-sm">
              <span class="text-red-400">Issues: {{ item.errorCount }}</span>
              <span class="text-yellow-400">Warnings: {{ item.warningCount }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Main content -->
      <div class="flex-1" v-if="selectedResult">
        <div class="rounded-lg p-4 text-white">
          <div class="flex items-center justify-between mb-4">
            <div>
              <h2 class="text-xl font-bold">{{ selectedResult.url }}</h2>
              <p class="text-gray-400 text-sm">{{ selectedResult.title }}</p>
            </div>
            <div class="flex gap-4">
              <div class="text-center">
                <p class="text-sm text-gray-400">Issues</p>
                <p class="font-bold">{{ selectedResult.errorCount }}</p>
              </div>
              <div class="text-center">
                <p class="text-sm text-gray-400">Warnings</p>
                <p class="font-bold">{{ selectedResult.warningCount }}</p>
              </div>
            </div>
          </div>

          <div class="space-y-3">
            <div v-for="issue in selectedResult.issues" 
                 :key="issue.code"
                 class="bg-gray-700 p-3 rounded-md">
              <div class="flex items-center gap-2 mb-2">
                <span class="px-2 py-1 rounded text-sm"
                      :class="issue.type === 'error' ? 'bg-red-500' : 'bg-yellow-500'">
                  {{ issue.type }}
                </span>
                <span class="text-sm text-gray-300">{{ issue.code }}</span>
              </div>
              <p class="text-sm mb-2">{{ issue.message }}</p>
              <div class="bg-gray-600 p-2 rounded text-sm font-mono">
                <code>{{ issue.context }}</code>
              </div>
              <p class="text-sm text-gray-400 mt-2">
                Selector: {{ issue.selector }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
</template>

<style scoped>
.container {
  max-width: 1200px;
}
</style>
