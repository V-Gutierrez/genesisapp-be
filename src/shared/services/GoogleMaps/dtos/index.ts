/* eslint-disable no-use-before-define */

export namespace AddressAPI {
  export interface Response {
    results: Result[]
    status: string
  }

  export interface Result {
    address_components: AddressComponent[]
    formatted_address: string
    geometry: Geometry
    place_id: string
    plus_code: PlusCode
    types: string[]
  }

  export interface AddressComponent {
    long_name: string
    short_name: string
    types: string[]
  }

  export interface Geometry {
    location: Location
    location_type: string
    viewport: Viewport
  }

  export interface Location {
    lat: number
    lng: number
  }

  export interface Viewport {
    northeast: Northeast
    southwest: Southwest
  }

  export interface Northeast {
    lat: number
    lng: number
  }

  export interface Southwest {
    lat: number
    lng: number
  }

  export interface PlusCode {
    compound_code: string
    global_code: string
  }
}

export namespace AutocompleteAPI {
  export interface Response {
    predictions: Prediction[]
    status: string
  }

  export interface Prediction {
    description: string
    matched_substrings: MatchedSubstring[]
    place_id: string
    reference: string
    structured_formatting: StructuredFormatting
    terms: Term[]
    types: string[]
  }

  export interface MatchedSubstring {
    length: number
    offset: number
  }

  export interface StructuredFormatting {
    main_text: string
    main_text_matched_substrings: MainTextMatchedSubstring[]
    secondary_text: string
  }

  export interface MainTextMatchedSubstring {
    length: number
    offset: number
  }

  export interface Term {
    offset: number
    value: string
  }
}
