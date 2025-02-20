import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { env } from '../env'
import { accessInviteLink } from '../functions/access-invite-link'
import { redis } from '../redis/client'

export const accessInviteLinkRoute: FastifyPluginAsyncZod = async app => {
  app.get(
    '/invites/:subscribeId',
    {
      schema: {
        summary: 'Access invite link and redirects user',
        tags: ['Referral'],
        params: z.object({
          subscribeId: z.string(),
        }),
        response: {
          201: z.object({
            subscriberId: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { subscribeId } = request.params

      await accessInviteLink({ subscribeId })

      console.log(await redis.hgetall('referral:access-count'))

      const redirectUrl = new URL(env.WEB_URL)

      redirectUrl.searchParams.set('referrer', subscribeId)
      return reply.redirect(redirectUrl.toString(), 302)
    }
  )
}
