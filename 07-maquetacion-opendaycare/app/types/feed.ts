// Tipos compartidos del feed del staff.

export type FeedPostType =
  | 'food'
  | 'nap'
  | 'activity'
  | 'achievement'
  | 'mood'
  | 'photo'
  | 'announcement'

// Destinatario de una publicación: un niño o toda la sala.
export type PostRecipient =
  | { kind: 'child'; slug: string; name: string }
  | { kind: 'room' }

// Tipo de momento publicado (coincide con los chips de "Nueva publicación").
export type PostType = FeedPostType

export interface FeedUser {
  name: string
  initials: string
  role: string
}

export interface FeedMeta {
  room: string
  greeting: string
  subtitle: string
}

export interface FeedPost {
  id: string
  type: FeedPostType
  // Nombre visible del autor del post: el niño o "Anuncio general".
  title: string
  // Iniciales del avatar; vacío en los posts de anuncio (usan ícono).
  initials: string
  time: string
  publisherLabel: string
  recipient: string
  content: string
  photoCaption?: string
  // Miniatura local de la foto adjunta (URL de objeto, solo en memoria).
  photoUrl?: string
  likes: number
  comments: number
}
