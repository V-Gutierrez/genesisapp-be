import 'dotenv/config'

import TwillioClient from 'twilio'
import { sanitizeUserPhone } from '@Helpers/Utils'

const accountSid = process.env.TWILIO_ACCOUNT_SID
const authToken = process.env.TWILIO_AUTH_TOKEN
const MessagingServiceSid = process.env.TWILLIO_MESSAGING_SERVICE_SID

const TwillioInstance = TwillioClient(accountSid, authToken)

class Twillio {
  static async sendSimpleMessage(body: string, to: string) {
    try {
      await TwillioInstance.messages.create({
        body,
        to: sanitizeUserPhone(to),
        messagingServiceSid: MessagingServiceSid,
      })
    } catch (error) {
      console.log('Error in Twillio flow')
    }
  }
}

export default Twillio

/* https://docs.sendgrid.com/for-developers/sending-email/scheduling-parameters#send-at */
