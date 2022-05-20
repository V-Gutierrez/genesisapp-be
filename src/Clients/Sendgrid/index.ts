import 'dotenv/config'

import SendgridMail, { MailDataRequired } from '@sendgrid/mail'

class SendgridClient {
  TEMPLATES = {
    confirmationEmail: {
      config: (
        to: string,
        dynamicTemplateData: { userFirstName: string; activationUrl: string },
      ): MailDataRequired => ({
          to,
          from: 'suportegenesischurch@gmail.com',
          subject: 'Seja bem vindo à Genesis Church',
          templateId: 'd-20dab053877c41cdb7feeda798233024',
          dynamicTemplateData,
        }),
    },
  }

  constructor() {
    SendgridMail.setApiKey(process.env.SENDGRID_API_KEY as string)
  }

  async send(templateConfig: MailDataRequired | MailDataRequired[]) {
    const msg = templateConfig

    try {
      await SendgridMail.send(msg)

      console.log('[SendgridClient]: Email sent successfully', msg)
    } catch (error) {
      console.error(error)
    }
  }
}

export default SendgridClient
