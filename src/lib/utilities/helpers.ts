import { Types } from "."

export const ArtistName = (datum: Types.ArtistData) => {
  return datum.artist.replace(/[\s\.]/g, "")
}

export const TextWidth = (id: string, text: string): number => {
  const node = d3.select(id).node()! as Element
  if (node) {
    const bbox = node.getBoundingClientRect()
    return bbox.width
  } else {
    return 0
  }
}

export const TextHeight = (id: string, text: string): number => {
  const node = d3.select(id).node()! as Element
  if (node) {
    const bbox = node.getBoundingClientRect()
    return bbox.height
  } else {
    return 0
  }
}

export const getXfromLatLon = (
  projection: any,
  loc: {
    lat: number
    lon: number
  }[]
) => {
  const pos = projection([loc[0].lon, loc[0].lat])!
  return pos[0]
}

export const getYfromLatLon = (
  projection: any,
  loc: {
    lat: number
    lon: number
  }[]
) => {
  const pos = projection([loc[0].lon, loc[0].lat])!
  return pos[1]
}
