import type { CollectionConfig } from 'payload'

export const Courses: CollectionConfig = {
  slug: 'courses',
  admin: {
    useAsTitle: 'name',
  },
  fields: [
    { name: 'name', type: 'text' },
    { name: 'description', type: 'text' },
    { name: 'videos', type: 'join', collection: 'videos', on: 'course' },
    { name: 'leaderboards', type: 'join', collection: 'leaderboards', on: 'courses' },
  ],
}
