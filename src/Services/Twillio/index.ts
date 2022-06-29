import 'dotenv/config'

import Formatter from '@Helpers/Formatter'
import TwillioClient from 'twilio'

class Twillio {
  private accountSid: string

  private authToken: string

  private messagingServiceSid: string

  private TwillioInstance: TwillioClient.Twilio

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

      console.log('Twillio Service - 200')
    } catch (error) {
      console.log('Error in Twillio flow')
    }
  }
}

export default new Twillio()
