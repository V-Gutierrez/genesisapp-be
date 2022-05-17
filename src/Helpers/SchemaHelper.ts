import * as R from 'ramda'

import Joi, { Schema } from 'joi'

class SchemaHelper {
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
