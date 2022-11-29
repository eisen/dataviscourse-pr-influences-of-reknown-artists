<script lang="ts">
  import * as d3 from "d3"
  import { feature, neighbors } from "topojson"
  import { geoWinkel3 } from "d3-geo-projection"
  import { Config, Helpers, Types } from "$lib/utilities"
  import { fade } from "svelte/transition"
  import { createEventDispatcher } from "svelte"

  const dispatch = createEventDispatcher()

  const RADIUS = 15
  const TEXT_Y_OFFSET = 20
  const PADDING = 20
  const DURATION = 1000

  const LEGEND_WIDTH = 280
  const LEGEND_HEIGHT = 80
  const LEGEND_SCALE = 0.8

  let simWorker: Worker | undefined = new Worker(
    new URL("workers/sim-nodes.worker.ts?worker", import.meta.url)
  )

  const OnWorkerMessage = (event: any) => {
    influences = event.data.nodes
    selected = influences.filter((d) => d[0] === selected[0])[0]
  }

  simWorker.onmessage = OnWorkerMessage

  export let width: number
  $: width = 0
  export let height: number
  $: height = 0

  let world_data: any
  $: world_data = null
  let neighbors_data: number[][]
  $: neighbors_data = []

  let country_color: number[]
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
      ? `translate(${width - 25}, ${
          height - 60
        }) rotate(${compass_angle}) scale(2)`
      : `translate(${width - 65}, ${
          height - 5
        }) rotate(${compass_angle}) scale(2)`

  const Magnitude = (x: number, y: number): number => {
    return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2))
  }

  const GetCurve = (source: number[], target: number[]): string => {
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
    curve.point(target[0], target[1])
    curve.lineEnd()

    return path.toString()
  }

  let influence_scale: d3.ScaleLinear<number, number, never>

  const Translate = (x: number | undefined, y: number | undefined) =>
    `translate(${x!}, ${y!})`

  const InfluencedBy = (influencee_name: string, influencer_name: string) => {
    const influencer = allInfluencees.find((d) => d[0] === influencer_name)
    if (influencer) {
      const influenced = influencer[1].find(
        (d) => d.influenced === influencee_name
      )
      if (influenced) {
        return true
      } else {
        return false
      }
    } else {
      return false
    }
  }

  const GetInfluenceAngle = (source: number[], target: number[]): number => {
    return (
      (Math.atan2(target[1] - source[1], target[0] - source[0]) * 180) / Math.PI
    )
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
    projection.center([0, 0])
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
      0.6 /
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

    // Run twice so the text elements are created and the TextWidth and TextHeight helper functions can properly work
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

  const GetYears = (locations: Types.ArtistLocation[]): string => {
    return `${locations[0].year} - ${
      locations[1].year > 2021 ? "" : locations[1].year
    }`
  }

  const GetYearGap = (
    loc1: Types.LocationGroup,
    loc2: Types.LocationGroup
  ): number => {
    const middle1 = loc1[1][0].year // Born Year
    const middle2 = loc2[1][0].year // Born Year

    return influence_scale(Math.abs(middle2 - middle1))
  }

  const GetThumbnail = (name: string) => {
    const artist = allArtists.filter((d) => d.artist === name)[0]
    return artist.thumbnail
  }

  const OnMouseOver = (target: any) => {
    d3.selectAll(target + "-map-detail")
      .transition()
      .duration(DURATION)
      .attr("opacity", 1)
  }

  const OnMouseOut = (target: any) => {
    d3.selectAll(target + "-map-detail")
      .transition()
      .duration(DURATION)
      .attr("opacity", 0)
  }

  export const ResetInfluences = () => {
    projection.center([0, 0])
    projection.scale(original_scale)
    projection.angle(0)

    compass_angle = 0

    influences = []

    update_map += 1
  }

  const OnMouseClickReset = () => {
    dispatch("reset_influences", {})
  }

  export const Initialize = (
    features: any,
    influencers_data: Types.InfluenceGroup[],
    influencees_data: Types.InfluenceGroup[],
    locations: Types.ArtistLocation[],
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
        (d3.max(neighbors_data[i]!, (j) => country_color[j]!)! + 1) | 0
    }

    allInfluencees = influencees_data
    allInfluencers = influencers_data

    if (locations) {
      allLocations = d3.groups(locations, (d) => d.artist)

      let smallest_gap = 2000
      let biggest_gap = 0
      for (const [influencer, influencees] of allInfluencers) {
        const influencer_data = locations.filter(
          (d) => d.artist === influencer
        )[0]
        for (const influencee of influencees) {
          const influencee_data = locations.filter(
            (d) => d.artist === influencee.artist
          )[0]
          const birth_gap = Math.abs(
            influencer_data.year - influencee_data.year
          )
          if (birth_gap > biggest_gap) {
            biggest_gap = birth_gap
          }

          if (birth_gap < smallest_gap) {
            smallest_gap = birth_gap
          }
        }
      }

      influence_scale = d3
        .scaleLinear()
        .domain([smallest_gap, biggest_gap])
        .range([2, RADIUS * 4])
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
    on:click={OnMouseClickReset}
  >
    <defs>
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
    </defs>

    {#if path}
      <g id="map">
        {#key update_map}
          <g id="fill">
            <path
              d={path(graticuleOutline)}
              fill={Helpers.SeaColor}
              stroke="none"
            />
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
              {#if selected[0] !== location[0]}
                {#if InfluencedBy(selected[0], location[0])}
                  <g transform="translate({GetX(location)}, {GetY(location)})"
                    ><g
                      transform="rotate({GetInfluenceAngle(
                        [GetX(location), GetY(location)],
                        [GetX(selected), GetY(selected)]
                      )})"
                    >
                      <g transform="translate({RADIUS * 2}, 0)">
                        <path
                          d="M 0,-5 L 10,0 L 0,5 L 0,-5 Z"
                          fill="#cc0000"
                          stroke="black"
                          stroke-width="2"
                        />
                      </g>
                    </g>
                  </g>
                  <path
                    d={GetCurve(
                      [GetX(location), GetY(location)],
                      [GetX(selected), GetY(selected)]
                    )}
                    stroke="#c00"
                    fill="none"
                    opacity="0.5"
                    stroke-width={GetYearGap(selected, location)}
                  />
                {:else}
                  <g transform="translate({GetX(location)}, {GetY(location)})">
                    <g
                      transform="rotate({GetInfluenceAngle(
                        [GetX(selected), GetY(selected)],
                        [GetX(location), GetY(location)]
                      )})"
                    >
                      <g transform="translate({-RADIUS * 2 - 10}, 0)">
                        <path
                          d="M 0,-5 L 10,0 L 0,5 L 0,-5 Z"
                          fill="#cc0000"
                          stroke="black"
                          stroke-width="2"
                        />
                      </g>
                    </g>
                  </g>
                  <path
                    d={GetCurve(
                      [GetX(selected), GetY(selected)],
                      [GetX(location), GetY(location)]
                    )}
                    stroke="#c00"
                    fill="none"
                    opacity="0.5"
                    stroke-width={GetYearGap(selected, location)}
                  />
                {/if}
              {/if}
            </g>
          {/each}
          {#each influences as location}
            <g
              id={Helpers.ArtistID(location[0]) + "-group-map"}
              transform={Translate(GetX(location), GetY(location))}
              on:focus={(ev) =>
                OnMouseOver("." + Helpers.ArtistID(location[0]))}
              on:mouseover={(ev) =>
                OnMouseOver("." + Helpers.ArtistID(location[0]))}
              on:blur={(ev) => OnMouseOut("." + Helpers.ArtistID(location[0]))}
              on:mouseout={(ev) =>
                OnMouseOut("." + Helpers.ArtistID(location[0]))}
              transition:fade
              style="outline: none;"
            >
              {#if location[0] === selected[0]}
                <image
                  id={Helpers.ArtistID(location[0]) + "-image-map"}
                  href={Config.server_url + GetThumbnail(location[0])}
                  style="outline: none;"
                  height={RADIUS * 4}
                  width={RADIUS * 4}
                  x={-RADIUS * 2}
                  y={-RADIUS * 2}
                />
                <circle
                  cx="0"
                  cy="0"
                  r={RADIUS * 2}
                  stroke="#c00"
                  stroke-width="2"
                  fill="none"
                />
              {:else}
                <image
                  id={Helpers.ArtistID(location[0]) + "-image-map"}
                  href={Config.server_url + GetThumbnail(location[0])}
                  style="outline: none;"
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
            </g>
          {/each}
          {#each influences as location}
            <g transform={Translate(GetX(location), GetY(location))}>
              <rect
                id={Helpers.ArtistID(location[0]) + "-rect-map"}
                class={Helpers.ArtistID(location[0]) +
                  "-map-detail pointer-events-none"}
                x={-(
                  Helpers.TextWidth(
                    "#" + Helpers.ArtistID(location[0]) + "-map-name",
                    location[0]
                  ) +
                  PADDING * 2
                ) / 2}
                width={Helpers.TextWidth(
                  "#" + Helpers.ArtistID(location[0]) + "-map-name",
                  location[0]
                ) +
                  PADDING * 2}
                y={GetY(location) < height / 2
                  ? (TEXT_Y_OFFSET * 2.5 +
                      Helpers.TextHeight(
                        "#" + Helpers.ArtistID(location[0]) + "-map-name",
                        location[0]
                      )) /
                    2
                  : (-2 *
                      (TEXT_Y_OFFSET * 4.75 +
                        Helpers.TextHeight(
                          "#" + Helpers.ArtistID(location[0]) + "-map-name",
                          location[0]
                        ))) /
                    2}
                height={3 *
                  Helpers.TextHeight(
                    "#" + Helpers.ArtistID(location[0]) + "-map-name",
                    location[0]
                  ) +
                  PADDING -
                  10}
                fill="white"
                stroke="black"
                rx="15"
                opacity="0"
              />
              <text
                id={Helpers.ArtistID(location[0]) + "-map-name"}
                class={Helpers.ArtistID(location[0]) +
                  "-map-detail pointer-events-none"}
                opacity="0"
                x="0"
                y={GetY(location) < height / 2
                  ? TEXT_Y_OFFSET * 2.75
                  : -TEXT_Y_OFFSET * 4.75}
                text-anchor="middle">{location[0]}</text
              >
              <text
                id={Helpers.ArtistID(location[0]) + "-map-origin"}
                class={Helpers.ArtistID(location[0]) +
                  "-map-detail pointer-events-none"}
                opacity="0"
                x="0"
                y={GetY(location) < height / 2
                  ? TEXT_Y_OFFSET * 3.75
                  : -TEXT_Y_OFFSET * 3.75}
                text-anchor="middle">{location[1][0].country}</text
              >
              <text
                id={Helpers.ArtistID(location[0]) + "-map-year"}
                class={Helpers.ArtistID(location[0]) +
                  "-map-detail pointer-events-none"}
                opacity="0"
                x="0"
                y={GetY(location) < height / 2
                  ? TEXT_Y_OFFSET * 4.75
                  : -TEXT_Y_OFFSET * 2.75}
                text-anchor="middle">{GetYears(location[1])}</text
              >
            </g>
          {/each}
        </g>
      </g>
    {/if}
    <svg
      id="compass"
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
  <div
    class="absolute left-0 bottom-0"
    style="width: {LEGEND_WIDTH * LEGEND_SCALE}px; height: {LEGEND_HEIGHT *
      LEGEND_SCALE}px;"
  >
    <svg
      id="legend"
      class="inline-block absolute top-0 left-0"
      style="padding-top: 12px;"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 {LEGEND_WIDTH} {LEGEND_HEIGHT}"
      preserveAspectRatio="xMidYMid meet"
    >
      <g transform="scale({LEGEND_SCALE})">
        <rect
          x="2"
          y="2"
          width={LEGEND_WIDTH - 4}
          height={LEGEND_HEIGHT - 4}
          fill="white"
          stroke="black"
          rx="15"
        />
        <g transform="translate(0, 20)">
          <g transform="translate(115, 20)">
            <g transform="rotate(0)">
              <g transform="translate({-RADIUS * 2 + 5}, 0)">
                <path
                  d="M 0,-5 L 10,0 L 0,5 L 0,-5 Z"
                  fill="#cc0000"
                  stroke="black"
                  stroke-width="2"
                />
              </g>
            </g>
          </g>
          <line
            x1="20"
            y1="20"
            x2="115"
            y2="20"
            stroke="#c00"
            stroke-width="5"
            opacity="0.5"
          />
          <circle cx="20" cy="20" r={RADIUS} fill="white" stroke="#c00" />
          <text x="15" y="25">A</text>
          <circle cx="115" cy="20" r={RADIUS} fill="white" stroke="black" />
          <text x="110" y="25">B</text>
          <text x="15" y="50">A influenced B</text>
        </g>
        <g transform="translate(140, 20)">
          <g transform="translate(20, 20)">
            <g transform="rotate(0)">
              <g transform="translate({RADIUS * 2 - 15}, 0)">
                <path
                  d="M 0,-5 L 10,0 L 0,5 L 0,-5 Z"
                  fill="#cc0000"
                  stroke="black"
                  stroke-width="2"
                />
              </g>
            </g>
          </g>
          <line
            x1="20"
            y1="20"
            x2="115"
            y2="20"
            stroke="#c00"
            stroke-width="5"
            opacity="0.5"
          />
          <circle cx="20" cy="20" r={RADIUS} fill="white" stroke="black" />
          <text x="15" y="25">A</text>
          <circle cx="115" cy="20" r={RADIUS} fill="white" stroke="#c00" />
          <text x="110" y="25">B</text>
          <text x="15" y="50">A influenced B</text>
        </g>
        <g transform="translate(0, 18)">
          <text
            font-size="smaller"
            text-anchor="middle"
            x="140"
            y="0"
            stroke="#c00"
            opacity="0.5"
          >
            Line thickness encodes birth year gap
          </text>
        </g>
      </g>
    </svg>
  </div>
</div>
