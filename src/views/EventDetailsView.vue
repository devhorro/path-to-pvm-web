<!-- EventDetailsView.vue -->
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
      <ParticipantsList :eventId="eventData.eventId" />
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
import ParticipantsList from '../components/ParticipantsList.vue';
import type { EventData } from '@/components/types';
import { serverHostUrl } from '@/utils/constants';
  
export default defineComponent({
  components: {
    ParticipantsList,
  },
  setup() {
    const route = useRoute();
    const eventData = ref<EventData>({
      eventId: '',
      eventName: '',
      paths: [],
      startDate: '',
      endDate: '',
    });
    const eventNotFound = ref(false);
    const showParticipants = ref(false);
  
    onMounted(async () => {
      const { eventId } = route.params;
      try {

        const response = await axios.get(
          `${serverHostUrl}/api/events/${eventId}`
        );
        if (!response.data) {
          eventNotFound.value = true;
          return;
        }
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
  
    return { eventData, eventNotFound, showParticipants  };
  },
});
</script>
  