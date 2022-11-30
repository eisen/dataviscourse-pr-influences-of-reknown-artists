<script lang="ts">
  import * as d3 from "d3"
  import { Helpers, Types } from "$lib/utilities"
  import { createEventDispatcher } from "svelte"

  const dispatch = createEventDispatcher()

  export let width: number = 0
  export let height: number = 0

  let svg: SVGSVGElement
  let scattterViz: SVGGElement

  let allLocations: [string, Types.ArtistLocation[]][]
  $: allLocations = []

  let allDeaths: [string, Types.ArtistData[]][]
  $: allDeaths = []

  export const Initialize = (
    locs: Types.ArtistLocation[],
    deathLocs: Types.ArtistData[]
  ) => {
    if(locs && deathLocs)
    {
      console.log(locs)
      console.log(deathLocs)

      allLocations = d3.groups(locs, (d) => d.artist)
      allDeaths = d3.groups(deathLocs, (d) => d.artist)

      let scatterData = []
      let ageCalc, yearCalc
      let deathFound = false
      let deathDeriv
      for(let i = 0; i < allLocations.length; i++)
      {
        deathFound = false
        // Date-related derivations
        // console.log(allLocations[i][1])
        if(allLocations[i][1].length > 1)
        {
          ageCalc = Number(allLocations[i][1][1].year) - Number(allLocations[i][1][0].year) 
          yearCalc = Number(allLocations[i][1][1].year)
        }
        else{
          ageCalc = 2022 - Number(allLocations[i][1][0].year)
          yearCalc = 2022
        }
        // Death-related derivations
        for(let j = 0; j < allDeaths.length; j++)
        {
          if(allDeaths[j][0] == allLocations[i][0])
          {
            deathDeriv = allDeaths[j][1][0].death_type
            deathFound = true
            break
          }
        }
        if(deathFound)
        {
          scatterData.push(
          {
            name: allLocations[i][0],
            age: ageCalc,
            finalYear: yearCalc,
            typeOfDeath: deathDeriv
          } )
        }
      }
      console.log("here it is!")
      console.log(scatterData)
    }
    else {
      console.error("Unable to load Artist Locations!")
    }

  }

</script>

<div
  id="container"
  class="inline-block relative align-top overflow-hidden"
  style="width: {width}px; height: {height}px;"
>
  <svg
    class="inline-block absolute top-0 left-0"
    viewBox="0, 0, {width}, {height}"
    preserveAspectRatio="xMidYMid meet"
  >
    <g
    id='scatterViz'
    bind:this={scattterViz}
    transform="translate({width / 2}, {height / 2})"
    />
  </svg>
</div>
