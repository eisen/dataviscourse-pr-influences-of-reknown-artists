<script lang="ts">
  import { geoGraticule, geoMercator, geoPath } from 'd3-geo'
  import { json } from 'd3-fetch'
  import { feature } from 'topojson'
  import { onMount } from 'svelte'

  let data: any
  $: data = null

  const graticuleGen = geoGraticule()
  const graticuleUle = graticuleGen.lines()
  const graticuleOutline = graticuleGen.outline()

  const projection = geoMercator().scale(150)
  const path = geoPath().projection(projection)

  onMount(async () => {
    const features: any = await json('http://localhost:5173/data/world.json')
    data = feature(features, features.objects.countries)
  })
</script>

<div class="absolute inset-0">
  <svg id="map" width="100%" height="100%">
    <g id="graticules">
      {#each graticuleUle as line}
        <path d={path(line)} fill="none" stroke="lightgray" />
      {/each}
      <g id="outline">
        <path d={path(graticuleOutline)} fill="none" stroke="black" stroke-width="2" />
      </g>
    </g>
    <g id="countries">
      {#if data}
        {#each data.features as feature}
          <path id={feature.id} d={path(feature)} stroke="lightgray" fill="none" />
        {/each}
      {/if}
    </g>
  </svg>
</div>
