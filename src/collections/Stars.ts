import type { CollectionConfig } from 'payload'
import type { CollectionBeforeOperationHook, CollectionAfterChangeHook } from 'payload'

const beforeAddingStars: CollectionBeforeOperationHook = async ({ args, operation, req }) => {
  if (operation === 'create' || operation === 'update') {
    // Get the current date and start of day
    const now = new Date()
    const startOfDay = new Date(now.setHours(0, 0, 0, 0))

    // not required when using req.user
    const userDetails = await req.payload.findByID({
      collection: 'users',
      id: args.data.user,
    })

    // Query to check stars allocated today for this user
    const todayStars = await req.payload.find({
      collection: 'stars',
      where: {
        awarded_at: {
          greater_than: startOfDay,
        },
        user: {
          equals: userDetails.id,
        },
      },
      // user: userDetails,
      // overrideAccess: false,
    })

    const starForTheVideoExists = await req.payload.find({
      collection: 'stars',
      where: {
        video: {
          equals: args.data.video,
        },
        user: {
          equals: userDetails.id,
        },
      },
    })

    // Check if stars were already allocated to the same video/course
    // TODO: If starts are already allocated for the video, just stop creating the a new row
    // const existingStarsForVideo = todayStars.docs.find(star => star.video === args.data.video)
    if (starForTheVideoExists.totalDocs) {
      throw new Error('Stars have already been allocated to this video today')
    }

    // Determine star value based on user's daily allocation count
    const starCount = todayStars.docs.length
    let starValue
    if (starCount < 2) {
      starValue = 20
    } else if (starCount < 5) {
      starValue = 5
    } else if (starCount < 10) {
      starValue = 1
    } else {
      throw new Error('Daily star allocation limit reached for this user')
    }

    // Override the star value in the data
    args.data.stars = starValue

    // Calculate total stars awarded today for this user
    const totalStars = todayStars.docs.reduce((sum, star) => sum + (star.stars || 0), 0) + starValue

    // If more than 60 stars were allocated today, throw error
    if (totalStars > 60) {
      throw new Error('Cannot allocate more stars. Daily limit of 60 stars has been exceeded.')
    }
  }
  return args
}

const afterAddingStars: CollectionAfterChangeHook = async ({ doc, req, operation }) => {
  if (operation === 'create') {
    // Get the video details to find its course
    const video = await req.payload.findByID({
      collection: 'videos',
      id: doc.video,
    })

    // Get the specific leaderboard for this course
    const leaderboardDoc = await req.payload.find({
      collection: 'leaderboards',
      where: {
        courses: {
          equals: typeof video?.course === 'string' ? video.course : video?.course?.id,
        },
      },
    })

    const leaderboard = leaderboardDoc?.docs?.at(0)

    console.log({ leaderboard })

    if (leaderboard) {
      const now = new Date()
      // Initialize with default values (current month)
      let periodStart = new Date(now.getFullYear(), now.getMonth(), 1)
      let periodEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0)

      // Calculate period start and end based on leaderboard type
      switch (leaderboard.type) {
        case 'weekly':
          periodStart = new Date(now.setDate(now.getDate() - now.getDay()))
          periodStart.setHours(0, 0, 0, 0)
          periodEnd = new Date(periodStart)
          periodEnd.setDate(periodStart.getDate() + 7)
          break
        case 'monthly':
          // Already set with default values
          break
        case 'yearly':
          periodStart = new Date(now.getFullYear(), 0, 1)
          periodEnd = new Date(now.getFullYear(), 11, 31)
          break
        default:
          // Keep default monthly values for unknown types
          break
      }

      // Find existing score for this period
      const existingScore = await req.payload.find({
        collection: 'leader-board-scores',
        where: {
          leaderboard: {
            equals: leaderboard.id,
          },
          user: {
            equals: doc.user,
          },
          period_start: {
            equals: periodStart,
          },
          period_end: {
            equals: periodEnd,
          },
        },
      })

      console.log(existingScore)

      if (existingScore.totalDocs > 0) {
        // Update existing score
        await req.payload.update({
          collection: 'leader-board-scores',
          id: existingScore.docs[0].id,
          data: {
            star_count: existingScore.docs[0].star_count + doc.stars,
          },
        })
      } else {
        // Create new score
        await req.payload.create({
          collection: 'leader-board-scores',
          data: {
            leaderboard: leaderboard.id,
            user: doc.user,
            star_count: doc.stars,
            period_start: periodStart.toISOString(),
            period_end: periodEnd.toISOString(),
          },
        })
      }
    }
    return doc
  }
}

export const Stars: CollectionConfig = {
  slug: 'stars',
  hooks: {
    beforeOperation: [beforeAddingStars],
    afterChange: [afterAddingStars], // Add this line
  },
  fields: [
    { name: 'user', type: 'relationship', relationTo: 'users' },
    { name: 'video', type: 'relationship', relationTo: 'videos' },
    {
      name: 'stars',
      type: 'number',
      defaultValue: 0,
      validate: (value: any) => {
        const allowedValues = [0, 1, 5, 20]
        if (!allowedValues.includes(value)) {
          return 'Must be 1, 5, 20'
        }
        return true
      },
      hooks: {
        beforeChange: [
          ({ value, operation }) => {
            if (operation === 'create') {
              // Perform additional validation or transformation for 'create' operation
            }
            return value
          },
        ],
      },
    },
    {
      name: 'awarded_at',
      type: 'date',
      defaultValue: () => new Date(),
    },
  ],
}
