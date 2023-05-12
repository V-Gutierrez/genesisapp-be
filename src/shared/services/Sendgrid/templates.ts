import { MailDataRequired } from '@sendgrid/mail'
import { TemplateDepedency } from '@Shared/services/Sendgrid/dtos'

const fromObject = {
  from: {
    email: 'suportegenesischurch@gmail.com',
    name: 'Genesis Church',
  },
}

export const TEMPLATES: TemplateDepedency = {
  confirmationEmail: {
    config: (
      to: string,
      dynamicTemplateData: { userFirstName: string; activationUrl: string },
    ): MailDataRequired => ({
      to,
      ...fromObject,
      subject: 'Seja bem vindo à Genesis Church',
      templateId: 'd-20dab053877c41cdb7feeda798233024',
      dynamicTemplateData,
    }),
  },
  resetPassword: {
    config: (to: string, dynamicTemplateData: { resetPasswordUrl: string }): MailDataRequired => ({
      to,
      ...fromObject,
      subject: 'Alteração de senha',
      templateId: 'd-03325789ee6f4014858e14ac7cde78e1',
      dynamicTemplateData,
    }),
  },
  anniversary: {
    config: (to: string): MailDataRequired => ({
      templateId: 'd-b5cc420efe514a31bef0e658747cf56d',
      ...fromObject,
      to,
    }),
  },
}
