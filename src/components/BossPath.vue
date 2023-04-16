<!-- BossPath.vue -->
<template>
    <div class="mb-4">
        <label class="block mb-2">Select a boss for path {{ path.pathId }}:</label>
        <select :disabled="!isAvailable(path)" v-model="selectedBoss" class="w-full border border-gray-300 rounded p-2"
            @change="emitSelectedBoss">
            <option disabled value="">Select a boss</option>
            <option v-for="(boss, index) in path.bosses" :key="index" :value="boss">
                {{ boss.name }}
            </option>
        </select>
        <img v-if="selectedBoss" :src="selectedBoss.image" :alt="selectedBoss.name" class="w-24 h-24 mt-2">
    </div>
</template>
  
<script lang="ts">
import type { Boss, Path } from './types';

export default {
  props: {
    path: {
      type: Object as () => Path,
      default: () => ({
        pathId: 0,
        prevPathId: null,
        prevBosses: [],
        bosses: []
      })
    },
    selectedBosses: {
      type: Array as () => (Boss | null)[],
      default: () => []
    },
  },
  data() {
    return {
      selectedBoss: null as Boss | null
    }
  },
  methods: {
    isAvailable(path: Path) {
      if (path.prevPathId === null) {
        return true;
      }

      const prevPathBoss = this.selectedBosses[path.prevPathId];
      return prevPathBoss && path.prevBosses.includes(prevPathBoss.name);


    },
    emitSelectedBoss() {
      this.$emit('select-boss', this.path);
    }
  }
};
</script>
  