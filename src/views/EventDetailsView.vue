<template>
    <div class="container mx-auto px-4">
      <h1 class="my-8 text-2xl">Event Details</h1>
      <div v-if="eventData">
        <h2>{{ eventData.eventName }}</h2>
        <p>Start Date: {{ eventData.startDate }}</p>
        <p>End Date: {{ eventData.endDate }}</p>
        <div v-for="(path, index) in eventData.paths" :key="index">
          <h3>Path {{ index + 1 }}</h3>
          <p>Boss: {{ path.boss }}</p>
          <p>Kill Count Threshold: {{ path.killCount }}</p>
        </div>
      </div>
      <div v-else-if="eventNotFound">
        <p>Sorry... this event could not be found.</p>
      </div>
      <div v-else>
        <p>Loading event data...</p>
      </div>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent, onMounted, ref } from 'vue';
  import { useRoute } from 'vue-router';
  import axios from 'axios';
  
  interface EventData {
    eventName: string;
    paths: {
      boss: string;
      killCount: number;
    }[];
    startDate: string;
    endDate: string;
  }
  
  export default defineComponent({
    setup() {
      const route = useRoute();
      const eventData = ref<EventData>({
        eventName: '',
        paths: [],
        startDate: '',
        endDate: '',
      });
      const eventNotFound = ref(false);
  
      onMounted(async () => {
        const { eventId } = route.params;
        try {
          // Fetch the event data from your API
          const response = await axios.get(`http://localhost:3000/api/events/${eventId}`);
          eventData.value = response.data;
        } catch (error) {
          eventNotFound.value = true;
          type AxiosError = {
            response?: {
              status: number;
            };
          };
          const axiosError = error as AxiosError;
          if (axiosError.response && axiosError.response.status === 404) {
            eventNotFound.value = true;
          }
        }
      });
  
      return { eventData, eventNotFound };
    },
  });
  </script>
  