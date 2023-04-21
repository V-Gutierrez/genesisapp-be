import { Request, Response } from 'express'

import ImageKitService from 'src/shared/domain/services/ImageKitService'
import { zonedTimeToUtc } from 'date-fns-tz'
import { TIMEZONE } from 'src/shared/constants'
import { ImageKitFolders } from 'src/shared/types/Enum'
import DevotionalsRepository from 'src/modules/Devotionals/domain/repositories/DevotionalsRepository'
import { Errors, Success } from 'src/shared/helpers/Messages'
import Formatter from 'src/shared/helpers/Formatter'
import SchemaHelper from 'src/shared/helpers/SchemaHelper'

class DevotionalsController {
  static async getDevotionals(req: Request, res: Response) {
    const { region } = req.cookies.user ?? {}

    try {
      const response = await DevotionalsRepository.getReleasedDevotionals(
        region,
      )

      res.status(200).json(response)
    } catch (error) {
      res.sendStatus(500)
    }
  }

  static async getDevotionalBySlug(req: Request, res: Response) {
    try {
      const { slug } = req.params
      const { id: userId, region } = req.cookies.user ?? {}

      const response = await DevotionalsRepository.getBySlug(slug, region)

      if (!response)
        return res.status(404).json({ message: Errors.RESOURCE_NOT_FOUND })

      await DevotionalsRepository.view(response.id, userId)

      return res.status(200).json(response)
    } catch (error) {
      res.sendStatus(500)
    }
  }

  static async getDevotionalsAsAdmin(req: Request, res: Response) {
    const { region } = req.cookies.user ?? {}

    try {
      const response = await DevotionalsRepository.getAll(region)

      res.status(200).json(response)
    } catch (error) {
      res.sendStatus(500)
    }
  }

  static async createDevotional(req: Request, res: Response) {
    try {
      const errors = SchemaHelper.validateSchema(
        SchemaHelper.DEVOTIONAL_CREATION,
        req.body,
      )

      if (errors) {
        return res.status(400).json({ message: errors })
      }
      if (!req.file) {
        return res.status(400).json({ message: 'coverImage is missing' })
      }

      const { body, title, scheduledTo, author } = req.body
      const { file } = req
      const { region } = req.cookies.user ?? {}

      const {
        url: coverImage,
        thumbnailUrl: coverThumbnail,
        fileId,
      } = await ImageKitService.uploadFile(
        file.buffer,
        Formatter.generateSlug(title),
        ImageKitFolders.Devotionals,
      )

      const devotional = await DevotionalsRepository.create({
        body,
        title,
        scheduledTo: zonedTimeToUtc(new Date(scheduledTo), TIMEZONE),
        author,
        slug: Formatter.generateSlug(title),
        coverImage,
        coverThumbnail,
        assetId: fileId,
        region,
      })

      return res.status(201).json(devotional)
    } catch (e) {
      res.sendStatus(500)
    }
  }

  static async deleteDevotional(req: Request, res: Response) {
    try {
      const { id } = req.params

      const deleted = await DevotionalsRepository.deleteById(id)

      await ImageKitService.delete(deleted.assetId)

      res.status(200).json({ message: Success.RESOURCE_DELETED })
    } catch (error) {
      res.sendStatus(500)
    }
  }

  static async like(req: Request, res: Response) {
    try {
      const { id } = req.params
      const { id: userId } = req.cookies.user ?? {}

      await DevotionalsRepository.like(id, userId)

      res.status(201).json({ status: Success.RESOURCE_CREATED })
    } catch (error) {
      res.sendStatus(500)
    }
  }
}

export default DevotionalsController
