<script lang="ts">
  import * as d3 from "d3"
  import { Area } from "$lib/components"
  import { onMount } from "svelte"
  import { Config, Types } from "$lib/utilities"

  $: width = 0
  $: height = 0

  let area: Area

  onMount(async () => {
    const location_data: Types.ArtistLocation[] | undefined = await d3.json(`${Config.server_url}/data/artist-locations.json`)
    const medium_data: Types.ArtistMedium[] | undefined = await d3.json(`${Config.server_url}/data/artist-mediums.json`)
    
    area.Initialize(location_data!, medium_data!)
  })
</script>

<svelte:window bind:innerWidth={width} bind:innerHeight={height} />

<Area bind:this={area} {width} {height} />
