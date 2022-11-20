<script lang="ts">
  import { Chord, Network } from '$lib/components'

  $: width = 0
  $: height = 0

  $: network_width = width / 2
  $: network_height = height / 2

  $: chord_width = width / 2
  $: chord_height = height * 0.65
</script>

<svelte:window bind:outerWidth={width} bind:outerHeight={height} />

<div class="grid-cols-2">
  <Network width={network_width} height={network_height} />
  <Chord width={chord_width} height={chord_height} />
</div>
