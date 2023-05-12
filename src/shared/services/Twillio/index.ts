import { Service } from '@Shared/services'
import Formatter from 'src/shared/helpers/Formatter'

import TwillioClient from 'twilio'

class Twillio extends Service {
  private readonly accountSid: string

  private readonly authToken: string

  private readonly messagingServiceSid: string

  private readonly TwillioInstance: TwillioClient.Twilio

  constructor() {
    super()
    this.accountSid = process.env.TWILIO_ACCOUNT_SID as string
    this.authToken = process.env.TWILIO_AUTH_TOKEN as string
    this.messagingServiceSid = process.env.TWILLIO_MESSAGING_SERVICE_SID as string

    this.TwillioInstance = TwillioClient(this.accountSid, this.authToken)
  }

  async sendSimpleMessage(body: string, to: string) {
    try {
      await this.TwillioInstance.messages.create({
        body,
        to: Formatter.sanitizeUserPhone(to),
        messagingServiceSid: this.messagingServiceSid,
      })
    } catch (error) {
      console.error(error)
      throw new Error('Error in TwillioService')
    }
  }
}

export default new Twillio()
