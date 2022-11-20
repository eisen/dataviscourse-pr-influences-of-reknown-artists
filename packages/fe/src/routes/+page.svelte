<script lang="ts">
  import { Network } from '$lib/components'

  $: width = 0
  $: height = 0

  $: network_width = width / 2
  $: network_height = height / 2
</script>

<svelte:window bind:innerWidth={width} bind:innerHeight={height} />

<Network width={network_width} height={network_height} />
