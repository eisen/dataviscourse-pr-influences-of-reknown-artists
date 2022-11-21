<script lang="ts">
  import * as d3 from 'd3'
  import { Types } from '$lib/utilities'
  import type { ArtistData } from '$lib/utilities/types'

  const RADIUS = 15
  const DURATION = 500
  const PADDING = 20
  const OFFSET_X = 40
  const OFFSET_Y = 100

  let sim: d3.Simulation<d3.SimulationNodeDatum, d3.SimulationLinkDatum<d3.SimulationNodeDatum>>
  let sim_running = false

  let artists: Types.ArtistData[]
  $: artists = []
  let links: Types.ArtistLink[]
  $: links = []

  let allArtists: Types.ArtistData[]
  let allLinks: Types.ArtistLink[]

  export let width: number = 0
  export let height: number = 0

  const Translate = (x: number | undefined, y: number | undefined) => `translate(${x - OFFSET_X}, ${y - OFFSET_Y})`

  const ArtistName = (datum: ArtistData) => {
    return datum.artist.replace(/[\s\.]/g, '')
  }

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
      )
      .force('charge', d3.forceManyBody().strength(15))
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
    d3.select(target + '-text')
      .transition()
      .duration(DURATION)
      .attr('opacity', 1)
    d3.select(target + '-rect')
      .transition()
      .duration(DURATION)
      .attr('opacity', 1)
    d3.select(target + '-image')
      .transition()
      .duration(DURATION)
      .attr('width', 100)
      .attr('height', 100)
      .attr('x', -50)
      .attr('y', -50)
    d3.select(target + '-circle')
      .transition()
      .duration(DURATION)
      .attr('r', 50)
  }

  const OnMouseOut = (target: any) => {
    d3.select(target + '-text')
      .transition()
      .duration(DURATION)
      .attr('opacity', 0)
    d3.select(target + '-rect')
      .transition()
      .duration(DURATION)
      .attr('opacity', 0)
    d3.select(target + '-image')
      .transition()
      .duration(DURATION)
      .attr('width', RADIUS * 2)
      .attr('height', RADIUS * 2)
      .attr('x', -RADIUS)
      .attr('y', -RADIUS)
    d3.select(target + '-circle')
      .transition()
      .duration(DURATION)
      .attr('r', RADIUS)
  }

  const TextWidth = (id: string, text: string): number => {
    const node = d3.select(id).node()! as Element
    if (node) {
      const bbox = node.getBoundingClientRect()
      return bbox.width
    } else {
      return 0
    }
  }

  const TextHeight = (id: string, text: string): number => {
    const node = d3.select(id).node()! as Element
    if (node) {
      const bbox = node.getBoundingClientRect()
      return bbox.height
    } else {
      return 0
    }
  }

  export const Initialize = (artist_data: Types.ArtistData[], influence_data: Types.ArtistInfluence[]) => {
    for (let artist of artist_data) {
      artist.x = width / 2
    }
    allArtists = artist_data

    allLinks = d3.map(influence_data, (d: Types.ArtistInfluence): Types.ArtistLink => {
      const link: Types.ArtistLink = {
        source: d.artist,
        target: d.influenced,
      }
      return link
    })
    RunSim(allArtists, allLinks)
  }
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
          x1={link.source.x + width / 2 - OFFSET_X}
          y1={link.source.y - OFFSET_Y}
          x2={link.target.x + width / 2 - OFFSET_X}
          y2={link.target.y - OFFSET_Y}
          stroke="black"
        />
      </g>
    {/each}
  </g>
  <g id="nodes">
    {#each artists as artist}
      <g transform={Translate(artist.x + width / 2, artist.y)} id={ArtistName(artist) + '-group'}>
        <image
          id={ArtistName(artist) + '-image'}
          href={artist.thumbnail}
          height={RADIUS * 2}
          width={RADIUS * 2}
          x={-RADIUS}
          y={-RADIUS}
          on:focus={ev => OnMouseOver('#' + ArtistName(artist))}
          on:mouseover={ev => OnMouseOver('#' + ArtistName(artist))}
          on:blur={ev => OnMouseOut('#' + ArtistName(artist))}
          on:mouseout={ev => OnMouseOut('#' + ArtistName(artist))}
        />
        <circle id={ArtistName(artist) + '-circle'} cx="0" cy="0" r={RADIUS} stroke="black" fill="none" />
        <rect
          id={ArtistName(artist) + '-rect'}
          x={-(TextWidth('#' + ArtistName(artist) + '-text', artist.artist) + PADDING) / 2}
          width={TextWidth('#' + ArtistName(artist) + '-text', artist.artist) + PADDING}
          y={RADIUS + 60 - (TextHeight('#' + ArtistName(artist) + '-text', artist.artist) + PADDING) / 2}
          height={TextHeight('#' + ArtistName(artist) + '-text', artist.artist) + PADDING}
          fill="white"
          stroke="black"
          rx="15"
          opacity="0"
          class="pointer-events-none"
        />
        <text
          class="cursor-default pointer-events-none"
          id={ArtistName(artist) + '-text'}
          x="0"
          y={RADIUS + 65}
          opacity="0"
          text-anchor="middle">{artist.artist}</text
        >
      </g>
    {/each}
  </g>
  <g transform={Translate(width - 110, height - 50)}>
    <rect x="-3" y="0" width="140" height="60" fill="white" stroke="black" rx="15" />
    <line marker-end="url(#arrowhead)" x1="20" y1="20" x2="115" y2="20" stroke="black" />
    <circle cx="20" cy="20" r={RADIUS} fill="white" stroke="black" />
    <text x="15" y="25">A</text>
    <circle cx="115" cy="20" r={RADIUS} fill="white" stroke="black" />
    <text x="110" y="25">B</text>
    <text x="15" y="50">A influenced B</text>
  </g>
</svg>
