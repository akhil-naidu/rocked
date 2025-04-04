import type { CollectionConfig } from 'payload'

export const Leaderboards: CollectionConfig = {
  slug: 'leaderboards',
  admin: {
    useAsTitle: 'name',
  },
  fields: [
    { name: 'name', type: 'text' },
    {
      name: 'type',
      type: 'select',
      options: [
        { label: 'weekly', value: 'weekly' },
        { label: 'monthly', value: 'monthly' },
        { label: 'yearly', value: 'yearly' },
      ],
    },
    { name: 'courses', type: 'relationship', relationTo: 'courses', hasMany: true },
  ],
}
