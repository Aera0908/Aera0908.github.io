export interface GalleryImage {
  src: string
  caption: string
}

export interface StackGroup {
  label: string
  items: string[]
}

export interface StatItem {
  label: string
  value: string
  note?: string
}

export interface DiagramNode {
  id?: string
  label: string
  sublabel?: string
}

export interface ProjectSection {
  title: string
  content?: string
  paragraphs?: string[]
  type?: 'list' | 'diagram' | 'callout' | 'stack' | 'stats' | 'steps'
  items?: string[]
  diagramId?:
    | 'aerovit-architecture'
    | 'aerovit-dataflow'
    | 'emg-pipeline'
    | string
  caption?: string
  variant?: 'info' | 'warn' | 'note' | 'success'
  groups?: StackGroup[]
  stats?: StatItem[]
  steps?: { title: string; detail?: string }[]
}

export interface ProjectLinks {
  website?: string
  github?: string
  live?: string
}

export type WebTier = 'Web2' | 'Web3'

export type Engagement = 'Freelance' | 'Client' | 'Academic' | 'Personal' | 'Open Source'

export interface Project {
  id: string
  title: string
  description: string
  fullDescription: string
  technologies: string[]
  image: string
  category?: string
  status?: string
  featured?: boolean
  webTier?: WebTier
  engagement?: Engagement
  ndaConstrained?: boolean
  websiteUrl?: string
  gallery?: GalleryImage[]
  role: string
  duration: string
  highlights?: string[]
  sections?: ProjectSection[]
  links?: ProjectLinks
}
