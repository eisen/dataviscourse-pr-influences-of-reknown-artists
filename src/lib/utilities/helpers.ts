import * as d3 from "d3"
import { Types } from "."

export const SeaColor = "#def3f6"

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
  "#00008B",
  "#3C1900",
  "#84011B",
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

export const MaxTextWidth = (ids: string[], text: string[]): number => {
  let max_width = 0
  for (let idx in ids) {
    const width = TextWidth(ids[idx], text[idx])
    if (width > max_width) {
      max_width = width
    }
  }

  return max_width
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

export const MaxTextHeight = (ids: string[], text: string[]): number => {
  let max_height = 0
  for (let idx in ids) {
    const height = TextHeight(ids[idx], text[idx])
    if (height > max_height) {
      max_height = height
    }
  }

  return max_height
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

export const Distance = (
  x1: number,
  y1: number,
  x2: number,
  y2: number
): number => {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2))
}

export const GetTransformValues = (transform: string): number[] => {
  const match = transform.slice(10, -1).split(",")
  return [parseFloat(match![0]), parseFloat(match![1])]
}
