import type { CollectionConfig } from 'payload'

export const LeaderBoardScores: CollectionConfig = {
  slug: 'leader-board-scores',
  fields: [
    { name: 'leaderboard', type: 'relationship', relationTo: 'leaderboards' },
    { name: 'user', type: 'relationship', relationTo: 'users' },
    { name: 'star_count', type: 'number', defaultValue: 0 },
    { name: 'period_start', type: 'date' },
    { name: 'period_end', type: 'date' },
  ],
}
