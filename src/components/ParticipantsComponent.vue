<template>
  <div class="container mx-auto px-4">
    <h1 class="my-8 text-2xl">Participants</h1>
    <table v-if="participants.length > 0" class="table-auto">
      <thead>
        <tr>
          <th class="px-4 py-2">#</th>
          <th class="px-4 py-2">Username</th>
          <th class="px-4 py-2">EHB</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(participant, index) in participants" :key="index">
          <td class="border px-4 py-2">{{ index + 1 }}</td>
          <td class="border px-4 py-2">{{ participant.username }}</td>
          <td class="border px-4 py-2">{{ Math.round(participant.ehb) }}</td>
        </tr>
      </tbody>
    </table>
    <p v-if="errorMessage" class="text-red-500">{{ errorMessage }}</p>
  </div>
</template>

<script lang="ts">
import axios from 'axios';
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { serverHostUrl } from '../utils/constants';

export default {
  setup() {
    const route = useRoute();
    const participants = ref<{ username: string; ehb: number }[]>([]);
    const errorMessage = ref<string>('');

    onMounted(async () => {
      try {
        const { eventId } = route.params;
        const response = await axios.get(
          `${serverHostUrl}/participants/${eventId}`
        );
        if (response.data.length === 0) {
          errorMessage.value = 'No event found...';
        }
        participants.value = response.data;
      } catch (error) {
        errorMessage.value =
          'Error finding participants for event:' + `${route.params.eventId}`;
      }
    });

    return { participants, errorMessage };
  },
};
</script>
