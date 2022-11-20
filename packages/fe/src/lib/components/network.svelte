<script lang="ts">
  import * as d3 from 'd3'
  import { Config, Types } from '$lib/utilities'
  import { onMount } from 'svelte'

  const RADIUS = 15

  let sim: d3.Simulation<d3.SimulationNodeDatum, d3.SimulationLinkDatum<d3.SimulationNodeDatum>>
  let sim_running = false

  let allArtists: Types.ArtistData[]
  $: allArtists = []
  let allLinks: Types.ArtistLink[]
  $: allArtists = []

  let artists: Types.ArtistData[]
  $: artists = []
  let links: Types.ArtistLink[]
  $: links = []

  export let width: number = 0
  export let height: number = 0

  const translate = (x: number | undefined, y: number | undefined) => `translate(${x}, ${y})`

  const RunSim = (nodes: any, edges: any) => {
    sim = d3
      .forceSimulation(nodes)
      .force(
        'link',
        d3
          .forceLink()
          .id(d => d['artist'])
          .distance(RADIUS * 3)
          .strength(1)
        //.iterations(30)
      )
      .force('charge', d3.forceManyBody().strength(15))
      //.force('center', d3.forceCenter(width / 2, height / 2))
      .force('y', d3.forceY(height / 2))
      .force(
        'collide',
        d3.forceCollide().radius(d => RADIUS + 15)
      )

    sim.force('link')!.links(edges)

    sim.on('tick', () => {
      artists = nodes
      links = edges

      if (Math.abs(sim.alpha() - sim.alphaTarget()) < 0.1) {
        sim.stop()
        sim_running = false
      }
    })

    sim.on('end', () => {
      sim_running = false
    })
  }

  const OnMouseOver = (target: any) => {
    d3.select(target + '-group').raise()
    d3.select(target + '-text').attr('opacity', 1)
  }

  const OnMouseOut = (target: any) => {
    d3.select(target + '-text').attr('opacity', 0)
  }

  onMount(async () => {
    const artist_data: Types.ArtistData[] | undefined = await d3.json(`${Config.server_url}/data/artist-data.json`)
    if (artist_data) {
      for (let artist of artist_data) {
        artist.x = width / 2
      }
      allArtists = artist_data
    }

    const influence_data: Types.ArtistInfluence[] | undefined = await d3.json(
      `${Config.server_url}/data/artist-influences.json`
    )
    if (influence_data) {
      allLinks = d3.map(influence_data, (d: Types.ArtistInfluence): Types.ArtistLink => {
        const link: Types.ArtistLink = {
          source: d.artist,
          target: d.influenced,
        }
        return link
      })
    }

    RunSim(allArtists, allLinks)
  })
</script>

<svg class="inline-block" {width} {height}>
  <defs>
    <marker
      id="arrowhead"
      viewBox="-0 -5 10 10"
      refX={RADIUS * 2}
      refY="0"
      orient="auto"
      markerWidth="7"
      markerHeight="7"
    >
      <path d="M 0,-5 L 10 ,0 L 0,5" fill="black" stroke="none" />
    </marker>
  </defs>

  <g id="links">
    {#each links as link}
      <g>
        <line
          marker-end="url(#arrowhead)"
          x1={link.source.x + width / 2}
          y1={link.source.y}
          x2={link.target.x + width / 2}
          y2={link.target.y}
          stroke="black"
        />
      </g>
    {/each}
  </g>
  <g id="nodes">
    {#each artists as artist}
      <g
        transform={translate(artist.x + width / 2, artist.y)}
        id={artist.artist.replace(/[\s\.]/g, '') + '-group'}
        on:focus={ev => OnMouseOver('#' + artist.artist.replace(/[\s\.]/g, ''))}
        on:mouseover={ev => OnMouseOver('#' + artist.artist.replace(/[\s\.]/g, ''))}
        on:blur={ev => OnMouseOut('#' + artist.artist.replace(/[\s\.]/g, ''))}
        on:mouseout={ev => OnMouseOut('#' + artist.artist.replace(/[\s\.]/g, ''))}
      >
        <image href={artist.thumbnail} height={RADIUS * 2} width={RADIUS * 2} x={-RADIUS} y={-RADIUS} />
        <circle cx="0" cy="0" r={RADIUS} stroke="black" fill="none" />
        <text id={artist.artist.replace(/[\s\.]/g, '') + '-text'} x="0" y={RADIUS + 15} opacity="0" text-anchor="middle"
          >{artist.artist}</text
        >
      </g>
    {/each}
  </g>
</svg>
