<script lang="ts">
  import { Network } from '$lib/components'

  $: width = 0
  $: height = 0
</script>

<svelte:window bind:innerWidth={width} bind:innerHeight={height} />

<Network {width} {height} />
