/* eslint-disable node/no-unsupported-features/node-builtins */
import Environment from '@Shared/helpers/Environment'
import { AddressAPI } from '@Shared/services/GoogleMaps/dtos'
import axios from 'axios'

class GoogleMaps {
  public async getGeocodeFromAddress(address: string): Promise<AddressAPI.Location | null> {
    if (!address) throw new Error('Address is required')

    const url = new URL(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${Environment.getEnv(
        'GOOGLE_MAPS_API_KEY',
      )}`,
    )

    const response = await axios.get<AddressAPI.Response>(url.toString())

    if (response) return response.data.results[0].geometry.location

    return null
  }
}

export default new GoogleMaps()
