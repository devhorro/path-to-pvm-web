<!-- ParticipantsList.vue -->
<template>
  <div>
    <button
      @click="showParticipants = !showParticipants"
      class="px-4 py-2 bg-blue-500 text-white rounded shadow"
    >
      {{ showParticipants ? 'Hide Participants' : 'Show Participants' }}
    </button>

    <div v-if="showParticipants">
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
              <td class="border px-4 py-2">
                {{ Math.round(participant.ehb) }}
              </td>
            </tr>
          </tbody>
        </table>
        <p v-if="errorMessage" class="text-red-500">{{ errorMessage }}</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';
import { serverHostUrl } from '@/utils/constants';

interface Participant {
  username: string;
  ehb: string;
  playerData: object;
}

export default defineComponent({
  props: {
    eventId: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const route = useRoute();
    const participants = ref<Participant[]>([]);
    const showParticipants = ref(false);
    const errorMessage = ref<string>('');

    const getParticipants = async () => {
      try {
        console.log('fetching participants');
        const response = await axios.get(
          `${serverHostUrl}/participants/${props.eventId}`
        );
        participants.value = response.data.sort(
          (a: { ehb: string }, b: { ehb: string }) =>
            parseInt(b.ehb, 2) - parseInt(a.ehb, 2)
        );
        console.log(participants.value);
      } catch (error) {
        errorMessage.value = 'Error fetching participants for event.';
      }
    };

    onMounted(() => {
      console.log(`props.eventId: ${props.eventId}`);
      if (props.eventId) getParticipants();
    });

    watch(
      () => props.eventId,
      () => {
        if (!props.eventId) getParticipants();
      }
    );

    return {
      participants,
      showParticipants,
      errorMessage,
    };
  },
});
</script>
