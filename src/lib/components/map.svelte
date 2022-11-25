<script lang="ts">
  import * as d3 from "d3"
  import { feature, neighbors } from "topojson"
  import { geoWinkel3 } from "d3-geo-projection"
  import { Config, Helpers, Types } from "$lib/utilities"
  import { fade } from "svelte/transition"
  import type { Path } from "d3"

  const RADIUS = 15
  const TEXT_Y_OFFSET = 20
  const PADDING = 20

  let simWorker: Worker | undefined = new Worker(
    new URL("workers/sim-nodes.worker.ts?worker", import.meta.url)
  )

  const OnWorkerMessage = (event: any) => {
    influences = event.data.nodes
  }

  simWorker.onmessage = OnWorkerMessage

  export let width: number
  $: width = 0
  export let height: number
  $: height = 0

  let world_data: any
  $: world_data = null
  let neighbors_data: any
  $: neighbors_data = null

  let country_color: any
  $: country_color = []

  let allArtists: Types.ArtistData[]

  let allLocations: Types.LocationGroup[]
  $: allLocations = []
  let locations: Types.LocationGroup[]
  $: locations = []
  let allInfluencees: Types.InfluenceGroup[]
  $: allInfluencees = []
  let allInfluencers: Types.InfluenceGroup[]
  $: allInfluencers = []

  let influences: Types.LocationGroup[]
  $: influences = []
  let influencees: Types.LocationGroup[]
  $: influencees = []
  let influencers: Types.LocationGroup[]
  $: influencers = []
  let selected: Types.LocationGroup
  $: selected

  let oldestYear: number | undefined
  $: oldestYear = 0
  let youngestYear: number | undefined
  $: youngestYear = 2100
  $: year = 0

  const graticuleGen = d3.geoGraticule()
  const graticuleUle = graticuleGen.lines()
  const graticuleOutline = graticuleGen.outline()

  let projection: any
  let path: any
  let original_scale: number
  $: update_map = 0

  $: compass_angle = 0
  $: transform_compass =
    compass_angle === 0
      ? `translate(${width - 20}, ${
          height - 60
        }) rotate(${compass_angle}) scale(2)`
      : `translate(${width - 60}, ${
          height - 20
        }) rotate(${compass_angle}) scale(2)`

  const Magnitude = (x: number, y: number): number => {
    return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2))
  }

  const GetCurve = (source: number[], target: number[]): string | Path => {
    if (source[0] === target[0] && source[1] === target[1]) return ""

    const path = d3.path()
    const curve = d3.curveCatmullRom(path)

    const tangent = [target[0] - source[0], target[1] - source[1]]
    const normal = [
      -tangent[1] / Magnitude(tangent[0], tangent[1]),
      tangent[0] / Magnitude(tangent[0], tangent[1]),
    ]

    curve.lineStart()
    curve.point(source[0], source[1])
    curve.point(
      RADIUS * 2 * normal[0] + (1 * (target[0] + source[0])) / 2,
      RADIUS * 2 * normal[1] + (1 * (target[1] + source[1])) / 2
    )
    curve.point(target[0], target[1])
    curve.lineEnd()

    return path
  }

  let tl_x_scale: d3.ScaleLinear<number, number, never>

  let influence_scale: d3.ScaleLinear<number, number, never>

  const Translate = (x: number | undefined, y: number | undefined) =>
    `translate(${x!}, ${y!})`

  const filterLocations = (year: number) => {
    locations = allLocations.filter(([, locations]) => {
      if (locations.length > 1) {
        return locations[0].year <= year && locations[1].year > year
      } else {
        return locations[0].year <= year
      }
    })
    for (const location of locations) {
      location.x = Helpers.GetXfromLatLon(projection, location[1])
      location.y = Helpers.GetYfromLatLon(projection, location[1])
    }
  }

  export const DisplayInfluences = (
    artist: string,
    influences: Types.LocationGroup[]
  ) => {
    selected = allLocations.filter((d) => d[0] === artist)[0]
    influences.push(selected)

    let min_lon = 180
    let min_lat = 180
    let max_lon = -180
    let max_lat = -180
    projection.scale(original_scale)
    projection.angle(0)
    for (const loc of influences) {
      loc.x = Helpers.GetXfromLatLon(projection, loc[1])
      loc.y = Helpers.GetYfromLatLon(projection, loc[1])
      if (loc[1][0].lon > max_lon) max_lon = loc[1][0].lon
      if (loc[1][0].lat > max_lat) max_lat = loc[1][0].lat
      if (loc[1][0].lon < min_lon) min_lon = loc[1][0].lon
      if (loc[1][0].lat < min_lat) min_lat = loc[1][0].lat
    }

    const location = [(max_lon + min_lon) / 2, (max_lat + min_lat) / 2]

    const feature = [
      [max_lat, min_lon],
      [min_lat, max_lon],
    ]

    const top_left = projection(feature[0])
    const bottom_right = projection(feature[1])

    const scale =
      0.7 /
      Math.max(
        Math.abs(bottom_right[1] - top_left[1]) / width,
        Math.abs(bottom_right[0] - top_left[0]) / height
      )

    projection.center(location)
    projection.translate([width / 2, height / 2])
    projection.scale(scale * original_scale)
    if (
      Math.abs(bottom_right[0] - top_left[0]) >
      Math.abs(bottom_right[1] - top_left[1])
    ) {
      // Taller than wide
      projection.angle(90)
      compass_angle = -90
    } else {
      compass_angle = 0
    }

    update_map += 1

    for (const loc of influences) {
      loc.x = Helpers.GetXfromLatLon(projection, loc[1])
      loc.y = Helpers.GetYfromLatLon(projection, loc[1])
    }

    simWorker!.postMessage({
      nodes: influences,
      radius: RADIUS,
    })
  }

  const GetX = (location: Types.LocationGroup) => {
    if (location.hasOwnProperty("x")) {
      return location.x
    }
    return Helpers.GetXfromLatLon(projection, location[1])
  }

  const GetY = (location: Types.LocationGroup) => {
    if (location.hasOwnProperty("y")) {
      return location.y
    }
    return Helpers.GetYfromLatLon(projection, location[1])
  }

  const GetYearGap = (
    loc1: Types.LocationGroup,
    loc2: Types.LocationGroup
  ): number => {
    const middle1 = loc1[1][0].year // Death Year - Born Year
    const middle2 = loc2[1][0].year // Death Year - Born Year

    return influence_scale(Math.abs(middle2 - middle1))
  }

  const GetThumbnail = (name: string) => {
    const artist = allArtists.filter((d) => d.artist === name)[0]
    return artist.thumbnail
  }

  export const Initialize = (
    features: any,
    influencers_data: Types.InfluenceGroup[],
    influencees_data: Types.InfluenceGroup[],
    locs: Types.ArtistLocation[],
    artist_data: Types.ArtistData[]
  ) => {
    world_data = feature(features, features.objects.countries)
    neighbors_data = neighbors(features.objects.countries.geometries)

    projection = geoWinkel3().fitSize([width, height + 4], world_data)
    path = d3.geoPath().projection(projection)
    original_scale = projection.scale()

    country_color = new Array(world_data.features.length)
    for (let i = 0; i < country_color.length; ++i) {
      country_color[i] =
        (d3.max(neighbors_data[i], (j) => country_color[j]) + 1) | 0
    }

    allInfluencees = influencees_data
    allInfluencers = influencers_data

    if (locs) {
      oldestYear = d3.min(locs, (d) => d.year)
      year = oldestYear!
      youngestYear = d3.max(locs, (d) => d.year)
      allLocations = d3.groups(locs, (d) => d.artist)
      filterLocations(oldestYear!)

      influence_scale = d3
        .scaleLinear()
        .domain([0, youngestYear! - oldestYear!])
        .range([2, RADIUS])
      tl_x_scale = d3
        .scaleLinear()
        .domain([oldestYear!, youngestYear!])
        .range([0, width])
    } else {
      console.error("Unable to load Artist Locations!")
    }

    allArtists = artist_data
  }
</script>

<div
  id="container"
  class="inline-block relative align-top overflow-hidden"
  style="width: {width}px; height: {height}px;"
>
  <svg
    class="inline-block absolute top-0 left-0"
    viewBox="0, 0, {width}, {height}"
    preserveAspectRatio="xMidYMid meet"
  >
    <style>
      .pointer {
        cursor: pointer;
      }
      .slider {
        cursor: ew-resize;
      }
      #handle {
        fill: #000000;
        stroke: #000000;
        stroke-miterlimit: 10;
      }
    </style>
    {#if path}
      <g id="map">
        {#key update_map}
          <g id="fill">
            <path d={path(graticuleOutline)} fill="#def3f6" stroke="none" />
          </g>
          <g id="graticules">
            {#each graticuleUle as line}
              <path d={path(line)} fill="none" stroke="lightgray" />
            {/each}
          </g>
          <g id="countries">
            {#if world_data}
              {#each world_data.features as feature, idx}
                <path
                  id={feature.id}
                  d={path(feature)}
                  stroke="none"
                  fill={d3.schemePastel2[country_color[idx]]}
                />
              {/each}
            {/if}
          </g>
          <g id="outline">
            <path
              d={path(graticuleOutline)}
              fill="none"
              stroke="lightgray"
              stroke-width="2"
            />
          </g>
        {/key}
        <g id="artists">
          {#each influences as location}
            <g>
              <line
                x2={Helpers.GetXfromLatLon(projection, location[1])}
                y2={Helpers.GetYfromLatLon(projection, location[1])}
                x1={GetX(location)}
                y1={GetY(location)}
                stroke="black"
              />
              <circle
                cx={Helpers.GetXfromLatLon(projection, location[1])}
                cy={Helpers.GetYfromLatLon(projection, location[1])}
                r="2"
                fill="black"
              />

              <path
                d={GetCurve(
                  [GetX(location), GetY(location)],
                  [GetX(selected), GetY(selected)]
                )}
                stroke="red"
                fill="none"
                opacity="0.5"
                stroke-width={GetYearGap(selected, location)}
              />
            </g>
          {/each}
          {#each influences as location}
            <g
              id={Helpers.ArtistID(location[0]) + "-group"}
              transform={Translate(GetX(location), GetY(location))}
              transition:fade
            >
              {#if location[0] === selected[0]}
                <image
                  id={Helpers.ArtistID(location[0]) + "-image"}
                  href={Config.server_url + GetThumbnail(location[0])}
                  height={RADIUS * 4}
                  width={RADIUS * 4}
                  x={-RADIUS * 2}
                  y={-RADIUS * 2}
                />
                <circle
                  cx="0"
                  cy="0"
                  r={RADIUS * 2}
                  stroke="white"
                  stroke-width="2"
                  fill="none"
                />
              {:else}
                <image
                  id={Helpers.ArtistID(location[0]) + "-image"}
                  href={Config.server_url + GetThumbnail(location[0])}
                  height={RADIUS * 4}
                  width={RADIUS * 4}
                  x={-RADIUS * 2}
                  y={-RADIUS * 2}
                />
                <circle
                  cx="0"
                  cy="0"
                  r={RADIUS * 2}
                  stroke="black"
                  fill="none"
                />
              {/if}
              <rect
                id={Helpers.ArtistID(location[0]) + "-rect"}
                x={-(
                  Helpers.TextWidth(
                    "#" + Helpers.ArtistID(location[0]) + "-text",
                    location[0]
                  ) + PADDING
                ) / 2}
                width={Helpers.TextWidth(
                  "#" + Helpers.ArtistID(location[0]) + "-text",
                  location[0]
                ) + PADDING}
                y={(TEXT_Y_OFFSET * 2.5 +
                  Helpers.TextHeight(
                    "#" + Helpers.ArtistID(location[0]) + "-text",
                    location[0]
                  )) /
                  2}
                height={Helpers.TextHeight(
                  "#" + Helpers.ArtistID(location[0]) + "-text",
                  location[0]
                ) +
                  PADDING -
                  10}
                fill="white"
                stroke="black"
                rx="15"
                opacity="0.5"
                class="pointer-events-none"
              />
              <text
                id={Helpers.ArtistID(location[0]) + "-text"}
                opacity="1"
                x="0"
                y={TEXT_Y_OFFSET * 2.75}
                text-anchor="middle">{location[0]}</text
              >
            </g>
          {/each}
        </g>
      </g>
    {/if}
    <svg
      id="Layer_1"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 {width} {height}"
    >
      <defs>
        <style>
          .cls-1,
          .cls-2 {
            fill: #c00;
          }
          .cls-2 {
            stroke: #000;
            stroke-miterlimit: 10;
            stroke-width: 0.25px;
          }
        </style>
      </defs>
      <g transform={transform_compass}>
        <path
          d="M4.24,28.34l4.24-11.31L4.24,5.71,0,17.02l4.24,11.31Zm0-2.85l-2.8-7.47H7.04s-2.8,7.47-2.8,7.47Z"
        />
        <polygon
          class="cls-1"
          points="4.24 8.29 7.04 15.76 1.44 15.76 4.24 8.29"
        />
        <path
          class="cls-2"
          d="M1.83,.24h1.63l1.28,1.85h.01V.24h1.61V4.58h-1.62l-1.28-1.85h-.01v1.85H1.83V.24Z"
        />
      </g>
    </svg>
  </svg>
</div>
