import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import CreateEvent from '../components/CreateEvent.vue';
import EventDetails from '../views/EventDetailsView.vue';
import ParticipantsComponent from '../components/ParticipantsComponent.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/create-event',
      name: 'CreateEvent',
      component: CreateEvent,
    },
    {
      path: '/event/:eventId',
      name: 'EventDetails',
      component: EventDetails,
    },
    {
      path: '/event/:eventId/participants',
      name: 'Participants',
      component: ParticipantsComponent,
    },
  ],
});

export default router;
