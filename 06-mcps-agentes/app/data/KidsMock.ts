// Mock estático de niños (sin base de datos, API ni seed).
// El listado es copia literal de pantallas/ninos.dc.html; los datos de perfil de
// Mateo provienen de pantallas/perfil-nino.dc.html y el resto es mock de diseño.

import type { Child, ChildAlert, ChildParent } from '~/types/child'

// Etiquetas de la barra superior del listado.
export const kidsRoomLabel = 'SALA SOLES'
export const kidsCountLabel = '8 niños'

// Alergia del niño con maní (referencia de diseño).
const peanutAlert: ChildAlert = {
  kind: 'allergy',
  label: 'MANÍ',
  title: 'Alergias y notas',
  notes: 'Alergia al maní. Evitar frutos secos. Lleva inhalador en la mochila.',
  tone: 'danger',
}

// Intolerancia a la lactosa (mock de diseño para el perfil de Tomás).
const lactoseAlert: ChildAlert = {
  kind: 'diet',
  label: 'LACTOSA',
  title: 'Alergias y notas',
  notes: 'Intolerancia a la lactosa. Se ofrece leche de soya en la merienda.',
  tone: 'danger',
}

const parents = (items: ChildParent[]): ChildParent[] => items

export const kids: Child[] = [
  {
    id: 'kid-mateo-fernandez',
    slug: 'mateo-fernandez',
    fullName: 'Mateo Fernández',
    initials: 'M',
    age: '3 años',
    room: 'Soles',
    avatarTone: 'sky',
    linkedParentsLabel: '2 padres vinculados',
    alerts: [peanutAlert],
    badge: { type: 'alert', label: 'MANÍ' },
    birthDate: '12 mar 2022',
    enrolledAt: 'feb 2025',
    parents: parents([
      {
        name: 'Lucía Fernández',
        initials: 'L',
        role: 'Mamá',
        statusLabel: 'activa',
        status: 'active',
      },
      {
        name: 'Diego Fernández',
        initials: 'D',
        role: 'Papá',
        statusLabel: 'invitación enviada',
        status: 'pending',
      },
    ]),
  },
  {
    id: 'kid-sofia-mendez',
    slug: 'sofia-mendez',
    fullName: 'Sofía Méndez',
    initials: 'S',
    age: '2 años',
    room: 'Soles',
    avatarTone: 'pink',
    linkedParentsLabel: '1 padre vinculado',
    alerts: [],
    badge: { type: 'none' },
    birthDate: '8 sep 2023',
    enrolledAt: 'mar 2025',
    parents: parents([
      {
        name: 'Camila Méndez',
        initials: 'C',
        role: 'Mamá',
        statusLabel: 'activa',
        status: 'active',
      },
    ]),
  },
  {
    id: 'kid-benjamin-ruiz',
    slug: 'benjamin-ruiz',
    fullName: 'Benjamín Ruiz',
    initials: 'B',
    age: '3 años',
    room: 'Soles',
    avatarTone: 'mint',
    linkedParentsLabel: '2 padres vinculados',
    alerts: [],
    badge: { type: 'none' },
    birthDate: '21 jun 2022',
    enrolledAt: 'feb 2025',
    parents: parents([
      {
        name: 'Andrés Ruiz',
        initials: 'A',
        role: 'Papá',
        statusLabel: 'activa',
        status: 'active',
      },
      {
        name: 'Paula Ruiz',
        initials: 'P',
        role: 'Mamá',
        statusLabel: 'invitación enviada',
        status: 'pending',
      },
    ]),
  },
  {
    id: 'kid-valentina-soto',
    slug: 'valentina-soto',
    fullName: 'Valentina Soto',
    initials: 'V',
    age: '2 años',
    room: 'Soles',
    avatarTone: 'yellow',
    linkedParentsLabel: 'sin padres vinculados',
    alerts: [],
    badge: { type: 'link', label: 'VINCULAR' },
    birthDate: '17 ene 2024',
    enrolledAt: 'abr 2025',
    parents: [],
  },
  {
    id: 'kid-tomas-diaz',
    slug: 'tomas-diaz',
    fullName: 'Tomás Díaz',
    initials: 'T',
    age: '3 años',
    room: 'Soles',
    avatarTone: 'violet',
    linkedParentsLabel: '1 padre vinculado',
    alerts: [lactoseAlert],
    badge: { type: 'alert', label: 'LACTOSA' },
    birthDate: '4 nov 2022',
    enrolledAt: 'feb 2025',
    parents: parents([
      {
        name: 'Carla Díaz',
        initials: 'C',
        role: 'Mamá',
        statusLabel: 'activa',
        status: 'active',
      },
    ]),
  },
  {
    id: 'kid-emma-castro',
    slug: 'emma-castro',
    fullName: 'Emma Castro',
    initials: 'E',
    age: '2 años',
    room: 'Soles',
    avatarTone: 'pink',
    linkedParentsLabel: '1 padre vinculado',
    alerts: [],
    badge: { type: 'none' },
    birthDate: '2 feb 2024',
    enrolledAt: 'may 2025',
    parents: parents([
      {
        name: 'Julián Castro',
        initials: 'J',
        role: 'Papá',
        statusLabel: 'invitación enviada',
        status: 'pending',
      },
    ]),
  },
  {
    id: 'kid-lucas-romero',
    slug: 'lucas-romero',
    fullName: 'Lucas Romero',
    initials: 'L',
    age: '3 años',
    room: 'Soles',
    avatarTone: 'sky',
    linkedParentsLabel: '1 padre vinculado',
    alerts: [],
    badge: { type: 'none' },
    birthDate: '19 jul 2022',
    enrolledAt: 'mar 2025',
    parents: parents([
      {
        name: 'Mariana Romero',
        initials: 'M',
        role: 'Mamá',
        statusLabel: 'activa',
        status: 'active',
      },
    ]),
  },
  {
    id: 'kid-olivia-vega',
    slug: 'olivia-vega',
    fullName: 'Olivia Vega',
    initials: 'O',
    age: '2 años',
    room: 'Soles',
    avatarTone: 'mint',
    linkedParentsLabel: '1 padre vinculado',
    alerts: [],
    badge: { type: 'none' },
    birthDate: '25 abr 2024',
    enrolledAt: 'jun 2025',
    parents: parents([
      {
        name: 'Nicolás Vega',
        initials: 'N',
        role: 'Papá',
        statusLabel: 'activa',
        status: 'active',
      },
      {
        name: 'Sol Vega',
        initials: 'S',
        role: 'Mamá',
        statusLabel: 'invitación enviada',
        status: 'pending',
      },
    ]),
  },
]

// Busca un niño por slug; devuelve undefined si no existe.
export function getChildBySlug(slug: string): Child | undefined {
  return kids.find((child) => child.slug === slug)
}
