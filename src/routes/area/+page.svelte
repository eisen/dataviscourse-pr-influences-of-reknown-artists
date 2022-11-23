<script lang="ts">
  import * as d3 from "d3"
  import { Area } from "$lib/components"
  import { onMount } from "svelte"

  $: width = 0
  $: height = 0

  let area: Area

  onMount(async () => {
    area.Initialize()
  })
</script>

<svelte:window bind:innerWidth={width} bind:innerHeight={height} />

<Area bind:this={area} {width} {height} />
