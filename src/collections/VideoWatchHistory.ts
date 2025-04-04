import type { CollectionConfig } from 'payload'

export const VideoWatchHistory: CollectionConfig = {
  slug: 'video-watch-history',
  fields: [
    { name: 'user', type: 'relationship', relationTo: 'users' },
    { name: 'video', type: 'relationship', relationTo: 'videos' },
    {
      name: 'watch_percentage',
      type: 'number',
      label: 'percentage varies form 1 to 100',
      defaultValue: 0,
      min: 0,
      max: 100,
    },
    {
      name: 'watch_at',
      type: 'date',
      defaultValue: () => new Date(),
    },
  ],
}
