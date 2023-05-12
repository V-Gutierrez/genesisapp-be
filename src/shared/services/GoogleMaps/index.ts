import Environment from '@Shared/helpers/Environment'
import { AddressAPI, AutocompleteAPI } from '@Shared/services/GoogleMaps/dtos'
import axios from 'axios'

class GoogleMaps {
  private readonly MAPS_BASE_URL = 'https://maps.googleapis.com/maps/api'

  private async fetchQueryAsAPlace(address: string): Promise<string> {
    const response = await axios.get<AutocompleteAPI.Response>(
      `${this.MAPS_BASE_URL}/place/autocomplete/json?input=${address}&key=${Environment.getEnv(
        'GOOGLE_MAPS_API_KEY',
      )}`,
    )

    return response.data.predictions[0].description
  }

  public async getGeocodeFromAddress(address: string): Promise<AddressAPI.Location | null> {
    if (!address) throw new Error('Address is required')

    const autocompletedAddress = encodeURIComponent(await this.fetchQueryAsAPlace(address))

    const response = await axios.get<AddressAPI.Response>(
      `${this.MAPS_BASE_URL}/geocode/json?address=${autocompletedAddress}&key=${Environment.getEnv(
        'GOOGLE_MAPS_API_KEY',
      )}`,
    )
    const result = response.data.results[0]

    if (response && result) return result.geometry.location

    return null
  }
}

export default new GoogleMaps()
