<script lang="ts">
  import * as d3 from "d3"
  import { feature } from "topojson"
  import { geoWinkel3 } from "d3-geo-projection"
  import { Config, Helpers, Types } from "$lib/utilities"

  const RADIUS = 15
  const TEXT_Y_OFFSET = 30

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
  let showInfluences: boolean
  $: showInfluences = false

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

  const filterLocations = (year: number) => {
    locations = allLocations.filter(([, locations]) => {
      if (locations.length > 1) {
        return locations[0].year <= year && locations[1].year > year
      } else {
        return locations[0].year <= year
      }
    })
    for (const location of locations) {
      location.x = Helpers.getXfromLatLon(projection, location[1])
      location.y = Helpers.getYfromLatLon(projection, location[1])
    }
  }

  export const DisplayInfluences = (artist: string) => {
    showInfluences = true
    influences = []
    influencers = []
    influencees = []
    selected = allLocations.filter((d) => d[0] === artist)[0]
    influences.push(selected)
    const artistInfluencees: Types.InfluenceGroup[] = allInfluencees.filter(
      (d) => d[0] === artist
    )
    const artistInfluencers: Types.InfluenceGroup[] = allInfluencers.filter(
      (d) => d[0] === artist
    )

    if (artistInfluencers.length > 0) {
      console.log("Influencers")
      for (let influence of artistInfluencers[0][1]) {
        const data = allLocations.find(
          (loc) => loc[1][0].artist === influence.influenced
        )
        if (data) {
          influences.push(data)
          influencers.push(data)
          console.log(influence)
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
          influences.push(data)
          influencees.push(data)
          console.log(influence)
          console.log(
            allLocations.find((loc) => loc[1][0].artist === influence.artist)
          )
        }
      }
    }
    console.log(influences)
    for (const location of influences) {
      location.x = Helpers.getXfromLatLon(projection, location[1])
      location.y = Helpers.getYfromLatLon(projection, location[1])
    }

    // simWorker!.postMessage({
    //   nodes: influences,
    //   radius: RADIUS,
    //   projection: projection,
    //   height: height,
    // })
  }

  const getX = (location: Types.LocationGroup) => {
    if (location.hasOwnProperty("x")) {
      return location.x
    }
    return Helpers.getXfromLatLon(projection, location[1])
  }

  const getY = (location: Types.LocationGroup) => {
    if (location.hasOwnProperty("y")) {
      return location.y
    }
    return Helpers.getYfromLatLon(projection, location[1])
  }

  const getYearGap = (
    loc1: Types.LocationGroup,
    loc2: Types.LocationGroup
  ): number => {
    const middle1 = loc1[1][0].year // Death Year - Born Year
    const middle2 = loc2[1][0].year // Death Year - Born Year

    return influence_scale(Math.abs(middle2 - middle1))
  }

  export const Initialize = (
    features: any,
    influence_data: Types.ArtistInfluence[],
    locs: Types.ArtistLocation[]
  ) => {
    projection = geoWinkel3()
      .translate([width / 2, height / 2])
      .scale(height / 3.5)
    path = d3.geoPath().projection(projection)

    world_data = feature(features, features.objects.countries)

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
        <g id="graticules">
          {#each graticuleUle as line}
            <path d={path(line)} fill="none" stroke="lightgray" />
          {/each}
        </g>
        <g id="countries">
          {#if world_data}
            {#each world_data.features as feature}
              <path
                id={feature.id}
                d={path(feature)}
                stroke="lightgray"
                fill="white"
              />
            {/each}
          {/if}
        </g>
        <g id="artists">
          {#if showInfluences}
            {#each influences as location}
              <g>
                <line
                  x2={Helpers.getXfromLatLon(projection, location[1])}
                  y2={Helpers.getYfromLatLon(projection, location[1])}
                  x1={getX(location)}
                  y1={getY(location)}
                  stroke="black"
                />
                <circle
                  cx={Helpers.getXfromLatLon(projection, location[1])}
                  cy={Helpers.getYfromLatLon(projection, location[1])}
                  r="2"
                  fill="black"
                />

                <line
                  x2={getX(location)}
                  y2={getY(location)}
                  x1={getX(selected)}
                  y1={getY(selected)}
                  stroke="red"
                  opacity="0.5"
                  stroke-width={getYearGap(selected, location)}
                />
              </g>
            {/each}
            {#each influences as location}
              <g
                id={location[0].replace(/[[\s\.]]/g, "") + "-group"}
                class="pointer"
              >
                {#if location[0] === selected[0]}
                  <image
                    id={Helpers.ArtistName(location[0]) + "-image"}
                    href={Config.server_url + location[1]["thumbnail"]}
                    height={RADIUS * 2}
                    width={RADIUS * 2}
                    x={-RADIUS}
                    y={-RADIUS}
                  />
                  <circle
                    cx={getX(location)}
                    cy={getY(location)}
                    r={RADIUS * 2}
                    stroke="black"
                    fill="white"
                  />
                  <text
                    id={location[0].replace(/[\s\.]/g, "") + "-text"}
                    opacity="1"
                    x={getX(location)}
                    y={getY(location) + TEXT_Y_OFFSET + RADIUS}
                    text-anchor="middle">{location[0]}</text
                  >
                {:else}
                  <circle
                    cx={getX(location)}
                    cy={getY(location)}
                    r={RADIUS}
                    stroke="black"
                    fill="white"
                  />
                  <text
                    id={location[0].replace(/[\s\.]/g, "") + "-text"}
                    opacity="1"
                    x={getX(location)}
                    y={getY(location) + TEXT_Y_OFFSET}
                    text-anchor="middle">{location[0]}</text
                  >
                {/if}
              </g>
            {/each}
          {/if}
        </g>
        <g id="outline">
          <path
            d={path(graticuleOutline)}
            fill="none"
            stroke="black"
            stroke-width="2"
          />
        </g>
      </g>
    {/if}
  </svg>
</div>
