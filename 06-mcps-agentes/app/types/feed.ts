// Tipos compartidos del feed del staff.

export type FeedPostType = 'achievement' | 'activity' | 'announcement'

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
  likes: number
  comments: number
}
