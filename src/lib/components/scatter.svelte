<script lang="ts">
  import * as d3 from "d3"
  import { Config, Helpers, Types } from "$lib/utilities"
  import { createEventDispatcher } from "svelte"

  const dispatch = createEventDispatcher()

  export let width: number = 0
  export let height: number = 0
  export let topOffset: number = 0

  let PADDING = 20

  let svg: SVGSVGElement
  let scatterViz: SVGGElement

  let allLocations: [string, Types.ArtistLocation[]][]
  $: allLocations = []

  let allDeaths: [string, Types.ArtistData[]][]
  $: allDeaths = []

  $: scatterWidth = width
  $: scatterHeight = height
  $: attrFontSize =
    height <= width ? (scatterHeight / 270) * 15 : (scatterWidth / 370) * 15
  $: rectWidth = (scatterWidth / 370) * 50 + 20

  let scatterData: Types.ScatterData[]
  $: scatterData = []

  const fastTransitionDur = 250

  // let gtDeaths = [
  //   "illness",
  //   "alive",
  //   "suicide",
  //   "no-mention",
  //   "heartattack",
  //   "heartattack-overdose-probably",
  //   "natural",
  //   "accident",
  //   "murder",
  // ] //Change to programmatic way here
  let gtDeaths = []
  // let deathTypeLocks = new Array(gtDeaths.length).fill(false)
  let deathTypeLocks

  let clickLock = false
  let centClicked = ""
  let horizYearScale
  let verticalAgeScale
  let scatterColorScale

  let scatterXAxis
  let scatterYAxis

  let scatterXAxisG
  let scatterYAxisG

  let horizontalAdjust = 30

  let dbBusy = false

  let newMinYear = 0
  let newMaxYear = 0

  let minYear = 0
  let maxYear = 0

  function delay(time: number) {
    return new Promise((resolve) => setTimeout(resolve, time))
  }

  // Dispatch functions:
  const OnMouseOverDots = (group: string) => {
    dispatch("highlight_scatter_dots", {
      deathGroup: group,
    })
  }
  const OnMouseLeaveDots = () => {
    dispatch("restore_scatter_dots", {})
  }

  // Handler functions
  export const chordGroupingFocus = (chordGroup: string) => {
    if (dbBusy) {
      console.log("sorry. the points are busy moving right now...")
    } else {
      d3.selectAll(".allPoints")
        .transition()
        .duration(fastTransitionDur)
        .style("opacity", function (d, i) {
          // if(!deathTypeLocks[gtDeaths.indexOf(d.typeOfDeath)])
          // {
          //   return '0.15'
          // }
          // else{
          //   return '1.0'
          // }
          return "0.15"
        })
      d3.selectAll(".allPoints_" + chordGroup)
        .transition()
        .duration(fastTransitionDur)
        .style("opacity", "1.0")
        .attr("stroke", "#3C1900")
        .attr("stroke-width", 2)
    }
  }
  export const chordGroupingReFocus = () => {
    if (dbBusy) {
      console.log("sorry. the points are busy moving right now...")
    } else {
      d3.selectAll(".allPoints")
        .transition()
        .duration(fastTransitionDur)
        .style("opacity", "1.0")
        .attr("stroke", (d, i) =>
          !deathTypeLocks[gtDeaths.indexOf(d.typeOfDeath)] ? "none" : "#3C1900"
        )
    }
  }
  // Takes in chord group and century that the ribbon maps to
  export const chordRibbonFocus = (chordGroup: string, chordTime: string) => {
    // check if they are busy
    if (dbBusy) {
      console.log("sorry. the points are busy moving right now...")
    } else {
      // if(!clickLock)
      // {
      d3.selectAll(".allPoints")
        .transition()
        .duration(fastTransitionDur)
        .style("opacity", "0.15")
      d3.selectAll(".allPoints_" + chordGroup + "_" + chordTime)
        .transition()
        .duration(fastTransitionDur)
        .style("opacity", "1.0")
        .attr("stroke", "#3C1900")
        .attr("stroke-width", 2)
      // }
    }
    // positionCompare = Number(d3.select('.allPoints').attr('cx'))
  }
  export const chordRibbonReFocus = () => {
    if (dbBusy) {
      console.log("sorry. the points are busy moving right now...")
    } else {
      d3.selectAll(".allPoints")
        .transition()
        .duration(fastTransitionDur)
        .style("opacity", "1.0")
        .attr("stroke", (d, i) =>
          !deathTypeLocks[gtDeaths.indexOf(d.typeOfDeath)] ? "none" : "#3C1900"
        )
    }
    // positionCompare = Number(d3.select('.allPoints').attr('cx'))
  }

  // Handles button interactivity
  export const chordButtonFocus = (chordTime: string, groups: any) => {
    if (!clickLock) {
      // d3.selectAll('.allPoints').style('opacity', (d, i) => (!deathTypeLocks[gtDeaths.indexOf(d.typeOfDeath)]) ? '0.15' : '1.0')
      d3.selectAll(".allPoints").style("opacity", "0.15")
      for (let i = 0; i < groups.length; i++) {
        d3.selectAll(".allPoints_" + groups[i] + "_" + chordTime)
          .style("opacity", "1.0")
          .attr("stroke", "#3C1900")
          .attr("stroke-width", 2)
      }
    } else {
      // d3.selectAll('.allPoints').style('opacity', (d, i) => (!deathTypeLocks[gtDeaths.indexOf(d.typeOfDeath)]) ? '0.15' : '1.0')
      d3.selectAll(".allPoints").style("opacity", "0.15")
      for (let i = 0; i < groups.length; i++) {
        d3.selectAll(".allPoints_" + groups[i] + "_" + chordTime)
          .style("opacity", "1.0")
          .attr("stroke", "#3C1900")
          .attr("stroke-width", 2)
      }
    }
  }
  export const chordButtonReFocus = (chordTime: string) => {
    if (!clickLock) {
      d3.selectAll(".allPoints")
        .style("opacity", "1.0")
        .attr("stroke", (d, i) =>
          !deathTypeLocks[gtDeaths.indexOf(d.typeOfDeath)] ? "none" : "#3C1900"
        )
    } else {
      d3.selectAll(".allPoints")
        .style("opacity", function (d, i) {
          if (Math.floor(d.finalYear / 100) * 100 == Number(centClicked)) {
            return "1.0"
          }
          return "0.0" //Hmmm
        })
        .attr("stroke", (d, i) =>
          !deathTypeLocks[gtDeaths.indexOf(d.typeOfDeath)] ? "none" : "#3C1900"
        )
    }
  }

  export const chordButtonClick = (chordTime: string, groups: any) => {
    let secondCheck = clickLock
    if ((secondCheck = true)) {
      if (chordTime != centClicked) {
        secondCheck = false
      }
    }
    if (secondCheck == false) {
      // Zooms
      // d3.selectAll('.allPoints').classed('busy', true)
      dbBusy = true
      clickLock = true
      centClicked = chordTime
      // d3.selectAll('.allPoints').transition().duration(1000).style('opacity', 0.0)

      // d3.selectAll('.allPoints').transition().duration(fastTransitionDur).style('opacity', '0.15')
      // Huge help with zoom: https://bl.ocks.org/guilhermesimoes/15ed216d14175d8165e6
      newMinYear = Number(chordTime)
      newMaxYear =
        chordTime == "2000" ? Number(chordTime) + 22 : Number(chordTime) + 100
      let updatedHorizYearScale = d3
        .scaleLinear()
        .domain(
          chordTime == "2000"
            ? [Number(chordTime), Number(chordTime) + 22]
            : [Number(chordTime), Number(chordTime) + 100]
        )
        .range([horizontalAdjust, scatterWidth - horizontalAdjust * 2])
      console.log("updating to: ", scatterWidth)
      scatterXAxisG
        .transition()
        .duration(1000)
        .call(
          scatterXAxis
            .scale(updatedHorizYearScale)
            .ticks(scatterWidth <= 490 ? 8 : 13)
            .tickFormat(d3.format("d"))
        )

      d3.selectAll(".allPoints")
        .transition()
        .duration(1000)
        .attr(
          "cx",
          (d, i) => updatedHorizYearScale(d.finalYear) + horizontalAdjust
        )
        .style("opacity", 0.0)
        .attr("r", d3.min([scatterWidth, scatterHeight]) * 0.015)
      for (let i = 0; i < groups.length; i++) {
        d3.selectAll(".allPoints_" + groups[i] + "_" + chordTime)
          .transition()
          .duration(1000)
          .style("opacity", "1.0")
          .attr("stroke", "#3C1900")
          .attr("stroke-width", 2)
          .attr("r", d3.min([scatterWidth, scatterHeight]) * 0.02)
          .attr(
            "cx",
            (d, i) => updatedHorizYearScale(d.finalYear) + horizontalAdjust
          )
      }
      // delay(2200).then(() => d3.selectAll('.allPoints').classed('busy', false))
      delay(2000).then(() => (dbBusy = false))

      // d3.selectAll('.allPoints').transition().duration(1500).classed('busy', false)
      // d3.selectAll('.allPoints').transition().duration(1000).attr('cx', (d, i) => updatedHorizYearScale(d.finalYear) + horizontalAdjust)
    } else {
      // Goes back to default range
      // d3.selectAll('.allPoints').classed('busy', true)
      dbBusy = true
      clickLock = false
      centClicked = ""

      newMinYear = minYear
      newMaxYear = maxYear
      // d3.selectAll('.allPoints').transition().duration(1000).style('opacity', 1.0)
      scatterXAxisG
        .transition()
        .duration(1000)
        .call(
          scatterXAxis
            .scale(horizYearScale)
            .ticks(scatterWidth <= 490 ? 8 : 13)
            .tickFormat(d3.format("d"))
        )

      d3.selectAll(".allPoints")
        .transition()
        .duration(1000)
        .attr("cx", (d, i) => horizYearScale(d.finalYear) + horizontalAdjust)
        .style("opacity", 1.0)
      for (let i = 0; i < groups.length; i++) {
        d3.selectAll(".allPoints_" + groups[i] + "_" + chordTime)
          .transition()
          .duration(1000)
          .style("opacity", "1.0")
          .attr("stroke", "#3C1900")
          .attr("stroke-width", 2)
          .attr("r", d3.min([scatterWidth, scatterHeight]) * 0.015)
          .attr("cx", (d, i) => horizYearScale(d.finalYear) + horizontalAdjust)
      }
      // delay(2200).then(() => d3.selectAll('.allPoints').classed('busy', false))
      delay(2000).then(() => (dbBusy = false))
      // d3.selectAll('.allPoints').transition().duration(1000).attr('cx', (d, i) => horizYearScale(d.finalYear) + horizontalAdjust)
    }
  }

  export const chordArcClick = (chordGroup: string) => {
    // Old way...
    // if(d3.sele)
    // d3.selectAll('.allPoints_'+chordGroup+'_'+'staying')
    // let stayingClass = '.allPoints_'+chordGroup+'_staying'
    // if(d3.selectAll(stayingClass)._groups[0].length == 0)
    // {
    //   d3.selectAll('.allPoints_'+chordGroup).classed('allPoints_'+chordGroup+'_staying', true)
    // }
    // else{
    //   d3.selectAll('.allPoints_'+chordGroup).classed('allPoints_'+chordGroup+'_staying', false)
    // }
    deathTypeLocks[gtDeaths.indexOf(chordGroup)] =
      !deathTypeLocks[gtDeaths.indexOf(chordGroup)]
  }

  export const Initialize = (
    locs: Types.ArtistLocation[],
    deathLocs: Types.ArtistData[]
  ) => {
    if (locs && deathLocs) {
      allLocations = d3.groups(locs, (d) => d.artist)
      allDeaths = d3.groups(deathLocs, (d) => d.artist)
      let allDeathsRoll = d3.groups(deathLocs, (d) => d.death_type)
      for (let i = 0; i < allDeathsRoll.length; i++) {
        gtDeaths.push(allDeathsRoll[i][0])
      }
      gtDeaths.sort(d3.ascending)
      deathTypeLocks = new Array(gtDeaths.length).fill(false)

      let ageCalc, yearCalc
      let deathFound = false
      let deathDeriv
      for (let i = 0; i < allLocations.length; i++) {
        deathFound = false
        // Date-related derivations
        if (allLocations[i][1].length > 1) {
          ageCalc =
            Number(allLocations[i][1][1].year) -
            Number(allLocations[i][1][0].year)
          yearCalc = Number(allLocations[i][1][1].year)
        } else {
          ageCalc = 2022 - Number(allLocations[i][1][0].year)
          yearCalc = 2022
        }
        // Death-related derivations
        for (let j = 0; j < allDeaths.length; j++) {
          if (allDeaths[j][0] == allLocations[i][0]) {
            deathDeriv = allDeaths[j][1][0].death_type
            deathFound = true
            break
          }
        }
        if (deathFound) {
          scatterData.push({
            name: allLocations[i][0],
            age: ageCalc,
            finalYear: yearCalc,
            // finalCent: String(Math.floor(yearCalc/100) * 100),
            typeOfDeath: deathDeriv,
          })
        }
      }

      maxYear = d3.max(scatterData, function (d) {
        return d.finalYear
      })
      minYear = d3.min(scatterData, function (d) {
        return d.finalYear
      })

      let maxAge = d3.max(scatterData, function (d) {
        return d.age
      })
      let minAge = d3.min(scatterData, function (d) {
        return d.age
      })

      newMinYear = minYear
      newMaxYear = maxYear

      // Creating our scales
      // Horizontal scale: death year
      horizYearScale = d3
        .scaleLinear()
        .domain([minYear, maxYear])
        .range([horizontalAdjust, scatterWidth - horizontalAdjust * 2])
      console.log("original: ", scatterWidth)
      // Vertical scale: deatt age
      verticalAgeScale = d3
        .scaleLinear()
        .domain([maxAge, 0])
        .range([0, scatterHeight * 0.65])
      // Color scale for death type
      scatterColorScale = d3
        .scaleOrdinal()
        .domain(gtDeaths)
        .range(d3.schemePaired)

      // Creating our axes:
      scatterXAxis = d3.axisBottom(horizYearScale)
      scatterYAxis = d3.axisLeft(verticalAgeScale)

      // Adding dots:
      let pointGroup = d3
        .select(scatterViz)
        .append("g")
        .attr("class", "pointGroup")
        .selectAll("g")
        .data(scatterData)
        .enter()
        .append("g")
        .attr("transform", (d) => `translate(0, 0)`)
      // // Defining tooltip/appending it
      // pointGroup.append("")
      // Adding actual points:
      if (attrFontSize > 30) {
        attrFontSize = 30
      }
      pointGroup
        .append("circle")
        .attr("cx", (d, i) => horizYearScale(d.finalYear) + horizontalAdjust)
        .attr("cy", (d, i) => verticalAgeScale(d.age) + scatterHeight * 0.2)
        .attr("r", (d, i) => d3.min([scatterWidth, scatterHeight]) * 0.015)
        .attr("fill", (d, i) => scatterColorScale(d.typeOfDeath))
        // .style("stroke", "black")
        .attr("class", function (d, i) {
          return (
            "allPoints_" +
            d.typeOfDeath +
            " allPoints_" +
            d.typeOfDeath +
            "_" +
            Math.floor(d.finalYear / 100) * 100
          )
        })
        .classed("allPoints", true)
        .on("mouseover", function (e, d, boolL = dbBusy) {
          if (!boolL) {
            console.log("oh yeah oh yeah mario oh yeah")
            d3.selectAll(".allPoints")
              .transition()
              .duration(fastTransitionDur)
              .style("opacity", 0.15)
              .attr("stroke", (d, i) =>
                !deathTypeLocks[gtDeaths.indexOf(d.typeOfDeath)]
                  ? "none"
                  : "#3C1900"
              )
            // style('opacity', (d, i) => (!deathTypeLocks[gtDeaths.indexOf(d.typeOfDeath)]) ? 0.15 : 1.0).attr('stroke','none')
            // .attr('r', (d3.min([scatterWidth, scatterHeight]) * 0.015))
            d3.select(this)
              .transition()
              .duration(fastTransitionDur)
              .style("opacity", 1.0)
              .attr("stroke", "#3C1900")
              .attr("stroke-width", 2)
            // .attr('r', (d3.min([scatterWidth, scatterHeight]) * 0.02))

            // Adding tooltip text/rect:
            d3.selectAll(".tempTextT").remove()
            d3.select(scatterViz)
              .append("rect")
              .classed("tempTextT", true)
              .attr("rx", 6)
              .attr("ry", 6)
              .attr(
                "width",
                () =>
                  Helpers.MaxTextWidth(
                    [
                      "#" + Helpers.ArtistID(d.name) + "-name",
                      "#" + Helpers.ArtistID(d.name) + "-age",
                      "#" + Helpers.ArtistID(d.name) + "-year",
                    ],
                    [d.name, `Aged ${d.age}`, `${d.finalYear}`]
                  ) + PADDING
              )
              .attr(
                "height",
                () =>
                  (Helpers.TextHeight(
                    "#" + Helpers.ArtistID(d.name) + "-name",
                    d.name
                  ) +
                    PADDING * 0.5) *
                  3
              )
              .attr("fill", "white")
              .attr("stroke", "black")
              .attr("opacity", 0.0)
              .attr(
                "x", function(){
                let horizontalOffsetQ = 0
                if((d.finalYear - newMinYear) / (newMaxYear - newMinYear) >= 0.8)
                {
                  horizontalOffsetQ = -scatterWidth * 0.1
                }
                else if((d.finalYear - newMinYear) / (newMaxYear - newMinYear) <= 0.2)
                {
                  horizontalOffsetQ = scatterWidth * 0.1
                }
                return  (e.offsetX + horizontalOffsetQ) -
                  (Helpers.MaxTextWidth(
                    [
                      "#" + Helpers.ArtistID(d.name) + "-name",
                      "#" + Helpers.ArtistID(d.name) + "-age",
                      "#" + Helpers.ArtistID(d.name) + "-year",
                    ],
                    [d.name, `Aged ${d.age}`, `${d.finalYear}`]
                  ) +
                    PADDING) *
                    0.5
                })
              .attr(
                "y",
                e.offsetY -
                  1.25 * PADDING -
                  (Helpers.TextHeight(
                    "#" + Helpers.ArtistID(d.name) + "-name",
                    d.name
                  ) +
                    PADDING * 0.5) *
                    3
              )
            d3.select(scatterViz)
              .append("text")
              .attr(
                "x", function(){
                  let horizontalOffsetQ = 0
                  if((d.finalYear - newMinYear) / (newMaxYear - newMinYear) >= 0.8)
                  {
                    horizontalOffsetQ = -scatterWidth * 0.1
                  }
                  else if((d.finalYear - newMinYear) / (newMaxYear - newMinYear) <= 0.2)
                  {
                    horizontalOffsetQ = scatterWidth * 0.1
                  }
                  return e.offsetX + horizontalOffsetQ
                }
              )
              .attr(
                "y",
                e.offsetY -
                  (Helpers.TextHeight(
                    "#" + Helpers.ArtistID(d.name) + "-name",
                    d.name
                  ) +
                    PADDING * 0.5) *
                    3
              )
              .attr("fill", "black")
              .style("text-anchor", "middle")
              .classed("tempTextT", true)
              .attr("id", () => Helpers.ArtistID(d.name) + "-name")
              .style(
                "font-size",
                d.name.length >= 15 &&
                  (d.finalYear - newMinYear) / (newMaxYear - newMinYear) >= 0.8
                  ? attrFontSize * 0.52
                  : attrFontSize * 0.6
              )
              .text(`${d.name}`)
              .style("opacity", 0)
            d3.select(scatterViz)
              .append("text")
              .attr(
                "x", function(){
                  let horizontalOffsetQ = 0
                  if((d.finalYear - newMinYear) / (newMaxYear - newMinYear) >= 0.8)
                  {
                    horizontalOffsetQ = -scatterWidth * 0.1
                  }
                  else if((d.finalYear - newMinYear) / (newMaxYear - newMinYear) <= 0.2)
                  {
                    horizontalOffsetQ = scatterWidth * 0.1
                  }
                  return e.offsetX + horizontalOffsetQ
                }
              )
              .attr(
                "y",
                e.offsetY +
                  0.125 * PADDING -
                  (Helpers.TextHeight(
                    "#" + Helpers.ArtistID(d.name) + "-name",
                    d.name
                  ) +
                    PADDING * 0.5) *
                    2
              )
              .attr("fill", "black")
              .style("text-anchor", "middle")
              .classed("tempTextT", true)
              .style("font-size", attrFontSize * 0.6)
              .attr("id", () => Helpers.ArtistID(d.name) + "-age")
              .text(`Aged ${d.age}`)
              .style("opacity", 0)
            d3.select(scatterViz)
              .append("text")
              .attr(
                "x",function(){
                  let horizontalOffsetQ = 0
                  if((d.finalYear - newMinYear) / (newMaxYear - newMinYear) >= 0.8)
                  {
                    horizontalOffsetQ = -scatterWidth * 0.1
                  }
                  else if((d.finalYear - newMinYear) / (newMaxYear - newMinYear) <= 0.2)
                  {
                    horizontalOffsetQ = scatterWidth * 0.1
                  }
                  return e.offsetX + horizontalOffsetQ
                }
              )
              .attr(
                "y",
                e.offsetY -
                  (Helpers.TextHeight(
                    "#" + Helpers.ArtistID(d.name) + "-name",
                    d.name
                  ) +
                    PADDING * 0.5)
              )
              .attr("id", () => Helpers.ArtistID(d.name) + "-year")
              .attr("fill", "black")
              .style("text-anchor", "middle")
              .classed("tempTextT", true)
              .style("font-size", attrFontSize * 0.6)
              .text(`${d.finalYear}`)
              .style("opacity", 0)
            d3.selectAll(".tempTextT")
              .transition()
              .duration(fastTransitionDur)
              .style("opacity", 1.0)
            // Call function to update legend:
            OnMouseOverDots(d.typeOfDeath)
          }
        })
        .on("mouseout", function (e, d, boolL = dbBusy) {
          if (!boolL) {
            d3.selectAll(".allPoints")
              .transition()
              .duration(fastTransitionDur)
              .style("opacity", 1.0)
              .attr("stroke", (d, i) =>
                !deathTypeLocks[gtDeaths.indexOf(d.typeOfDeath)]
                  ? "none"
                  : "#3C1900"
              )
            // .attr('r', (d3.min([scatterWidth, scatterHeight]) * 0.015))
            d3.selectAll(".tempTextT")
              .transition()
              .duration(fastTransitionDur)
              .style("opacity", 0)
              .remove()
            // d3.selectAll('.tempTextT').transition().duration(fastTransitionDur + 10000).remove()
            OnMouseLeaveDots()
          }
        })

      // pointGroup
      //   .append("image")
      //   .classed("no-pointer-events", true)
      //   .attr("opacity", 0)
      //   .attr(
      //     "x",
      //     (d) =>
      //       horizYearScale(d.finalYear) +
      //       horizontalAdjust -
      //       (d3.min([scatterWidth, scatterHeight]) * 0.025) / 2
      //   )
      //   .attr(
      //     "y",
      //     (d) =>
      //       verticalAgeScale(d.age) +
      //       scatterHeight * 0.2 -
      //       (d3.min([scatterWidth, scatterHeight]) * 0.025) / 2
      //   )
      //   .attr("width", (d, i) => d3.min([scatterWidth, scatterHeight]) * 0.025)
      //   .attr("height", (d, i) => d3.min([scatterWidth, scatterHeight]) * 0.025)
      //   .attr(
      //     "href",
      //     (d) =>
      //       Config.server_url +
      //       allDeaths.filter((artist) => artist[0] == d.name)[0][1][0].thumbnail
      //   )

      // Appending axes
      scatterXAxisG = d3
        .select(scatterViz)
        .append("g")
        .classed("axis", true)
        .attr(
          "transform",
          `translate(${horizontalAdjust},${scatterHeight * 0.85})`
        )
        .call(
          scatterXAxis
            .ticks(scatterWidth <= 490 ? 8 : 13)
            .tickFormat(d3.format("d"))
        )
      scatterYAxisG = d3
        .select(scatterViz)
        .append("g")
        .classed("axis", true)
        .attr(
          "transform",
          `translate(${horizontalAdjust * 1.75},${scatterHeight * 0.2})`
        )
        .call(scatterYAxis.ticks(15).tickFormat(d3.format("d")))
      // Appending axes labels
      d3.select(scatterViz)
        .append("text")
        .attr("x", scatterWidth / 2)
        .attr("y", scatterHeight * 0.93)
        .attr("fill", "black")
        .style("text-anchor", "middle")
        .attr("font-weight", 700)
        .classed("axesBigLabel", true)
        .style("font-size", attrFontSize * 0.65)
        .text("Latest Year Alive")
        .style("opacity", 1.0)
      d3.select(scatterViz)
        .append("text")
        .attr("x", -scatterHeight / 2)
        .attr("y", 15)
        .attr("fill", "black")
        .attr("font-weight", 700)
        .style("text-anchor", "middle")
        .classed("axesBigLabel", true)
        .style("font-size", attrFontSize * 0.65)
        .text("Most Recent Age")
        .style("opacity", 1.0)
        .attr("transform", "rotate(-90)")
      // .attr('font-weight', d3.min([scatterHeight, scatterWidth]) * 0.6 )
    } else {
      console.error("Unable to load Artist Locations!")
    }

    console.log(scatterData)
    scatterData = scatterData
  }
</script>

<div
  id="container"
  class="inline-block relative align-top overflow-hidden"
  style="width: {width}px; height: {height}px; top: {topOffset > 50
    ? 50
    : topOffset * 0.9}px;"
>
  <svg
    class="inline-block absolute top-0 left-0"
    viewBox="0, 0, {width}, {height}"
    preserveAspectRatio="xMidYMid meet"
  >
    <g id="scatterViz" bind:this={scatterViz} transform="translate(0, 0)" />
    <g id="hidden-text" opacity="0">
      {#each scatterData as data}
        <text x="0" y="0" id={Helpers.ArtistID(data.name) + "-name"}
          >{data.name}</text
        >
        <text x="0" y="0" id={Helpers.ArtistID(data.name) + "-age"}
          >{`Aged ${data.age}`}</text
        >
        <text x="0" y="0" id={Helpers.ArtistID(data.name) + "-year"}
          >{`${data.finalYear}`}</text
        >
      {/each}
    </g>
  </svg>
</div>
