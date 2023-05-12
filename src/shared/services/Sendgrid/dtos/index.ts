/* eslint-disable no-unused-vars */
import { MailDataRequired } from '@sendgrid/mail'

export type SendGridTemplate = {
  config: (to: string, dynamicTemplateData: any) => MailDataRequired
}

export type TemplateDepedency = Record<string, SendGridTemplate>
