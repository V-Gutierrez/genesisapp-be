import 'dotenv/config'

import Formatter from '@Helpers/Formatter'
import TwillioClient from 'twilio'

class Twillio {
  private readonly accountSid: string

  private readonly authToken: string

  private readonly messagingServiceSid: string

  private readonly TwillioInstance: TwillioClient.Twilio

  constructor() {
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
      throw new Error('Error in TwillioService')
    }
  }
}

export default new Twillio()
