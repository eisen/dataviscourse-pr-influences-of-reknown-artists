<script lang="ts">
  import * as d3 from "d3"
  import { feature, neighbors } from "topojson"
  import { geoWinkel3 } from "d3-geo-projection"
  import { Config, Helpers, Types } from "$lib/utilities"
  import { fade } from "svelte/transition"

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

  const tickEvery = 20
  const yearEvery = 100

  let tl_x_scale: d3.ScaleLinear<number, number, never>
  let tl_x_axis = null

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

  export const DisplayInfluences = (artist: string) => {
    const local_influences = []
    // influencers = []
    // influencees = []

    selected = allLocations.filter((d) => d[0] === artist)[0]
    console.log("Selected: ", selected)
    local_influences.push(selected)

    const artistInfluencers: Types.InfluenceGroup[] = allInfluencers.filter(
      (d) => d[0] === artist
    )
    const artistInfluencees: Types.InfluenceGroup[] = allInfluencees.filter(
      (d) => d[0] === artist
    )

    if (artistInfluencers.length > 0) {
      console.log("Influencers")
      for (let influence of artistInfluencers[0][1]) {
        const data = allLocations.find(
          (loc) => loc[1][0].artist === influence.artist
        )
        console.log(influence.artist)
        if (data) {
          local_influences.push(data)
          //influencers.push(data)
          console.log(
            allLocations.find((loc) => loc[1][0].artist === influence.artist)
          )
        }
      }
    }

    if (artistInfluencees.length > 0) {
      console.log("Influencees")
      for (let influence of artistInfluencees[0][1]) {
        const data = allLocations.find(
          (loc) => loc[1][0].artist === influence.influenced
        )
        if (data) {
          local_influences.push(data)
          //influencees.push(data)
          console.log(
            allLocations.find(
              (loc) => loc[1][0].artist === influence.influenced
            )
          )
        }
      }
    }
    for (const location of local_influences) {
      location.x = Helpers.GetXfromLatLon(projection, location[1])
      location.y = Helpers.GetYfromLatLon(projection, location[1])
    }

    simWorker!.postMessage({
      nodes: local_influences,
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
    influence_data: Types.ArtistInfluence[],
    locs: Types.ArtistLocation[],
    artist_data: Types.ArtistData[]
  ) => {
    projection = geoWinkel3()
      .translate([width / 2, height / 2])
      .scale(height / 3.5)
    path = d3.geoPath().projection(projection)

    world_data = feature(features, features.objects.countries)
    neighbors_data = neighbors(features.objects.countries.geometries)

    country_color = new Array(world_data.features.length)
    for (let i = 0; i < country_color.length; ++i) {
      country_color[i] =
        (d3.max(neighbors_data[i], (j) => country_color[j]) + 1) | 0
    }

    if (influence_data) {
      allInfluencees = d3.groups(
        influence_data,
        (d: Types.ArtistInfluence) => d.artist
      )
      allInfluencers = d3.groups(
        influence_data,
        (d: Types.ArtistInfluence) => d.influenced
      )
    }

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
      tl_x_axis = d3
        .axisBottom(tl_x_scale)
        .tickFormat((d) => {
          return Number(d) % yearEvery === 0 ? String(d) : ""
        })
        .ticks((youngestYear! - oldestYear!) / tickEvery)
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

              <line
                x2={GetX(location)}
                y2={GetY(location)}
                x1={GetX(selected)}
                y1={GetY(selected)}
                stroke="red"
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
                  height={RADIUS * 2}
                  width={RADIUS * 2}
                  x={-RADIUS}
                  y={-RADIUS}
                />
                <circle
                  cx="0"
                  cy="0"
                  r={RADIUS}
                  stroke="white"
                  stroke-width="2"
                  fill="none"
                />
              {:else}
                <image
                  id={Helpers.ArtistID(location[0]) + "-image"}
                  href={Config.server_url + GetThumbnail(location[0])}
                  height={RADIUS * 2}
                  width={RADIUS * 2}
                  x={-RADIUS}
                  y={-RADIUS}
                />
                <circle cx="0" cy="0" r={RADIUS} stroke="black" fill="none" />
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
                y={(TEXT_Y_OFFSET +
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
                y={TEXT_Y_OFFSET * 2}
                text-anchor="middle">{location[0]}</text
              >
            </g>
          {/each}
        </g>
      </g>
    {/if}
  </svg>
</div>
