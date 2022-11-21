<script lang="ts">
  import * as d3 from 'd3'
  import { onMount } from 'svelte'
  import { Config, Types } from '$lib/utilities'
  import { Map } from '$lib/components'

  $: width = 0
  $: height = 0

  let map: Map

  onMount(async () => {
    const features: any = await d3.json(`${Config.server_url}/data/world.json`)
    const locs: Types.ArtistLocation[] | undefined = await d3.json(`${Config.server_url}/data/artist-locations.json`)
    const influence_data: Types.ArtistInfluence[] | undefined = await d3.json(
      `${Config.server_url}/data/artist-influences.json`
    )

    map.Initialize(features, influence_data!, locs!)
  })
</script>

<svelte:window bind:outerWidth={width} bind:outerHeight={height} />

<Map bind:this={map} {width} {height} />
