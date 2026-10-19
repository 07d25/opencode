// Tipos del dominio de niños (listado y perfil).

export type ChildAlertKind = 'allergy' | 'diet' | 'medical'

export type ParentStatus = 'active' | 'pending'

export interface ChildAlert {
  kind: ChildAlertKind
  // Etiqueta corta de la alerta: "MANÍ" | "LACTOSA".
  label: string
  // Título del panel: "Alergias y notas".
  title: string
  // Texto descriptivo del panel de advertencia.
  notes: string
  tone: 'danger'
}

export interface ChildParent {
  name: string
  initials: string
  // Rol del familiar: "Mamá" | "Papá".
  role: string
  // Estado legible: "activa" | "invitación enviada".
  statusLabel: string
  status: ParentStatus
}

export interface Child {
  id: string
  // Slug de la ruta: "mateo-fernandez".
  slug: string
  fullName: string
  initials: string
  age: string
  room: string
  // Tono del avatar según el color de la referencia.
  avatarTone: 'sky' | 'pink' | 'mint' | 'yellow' | 'violet'
  // "2 padres vinculados" | "1 padre vinculado" | "sin padres vinculados".
  linkedParentsLabel: string
  alerts: ChildAlert[]
  // Indicador del lado derecho de la card.
  badge: { type: 'alert' | 'link' | 'none'; label?: string }
  // Fecha de nacimiento: "12 mar 2022".
  birthDate: string
  // Mes de ingreso: "feb 2025".
  enrolledAt: string
  parents: ChildParent[]
}
