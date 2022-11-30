<script lang="ts">
  import * as d3 from "d3"
  import { Helpers, Types } from "$lib/utilities"
  import { createEventDispatcher } from "svelte"
  import { group } from "d3"

  const dispatch = createEventDispatcher()

  export let width: number
  export let height: number
  export let grouping: string

  // Sizing dependent on window
  $: chordCHeight = height * 0.45 > 275 ? 275 : height * 0.45
  $: chartRad = width * 0.45 > 390 ? 390 : width * 0.45 // Max size for more possible screens
  //   $: angleD = (chordCHeight / 270) * 90 - 5
  $: angleD = (chordCHeight / 270) * 90 - 10
  $: rectWidth = (chartRad / 370) * 120
  $: attrFontSize =
    height <= width ? (chordCHeight / 270) * 15 : (chartRad / 370) * 15
  $: titleFontSize =
    height <= width ? (chordCHeight / 170) * 20 : (chartRad / 270) * 20

  let svg: SVGSVGElement
  let chordViz: SVGGElement

  let allLocations: [string, Types.ArtistLocation[]][]
  $: allLocations = []

  let allGroupings: [string, Types.ArtistMedium[]][]
  $: allGroupings = []

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
  ]

  let gtCents = [
    "1000",
    "1100",
    "1200",
    "1300",
    "1400",
    "1500",
    "1600",
    "1700",
    "1800",
    "1900",
  ]

  let centStatus = new Array(gtCents.length).fill(false)

  let medN = gtMediums.length

  let chordCentScale = d3
    .scaleOrdinal()
    .domain(d3.range(gtCents.length))
    .range(gtCents)

  let selectedG = []

  let chordColorScale = d3
    .scaleOrdinal()
    .domain(d3.range(12))
    .range(Helpers.ColorScheme)

  function ribbonBasket(d) {
    var buffer,
      sr = chartRad * 0.9125, // source radius
      sa0 = (d.startAngle * 180) / Math.PI - 90, // start angle source
      sa1 = (d.endAngle * 180) / Math.PI - 90 // end angle source

    var context = null
    if (!context) {
      context = buffer = d3.path()
    }
    context.moveTo(
      sr * Math.cos((sa0 * Math.PI) / 180),
      sr * Math.sin((sa0 * Math.PI) / 180)
    ) // Good
    context.arc(0, 0, sr, (sa0 * Math.PI) / 180, (sa1 * Math.PI) / 180)

    // first control point
    let missAngle
    let mMult = (sa1 > 0 && sa1 < 90) || (sa1 < -90 && sa1 > -180) ? 0.4 : 1.1
    missAngle = 180 - 90 - (90 - (Math.abs(sa1 - sa0) * mMult + sa0))
    let vert = sr * Math.sin((missAngle * Math.PI) / 180)
    let hor = sr * Math.cos((missAngle * Math.PI) / 180)
    let vertCoord = vert / 2 + Math.abs(sa1 - sa0) * 0.1 * 5
    let adjustHi = -1
    if (sa1 > -90 && sa1 < 90) {
      adjustHi = Math.abs(sa1 - sa0) * 0.1 * 10
    } else {
      adjustHi = -1 * (Math.abs(sa1 - sa0) * 0.1 * 10)
    }
    let horCoord = hor / 2 + adjustHi

    // second control point
    let missTangle
    let mMultT = (sa1 > 0 && sa1 < 90) || (sa1 < -90 && sa1 > -180) ? 1.1 : 0.4
    missTangle = 180 - 90 - (90 - (sa1 - Math.abs(sa1 - sa0) * mMultT))
    let vertT = sr * Math.sin((missTangle * Math.PI) / 180)
    let horT = sr * Math.cos((missTangle * Math.PI) / 180)
    let vertTCoord = vertT / 2 + Math.abs(sa1 - sa0) * 0.1 * 5
    let adjustH = -1
    if (sa1 > -90 && sa1 < 90) {
      adjustH = Math.abs(sa1 - sa0) * 0.05 * 10
    } else {
      adjustH = -1 * (Math.abs(sa1 - sa0) * 0.2 * 10)
    }
    let horTCoord = horT / 2 + adjustH

    let argg = []
    for (let m = 0; m < gtCents.length; m++) {
      argg.push(
        m * ((chordCHeight * 2 + 0.06 * chordCHeight) / gtCents.length) -
          chordCHeight * 0.9125
      )
    }

    context.quadraticCurveTo(
      horCoord,
      vertCoord,
      d.half == 0 ? rectWidth / 2 : -rectWidth / 2,
      argg[d.vertIdx]
    ) // to

    context.quadraticCurveTo(
      horTCoord,
      vertTCoord,
      sr * Math.cos((sa0 * Math.PI) / 180),
      sr * Math.sin((sa0 * Math.PI) / 180)
    ) //back

    if (buffer) return (context = null), buffer + "" || null
  }

  const OnMouseOverRibbons = (group: string, idx: number) => {
    dispatch("highlight_chord_ribbon", {
      chordGroup: group,
      chordIdx: idx,
    })
  }

  const fastTransitionDur = 250
  const slowTransitionDur = 450

  const OnMouseLeaveRibbons = (group: string) => {
    dispatch("restore_chord_ribbon", {
      chordGroup: group,
    })
  }

  const OnMouseOverArcs = (group: string) => {
    dispatch("highlight_chord_group", {
      chordGroup: group,
    })
  }

  const OnMouseLeaveArcs = (group: string) => {
    dispatch("restore_chord_group", {
      chordGroup: group,
    })
  }

  export const HighlightGrouping = (chordGroup: string) => {
    // Chaning Ribbon Opacity
    d3.selectAll(".ribbonPaths")
      .transition()
      .duration(fastTransitionDur)
      .style("opacity", 0.1)
    d3.selectAll(".ribbonPaths_" + chordGroup)
      .transition()
      .duration(fastTransitionDur)
      .style("opacity", 0.95)
    // Changing Arc Opacity
    d3.selectAll(".arcPaths")
      .transition()
      .duration(fastTransitionDur)
      .style("opacity", 0.4)
    d3.selectAll("#arc_" + chordGroup)
      .transition()
      .duration(fastTransitionDur)
      .style("opacity", 1.0)
    // d3.selectAll('#arc_'+ chordGroup).transition().duration(fastTransitionDur).attr("outerRadius", chartRad * 1.05 )
    // d3.arc()
    //     .innerRadius(chartRad * 0.925)
    //     .outerRadius(chartRad * 1.05)
    //     .cornerRadius(3)
    // )
  }

  export const RestoreGrouping = (chordGroup: string) => {
    // Restoring Ribbon Styling
    d3.selectAll(".ribbonPaths")
      .transition()
      .duration(slowTransitionDur)
      .style("opacity", 0.5)
    // Restoring Arc Styliing
    // Changing Arc Opacity
    d3.selectAll(".arcPaths")
      .transition()
      .duration(slowTransitionDur)
      .style("opacity", 1.0)
    // d3.selectAll('#arc_'+ chordGroup).transition().duration(fastTransitionDur).attr("d",
    // d3.arc()
    //     .innerRadius(chartRad * 0.925)
    //     .outerRadius(chartRad)
    //     .cornerRadius(3)
    // )

    // d3.selectAll('#arc_'+ chordGroup).transition().duration(fastTransitionDur).style('opacity', 1.0)
    // d3.selectAll('#r_'+ chordGroup).style('opacity', 0.95)
  }

  export const HighlightRibbon = (chordGroup: string, chordIdx: number) => {
    // Chaning Ribbon Opacity
    d3.selectAll(".ribbonPaths")
      .transition()
      .duration(fastTransitionDur)
      .style("opacity", 0.1)
    d3.selectAll(".ribbonPaths_" + chordGroup)
      .transition()
      .duration(fastTransitionDur)
      .style("opacity", 0.5)
    d3.selectAll("#r_" + chordGroup + "_" + chordIdx)
      .transition()
      .duration(fastTransitionDur)
      .style("opacity", 0.95) //0.7
    // d3.selectAll('#r_'+ chordGroup + '_' + chordIdx).transition().duration(fastTransitionDur).style("stroke-width", 3)
    // Changing Arc Opacity
    d3.selectAll(".arcPaths")
      .transition()
      .duration(fastTransitionDur)
      .style("opacity", 0.4)
    d3.selectAll("#arc_" + chordGroup)
      .transition()
      .duration(fastTransitionDur)
      .style("opacity", 1.0)
  }

  export const RestoreRibbon = (chordGroup: string) => {
    // Restoring Ribbon Styling
    d3.selectAll(".ribbonPaths")
      .transition()
      .duration(slowTransitionDur)
      .style("opacity", 0.5)
    // d3.selectAll('.ribbonPaths').transition().duration(fastTransitionDur).style("stroke-width", 1)
    // Restoring Arc Styliing
    // Changing Arc Opacity
    d3.selectAll(".arcPaths")
      .transition()
      .duration(slowTransitionDur)
      .style("opacity", 1.0)
    // d3.selectAll('#arc_'+ chordGroup).transition().duration(fastTransitionDur).style('opacity', 1.0)
    // d3.selectAll('#r_'+ chordGroup).style('opacity', 0.95)
  }

  export const Initialize = (
    locs: Types.ArtistLocation[],
    groupLocs: Types.ArtistMedium[] | Types.ArtistData
  ) => {
    if (locs && groupLocs) {
      if (grouping == "Medium") {
        selectedG = gtMediums
      } else {
        selectedG = gtDeaths
      }

      let groupedData = []
      for (let i = 0; i < selectedG.length; i++) {
        groupedData.push({
          slice: selectedG[i],
          groups: new Array(gtCents.length).fill(0),
        })
      }

      allGroupings = d3.groups(groupLocs, (d) => d.artist)

      allLocations = d3.groups(locs, (d) => d.artist)

      let currGroup = []
      let foundMatch = false
      for (let i = 0; i < allLocations.length; i++) {
        foundMatch = false
        for (let j = 0; j < allGroupings.length; j++) {
          if (allGroupings[j][0] == allLocations[i][0]) {
            currGroup = allGroupings[j][1]
            foundMatch = true
            break
          }
        }
        if (foundMatch) {
          for (let j = 0; j < currGroup.length; j++) {
            for (let k = 0; k < groupedData.length; k++) {
              if (grouping == "Medium") {
                if (groupedData[k].slice == currGroup[j].medium) {
                  groupedData[k].groups[
                    Math.floor(Number(allLocations[i][1][0].year) / 100) - 10
                  ] += 1
                  centStatus[
                    Math.floor(Number(allLocations[i][1][0].year) / 100) - 10
                  ] = true
                  break
                }
              } else {
                if (groupedData[k].slice == currGroup[j].death_type) {
                  groupedData[k].groups[
                    Math.floor(Number(allLocations[i][1][0].year) / 100) - 10
                  ] += 1
                  centStatus[
                    Math.floor(Number(allLocations[i][1][0].year) / 100) - 10
                  ] = true
                  break
                }
              }
            }
          }
        }
      }
      console.log(centStatus)

      let totalEntries = 0
      for (let i = 0; i < groupedData.length; i++) {
        for (let j = 0; j < groupedData[i].groups.length; j++) {
          totalEntries += groupedData[i].groups[j]
        }
      }

      let arcGen = d3
        .arc()
        .innerRadius(chartRad * 0.925)
        .outerRadius(chartRad)
        .cornerRadius(3)

      d3.select(chordViz).datum(function (d, i) {
        let sortedGroupedArr = groupedData.sort(function (a, b) {
          let totA = 0
          let totB = 0
          for (let i = 0; i < a.groups.length; i++) {
            totA += a.groups[i]
          }
          for (let i = 0; i < b.groups.length; i++) {
            totB += b.groups[i]
          }
          if (totA > totB) {
            return 1
          } else if (totB > totA) {
            return -1
          }
          return 0
        })

        let retArr = []
        let n = groupedData.length

        let angleR = (angleD * Math.PI) / 180
        let totalAngle = 2 * angleD
        let totalAngleR = (totalAngle * Math.PI) / 180
        let unitAngleR = totalAngleR / totalEntries
        // let unitAngleR = angleR / mediumsTotalEntries; // Old way just in case
        let padR = (chordCHeight / 270) * 0.02
        let colorIndex = -1
        let forwardAngle = (Math.PI - angleR) / 2
        let forwardAngleD = (Math.PI - angleR) / 2
        let runningRTally = 0.0
        let otherSide = false
        let rTallyInt = 0
        console.log(groupedData)

        let padCheck = false
        for (let i = 0; i < n; i++) {
          colorIndex++
          padCheck = true
          for (let j = 0; j < groupedData[i].groups.length; j++) {
            if (groupedData[i].groups[j] > 0) {
              let currSegment = groupedData[i].groups[j]
              runningRTally += unitAngleR * currSegment
              if (runningRTally < (angleD * Math.PI) / 180) {
                retArr.push({
                  startAngle:
                    padCheck && i > 0 ? padR + forwardAngle : forwardAngle,
                  endAngle:
                    padCheck && i > 0
                      ? padR + unitAngleR * currSegment + forwardAngle
                      : unitAngleR * currSegment + forwardAngle,
                  vertIdx: j,
                  colorIndex: colorIndex,
                  half: 0,
                  cent: j,
                  addLabel: padCheck ? true : false,
                  slice: groupedData[i].slice,
                  defIndex: rTallyInt,
                })
                forwardAngle +=
                  padCheck && i > 0
                    ? padR + unitAngleR * currSegment
                    : unitAngleR * currSegment
              } else {
                let baseTerm = 2 * Math.PI
                retArr.push({
                  startAngle:
                    padCheck && i > 0
                      ? baseTerm -
                        padR -
                        unitAngleR * currSegment -
                        forwardAngleD
                      : baseTerm - unitAngleR * currSegment - forwardAngleD,
                  endAngle:
                    padCheck && i > 0
                      ? baseTerm - padR - forwardAngleD
                      : baseTerm - forwardAngleD,
                  vertIdx: j,
                  colorIndex: colorIndex,
                  half: 1,
                  cent: j,
                  addLabel: padCheck || !otherSide ? true : false,
                  slice: groupedData[i].slice,
                  defIndex: rTallyInt,
                })
                if (!otherSide) {
                  otherSide = true
                }
                forwardAngleD +=
                  padCheck && i > 0
                    ? padR + unitAngleR * currSegment
                    : unitAngleR * currSegment
              }
              if (padCheck) {
                padCheck = false
              }
              rTallyInt++
            }
          }
        }
        return retArr
      })
      let deathArr = [
        "Natural Causes",
        "Unknown",
        "Heart Attack",
        "Suicide",
        "Currently Alive",
      ]
      let mediumArr = [
        "Water Color",
        "Oil Paint",
        "Pastel",
        "Sculptures",
        "Acrylic",
      ]
      // Ribbons
      let ribbons = d3
        .select(chordViz)
        .append("g")
        .attr("class", "ribbons")
        .selectAll("path")
        .data((chords) => chords)
        .enter()
        .append("path") //Appending paths to group
        .attr("d", ribbonBasket)
        .style("fill", function (d) {
          return chordColorScale(d.colorIndex)
        })
        .style("stroke", (d, i) =>
          d3.rgb(chordColorScale(d.colorIndex)).darker()
        )
        .style("stroke-width", 1)
        .attr("id", (d, i) => "r_" + d.slice + "_" + i)
        .attr("class", function (d, i) {
          return (
            "ribbonPaths_" +
            d.slice +
            " " +
            "ribbonPaths_" +
            chordCentScale(d.cent)
          )
        })
        // .classed(`ribbonPaths_${(d, i) => chordCentScale(d.cent)}`, true)
        .classed("ribbonPaths", true)
        // .classed(function(d, i){ return 'ribbonPaths_' + d.slice }, true)
        .style("opacity", 0.5)
        .on("mouseover", function (e, d) {
          OnMouseOverRibbons(d.slice, d.defIndex)
          // d3.select(this).style('opacity', 0.95)
        })
        .on("mouseout", (e, d) => OnMouseLeaveRibbons(d.slice))

      // Group for everything but the ribbons
      let groupChord = d3
        .select(chordViz)
        .append("g")
        .attr("class", "groups")
        .selectAll("g")
        .data((chords) => chords)
        .enter()
        .append("g")
      groupChord
        .append("path")
        .style("fill", function (d, i) {
          return chordColorScale(d.colorIndex)
        })
        .style("stroke", "white")
        .attr("d", arcGen)
        .attr("id", (d, i) => "arc_" + d.slice)
        .attr("class", (d, i) => "arcPaths_" + chordCentScale(d.cent))
        .classed("arcPaths", true)
        .on("mouseover", (e, d) => OnMouseOverArcs(d.slice))
        .on("mouseout", (e, d) => OnMouseLeaveArcs(d.slice))

      // Century butttons:
      let buttonDurr = 250
      groupChord
        .append("rect")
        .data(gtCents)
        .classed("cursor-pointer", (d, i) => centStatus[i])
        .classed("cursor-not-allowed", (d, i) => !centStatus[i])
        .attr("x", (-1 * rectWidth) / 2)
        .attr(
          "y",
          (d, i) =>
            i * ((chordCHeight * 2 + 0.05 * chordCHeight) / gtCents.length) -
            chordCHeight * 0.9 -
            0.05 * chordCHeight
        )
        .attr("rx", 6)
        .attr("ry", 6)
        .attr("width", rectWidth)
        .attr("height", 0.1 * chordCHeight)
        .attr("fill", "#00005C")
        .attr("opacity", 1.0)
        .on("mouseover", function (e, d) {
          let checkStat = centStatus[gtCents.indexOf(d)]
          console.log(gtCents.indexOf(d))
          d3.select(this)
            .transition()
            .duration(buttonDurr)
            .attr("fill", checkStat ? "#cf8217" : "#00005C")
          // Highlighting connecting ribbons
          d3.selectAll(".ribbonPaths")
            .transition()
            .duration(buttonDurr)
            .style("opacity", 0.1)
          d3.selectAll(".ribbonPaths_" + d)
            .transition()
            .duration(buttonDurr)
            .style("opacity", 0.95)
          // Focusing for Arcs
          d3.selectAll(".arcPaths")
            .transition()
            .duration(buttonDurr)
            .style("opacity", 0.4)
          // Selecting groups of arcs, not just individual one
          let groupsSelected = []
          let centSelected = Number(d) / 100 - 10
          for (let k = 0; k < groupedData.length; k++) {
            if (groupedData[k].groups[centSelected] > 0) {
              groupsSelected.push(groupedData[k].slice)
            }
          }
          for (let k = 0; k < groupsSelected.length; k++) {
            d3.selectAll("#arc_" + groupsSelected[k])
              .transition()
              .duration(buttonDurr)
              .style("opacity", 1.0)
          }
        })
        .on("mouseout", function (d, i) {
          d3.select(this)
            .transition()
            .duration(buttonDurr)
            .attr("fill", "#00005C")
          // Highlighting connecting ribbons
          d3.selectAll(".ribbonPaths")
            .transition()
            .duration(buttonDurr)
            .style("opacity", 0.5)
          // Focusing for Arcs
          d3.selectAll(".arcPaths")
            .transition()
            .duration(buttonDurr)
            .style("opacity", 1.0)
        })
        .classed("centRect", true)
        .attr("id", (d, i) => "centRect_" + d + "_" + grouping)
      const text = groupChord
        .append("text")
        .data(gtCents)
        .classed("cursor-pointer", (d, i) => centStatus[i])
        .classed("cursor-not-allowed", (d, i) => !centStatus[i])
        .attr("x", 0)
        .attr(
          "y",
          (d, i) =>
            i * ((chordCHeight * 2 + 0.05 * chordCHeight) / gtCents.length) -
            chordCHeight * 0.88
        )
        .attr("fill", "white")
        .style("text-anchor", "middle")
        .style("font-size", attrFontSize)
        .text(function (d) {
          return String(Number(d) / 100 + 1)
        })
        .classed("centText", true)
        .attr("id", (d, i) => "centText_" + d)
        .on("mouseover", function (e, d) {
          let checkStat = centStatus[gtCents.indexOf(d)]
          console.log(gtCents.indexOf(d))
          console.log(checkStat)
          console.log(d3.select("#centRect_" + d))
          d3.select("#centRect_" + d + "_" + grouping)
            .transition()
            .duration(buttonDurr)
            .attr("fill", checkStat ? "#cf8217" : "#00005C")
          // Highlighting connecting ribbons
          d3.selectAll(".ribbonPaths")
            .transition()
            .duration(buttonDurr)
            .style("opacity", 0.1)
          d3.selectAll(".ribbonPaths_" + d)
            .transition()
            .duration(buttonDurr)
            .style("opacity", 0.95)
          // Focusing for Arcs
          d3.selectAll(".arcPaths")
            .transition()
            .duration(buttonDurr)
            .style("opacity", 0.4)
          // Selecting groups of arcs, not just individual one
          let groupsSelected = []
          let centSelected = Number(d) / 100 - 10
          for (let k = 0; k < groupedData.length; k++) {
            if (groupedData[k].groups[centSelected] > 0) {
              groupsSelected.push(groupedData[k].slice)
            }
          }
          for (let k = 0; k < groupsSelected.length; k++) {
            d3.selectAll("#arc_" + groupsSelected[k])
              .transition()
              .duration(buttonDurr)
              .style("opacity", 1.0)
          }
        })
        .on("mouseout", function (d, i) {
          d3.selectAll(".centRect")
            .transition()
            .duration(buttonDurr)
            .attr("fill", "#00005C")
          // Highlighting connecting ribbons
          d3.selectAll(".ribbonPaths")
            .transition()
            .duration(buttonDurr)
            .style("opacity", 0.5)
          // Focusing for Arcs
          d3.selectAll(".arcPaths")
            .transition()
            .duration(buttonDurr)
            .style("opacity", 1.0)
        })
      text
        .append("tspan")
        .attr("baseline-shift", "super")
        .attr("font-size", attrFontSize * 0.6)
        .text("TH")
      let onceGroupChord = d3
        .select(chordViz)
        .append("g")
        .attr("class", "groups")
      onceGroupChord
        .append("text")
        .attr("x", 0)
        .attr("y", (chordCHeight / 270) * -270)
        .style("text-anchor", "middle")
        .style("font-size", titleFontSize > 20 ? 20 : titleFontSize)
        .text("Distribution of Artists by " + grouping + " Over Centuries")
    } else {
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
      id="chordViz"
      bind:this={chordViz}
      transform="translate({width / 2}, {height / 2})"
    />
  </svg>
</div>
