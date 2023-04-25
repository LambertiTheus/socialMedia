import { clerkClient } from "@clerk/nextjs/server"
import { z } from "zod"
import type { User } from "@clerk/nextjs/dist/api"

import { createTRPCRouter, privateProcedure, publicProcedure } from "~/server/api/trpc"
import { TRPCError } from "@trpc/server"

import { Analytics, Ratelimit } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis"

const filterUserForClient = (user: User) => {
  return { id: user.id, username: user.username, profileImageUrl: user.profileImageUrl }
}

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(3, "1 m"),
  analytics: true
})

export const postsRouter = createTRPCRouter({

  getAll: publicProcedure.query(async ({ ctx }) => {
    const posts = await ctx.prisma.post.findMany({
      take: 100,
    })

    const users = (
      await clerkClient.users.getUserList({
        userId: posts.map((post) => post.authorId),
        limit: 100
      })
    ).map(filterUserForClient)

    return posts.map((post) => {
      const author = users.find((user) => user.id === post.authorId)
      if (!author || !author.username)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Author for post not found",
        })
      return {
        post,
        author: {
          ...author,
          username: author.username
        },
      }
    })
  }),

  create: privateProcedure
    .input(
      z.object({
        content: z.string().min(1, "Post must contain at least 1 character").max(2, "Post must contain at most 280 characters"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const authorId = ctx.userId

      const { success } = await ratelimit.limit(authorId)

      if (!success) throw new TRPCError({code: "TOO_MANY_REQUESTS"})

        const post = await ctx.prisma.post.create({
          data: {
            authorId,
            content: input.content
          },
        })

      return post
    }),
})
