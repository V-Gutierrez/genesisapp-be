import SendgridMail, { MailDataRequired } from '@sendgrid/mail'
import Environment from '@Shared/helpers/Environment'
import { Service } from '@Shared/services'
import { TEMPLATES } from '@Shared/services/Sendgrid/templates'
import { TemplateDepedency } from './dtos/index'

class Sendgrid extends Service {
  public readonly TEMPLATES: TemplateDepedency

  constructor(templates: TemplateDepedency) {
    super()

    this.TEMPLATES = templates

    SendgridMail.setApiKey(Environment.getEnv('SENDGRID_API_KEY'))
  }

  async send(templateConfig: MailDataRequired | MailDataRequired[]) {
    const msg = templateConfig

    try {
      await SendgridMail.send(msg)
    } catch (error) {
      console.error(error)
      throw new Error('Error in Sendgrid Service')
    }
  }
}

export default new Sendgrid(TEMPLATES)
