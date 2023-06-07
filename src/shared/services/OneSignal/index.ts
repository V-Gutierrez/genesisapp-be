import * as OneSignalProvider from 'onesignal-node'
import Environment from '@Shared/helpers/Environment'
import { CreateNotificationBody } from 'onesignal-node/lib/types'
import { Region } from '@prisma/client'
import { Service } from '..'

/**
 * Service for sending push notifications using OneSignal API.
 * @extends Service
 */
class OneSignal extends Service {
  /**
   * OneSignal client instance.
   * @private
   * @type {OneSignalProvider.Client}
   */
  private readonly oneSignalClient: OneSignalProvider.Client

  /**
   * Creates an instance of OneSignalService.
   * @constructor
   */
  constructor() {
    super()

    /**
     * OneSignal client instance.
     * @private
     * @type {OneSignalProvider.Client}
     */
    this.oneSignalClient = new OneSignalProvider.Client(
      Environment.getEnv('ONESIGNAL_APP_ID'),
      Environment.getEnv('ONESIGNAL_API_KEY'),
    )
  }

  private detectSegment(region?: Region): string[] {
    switch (region) {
      case 'FEC':
        return ['Brazil']
      case 'AEP':
        return ['Argentina']
      default:
        return ['Subscribed Users']
    }
  }

  public async send(
    title: string,
    message: string,
    url?: string,
    scheduledDate?: Date,
    region?: Region,
  ): Promise<void> {
    if (!Environment.isProduction) {
      return
    }

    try {
      await this.oneSignalClient.createNotification({
        contents: {
          en: message,
          pt: message,
        },
        url,
        headings: {
          en: title,
          pt: title,
        },
        included_segments: this.detectSegment(region),
        send_after: scheduledDate?.toISOString(),
      })
    } catch (error) {
      console.error(error)
      throw new Error('Error in OneSignalService')
    }
  }
}

export default new OneSignal()
