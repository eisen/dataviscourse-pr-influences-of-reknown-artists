export type ArtistLocation = {
  artist: string
  year: number
  city: string
  country: string
  lat: number
  lon: number
}

export type ArtistInfluence = {
  artist: string
  influenced: string
}

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
