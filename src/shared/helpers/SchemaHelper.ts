import * as R from 'ramda'

import Joi, { Schema } from 'joi'

class SchemaHelper {
  private readonly weekdays = [
    'Domingo',
    'Segunda-feira',
    'Terça-feira',
    'Quarta-feira',
    'Quinta-feira',
    'Sexta-feira',
    'Sábado',
  ]

  SIGNUP_SCHEMA = Joi.object().keys({
    email: Joi.string().email().required(),
    name: Joi.string().required(),
    phone: Joi.string()
      .regex(/^\+[0-9]{2}\s[0-9]{1,2}\s[0-9]{1,2}\s[0-9]{4}\-[0-9]{4}/)
      .required(),
    password: Joi.string()
      .min(8)
      .regex(/[a-z]/)
      .regex(/[A-Z]/)
      .regex(/[0-9]/)
      .regex(/[ `!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~]/)
      .required(),
    birthdate: Joi.date().required(),
    region: Joi.string().required(),
  })

  LOGIN_SCHEMA = Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  })

  RESET_PASSWORD = Joi.object().keys({
    email: Joi.string().email().required(),
  })

  NEW_PASSWORD = Joi.object().keys({
    password: Joi.string()
      .min(8)
      .regex(/[a-z]/)
      .regex(/[A-Z]/)
      .regex(/[0-9]/)
      .regex(/[ `!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~]/)
      .required(),
  })

  DEVOTIONAL_CREATION = Joi.object().keys({
    body: Joi.string().required(),
    title: Joi.string().required(),
    author: Joi.string().required(),
    scheduledTo: Joi.date().required(),
  })

  GROWTH_GROUP_CREATION = Joi.object().keys({
    name: Joi.string().required(),
    whatsappLink: Joi.string().required(),
    addressInfo: Joi.string().required(),
    weekDay: Joi.allow(this.weekdays).required(),
    scheduledTime: Joi.string().required(),
    leadership: Joi.array().min(2).items(Joi.string()).required(),
  })

  EVENTS_CREATION = Joi.object().keys({
    title: Joi.string().required(),
    maxSlots: Joi.string().required(),
    subscriptionsScheduledTo: Joi.date().required(),
    subscriptionsDueDate: Joi.date().required(),
    eventDate: Joi.date().required(),
    description: Joi.string().required(),
  })

  EVENTS_SUBSCRIPTION = Joi.object().keys({
    userName: Joi.string().required(),
    userEmail: Joi.string().required(),
    userPhone: Joi.string().required(),
  })

  NEWS_CREATION = Joi.object().keys({
    title: Joi.string().required(),
    body: Joi.string().required(),
    highlightText: Joi.string().required(),
    scheduledTo: Joi.date().required(),
  })

  validateSchema<T>(schema: Schema, validationTarget: T) {
    const { error } = Joi.validate(validationTarget, schema, {
      abortEarly: false,
      convert: false,
    })

    if (!error || !error.details) {
      return null
    }

    const errorsArray = error.details.map(({ message, path }) => ({
      [path.join('.')]: message,
    }))

    return R.mergeAll(errorsArray)
  }
}

export default new SchemaHelper()
