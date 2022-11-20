<script lang="ts">
  import * as d3 from 'd3'
  import { Network } from '$lib/components'
  import { Config, Types } from '$lib/utilities'
  import { onMount } from 'svelte'

  $: width = 0
  $: height = 0
  let allArtists: Types.ArtistData[]
  $: allArtists = []
  let allLinks: Types.ArtistLink[]
  $: allLinks = []

  let network: Network

  onMount(async () => {
    const artist_data: Types.ArtistData[] | undefined = await d3.json(`${Config.server_url}/data/artist-data.json`)
    const influence_data: Types.ArtistInfluence[] | undefined = await d3.json(
      `${Config.server_url}/data/artist-influences.json`
    )
    if (artist_data && influence_data) {
      allLinks = d3.map(influence_data, (d: Types.ArtistInfluence): Types.ArtistLink => {
        const link: Types.ArtistLink = {
          source: d.artist,
          target: d.influenced,
        }
        return link
      })

      for (let artist of artist_data) {
        artist.x = width / 2
      }
      allArtists = artist_data
    }

    network.Run(allArtists, allLinks)
  })
</script>

<svelte:window bind:innerWidth={width} bind:innerHeight={height} />

<Network bind:this={network} {width} {height} />
