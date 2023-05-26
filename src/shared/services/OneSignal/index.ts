import * as OneSignalProvider from 'onesignal-node'
import Environment from '@Shared/helpers/Environment'
import { CreateNotificationBody } from 'onesignal-node/lib/types'
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

  /**
   * Sends a push notification using OneSignal API.
   * @param {CreateNotificationBody} payload - Notification payload.
   * @returns {Promise<void>} Promise that resolves when the notification is sent.
   * @throws {Error} If an error occurs while sending the notification.
   */
  public async send(payload: CreateNotificationBody): Promise<void> {
    try {
      await this.oneSignalClient.createNotification(payload)
    } catch (error) {
      console.error(error)
      throw new Error('Error in OneSignalService')
    }
  }
}

export default new OneSignal()
