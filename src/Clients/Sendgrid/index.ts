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
    resetPassword: {
      config: (
        to: string,
        dynamicTemplateData: { resetPasswordUrl: string },
      ): MailDataRequired => ({
        to,
        from: 'suportegenesischurch@gmail.com',
        subject: 'Alteração de senha',
        templateId: 'd-03325789ee6f4014858e14ac7cde78e1',
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

      console.log('Sendgrid Service - 200')
    } catch (error) {
      throw new Error('Error in Sendgrid flow')
    }
  }
}

export default SendgridClient
