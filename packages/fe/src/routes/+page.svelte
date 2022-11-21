<script lang="ts">
  import * as d3 from 'd3'
  import { Chord, Matrix, Network } from '$lib/components'
  import { Config, Types } from '$lib/utilities'
  import { onMount } from 'svelte'

  $: width = 0
  $: height = 0

  const horizontalPadding = 20

  $: network_width = Math.abs(width - horizontalPadding) / 2
  $: network_height = height / 2

  $: chord_width = Math.abs(width - horizontalPadding) / 2
  $: chord_height = height * 0.65

  $: matrix_width = Math.abs(width - horizontalPadding) / 2
  $: matrix_height = height / 2

  let allArtists: Types.ArtistData[]
  $: allArtists = []
  let allLinks: Types.ArtistLink[]
  $: allLinks = []

  let network: Network
  let chord: Chord
  let matrix: Matrix

  onMount(async () => {
    const locs: Types.ArtistLocation[] | undefined = await d3.json(`${Config.server_url}/data/artist-locations.json`)
    const medLocs: Types.ArtistMedium[] | undefined = await d3.json(`${Config.server_url}/data/artist-mediums.json`)
    const artist_data: Types.ArtistData[] | undefined = await d3.json(`${Config.server_url}/data/artist-data.json`)
    const influence_data: Types.ArtistInfluence[] | undefined = await d3.json(
      `${Config.server_url}/data/artist-influences.json`
    )

    chord.Initialize(locs!, medLocs!)
    matrix.Initialize(artist_data!, influence_data!)
    network.Initialize(artist_data!, influence_data!)
  })
</script>

<svelte:window bind:outerWidth={width} bind:outerHeight={height} />

<div class="grid-cols-2">
  <Network bind:this={network} width={network_width} height={network_height} />
  <Chord bind:this={chord} width={chord_width} height={chord_height} />
  <Matrix bind:this={matrix} width={matrix_width} height={matrix_height}/>
</div>
