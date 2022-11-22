<script lang='ts'>
  import { Chord } from '$lib/components'

  $: width = 0
  $: height = 0

  $: chord_width = width / 2
  $: chord_height = height * 0.65

</script>

<svelte:window bind:innerWidth={width} bind:innerHeight={height} />

<Chord width={chord_width} height={chord_height}></Chord>