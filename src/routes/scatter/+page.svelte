<script lang="ts">
  import * as d3 from "d3"
  import { Scatter } from "$lib/components"
  import { onMount } from "svelte"

  $: width = 0
  $: height = 0

  let scatter: Scatter

  onMount(async () => {
    scatter.Initialize()
  })
</script>

<svelte:window bind:innerWidth={width} bind:innerHeight={height} />

<Scatter bind:this={scatter} {width} {height} />
