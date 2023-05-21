import * as R from 'ramda'

import Joi, { Schema } from 'joi'

class SchemaHelper {
  private readonly WEEKDAYS = [
    'Domingo',
    'Segunda-feira',
    'Terça-feira',
    'Quarta-feira',
    'Quinta-feira',
    'Sexta-feira',
    'Sábado',
  ]

  private readonly WORKING_HOURS = [
    '08:00',
    '08:30',
    '09:00',
    '09:30',
    '10:00',
    '10:30',
    '11:00',
    '11:30',
    '12:00',
    '12:30',
    '13:00',
    '13:30',
    '14:00',
    '14:30',
    '15:00',
    '15:30',
    '16:00',
    '16:30',
    '17:00',
    '17:30',
    '18:00',
    '18:30',
    '19:00',
    '19:30',
    '20:00',
    '20:30',
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
    birthdate: Joi.string().required(),
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
    scheduledTo: Joi.string().required(),
  })

  GROWTH_GROUP_CREATION = Joi.object().keys({
    name: Joi.string().required(),
    whatsappLink: Joi.string().required(),
    addressInfo: Joi.string().required(),
    weekDay: Joi.allow(this.WEEKDAYS).required(),
    scheduledTime: Joi.allow(this.WORKING_HOURS).required(),
    leadership: Joi.array().min(2).items(Joi.string()).required(),
  })

  EVENTS_CREATION = Joi.object().keys({
    title: Joi.string().required(),
    maxSlots: Joi.string().required(),
    subscriptionsScheduledTo: Joi.string().required(),
    subscriptionsDueDate: Joi.string().required(),
    eventDate: Joi.string().required(),
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
    scheduledTo: Joi.string().required(),
  })

  GALLERY_CREATION = Joi.object().keys({
    title: Joi.string().required(),
    googlePhotosAlbumUrl: Joi.string().required(),
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
