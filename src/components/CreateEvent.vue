<template>
  <div class="container mx-auto px-4">
    <h1 class="my-8 text-2xl">Create a New Path to PVM Event</h1>
    <form @submit.prevent="createEvent">
      <div class="mb-4">
        <label for="eventName" class="block mb-2">Event Name:</label>
        <input type="text" id="eventName" v-model="eventName" class="w-full border border-gray-300 rounded p-2" />
      </div>
      <div v-for="(path, index) in paths" :key="index">
        <h2 class="mb-4 text-xl">Path {{ index + 1 }}</h2>
        <div class="mb-4">
          <label for="boss" class="block mb-2">Boss:</label>
          <select v-model="path.boss" class="w-full border border-gray-300 rounded p-2" required>
            <!-- Replace the options with your actual boss names -->
            <option disabled value="">Select a boss</option>
            <option>Boss A</option>
            <option>Boss B</option>
            <option>Boss C</option>
          </select>
        </div>
        <div class="mb-4">
          <label for="killCount" class="block mb-2">Kill Count Threshold:</label>
          <input type="number" id="killCount" v-model.number="path.killCount"
            class="w-full border border-gray-300 rounded p-2" min="1" required />
        </div>
      </div>
      <!-- ... -->
      <div class="mb-4">
        <label for="startDate" class="block mb-2">Start Date:</label>
        <input type="date" id="startDate" v-model="startDate" class="w-full border border-gray-300 rounded p-2"
          required />
      </div>
      <div class="mb-4">
        <label for="endDate" class="block mb-2">End Date:</label>
        <input type="date" id="endDate" v-model="endDate" class="w-full border border-gray-300 rounded p-2" required />
      </div>
      <!-- ... -->
      <button @click.prevent="addPath" class="px-4 py-2 bg-gray-600 text-white rounded mr-4">Add Path</button>
      <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded">Create Event</button>
    </form>

    <div v-if="eventCreated" class="mt-8">
      <h2 class="text-2xl mb-4">Event Created</h2>
      <div>
        <strong>Event Name:</strong> {{ eventCreated.eventName }}
      </div>
      <div>
        <strong>Start Date:</strong> {{ eventCreated.startDate }}
      </div>
      <div>
        <strong>End Date:</strong> {{ eventCreated.endDate }}
      </div>
      <div>
        <strong>Paths:</strong>
        <ul>
          <li v-for="(path, index) in eventCreated.paths" :key="index">
            Path {{ index + 1 }}: {{ path.boss }} ({{ path.killCount }} kill count)
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import axios from 'axios';

interface CreateEventData {
  eventName: string;
  paths: {
    boss: string;
    killCount: number;
  }[];
  startDate: string;
  endDate: string;
  eventCreated: {
    eventName: string;
    paths: {
      boss: string;
      killCount: number;
    }[];
    startDate: string;
    endDate: string;
  } | null;
}

export default defineComponent({
  data(): CreateEventData {
    return {
      eventName: '',
      paths: [
        {
          boss: '',
          killCount: 1,
        },
      ],
      startDate: '',
      endDate: '',
      eventCreated: null,
    };
  },
  methods: {
    addPath() {
      this.paths.push({ boss: '', killCount: 1 });
    },

    async createEvent() {
      // The method implementation remains unchanged
      // Perform validation here if necessary
      const eventData = {
        eventName: this.eventName,
        paths: this.paths,
        startDate: this.startDate,
        endDate: this.endDate,
      };

      // Send the event data to your API to create a new event
      // Replace with the appropriate API endpoint and axios or another HTTP library
      const response = await axios.post('http://localhost:3000/events', eventData);
      // const eventUUID = response.data.uuid;

      // // Display the generated UUID for the user to share with others

      // Clear the form
      this.eventName = '';
      this.paths = [{ boss: '', killCount: 1 }];

      // Set the eventCreated property
      this.eventCreated = {
        eventName: this.eventName,
        paths: this.paths,
        startDate: this.startDate,
        endDate: this.endDate,
      };
    },
  },
});
</script>

<style scoped>
/* Add your CSS styles here */
</style>
