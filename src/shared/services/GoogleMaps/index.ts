import Environment from '@Shared/helpers/Environment'
import { Service } from '@Shared/services'
import { AddressAPI, AutocompleteAPI } from '@Shared/services/GoogleMaps/dtos'
import axios from 'axios'

class GoogleMaps extends Service {
  constructor() {
    super()
  }

  private readonly MAPS_BASE_URL = 'https://maps.googleapis.com/maps/api'

  private readonly API_KEY = Environment.getEnv('GOOGLE_MAPS_API_KEY')

  private async useAutocompleteAPI(address: string): Promise<string> {
    const response = await axios.get<AutocompleteAPI.Response>(
      `${this.MAPS_BASE_URL}/place/autocomplete/json?input=${address}&key=${this.API_KEY}`,
    )

    return response.data.predictions[0].description
  }

  public async getGeocodeFromAddress(address: string): Promise<AddressAPI.Location | null> {
    if (!address) throw new Error('Address is required')

    const autocompletedAddress = encodeURIComponent(await this.useAutocompleteAPI(address))

    const response = await axios.get<AddressAPI.Response>(
      `${this.MAPS_BASE_URL}/geocode/json?address=${autocompletedAddress}&key=${this.API_KEY}`,
    )
    const result = response.data.results[0]

    if (response && result) return result.geometry.location

    return null
  }
}

export default new GoogleMaps()
