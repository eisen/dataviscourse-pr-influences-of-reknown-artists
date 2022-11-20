<script lang="ts">
  import * as d3 from 'd3'
  import { Chord, Network } from '$lib/components'
  import { Config, Types } from '$lib/utilities'
  import { onMount } from 'svelte'

  $: width = 0
  $: height = 0

  const horizontalPadding = 20;

  $: network_width = (width - horizontalPadding) / 2
  $: network_height = height / 2

  $: chord_width = (width - horizontalPadding) / 2
  $: chord_height = height * 0.65

  let allArtists: Types.ArtistData[]
  $: allArtists = []
  let allLinks: Types.ArtistLink[]
  $: allLinks = []

  let network: Network

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

    network.Run(allArtists, allLinks)
  })
</script>

<svelte:window bind:outerWidth={width} bind:outerHeight={height} />

<div class="grid-cols-2">
  <Network bind:this={network} width={network_width} height={network_height} />
  <Chord width={chord_width} height={chord_height} />
</div>
