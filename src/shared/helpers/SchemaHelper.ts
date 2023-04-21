import * as R from 'ramda'

import Joi, { Schema } from 'joi'

class SchemaHelper {
  static SIGNUP_SCHEMA = Joi.object().keys({
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

  static LOGIN_SCHEMA = Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  })

  static RESET_PASSWORD = Joi.object().keys({
    email: Joi.string().email().required(),
  })

  static NEW_PASSWORD = Joi.object().keys({
    password: Joi.string()
      .min(8)
      .regex(/[a-z]/)
      .regex(/[A-Z]/)
      .regex(/[0-9]/)
      .regex(/[ `!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~]/)
      .required(),
  })

  static DEVOTIONAL_CREATION = Joi.object().keys({
    body: Joi.string().required(),
    title: Joi.string().required(),
    author: Joi.string().required(),
    scheduledTo: Joi.string().required(),
  })

  static EVENTS_CREATION = Joi.object().keys({
    title: Joi.string().required(),
    maxSlots: Joi.string().required(),
    subscriptionsScheduledTo: Joi.string().required(),
    subscriptionsDueDate: Joi.string().required(),
    eventDate: Joi.string().required(),
    description: Joi.string().required(),
  })

  static EVENTS_SUBSCRIPTION = Joi.object().keys({
    userName: Joi.string().required(),
    userEmail: Joi.string().required(),
    userPhone: Joi.string().required(),
  })

  static NEWS_CREATION = Joi.object().keys({
    title: Joi.string().required(),
    body: Joi.string().required(),
    highlightText: Joi.string().required(),
    scheduledTo: Joi.string().required(),
  })

  static validateSchema(schema: Schema, validationTarget: any) {
    const { error } = Joi.validate(validationTarget, schema, {
      abortEarly: false,
      convert: false,
    })

    if (!error || !error.details) {
      return undefined
    }

    const errorsArray = error.details.map(({ message, path }) => ({
      [path.join('.')]: message,
    }))
    return R.mergeAll(errorsArray)
  }
}

export default SchemaHelper
