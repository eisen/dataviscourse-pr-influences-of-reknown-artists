<script lang="ts">
  import * as d3 from "d3"
  import { Helpers, Types } from "$lib/utilities"
  import { createEventDispatcher } from "svelte"
  import { attr } from "svelte/internal";

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
  $: attrFontSize =
    height <= width ? (scatterHeight / 270) * 15 : (scatterWidth / 370) * 15
  $: rectWidth = (scatterWidth / 370) * 50 + 20

  const fastTransitionDur = 250
  
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

  // Handler functions
  export const chordGroupingFocus = (chordGroup: string) => {
    console.log(chordGroup)
    d3.selectAll('.allPoints').transition().duration(fastTransitionDur).style('opacity', '0.15')
    d3.selectAll('.allPoints_'+chordGroup).transition().duration(fastTransitionDur).style('opacity', '1.0').attr('stroke', '#3C1900').attr('stroke-width', 2)
  }
  export const chordGroupingReFocus = () => {
    d3.selectAll('.allPoints').transition().duration(fastTransitionDur).style('opacity', '1.0').attr('stroke', 'none')
  }
  // Takes in chord group and century that the ribbon maps to
  export const chordRibbonFocus = (
    chordGroup: string, chordTime: string) => {

  }
  export const chordRibbonReFocus = (
    chordGroup: string, chordTime: string) => {

  }

  // Handles button interactivity
  export const chordButttonFocus = (chordTime: string) => {

  }

  export const Initialize = (
    locs: Types.ArtistLocation[],
    deathLocs: Types.ArtistData[]
  ) => {
    if(locs && deathLocs)
    {

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

      let maxYear = d3.max(scatterData, function(d) {return d.finalYear})
      let minYear = d3.min(scatterData, function(d) {return d.finalYear})
      
      let maxAge = d3.max(scatterData, function(d) {return d.age})
      let minAge = d3.min(scatterData, function(d) {return d.age})

      let horizontalAdjust = 20
      // Creating our scales
      // Horizontal scale: death year
      let horizYearScale = d3.scaleLinear()
        .domain([minYear, maxYear])
        .range([horizontalAdjust, scatterWidth - horizontalAdjust * 2])
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
        .call(scatterXAxis.ticks((scatterWidth <= 450) ? 8 : 13).tickFormat(d3.format("d")));
      d3.select(scattterViz)
        .append('g')
        .classed('axis', true)
        .attr("transform", `translate(${horizontalAdjust * 1.5},${scatterHeight * 0.2})`)
        .call(scatterYAxis.ticks(15).tickFormat(d3.format("d")));

      // Adding dots:
      let pointGroup = d3.select(scattterViz)
        .append('g')
        .attr('class', 'pointGroup')
        .selectAll('g')
        .data(scatterData)
        .enter()
        .append('g')
      // // Defining tooltip/appending it
      // pointGroup.append("")
      // Adding actual points:
      if(attrFontSize > 30)
      {
        attrFontSize = 30
      }
      pointGroup.append("circle")
        .attr("transform", function(d, i)
        { 
          return "translate(" + (horizYearScale(d.finalYear) + horizontalAdjust) + ", " + (verticalAgeScale(d.age) + scatterHeight * 0.2) + ")"
        })
        .attr('r', function(d, i) { return (d3.min([scatterWidth, scatterHeight]) * 0.015)})
        .attr('fill', (d, i) => scatterColorScale(d.typeOfDeath) )
        // .style("stroke", "black")
        .attr('class', function(d, i){return 'allPoints_' + d.typeOfDeath})
        .classed('allPoints', true)
        .on('mouseover', function(e, d) {
          d3.selectAll('.allPoints').transition().duration(fastTransitionDur).
              style('opacity', 0.15).attr('stroke','none')
              // .attr('r', (d3.min([scatterWidth, scatterHeight]) * 0.015))
          d3.select(this).transition().duration(fastTransitionDur).
              style('opacity', 1.0).attr('stroke', '#3C1900').attr('stroke-width', 2)
              // .attr('r', (d3.min([scatterWidth, scatterHeight]) * 0.02))
          // Adding tooltip text/rect:
          console.log('lesgoooo!')
          console.log(attrFontSize)
          d3.selectAll('.tempTextT').remove()
          d3.select(scattterViz).append('rect')
            .classed('tempTextT', true)
            .attr("rx", 6).attr("ry", 6)
            .attr("width", rectWidth + (5 * (d.name.length - 5))).attr("height", 0.1 * scatterHeight)
            .attr("fill", '#3C1900').attr("opacity", 0.0)
            .attr("x", (d.finalYear >= 1880) ? e.offsetX - scatterWidth * 0.1 - (rectWidth + (5 * (d.name.length - 5)))/2 : e.offsetX - (rectWidth + (5 * (d.name.length - 5)))/2)
            .attr("y", e.offsetY - 0.125 * scatterHeight)
          d3.select(scattterViz).append("text")
            .attr("x", (d.finalYear >= 1880) ? e.offsetX - scatterWidth * 0.1 : e.offsetX)
            .attr("y", e.offsetY - 0.125 * scatterHeight + 20)
            .attr("fill", "#cf8217")
            .style('text-anchor', 'middle')
            .classed('tempTextT', true)
            .style('font-size', (d.name.length >= 15 && d.finalYear >= 1880)? attrFontSize * 0.52 : attrFontSize * 0.6)
            .text(`${d.name}`)
            .style("opacity", 0)
          d3.select(scattterViz).append("text")
            .attr("x", (d.finalYear >= 1880) ? e.offsetX - scatterWidth * 0.1 : e.offsetX)
            .attr("y", e.offsetY - 0.125 * scatterHeight + 40)
            .attr("fill", "#cf8217")
            .style('text-anchor', 'middle')
            .classed('tempTextT', true)
            .style('font-size', attrFontSize * 0.6)
            .text(`Aged ${d.age}`)
            .style("opacity", 0)
          d3.select(scattterViz).append("text")
            .attr("x", (d.finalYear >= 1880) ? e.offsetX - scatterWidth * 0.1 : e.offsetX)
            .attr("y", e.offsetY - 0.125 * scatterHeight + 60)
            .attr("fill", "#cf8217")
            .style('text-anchor', 'middle')
            .classed('tempTextT', true)
            .style('font-size', attrFontSize * 0.6)
            .text(`${d.finalYear}`)
            .style("opacity", 0)
          d3.selectAll('.tempTextT').transition().duration(fastTransitionDur).style("opacity", 1.0)
        })
        .on('mouseout', function(e, d) {
          d3.selectAll('.allPoints').transition().duration(fastTransitionDur)
              .style('opacity', 1.0).attr('stroke','none')
              // .attr('r', (d3.min([scatterWidth, scatterHeight]) * 0.015))
          d3.selectAll('.tempTextT').transition().duration(fastTransitionDur).style("opacity", 0).remove()
          // d3.selectAll('.tempTextT').transition().duration(fastTransitionDur + 10000).remove()
          
        })
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
