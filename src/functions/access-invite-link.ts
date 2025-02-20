import { db } from '../drizzle/client'
import { subscriptions } from '../drizzle/schema/subscription'
import { redis } from '../redis/client'

interface AccessInviteLinkParams {
  subscribeId: string
}

export async function accessInviteLink({
  subscribeId,
}: AccessInviteLinkParams) {
  await redis.hincrby('referral:access-count', subscribeId, 1)
}
