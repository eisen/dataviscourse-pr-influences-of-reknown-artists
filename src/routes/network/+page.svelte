<script lang="ts">
  import * as d3 from "d3"
  import { Network } from "$lib/components"
  import { Config, Types } from "$lib/utilities"
  import { onMount } from "svelte"

  $: width = 0
  $: height = 0

  let network: Network

  onMount(async () => {
    const artist_data: Types.ArtistData[] | undefined = await d3.json(
      `${Config.server_url}/data/artist-data.json`
    )
    const influence_data: Types.ArtistInfluence[] | undefined = await d3.json(
      `${Config.server_url}/data/artist-influences.json`
    )

    network.Initialize(artist_data!, influence_data!)
  })
</script>

<svelte:window bind:innerWidth={width} bind:innerHeight={height} />

<Network bind:this={network} {width} {height} />
