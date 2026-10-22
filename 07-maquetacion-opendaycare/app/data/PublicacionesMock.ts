// Mock estático del feed (sin base de datos ni seed).
// El contenido es copia literal del diseño de referencia pantallas/feed.dc.html.

import { ref } from 'vue'
import type { FeedMeta, FeedPost, FeedUser } from '~/types/feed'

export const currentTeacher: FeedUser = {
  name: 'Caro Giménez',
  initials: 'C',
  role: 'Maestra · Soles',
}

export const feedMeta: FeedMeta = {
  room: 'Sala Soles',
  greeting: 'Buenas, Caro',
  subtitle: '12 niños · martes 17 jun',
}

// Lista reactiva: las publicaciones nuevas se agregan al tope y se pierden al recargar.
export const feedPosts = ref<FeedPost[]>([
  {
    id: 'logro-mateo-orinal',
    type: 'achievement',
    title: 'Mateo',
    initials: 'M',
    time: '14:20',
    publisherLabel: 'publicado por vos',
    recipient: 'familia de Mateo',
    content:
      '¡Usó el orinal solito por primera vez! Estaba feliz de contárselo a todos. Un gran paso.',
    likes: 3,
    comments: 1,
  },
  {
    id: 'actividad-mateo-temperas',
    type: 'activity',
    title: 'Mateo',
    initials: 'M',
    time: '09:40',
    publisherLabel: 'publicado por vos',
    recipient: 'familia de Mateo',
    content:
      'Pintamos con témperas esta mañana. Mateo eligió el azul para todo y se concentró un montón mezclando colores.',
    photoCaption: 'Foto · pintando con témperas',
    likes: 5,
    comments: 2,
  },
  {
    id: 'anuncio-parque-viernes',
    type: 'announcement',
    title: 'Anuncio general',
    initials: '',
    time: '07:50',
    publisherLabel: 'publicado por vos',
    recipient: 'toda la sala',
    content:
      'El viernes salimos al parque por la mañana. Recuerden mandar gorra y una botellita de agua.',
    likes: 8,
    comments: 0,
  },
])
