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
    scheduledTo: Joi.string().required(),
  })

  static validateSchema(schema: Schema, validationTarget: object) {
    const { error } = Joi.validate(validationTarget, schema, { abortEarly: false, convert: false })

    if (!error || !error.details) {
      return undefined
    }

    const errorsArray = error.details.map(({ message, path }) => ({ [path.join('.')]: message }))
    return R.mergeAll(errorsArray)
  }
}

export default SchemaHelper
