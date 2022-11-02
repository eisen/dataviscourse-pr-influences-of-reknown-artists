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
  }

  let svg: SVGSVGElement
  let map: SVGGElement
  let timeline: SVGGElement

  let data: any
  $: data = null

  let locations: InternMap<string, ArtistLocation[]>
  $: locations = new InternMap<string, ArtistLocation[]>()

  $: tl_pos = ''
  $: map_pos = 'translate(20, 20)'
  $: cursor_pos = 'translate(9, 38)'
  $: dragging = false
  $: oldestYear = 0
  $: youngestYear = 2100

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
      let year = tl_x_scale!.invert(Number(ev.offsetX - 9))
      let pos = ev.offsetX - 9
      if (year < oldestYear) {
        pos = tl_x_scale!(oldestYear) + 9
      } else if (year > youngestYear) {
        pos = tl_x_scale!(youngestYear) + 9
      }
      cursor_pos = `translate(${pos}, 38)`
    }
  }

  const stopDrag = () => {
    dragging = false
  }

  onMount(async () => {
    const bbox = select(map).node()!.getBoundingClientRect()

    tl_pos = `translate(${20}, ${bbox.height + 20 + 20})`

    const features: any = await json(`${server_url}/data/world.json`)
    data = feature(features, features.objects.countries)

    const locs: ArtistLocation[] | undefined = await json(`${server_url}/data/artist-locations.json`)
    if (locs) {
      locations = group(locs, d => d.artist)
      oldestYear = min(locs, d => d.year)
      youngestYear = max(locs, d => d.year)

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
      <g id="outline">
        <path d={path(graticuleOutline)} fill="none" stroke="black" stroke-width="2" />
      </g>
    </g>
    <g id="timeline" bind:this={timeline} transform={tl_pos}>
      <g transform={cursor_pos} on:mousedown={startDrag}>
        <path
          d="M6.75469 17.2828L5.32612 7.28284C5.154 6.07798 6.08892 5 7.30602 5H10.694C11.9111 5 12.846 6.07797 12.6739 7.28284L11.2453 17.2828C11.1046 18.2681 10.2607 19 9.26541 19H8.73459C7.73929 19 6.89545 18.2681 6.75469 17.2828Z"
          stroke="currentColor"
          fill="white"
          stroke-width="1.5"
          transform="rotate(180)"
        />
      </g>
    </g>
  </svg>
</div>
