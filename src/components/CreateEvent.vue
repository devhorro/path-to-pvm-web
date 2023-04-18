<template>
  <div class="container mx-auto px-4">
    <h1 class="my-8 text-2xl">Create Event</h1>
    <form @submit.prevent="submitForm">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label class="block mb-2" for="eventName">Event Name:</label>
          <input v-model="eventName" 
          id="eventName" 
          name="eventName" 
          class="w-full border border-gray-300 rounded p-2"
            required>
        </div>
        <div>
          <label class="block mb-2" for="startDate">Start Date:</label>
          <input v-model="startDate" 
          id="startDate" 
          name="startDate" 
          type="datetime-local"
            class="w-full border border-gray-300 rounded p-2" required>
        </div>
        <div>
          <label class="block mb-2" for="endDate">End Date:</label>
          <input v-model="endDate" id="endDate" name="endDate" type="datetime-local"
            class="w-full border border-gray-300 rounded p-2" required>
        </div>
        <div>
          <boss-path v-for="(path, index) in bossPaths" :key="index" :path="path" :selected-bosses="selectedBosses"
            @select-boss="selectBoss($event, index)" />
        </div>
      </div>
      <button type="submit" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Create Event
      </button>
    </form>
  </div>
</template>

<script lang="ts">
import axios from 'axios';
import bossPathsRaw from '../assets/bosses.json';
import BossPath from './BossPath.vue';
import type { Boss, Path } from './types';

const bossPaths: Path[] = bossPathsRaw;

export default {
  components: {
    BossPath
  },
  data() {
    return {
      eventName: '',
      startDate: '',
      endDate: '',
      selectedBosses: Array(bossPaths.length).fill(null) as (Boss | null)[],
    }
  },
  computed: {
    bossPaths() {
      return bossPaths;
    }
  },
  methods: {
    async submitForm() {
      try {
        const response = await axios.post('http://localhost:3000/events', {
          eventName: this.eventName,
          startDate: this.startDate,
          endDate: this.endDate,
          bosses: this.selectedBosses.map(boss => boss ? boss.name : ''),
        });

        // Clear the form fields
        this.eventName = '';
        this.startDate = '';
        this.endDate = '';
        this.selectedBosses = Array(bossPaths.length)
          .fill(null) as (Boss | null)[];
      } catch (error) {
        console.error(error);
      }
    },
    selectBoss(boss: Boss, index: number) {
      this.selectedBosses[index] = boss;
    }
  }
};
</script>
