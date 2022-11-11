<script lang="ts">
  import { geoGraticule, geoEquirectangular, geoPath } from 'd3-geo'
  import {
    group,
    InternMap,
    axisBottom,
    select,
    min,
    max,
    scaleLinear,
    type AxisScale,
    type NumberValue,
    type ScaleLinear,
    groups,
  } from 'd3'
  import { json } from 'd3-fetch'
  import { feature } from 'topojson'
  import { onMount } from 'svelte'

  const port = 5173
  const server_url = `http://localhost:${port}`

  type ArtistLocation = {
    artist: string
    year: number
    city: string
    country: string
    lat: number
    lon: number
  }

  let svg: SVGSVGElement
  let map: SVGGElement
  let timeline: SVGGElement

  let data: any
  $: data = null

  let allLocations: [string, ArtistLocation[]][]
  $: allLocations = []
  let locations: [string, ArtistLocation[]][]
  $: locations = []

  $: tl_pos = ''
  $: map_pos = 'translate(20, 20)'
  $: cursor_pos = 'translate(9, -22)'
  $: dragging = false
  let oldestYear: number | undefined
  $: oldestYear = 0
  let youngestYear: number | undefined
  $: youngestYear = 2100
  $: year = 0

  const graticuleGen = geoGraticule()
  const graticuleUle = graticuleGen.lines()
  const graticuleOutline = graticuleGen.outline()

  const projection = geoEquirectangular()
  const path = geoPath().projection(projection)

  const tickEvery = 20
  const yearEvery = 100

  let tl_x_scale: ScaleLinear<number, number, never>
  let tl_x_axis = null

  const startDrag = () => {
    dragging = true
  }

  const drag = (ev: { offsetX: number }) => {
    if (dragging) {
      year = tl_x_scale!.invert(Number(ev.offsetX - 9))
      filterLocations(year!)
      let pos = ev.offsetX - 9
      if (year < oldestYear!) {
        pos = tl_x_scale!(oldestYear!) + 9
      } else if (year > youngestYear!) {
        pos = tl_x_scale!(youngestYear!) + 9
      }
      cursor_pos = `translate(${pos}, -22)`
    }
  }

  const stopDrag = () => {
    dragging = false
  }

  const filterLocations = (year: number) => {
    locations = allLocations.filter(([, locations]) => {
      if (locations.length > 1) {
        return locations[0].year <= year && locations[1].year > year
      } else {
        return locations[0].year <= year
      }
    })
  }

  const getXfromLatLon = (
    loc: {
      lat: number
      lon: number
    }[]
  ) => {
    const pos = projection([loc[0].lon, loc[0].lat])!
    return pos[0]
  }

  const getYfromLatLon = (
    loc: {
      lat: number
      lon: number
    }[]
  ) => {
    const pos = projection([loc[0].lon, loc[0].lat])!
    return pos[1]
  }

  onMount(async () => {
    const bbox = select(map).node()!.getBoundingClientRect()

    tl_pos = `translate(${20}, ${bbox.height + 20 + 20})`

    const features: any = await json(`${server_url}/data/world.json`)
    data = feature(features, features.objects.countries)

    const locs: ArtistLocation[] | undefined = await json(`${server_url}/data/artist-locations.json`)
    if (locs) {
      oldestYear = min(locs, d => d.year)
      youngestYear = max(locs, d => d.year)
      allLocations = groups(locs, d => d.artist)
      filterLocations(oldestYear!)

      tl_x_scale = scaleLinear().domain([oldestYear!, youngestYear!]).range([0, bbox.width])
      tl_x_axis = axisBottom(tl_x_scale)
        .tickFormat(d => {
          return Number(d) % yearEvery === 0 ? String(d) : ''
        })
        .ticks((youngestYear! - oldestYear!) / tickEvery)
      select(timeline).call(tl_x_axis)
    } else {
      console.error('Unable to load Artist Locations!')
    }
  })
</script>

<div class="absolute inset-0 select-none" on:mousemove={drag} on:mouseup={stopDrag}>
  <svg id="svg" bind:this={svg} class="block w-full h-full">
    <g id="map" bind:this={map} transform={map_pos}>
      <g id="graticules">
        {#each graticuleUle as line}
          <path d={path(line)} fill="none" stroke="lightgray" />
        {/each}
      </g>
      <g id="countries">
        {#if data}
          {#each data.features as feature}
            <path id={feature.id} d={path(feature)} stroke="lightgray" fill="white" />
          {/each}
        {/if}
      </g>
      <g id="artists">
        {#each locations as location}
          <circle
            cx={getXfromLatLon(location[1])}
            cy={getYfromLatLon(location[1])}
            r="10"
            stroke="black"
            fill="white"
          />
          <text x={getXfromLatLon(location[1])} y={getYfromLatLon(location[1]) + 25} text-anchor="middle"
            >{location[0]}</text
          >
        {/each}
      </g>
      <g id="outline">
        <path d={path(graticuleOutline)} fill="none" stroke="black" stroke-width="2" />
      </g>
    </g>
    <g id="timeline" bind:this={timeline} transform={tl_pos}>
      <g transform={cursor_pos} on:mousedown={startDrag}>
        <path
          fill="white"
          d="M6.8,17.3l-1.4-10C5.2,6.1,6.1,5,7.3,5h3.4c1.2,0,2.2,1.1,2,2.3l-1.4,10c-0.1,1-1,1.7-2,1.7H8.7C7.7,19,6.9,18.3,6.8,17.3z"
        />
        <path
          stroke="black"
          fill="black"
          d="M9.3,19.8H8.7c-1.4,0-2.5-1-2.7-2.4l-1.4-10C4.5,6.6,4.7,5.8,5.2,5.2c0.5-0.6,1.3-0.9,2.1-0.9h3.4c0.8,0,1.6,0.3,2.1,0.9c0.5,0.6,0.8,1.4,0.6,2.2l-1.4,10C11.8,18.7,10.6,19.8,9.3,19.8z M7.3,5.8c-0.4,0-0.7,0.2-0.9,0.4C6.1,6.5,6,6.8,6.1,7.2l1.4,10c0.1,0.6,0.6,1.1,1.2,1.1h0.5c0.6,0,1.1-0.5,1.2-1.1l1.4-10c0.1-0.4-0.1-0.7-0.3-1c-0.2-0.3-0.6-0.4-0.9-0.4H7.3z"
        />
        <text
          transform="translate(9,0)"
          stroke="black"
          font-weight="lighter"
          text-anchor="middle"
          font-size="12"
          font-family="sans-serif">{Math.trunc(year)}</text
        >
      </g>
    </g>
  </svg>
</div>
