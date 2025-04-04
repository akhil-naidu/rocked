import type { CollectionConfig } from 'payload'

export const Videos: CollectionConfig = {
  slug: 'videos',
  admin: {
    useAsTitle: 'title',
  },
  fields: [
    { name: 'title', type: 'text' },
    { name: 'duration', type: 'number', label: 'duration in seconds' },
    { name: 'course', type: 'relationship', relationTo: 'courses' },
  ],
}
