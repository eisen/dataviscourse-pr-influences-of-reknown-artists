<script lang="ts">
  import * as d3 from 'd3'
  import { Types } from '$lib/utilities'
  import { onMount } from 'svelte'
  import type { ArtistLink } from '$lib/utilities/types'

  const port = 5173
  const server_url = `http://localhost:${port}`

  let sim: d3.Simulation<d3.SimulationNodeDatum, d3.SimulationLinkDatum<d3.SimulationNodeDatum>>
  let sim_running = false

  let allArtists: Types.ArtistData[]
  $: allArtists = []
  let allLinks: Types.ArtistLink[]
  $: allArtists = []
  let artists: [string, Types.ArtistInfluence[]][]
  $: artists = []

  $: width = 0
  $: height = 0

  const translate = (x: number, y: number) => `translate(${x}, ${y})`

  const RunSim = (nodes: any, links: any) => {
    sim = d3
      .forceSimulation(nodes)
      .force(
        'link',
        d3
          .forceLink()
          .id(d => d['artist'])
          .distance(100)
          .strength(1)
      )
      .force('charge', d3.forceManyBody())
      .force('center', d3.forceCenter(width / 2, height / 2))
    // .force(
    //   'x',
    //   d3.forceX().x(d => {
    //     return width / 2
    //   })
    // )
    // .force(
    //   'y',
    //   d3.forceY().y(d => {
    //     return height / 2
    //   })
    // )
    // .force(
    //   'collide',
    //   d3.forceCollide().radius(d => 50)
    // )

    sim.force('link')!.links(links)

    sim.on('tick', () => {
      artists = nodes
      if (Math.abs(sim.alpha() - sim.alphaTarget()) < 0.1) {
        sim.stop()
        sim_running = false
      }
    })

    sim.on('end', () => {
      sim_running = false
    })
  }

  onMount(async () => {
    console.log('Mounted')

    const influence_data: Types.ArtistInfluence[] | undefined = await d3.json(
      `${server_url}/data/artist-influences.json`
    )
    const artist_data: Types.ArtistData[] | undefined = await d3.json(`${server_url}/data/artist-data.json`)

    if (artist_data) {
      allArtists = artist_data
    }

    if (influence_data) {
      allLinks = d3.map(influence_data, (d: Types.ArtistInfluence, i): ArtistLink => {
        const link: ArtistLink = {
          source: d.artist,
          target: d.influenced,
        }
        return link
      })
    }

    console.log(allArtists, allLinks)
    RunSim(allArtists, allLinks)
  })
</script>

<svelte:window bind:innerWidth={width} bind:innerHeight={height} />

<svg {width} {height}>
  {#each artists as influencer}
    <g transform={translate(influencer['x'], influencer['y'])}>
      <circle cx="0" cy="0" r="20" stroke="black" fill="white" />
      <text x="0" y="40" text-anchor="middle">{influencer['artist']}</text>
    </g>
  {/each}
</svg>
