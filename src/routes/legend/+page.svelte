<script lang="ts">
  import * as d3 from "d3"
  import { Legend } from "$lib/components"
  import { onMount } from "svelte"

  $: width = 0
  $: height = 0

  let legend: Legend

  onMount(async () => {
    legend.Initialize()
  })
</script>

<svelte:window bind:innerWidth={width} bind:innerHeight={height} />

<Legend bind:this={legend} {width} {height} />
