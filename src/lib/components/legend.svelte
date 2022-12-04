<script lang="ts">
  import * as d3 from "d3"
  import { Helpers, Types } from "$lib/utilities"
  import { createEventDispatcher } from "svelte"
  import { chord, color } from "d3"
  import { updated } from "$app/stores"

  const dispatch = createEventDispatcher()

  export let width: number = 0
  export let height: number = 0
  export let grouping: string
  export let topOffset: number

  $: attrFontSize = (width / 370) * 6 < 15 ? 15 : (width / 370) * 5
  // height <= width ? (height / 270) * 15 : (width / 370) * 15

  let legendViz: SVGElement

  let selectedG = []
  let colorScale
  let spacingVarH
  let spacingVarV
  let lilDurr = 200

  // Function for highlighting legend item based on one ribbon or arc:
  export const singleGroupingFocus = (chordGroup: string) => {
    d3.selectAll(".legendaryText_" + grouping)
      .transition()
      .duration(lilDurr)
      .style("opacity", 0.1)
    d3.selectAll(".legendaryRect_" + grouping)
      .transition()
      .duration(lilDurr)
      .style("opacity", 0.1)

    d3.select("#legendaryText_" + grouping + "_" + chordGroup)
      .transition()
      .duration(lilDurr)
      .style("opacity", 1.0)
    d3.select("#legendaryRect_" + grouping + "_" + chordGroup)
      .transition()
      .duration(lilDurr)
      .style("opacity", 1.0)
  }
  export const singleGroupingReFocus = () => {
    d3.selectAll(".legendaryText_" + grouping)
      .transition()
      .duration(lilDurr)
      .style("opacity", 1.0)
    d3.selectAll(".legendaryRect_" + grouping)
      .transition()
      .duration(lilDurr)
      .style("opacity", 1.0)
  }

  export const multipleGroupingsFocus = (chordGroups: any) => {
    d3.selectAll(".legendaryText_" + grouping)
      .transition()
      .duration(lilDurr)
      .style("opacity", 0.1)
    d3.selectAll(".legendaryRect_" + grouping)
      .transition()
      .duration(lilDurr)
      .style("opacity", 0.1)

    for (let i = 0; i < chordGroups.length; i++) {
      d3.select("#legendaryText_" + grouping + "_" + chordGroups[i])
        .transition()
        .duration(lilDurr)
        .style("opacity", 1.0)
      d3.select("#legendaryRect_" + grouping + "_" + chordGroups[i])
        .transition()
        .duration(lilDurr)
        .style("opacity", 1.0)
    }
  }

  export const multipleGroupingsReFocus = () => {
    d3.selectAll(".legendaryText_" + grouping)
      .transition()
      .duration(lilDurr)
      .style("opacity", 1.0)
    d3.selectAll(".legendaryRect_" + grouping)
      .transition()
      .duration(lilDurr)
      .style("opacity", 1.0)
  }

  const Reset = () => {
    dispatch("reset_mediums", {})
  }

  const OnMouseOverElement = (element: string) => {
    dispatch("highlight_element", {
      chordGroup: element,
    })
  }

  const OnMouseLeaveElement = (element: string) => {
    dispatch("restore_elements", {
      chordGroup: element,
    })
  }

  export const Initialize = (
    groupLocs: Types.ArtistMedium[] | Types.ArtistData[]
  ) => {
    let rolledUpG
    if (grouping == "Medium") {
      // selectedG = gtMediums
      colorScale = d3.scaleOrdinal().domain(selectedG).range(d3.schemePaired)
      spacingVarH = 0.67
      spacingVarV = 0.5
      rolledUpG = d3.groups(groupLocs, (d) => d.medium)
    } else {
      // selectedG = gtDeaths
      colorScale = d3.scaleOrdinal().domain(selectedG).range(d3.schemePaired)
      spacingVarH = 1.1
      spacingVarV = 0.5
      rolledUpG = d3.groups(groupLocs, (d) => d.death_type)
    }
    for (let i = 0; i < rolledUpG.length; i++) {
      selectedG.push(rolledUpG[i][0])
    }
    selectedG.sort(d3.ascending)
    // Append Legend Rect:
    d3.select(legendViz)
      .append("rect")
      .attr("rx", 4)
      .attr("ry", 4)
      .attr("width", width * 0.9)
      .attr("height", height * 0.85)
      .attr("fill", "none")
      .attr("opacity", 1.0)
      .attr("x", width / 20 - 10)
      .attr("y", 5)
      .attr("stroke-width", 1)
      .attr("stroke", "none")
    // .style('opacity', 0.9)
    d3.select(legendViz)
      .append("text")
      .attr("x", width / 2)
      .attr("y", attrFontSize)
      .attr("text-anchor", "middle")
      .attr("fill", "black")
      // .style('text-anchor', 'left')
      .classed("legendBigLabel", true)
      .style("font-size", attrFontSize)

      .text(grouping == "Death" ? "Means of Death" : "Artistic Medium")
      .style("opacity", 1.0)
      .attr("font-weight", 700)
    // console.log(attrFontSize)
    // Adding all color rectangles:
    let colorGroup = d3
      .select(legendViz)
      .append("g")
      .attr("class", "legends")
      .selectAll("g")
      .data(selectedG)
      .enter()
      .append("g")
      .on("mouseover", (el, d) => OnMouseOverElement(d))
      .on("mouseleave", (el, d) => OnMouseLeaveElement(d))

    colorGroup
      .append("rect")
      .attr("rx", 4)
      .attr("ry", 4)
      .attr("width", (width * 0.67) / (selectedG.length * 4))
      .attr("height", height * 0.15)
      .attr("fill", (d, i) => colorScale(d))
      .attr("opacity", 1.0)
      .attr(
        "x",
        (d, i) =>
          width / 20 +
          (7 * attrFontSize * 0.5 + 15) +
          ((width * spacingVarH) / selectedG.length +
            (7 * attrFontSize * 0.5 + 15)) *
            (i >= selectedG.length / 2 ? i - selectedG.length / 2 : i) +
          (7 * attrFontSize * 0.5 + 15)
      )
      .attr("y", (d, i) =>
        i >= selectedG.length / 2 ? height * 0.4 + height * 0.35 : height * 0.4
      )
      .attr("stroke-width", 1)
      .classed("legendaryRect_" + grouping, true)
      // .attr('stroke', "#DBE2E9")
      .attr("stroke", "black")
      .attr("id", (d, i) => "legendaryRect_" + grouping + "_" + d)

    colorGroup
      .append("text")
      .attr(
        "x",
        (d, i) =>
          width / 20 +
          (7 * attrFontSize * 0.5 + 15) +
          ((width * spacingVarH) / selectedG.length +
            (7 * attrFontSize * 0.5 + 15)) *
            (i >= selectedG.length / 2 ? i - selectedG.length / 2 : i) +
          // - ((d.length / 9) * (attrFontSize * 0.8))
          (7 * attrFontSize * 0.5 + 15) +
          (width * 0.67) / (selectedG.length * 4) +
          7
      )
      .attr("y", (d, i) =>
        i >= selectedG.length / 2
          ? height * 0.5 - attrFontSize * 0.6 + height * spacingVarV
          : height * 0.65 - attrFontSize * 0.6
      )
      .attr("fill", "black")
      .style("text-anchor", "center")
      .classed("legendaryText_" + grouping, true)
      .style("font-size", (d, i) =>
        d.length > 15 ? attrFontSize * 0.7 : attrFontSize * 0.8
      )
      .text(function (d, i) {
        let updatedWording = d
        if (d == "illness") {
          updatedWording = "Sickness"
        } else if (d == "heartattack") {
          updatedWording = "Heart Attack"
        } else if (d == "alive") {
          updatedWording = "Still Alive"
        } else if (d == "natural") {
          updatedWording = "Natural Causes"
        } else if (d == "no-mention") {
          updatedWording = "Cause Unknown"
        } else if (d == "architect") {
          updatedWording = "Architecture"
        } else if (d == "calligrapher") {
          updatedWording = "Calligraphy"
        } else if (d == "ceramicist") {
          updatedWording = "ceramics"
        } else if (d == "draughtsman") {
          updatedWording = "Blueprints"
        } else if (d == "illustrator") {
          updatedWording = "Illustrations"
        } else if (d == "muralist") {
          updatedWording = "Murals"
        } else if (d == "painter") {
          updatedWording = "Paintings"
        } else if (d == "printmaker") {
          updatedWording = "Prints"
        } else if (d == "sculptor") {
          updatedWording = "Sculptures"
        } else if (d == "photography-film") {
          updatedWording = "Photos & Film"
        }
        return updatedWording.charAt(0).toUpperCase() + updatedWording.slice(1)
      })
      .style("opacity", 1.0)
      .attr("id", (d, i) => "legendaryText_" + grouping + "_" + d)
  }
</script>

<div
  id="container"
  class="inline-block relative align-top overflow-hidden"
  style="width: {width}px; height: {height}px; top: {topOffset / 2 + 10}px;"
>
  <svg
    class="inline-block absolute top-0 left-0"
    viewBox="0, 0, {width}, {height}"
    preserveAspectRatio="xMidYMid meet"
    transform="translate(0, 0)"
  >
    <g on:click={(ev) => Reset()}>
      <rect x="0" y="0" {width} {height} fill="transparent" />
    </g>
    <g id="legendViz" bind:this={legendViz} transform="translate(0, 0)" />
  </svg>
</div>
