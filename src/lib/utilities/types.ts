export type AdjacencyData = {
  x: number
  y: number
  z: number
  influencer: string
  influencee: string
}

export type ScatterData = {
  name: string
  age: number
  finalYear: number
  typeOfDeath: string
}

export type ArtistLocation = {
  artist: string
  year: number
  city: string
  country: string
  lat: number
  lon: number
  x?: number
  y?: number
}

export type ArtistPosition = {
  x: number
  y: number
}

export type LocationGroup = [
  name: string,
  location: ArtistLocation[],
  x?: number,
  y?: number
]

export type ArtistInfluence = {
  artist: string
  influenced: string
}

export type InfluenceGroup = [name: string, influence: ArtistInfluence[]]

export type ArtistLink = {
  source: string
  target: string
}

export type ArtistData = {
  artist: string
  death_type: string
  thumbnail: string
  index?: number
  x?: number
  y?: number
}

export type ArtistMedium = {
  artist: string
  medium: string
}

export type PossibleMediums = {
  sculptor: number
  painter: number
  printmaker: number
  draughtsman: number
  photography: number
  film: number
  watercolourist: number
  oilpainter: number
  illustrator: number
  muralist: number
  architect: number
  ink: number
  ceramicist: number
  caligrapher: number
  engraving: number
}

export enum InfluenceType {
  Influencer = 0,
  Influencee,
  Both,
}
