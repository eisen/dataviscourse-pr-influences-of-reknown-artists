import * as d3 from "d3"
import { Types } from "."

export const ColorScheme = [
  "rgb(211, 157, 69)",
  "#ff69b4",
  "#ffe4c4",
  "rgb(20, 57, 59)",
  "rgb(163, 0, 48)",
  "rgb(222, 182, 254)",
  "#1e90ff",
  "#00ff00",
  "#7624C2",
  "rgb(195, 72, 54)",
  "rgb(52, 25, 58)",
  "rgb(252, 179, 75)",
]

export const ArtistName = (datum: Types.ArtistData) => {
  return datum.artist.replace(/[\s\.]/g, "")
}

export const ArtistID = (datum: string) => {
  return datum.replace(/[\s\.]/g, "")
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

export const GetXfromLatLon = (
  projection: any,
  loc: {
    lat: number
    lon: number
  }[]
) => {
  const pos = projection([loc[0].lon, loc[0].lat])!
  return pos[0]
}

export const GetYfromLatLon = (
  projection: any,
  loc: {
    lat: number
    lon: number
  }[]
) => {
  const pos = projection([loc[0].lon, loc[0].lat])!
  return pos[1]
}
