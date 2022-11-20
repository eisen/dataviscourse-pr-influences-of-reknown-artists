<script lang='ts'>
  import { Chord } from '$lib/components'

  $: width = 0
  $: height = 0

</script>

<svelte:window bind:innerWidth={width} bind:innerHeight={height} />

<Chord {width} {height}></Chord>