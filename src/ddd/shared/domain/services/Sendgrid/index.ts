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
        from: { email: 'suportegenesischurch@gmail.com', name: 'Genesis Church' },
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
        from: { email: 'suportegenesischurch@gmail.com', name: 'Genesis Church' },
        subject: 'Alteração de senha',
        templateId: 'd-03325789ee6f4014858e14ac7cde78e1',
        dynamicTemplateData,
      }),
    },
    anniversary: {
      config: (to: string): MailDataRequired => ({
        templateId: 'd-b5cc420efe514a31bef0e658747cf56d',
        from: { email: 'suportegenesischurch@gmail.com', name: 'Genesis Church' },
        to,
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
    } catch (error) {
      throw new Error('Error in Sendgrid flow')
    }
  }
}

export default SendgridClient
