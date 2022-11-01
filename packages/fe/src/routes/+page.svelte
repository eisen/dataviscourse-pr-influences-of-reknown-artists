<script lang="ts">
  import { geoGraticule, geoEquirectangular, geoPath } from 'd3-geo'
  import { json } from 'd3-fetch'
  import { feature } from 'topojson'
  import { onMount } from 'svelte'

  let data: any
  $: data = null

  const graticuleGen = geoGraticule()
  const graticuleUle = graticuleGen.lines()
  const graticuleOutline = graticuleGen.outline()

  const projection = geoEquirectangular()
  const path = geoPath().projection(projection)

  onMount(async () => {
    const features: any = await json('http://localhost:5173/data/world.json')
    data = feature(features, features.objects.countries)
  })
</script>

<div class="absolute inset-0">
  <svg id="map" viewBox="0 0 1420 710">
    <g id="graticules">
      {#each graticuleUle as line}
        <path d={path(line)} fill="none" stroke="lightgray" />
      {/each}
    </g>
    <g id="countries">
      {#if data}
        {#each data.features as feature}
          <path id={feature.id} d={path(feature)} stroke="lightgray" fill="white" />
        {/each}
      {/if}
    </g>
    <g id="outline">
      <path d={path(graticuleOutline)} fill="none" stroke="black" stroke-width="2" />
    </g>
  </svg>
</div>
