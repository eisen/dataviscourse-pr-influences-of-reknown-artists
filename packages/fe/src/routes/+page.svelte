<script lang="ts">
  import * as d3 from 'd3'
  import { Chord, Map, Matrix, Network } from '$lib/components'
  import { Config, Types } from '$lib/utilities'
  import { fade } from 'svelte/transition'
  import { Jellyfish } from 'svelte-loading-spinners'
  import { onMount } from 'svelte'

  const DURATION = 1000

  $: data_loaded = false
  $: width = 0
  $: height = 0

  const horizontalPadding = 24
  const verticalPadding = 30

  $: network_width = Math.abs(width - horizontalPadding) / 2
  $: network_height = Math.abs(height - verticalPadding) / 2

  $: chord_width = Math.abs(width - horizontalPadding) / 2
  $: chord_height = Math.abs(height - verticalPadding) / 2

  $: matrix_width = Math.abs(width - horizontalPadding) / 2
  $: matrix_height = Math.abs(height - verticalPadding) / 2

  $: map_width = Math.abs(width - horizontalPadding) / 2
  $: map_height = Math.abs(height - verticalPadding) / 2

  let allArtists: Types.ArtistData[]
  $: allArtists = []
  let allLinks: Types.ArtistLink[]
  $: allLinks = []

  let network: Network
  let chord: Chord
  let map: Map
  let matrix: Matrix

  onMount(async () => {
    const features: any = await d3.json(`${Config.server_url}/data/world.json`)
    const locs: Types.ArtistLocation[] | undefined = await d3.json(`${Config.server_url}/data/artist-locations.json`)
    const medLocs: Types.ArtistMedium[] | undefined = await d3.json(`${Config.server_url}/data/artist-mediums.json`)
    const artist_data: Types.ArtistData[] | undefined = await d3.json(`${Config.server_url}/data/artist-data.json`)
    const influence_data: Types.ArtistInfluence[] | undefined = await d3.json(
      `${Config.server_url}/data/artist-influences.json`
    )

    chord.Initialize(locs!, medLocs!)
    map.Initialize(features, influence_data!, locs!)
    matrix.Initialize(artist_data!, influence_data!)
    network.Initialize(artist_data!, influence_data!)

    data_loaded = true
  })
</script>

<svelte:window bind:innerWidth={width} bind:innerHeight={height} />

<header class="flex absolute top-4 left-4 w-full font-bold text-4xl z-20">Influences of Reknown Artists</header>
<div class="grid-cols-2" style={data_loaded ? 'opacity: 1;' : 'opacity:0;'}>
  <Network bind:this={network} width={network_width} height={network_height} />
  <Chord bind:this={chord} width={chord_width} height={chord_height} />
  <Matrix bind:this={matrix} width={matrix_width} height={matrix_height} />
  <Map bind:this={map} width={map_width} height={map_height} />
</div>
{#if data_loaded === false}
  <div class="absolute inset-0 z-10 bg-white" out:fade={{ duration: DURATION }}>
    <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
      <Jellyfish size="100" color="#CC0000" unit="px" duration="1s" />
    </div>
  </div>
{/if}
<footer class="flex justify-center absolute w-full">
  <span>Team members: Nishita Kharche, Nick Lord-Ender-Laing, Eisen Montalvo</span>
</footer>
