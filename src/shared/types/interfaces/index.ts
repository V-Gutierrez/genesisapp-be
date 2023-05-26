/* eslint-disable no-unused-vars */
import { Request, Response } from 'express'

export interface HTTPController {
  execute(req: Request, res: Response): Promise<any>
}

export interface EnvConfigInterface {
  DATABASE_URL: string
  FRONT_BASE_URL: string
  ACCESS_TOKEN_SECRET: string
  ACTIVATION_TOKEN_SECRET: string
  BCRYPTSALT: string
  IMAGEKIT_PRIVATE_KEY: string
  IMAGEKIT_PROJECT_URL: string
  IMAGEKIT_PUBLIC_KEY: string
  PASSWORD_RESET_TOKEN_SECRET: string
  REFRESH_TOKEN_SECRET: string
  SENDGRID_API_KEY: string
  TREBBLE_DOCS_API: string
  TREBBLE_DOCS_PID: string
  TWILIO_ACCOUNT_SID: string
  TWILIO_AUTH_TOKEN: string
  TWILLIO_MESSAGING_SERVICE_SID: string
  TWILLIO_TRIAL_NUMBER: string
  TZ: string
  GOOGLE_MAPS_API_KEY: string
  ONESIGNAL_APP_ID: string
  ONESIGNAL_API_KEY: string
}
