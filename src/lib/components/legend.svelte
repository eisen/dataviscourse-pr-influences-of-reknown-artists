<script lang="ts">
  import * as d3 from "d3"
  import { Helpers, Types } from "$lib/utilities"
  import { color } from "d3";

  export let width: number = 0
  export let height: number = 0
  export let grouping: string
  export let topOffset

  $: attrFontSize =
    ((width / 370) * 6) < 15 ? 15: (width / 370) * 5
    // height <= width ? (height / 270) * 15 : (width / 370) * 15

  let legendViz: SVGElement

  let gtMediums = [
    "sculptor",
    "painter",
    "printmaker",
    "draughtsman",
    "photography",
    "film",
    "watercolourist",
    "oilpainter",
    "illustrator",
    "muralist",
    "architect",
    "ink",
    "ceramicist",
    "calligrapher",
    "engraving",
  ]

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
  ]

  let selectedG = []
  let colorScale
  let spacingVarH
  let spacingVarV

  export const Initialize = () => {
    if(grouping == "Medium")
    {
      selectedG = gtMediums
      colorScale = d3.scaleOrdinal()
        .domain(selectedG)
        .range(Helpers.ColorSchemeMediums)
      spacingVarH = 0.67
      spacingVarV = 0.5
    }
    else{
      selectedG = gtDeaths
      colorScale = d3.scaleOrdinal()
        .domain(selectedG)
        .range(Helpers.ColorSchemeDeaths)
      spacingVarH = 1.1
      spacingVarV = 0.5
    }
    console.log("alright. here we are again.")
    // Append Legend Rect:
    d3.select(legendViz).append('rect')
            .attr("rx", 4).attr("ry", 4)
            .attr("width", (width * 0.9)).attr("height", height*0.85)
            .attr("fill", '#3C1900').attr("opacity", 1.0)
            .attr("x", (width/20) - 10)
            .attr("y", 5)
            .attr('stroke-width', 5)
            .attr('stroke', "#cf8217")
            // .style('opacity', 0.9)
    d3.select(legendViz).append("text")
        .attr("x", width / 20)
        .attr("y", 45)
        .attr("fill", "#cf8217")
        // .style('text-anchor', 'left')
        .classed('legendBigLabel', true)
        .style('font-size',  attrFontSize)
        
        .text('Legend: ')
        .style("opacity", 1.0)
        .attr('font-weight', 700 )
    // console.log(attrFontSize)
    // Adding all color rectangles:
    let colorGroup = d3.select(legendViz)
      .append('g')
      .attr('class', 'legends')
      .selectAll('g')
      .data(selectedG)
      .enter()
      .append('g')
    colorGroup.append('rect')
            .attr("rx", 4).attr("ry", 4)
            .attr("width", (width * 0.67) / (selectedG.length * 4)).attr("height", height * 0.15)
            .attr("fill", (d, i) => colorScale(d)).attr("opacity", 1.0)
            .attr("x", (d, i) => (width/20) + ((7 * attrFontSize * 0.5) + 15) 
                                  + (((width * spacingVarH) / (selectedG.length ) + ((7 * attrFontSize * 0.5) + 15)) 
                                  * (((i) >= selectedG.length / 2) ? (i - selectedG.length/2) : i))
                                  // + ((7 * attrFontSize * 0.5) + 15)
                                  )
            .attr("y", (d, i) => ((i) >= selectedG.length / 2) ? (height*0.25 + (height * 0.35)) : height * 0.25)
            .attr('stroke-width', 2)
            // .attr('stroke', "#DBE2E9")
            .attr('stroke', (d, i) => d3.rgb(colorScale(d)).brighter(3))
    colorGroup.append("text")
        .attr("x", (d, i) => (width/20) + ((7 * attrFontSize * 0.5) + 15) 
                                  + (((width * spacingVarH) / (selectedG.length ) + ((7 * attrFontSize * 0.5) + 15)) 
                                  * (((i) >= selectedG.length / 2) ? (i - selectedG.length/2) : i))
                                  // - ((d.length / 9) * (attrFontSize * 0.8))
                                  // + ((7 * attrFontSize * 0.5) + 15)
                                  + (width * 0.67) / (selectedG.length * 4) + 7
                                  )
        .attr("y", (d, i) => ((i) >= selectedG.length / 2) ? ((height * 0.35 - attrFontSize * 0.6) + (height * spacingVarV)) : height * 0.5 - attrFontSize * 0.6 )
        .attr("fill", "#cf8217")
        .style('text-anchor', 'center')
        .classed('legendSmallLabel', true)
        .style('font-size', (d, i) => (d.length > 15) ? attrFontSize * 0.7 : attrFontSize * 0.8)
        .text((d, i) => d.charAt(0).toUpperCase() + d.slice(1))
        .style("opacity", 1.0)
  }
</script>

<div
  id="container"
  class="inline-block relative align-top overflow-hidden"
  style="width: {width}px; height: {height}px; top: {(topOffset/2) + 10}px;"
>
  <svg
    class="inline-block absolute top-0 left-0"
    viewBox="0, 0, {width}, {height}"
    preserveAspectRatio="xMidYMid meet"
    transform='translate(0, 0)'
  >
    <g
    id='legendViz'
    bind:this={legendViz}
    transform="translate(0, 0)"
    />
  </svg>
</div>
