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

  $: scatterWidth = width
  $: scatterHeight = height

  let gtDeaths = [
    "illness",
    "alive",
    "suicide",
    "no-mention",
    "heartattack",
    "heartattack-overdose-probably",
    "natural",
    "accident",
    "murder",
    ""
  ] //Change to programmatic way here

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
      let maxYear = d3.max(scatterData, function(d) {return d.finalYear})
      let minYear = d3.min(scatterData, function(d) {return d.finalYear})
      console.log("Min and Max: " + minYear + ', ' + maxYear)
      let maxAge = d3.max(scatterData, function(d) {return d.age})
      let minAge = d3.min(scatterData, function(d) {return d.age})
      console.log("Min and Max for age: " + minAge + ', ' + maxAge)

      let horizontalAdjust = 20
      // Creating our scales
      // Horizontal scale: death year
      let horizYearScale = d3.scaleLinear()
        .domain([minYear, maxYear])
        .range([horizontalAdjust, scatterWidth - horizontalAdjust * 2])
      console.log(d3.range(minYear, maxYear + 1))
      console.log(scatterWidth)
      console.log(horizYearScale(2022))
      // Vertical scale: deatt age
      let verticalAgeScale = d3.scaleLinear()
        .domain([maxAge, 0])
        .range([0, scatterHeight * 0.65])
      // Color scale for death type
      let scatterColorScale = d3.scaleOrdinal()
        .domain(gtDeaths)
        .range(Helpers.ColorSchemeDeaths)

      // Creating our axes:
      let scatterXAxis = d3.axisBottom(horizYearScale)
      let scatterYAxis = d3.axisLeft(verticalAgeScale)

      // Appending axes
      d3.select(scattterViz)
        .append('g')
        .classed('axis', true)
        .attr("transform", `translate(${horizontalAdjust},${scatterHeight * 0.85})`)
        .call(scatterXAxis.ticks(12).tickFormat(d3.format("d")));
      d3.select(scattterViz)
        .append('g')
        .classed('axis', true)
        .attr("transform", `translate(${horizontalAdjust * 1.5},${scatterHeight * 0.2})`)
        .call(scatterYAxis.ticks(15).tickFormat(d3.format("d")));
      
      let pointGroup = d3.select(scattterViz)
        .append('g')
        .attr('class', 'pointGroup')
        .selectAll('g')
        .data(scatterData)
        .enter()
        .append('g')
      pointGroup.append("circle")
        .attr("transform", function(d, i)
        { 
          console.log(d.finalYear)
          console.log(horizYearScale(d.finalYear))
          console.log(d.age)
          console.log(verticalAgeScale(d.age))
          return "translate(" + (horizYearScale(d.finalYear) + horizontalAdjust) + ", " + (verticalAgeScale(d.age) + scatterHeight * 0.2) + ")"
        })
        .attr('r', function(d, i) { return (d3.min([scatterWidth, scatterHeight]) * 0.015)})
        .attr('fill', (d, i) => scatterColorScale(d.typeOfDeath) )
        .style("stroke", "black")
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
    transform="translate(0, 0)"
    />
  </svg>
</div>
