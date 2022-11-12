<script lang="ts">
  import { geoGraticule, geoPath } from 'd3-geo'
  import { geoWinkel3 } from 'd3-geo-projection'
  import {
    axisBottom,
    select,
    min,
    max,
    scaleLinear,
    type ScaleLinear,
    groups,
    forceSimulation,
    forceY,
    forceX,
    forceCollide,
    type SimulationNodeDatum,
    type Simulation,
  } from 'd3'
  import { json } from 'd3-fetch'
  import { feature } from 'topojson'
  import { onMount } from 'svelte'

  const port = 5173
  const server_url = `http://localhost:${port}`
  const CURSOR_HALF_WIDTH = 9
  const CURSOR_Y_POS = -12
  const RADIUS = 15
  const TEXT_Y_OFFSET = 30
  let sim: Simulation<SimulationNodeDatum, undefined>

  type ArtistLocation = {
    artist: string
    year: number
    city: string
    country: string
    lat: number
    lon: number
  }

  type ArtistInfluence = {
    artist: string
    influenced: string
  }

  let svg: SVGSVGElement
  let map: SVGGElement
  let timeline: SVGGElement

  let world_data: any
  $: world_data = null

  let allLocations: [string, ArtistLocation[]][]
  $: allLocations = []
  let locations: [string, ArtistLocation[]][]
  $: locations = []
  let allInfluencees: [string, ArtistInfluence[]][]
  $: allInfluencees = []
  let allInfluencers: [string, ArtistInfluence[]][]
  $: allInfluencers = []
  let influences: [string, ArtistLocation[]][]
  $: influences = []
  let showInfluences: boolean
  $: showInfluences = false

  $: tl_pos = ''
  $: map_pos = 'translate(20, 20)'
  $: cursor_pos = `translate(-${CURSOR_HALF_WIDTH}, ${CURSOR_Y_POS})`
  $: dragging = false
  $: sim_running = false
  let oldestYear: number | undefined
  $: oldestYear = 0
  let youngestYear: number | undefined
  $: youngestYear = 2100
  $: year = 0

  const graticuleGen = geoGraticule()
  const graticuleUle = graticuleGen.lines()
  const graticuleOutline = graticuleGen.outline()

  const projection = geoWinkel3()
  const path = geoPath().projection(projection)

  const tickEvery = 20
  const yearEvery = 100

  let tl_x_scale: ScaleLinear<number, number, never>
  let tl_x_axis = null

  const startDrag = () => {
    dragging = true
    showInfluences = false
    if (sim_running) {
      sim.stop()
    }
    sim_running = false
    locations = []
    influences = []
  }

  const drag = (ev: { offsetX: number }) => {
    if (dragging) {
      let pos = ev.offsetX - 90
      year = tl_x_scale!.invert(Number(pos))
      filterLocations(year!)

      if (year < oldestYear!) {
        year = oldestYear!
        pos = tl_x_scale!(oldestYear!)
      } else if (year > youngestYear!) {
        year = youngestYear!
        pos = tl_x_scale!(youngestYear!)
      }
      cursor_pos = `translate(${pos - CURSOR_HALF_WIDTH}, ${CURSOR_Y_POS})`
    }
  }

  const stopDrag = () => {
    dragging = false
    if (sim_running === false) {
      sim_running = true
      RunSim(locations)
    }
  }

  const filterLocations = (year: number) => {
    locations = allLocations.filter(([, locations]) => {
      if (locations.length > 1) {
        return locations[0].year <= year && locations[1].year > year
      } else {
        return locations[0].year <= year
      }
    })
    for (const location of locations) {
      location['x'] = getXfromLatLon(location[1])
      location['y'] = getYfromLatLon(location[1])
    }
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

  const displayInfluences = (location: ArtistLocation) => {
    showInfluences = true
    influences = []
    influences.push(allLocations.filter(d => d[0] === location.artist)[0])
    const artistInfluencees: [string, ArtistInfluence[]][] = allInfluencees.filter(d => d[0] === location.artist)
    const artistInfluencers: [string, ArtistInfluence[]][] = allInfluencers.filter(d => d[0] === location.artist)

    if (artistInfluencers.length > 0) {
      console.log('Influencers')
      for (let influence of artistInfluencers[0][1]) {
        const data = allLocations.find(loc => loc[1][0].artist === influence.artist)
        if (data) {
          influences.push(data)
          console.log(influence)
          console.log(allLocations.find(loc => loc[1][0].artist === influence.artist))
        }
      }
    }

    if (artistInfluencees.length > 0) {
      console.log('Influencees')
      for (let influence of artistInfluencees[0][1]) {
        const data = allLocations.find(loc => loc[1][0].artist === influence.influenced)
        if (data) {
          influences.push(data)
          console.log(influence)
          console.log(allLocations.find(loc => loc[1][0].artist === influence.influenced))
        }
      }
    }
    for (const location of influences) {
      location['x'] = getXfromLatLon(location[1])
      location['y'] = getYfromLatLon(location[1])
    }
    RunSim(influences)
  }

  const RunSim = (data: any) => {
    sim = forceSimulation(data)
      .force(
        'x',
        forceX().x(d => {
          const artist: Array<any> = d as Array<any>
          return getXfromLatLon(artist[1])
        })
      )
      .force(
        'y',
        forceY().y(d => {
          const artist: Array<any> = d as Array<any>
          return getYfromLatLon(artist[1])
        })
      )
      .force(
        'collide',
        forceCollide().radius(d => RADIUS * 2)
      )

    sim.on('tick', () => {
      if (showInfluences) {
        influences = data
      } else {
        locations = data
      }
    })

    sim.on('end', () => {
      sim_running = false
    })
  }

  const getX = (location: [string, ArtistLocation[]]) => {
    if (location.hasOwnProperty('x')) {
      return location['x']
    }
    return getXfromLatLon(location[1])
  }

  const getY = (location: [string, ArtistLocation[]]) => {
    if (location.hasOwnProperty('y')) {
      return location['y']
    }
    return getYfromLatLon(location[1])
  }

  const OnMouseOver = (target: any) => {
    select(target + '-group').raise()
    select(target + '-text').attr('opacity', 1)
  }

  const OnMouseOut = (target: any) => {
    select(target + '-group').lower()
    select(target + '-text').attr('opacity', 0)
  }

  onMount(async () => {
    const bbox = select(map).node()!.getBoundingClientRect()

    tl_pos = `translate(${90}, ${bbox.height + 60})`

    const features: any = await json(`${server_url}/data/world.json`)
    world_data = feature(features, features.objects.countries)

    const influence_data: ArtistInfluence[] | undefined = await json(`${server_url}/data/artist-influences.json`)
    if (influence_data) {
      allInfluencees = groups(influence_data, (d: ArtistInfluence) => d.artist)
      allInfluencers = groups(influence_data, (d: ArtistInfluence) => d.influenced)
    }

    const locs: ArtistLocation[] | undefined = await json(`${server_url}/data/artist-locations.json`)
    if (locs) {
      oldestYear = min(locs, d => d.year)
      year = oldestYear!
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
    <style>
      .pointer {
        cursor: pointer;
      }
      .slider {
        cursor: ew-resize;
      }
      .st0 {
        fill: #000000;
        stroke: #000000;
        stroke-miterlimit: 10;
      }
    </style>
    <g id="map" bind:this={map} transform={map_pos}>
      <g id="graticules">
        {#each graticuleUle as line}
          <path d={path(line)} fill="none" stroke="lightgray" />
        {/each}
      </g>
      <g id="countries">
        {#if world_data}
          {#each world_data.features as feature}
            <path id={feature.id} d={path(feature)} stroke="lightgray" fill="white" />
          {/each}
        {/if}
      </g>
      <g id="artists">
        {#if showInfluences}
          {#each influences as location}
            <g
              id={location[0].replace(/[[\s\.]]/g, '') + '-group'}
              class="pointer"
              on:focus={ev => OnMouseOver('#' + location[0].replace(/[\s\.]/g, ''))}
              on:mouseover={ev => OnMouseOver('#' + location[0].replace(/[\s\.]/g, ''))}
              on:blur={ev => OnMouseOut('#' + location[0].replace(/[\s\.]/g, ''))}
              on:mouseout={ev => OnMouseOut('#' + location[0].replace(/[\s\.]/g, ''))}
            >
              <line
                x2={getXfromLatLon(location[1])}
                x1={getX(location)}
                y2={getYfromLatLon(location[1])}
                y1={getY(location)}
                stroke="black"
              />
              <circle cx={getXfromLatLon(location[1])} cy={getYfromLatLon(location[1])} r="2" fill="black" />

              <circle cx={getX(location)} cy={getY(location)} r={RADIUS} stroke="black" fill="white" />
              <text
                id={location[0].replace(/[\s\.]/g, '') + '-text'}
                opacity="0"
                x={getX(location)}
                y={getY(location) + TEXT_Y_OFFSET}
                text-anchor="middle">{location[0]}</text
              >
            </g>
          {/each}
        {:else}
          {#each locations as location}
            <g
              class="pointer"
              id={location[0].replace(/[\s\.]/g, '') + '-group'}
              on:focus={ev => OnMouseOver('#' + location[0].replace(/[\s\.]/g, ''))}
              on:mouseover={ev => OnMouseOver('#' + location[0].replace(/[\s\.]/g, ''))}
              on:blur={ev => OnMouseOut('#' + location[0].replace(/[\s\.]/g, ''))}
              on:mouseout={ev => OnMouseOut('#' + location[0].replace(/[\s\.]/g, ''))}
            >
              <line
                x2={getXfromLatLon(location[1])}
                x1={getX(location)}
                y2={getYfromLatLon(location[1])}
                y1={getY(location)}
                stroke="black"
              />
              <circle cx={getXfromLatLon(location[1])} cy={getYfromLatLon(location[1])} r="2" fill="black" />
              <circle
                cx={getX(location)}
                cy={getY(location)}
                r={RADIUS}
                stroke="black"
                fill="white"
                on:click={() => {
                  displayInfluences(location[1][0])
                }}
              />
              <text
                id={location[0].replace(/[\s\.]/g, '') + '-text'}
                opacity="0"
                x={getX(location)}
                y={getY(location) + TEXT_Y_OFFSET}
                text-anchor="middle">{location[0]}</text
              >
            </g>
          {/each}
        {/if}
      </g>
      <g id="outline">
        <path d={path(graticuleOutline)} fill="none" stroke="black" stroke-width="2" />
      </g>
    </g>
    <g id="timeline" bind:this={timeline} transform={tl_pos}>
      <g transform={cursor_pos} on:mousedown={startDrag} on:mouseup={stopDrag} class="slider">
        <path
          class="st0"
          d="M9.3,19.8H8.7c-1.4,0-2.5-1-2.7-2.4l-1.4-10C4.5,6.6,4.7,5.8,5.2,5.2s1.3-0.9,2.1-0.9h3.4c0.8,0,1.6,0.3,2.1,0.9c0.5,0.6,0.8,1.4,0.6,2.2l-1.4,10C11.8,18.7,10.6,19.8,9.3,19.8z"
        />
        <text
          transform="translate({CURSOR_HALF_WIDTH},0)"
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
