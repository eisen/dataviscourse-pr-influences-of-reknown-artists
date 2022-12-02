<script lang="ts">
  import * as d3 from "d3"
  import { Helpers, Types } from "$lib/utilities"
  import { createEventDispatcher } from "svelte"
  import { group, image } from "d3"

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
    ""
  ]

  let gtCentsMedium = [
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

  let gtCentsDeath = [
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
    "2000"
  ]

  let selectedG = []
  let gtCents = []
  let selectedColorScheme
  let centStatus

  let clickLock = false
  let centClicked = ''
  let clickLocks = []
  let clickedArcs = []

  // All of the data will be here:
  let groupedData = []

  let chordCentScale

  let chordClickedScale

  let buttonDurr = 250

  // let chordColorScale = d3
  //   .scaleOrdinal()
  //   .domain(d3.range(12))
  //   .range(Helpers.ColorScheme)

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

  const fastTransitionDur = 250
  const slowTransitionDur = 450

  // Hover Dispatches

  const OnMouseOverRibbons = (group: string, idx: number, cent: string) => {
    dispatch("highlight_chord_ribbon", {
      chordGroup: group,
      chordIdx: idx,
      chordTime: cent
    })
  }

  const OnMouseLeaveRibbons = (group: string, idx: number) => {
    dispatch("restore_chord_ribbon", {
      chordGroup: group,
      chordIdx: idx
    })
  }

  const OnMouseOverArcs = (group: string, centNum: number) => {
    dispatch("highlight_chord_group", {
      chordGroup: group,
      chordTimeNum: centNum
    })
  }

  const OnMouseLeaveArcs = (group: string) => {
    dispatch("restore_chord_group", {
      chordGroup: group,
    })
  }

  const OnMouseOverButtons = (time: string, groups: any) => {
    dispatch("highlight_chord_button", {
      chordTime: time,
      chordGroups: groups,
    })
  }

  const OnMouseLeaveButtons = (time: string) => {
    dispatch("restore_chord_button", {
      chordTime: time,
    })
  }
  
  // Click Dispatches

  const OnClickArcs = (group: string) => {
    dispatch("click_chord_by_arc", {
      chordGroup: group,
    })
  }

  const OnClickRibbons = (group: string, time: string) => {
    dispatch("click_chord_by_ribbon", {
      chordGroup: group,
      chordTime: time
    })
  }

  const OnClickButtons = (time: string, groups: any) => {
    dispatch("click_chord_by_century", {
      chordTime: time,
      chordGroups: groups
    })
  }

  // Response Functions

  export const ClickGrouping = (chordGroup: string) => {
    // ...
    console.log('Group click for: ' + chordGroup)
    clickedArcs[selectedG.indexOf(chordGroup)] = !clickedArcs[selectedG.indexOf(chordGroup)]
    console.log(clickedArcs)
  }

  export const ClickRibbon = (chordGroup: string, chordTime: string) => {
    // ...
    // console.log('Ribbon click for: ' + chordGroup + ', ' + chordTime)
  }

  export const ClickButton = (chordTime: string, chordGroups: any) => {
    // ...
    // console.log('Button click for: ' + chordTime + ', ')
    // console.log(chordGroups)
  }

  export const HighlightGrouping = (chordGroup: string, chordTimeNum: number) => {
    let groupsSelected = []
            let centSelected = Number(centClicked) / 100 - 10
            for (let k = 0; k < groupedData.length; k++) {
              if (groupedData[k].groups[centSelected] > 0) {
                groupsSelected.push(groupedData[k].slice)
              }
            }
    if(!clickLocks[chordTimeNum])
    {
      console.log("THE LEGEND")
        // Chaning Ribbon Opacity
        d3.selectAll(".ribbonPaths"+grouping)
          .transition()
          .duration(fastTransitionDur)
          .style("opacity", (d, i) => (clickLocks[d.cent])? 0.95: 0.1)
        d3.selectAll(".ribbonPaths_" + chordGroup)
          .transition()
          .duration(fastTransitionDur)
          .style("opacity", 0.95)
        // Changing Arc Opacity
        d3.selectAll(".arcPaths"+grouping)
          .transition()
          .duration(fastTransitionDur)
          .style("opacity", (d, i) => (groupsSelected.indexOf(d.slice) == -1 && clickedArcs[selectedG.indexOf(d.slice)] == false) ? 0.4 : 1.0 )
          .style("stroke", (d, i) => clickedArcs[selectedG.indexOf(d.slice)] == false ? "white" : "#cf8217")
          .style("stroke-width", 1)
        d3.selectAll("#arc_" + chordGroup)
          .transition()
          .duration(fastTransitionDur)
          .style("opacity", 1.0)
          .style("stroke", "#cf8217")
          // .style("stroke-width", 3)
    }
    else{
        // Changing Arc Opacity
        d3.selectAll(".arcPaths"+grouping)
          .transition()
          .duration(fastTransitionDur)
          .style("opacity", (d, i) => (groupsSelected.indexOf(d.slice) == -1 && clickedArcs[selectedG.indexOf(d.slice)] == false) ? 0.4 : 1.0 )
          .style("stroke", (d, i) => clickedArcs[selectedG.indexOf(d.slice)] == false ? 'white' : "#cf8217")
          .style("stroke-width", 1)
        d3.selectAll("#arc_" + chordGroup)
          .transition()
          .duration(fastTransitionDur)
          .style("opacity", 1.0)
          .style("stroke", "#cf8217")
          // .style("stroke-width", 3)
        
       // Chaning Ribbon Opacity
        d3.selectAll(".ribbonPaths"+grouping)
          .transition()
          .duration(fastTransitionDur)
          .style("opacity", (d, i) => (chordCentScale(d.cent) == centClicked) ? 0.95 : 0.1)
        d3.selectAll(".ribbonPaths_" + chordGroup)
          .transition()
          .duration(fastTransitionDur)
          .style("opacity", (d, i) => (chordCentScale(d.cent) == centClicked) ? 0.95 : 0.5)
    }
    

    // d3.selectAll('#arc_'+ chordGroup).transition().duration(fastTransitionDur).attr("outerRadius", chartRad * 1.05 )
    // d3.arc()
    //     .innerRadius(chartRad * 0.925)
    //     .outerRadius(chartRad * 1.05)
    //     .cornerRadius(3)
    // )
  }

  export const RestoreGrouping = (chordGroup: string, chordTimeNum: number) => {
    // Changing Arc Opacity
    let groupsSelected = []
      let centSelected = Number(centClicked) / 100 - 10
      for (let k = 0; k < groupedData.length; k++) {
        if (groupedData[k].groups[centSelected] > 0) {
          groupsSelected.push(groupedData[k].slice)
        }
      }
    if(!clickLocks[chordTimeNum])
    {
      // Restoring Ribbon Styling
      d3.selectAll(".ribbonPaths"+grouping)
        .transition()
        .duration(slowTransitionDur)
        .style("opacity", function(d, i){

      if(clickLocks.includes(true))
      {
        return clickLocks[d.cent] ? 0.95 : 0.1
      }
      return 0.5
      })
      // Restoring Arc Styliing
      // Changing Arc Opacity
      if(clickLocks.includes(true))
            {
              d3.selectAll(".arcPaths" + grouping)
                .transition()
                .duration(slowTransitionDur)
                .style("opacity", (d, i) => (groupsSelected.indexOf(d.slice) == -1 && clickedArcs[selectedG.indexOf(d.slice)] == false) ? 0.4 : 1.0 )
                .style("stroke", (d, i) => clickedArcs[selectedG.indexOf(d.slice)] == false ? 'white' : "#cf8217")
                .style("stroke-width", 1)
            }
            else{
              d3.selectAll(".arcPaths" + grouping)
                .transition()
                .duration(slowTransitionDur)
                .style("opacity", (d, i) => 1.0 )
                .style("stroke", (d, i) => clickedArcs[selectedG.indexOf(d.slice)] == false ? 'white' : "#cf8217")
                .style("stroke-width", 1)
            }
    }
    else{
      // Restoring Ribbon Styling
      d3.selectAll(".ribbonPaths_"+chordGroup)
        .transition()
        .duration(slowTransitionDur)
        .style("opacity", (d, i) => (chordCentScale(d.cent) == centClicked) ? 0.95 : 0.1)
      // Restoring Arc Styliing
      d3.selectAll(".arcPaths"+grouping)
        .transition()
        .duration(slowTransitionDur)
        .style("opacity", (d, i) => (groupsSelected.indexOf(d.slice) == -1 && clickedArcs[selectedG.indexOf(d.slice)] == false) ? 0.4 : 1.0)
        .style("stroke", (d, i) => clickedArcs[selectedG.indexOf(d.slice)] == false ? 'white' : "#cf8217")
        .style("stroke-width", 1)
    }

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
    // Keeping bold those ribbons connected to the clicked button:
      let groupsSelected = []
      let centSelected = Number(centClicked) / 100 - 10
      for (let k = 0; k < groupedData.length; k++) {
        if (groupedData[k].groups[centSelected] > 0) {
          groupsSelected.push(groupedData[k].slice)
        }
      }
      for(let i = 0; i < gtCents.length; i++)
      {
        if(centClicked != gtCents[i])
        {
          d3.selectAll(".ribbonPaths_" + gtCents[i] + '_' + grouping)
            .transition()
            .duration(fastTransitionDur)
            .style("opacity", 0.1)
        }
      }

      for(let i = 0; i < selectedG.length; i++)
      {
        if(groupsSelected.indexOf(selectedG[i]) == -1)
        {
          d3.selectAll("#arc_"+selectedG[i])
            .transition()
            .duration(fastTransitionDur)
            .style("opacity", (d, i) => clickedArcs[selectedG.indexOf(d.slice)] == false ? 0.4 : 1.0)
            .style("stroke", (d, i) => clickedArcs[selectedG.indexOf(d.slice)] == false ? 'white' : "#cf8217")
            .style("stroke-width", 1)
        }
      }
      // if(chordGroup == )
      d3.selectAll(".ribbonPaths_" + chordGroup)
        .transition()
        .duration(fastTransitionDur)
        .style("opacity", (d, i) => (chordCentScale(d.cent) == centClicked) ? 0.95 : 0.5)
    // Regular highlight
    d3.selectAll("#r_" + chordGroup + "_" + chordIdx)
      .transition()
      .duration(fastTransitionDur)
      .style("opacity", 0.95) //0.7
    // d3.selectAll('#r_'+ chordGroup + '_' + chordIdx).transition().duration(fastTransitionDur).style("stroke-width", 3)
    // Changing Arc Opacity
    d3.selectAll("#arc_" + chordGroup)
      .transition()
      .duration(fastTransitionDur)
      .style("opacity", 1.0)
      .style("stroke", (d, i) => clickedArcs[selectedG.indexOf(d.slice)] == false ? 'white' : "#cf8217")
      .style("stroke-width", 1)
  }

  export const RestoreRibbon = (chordGroup: string, chordIdx: number, chordTimeNum: number ) => {
    let groupsSelected = []
      let centSelected = Number(centClicked) / 100 - 10
      for (let k = 0; k < groupedData.length; k++) {
        if (groupedData[k].groups[centSelected] > 0) {
          groupsSelected.push(groupedData[k].slice)
        }
      }
    if(!clickLocks[chordTimeNum])
    {
    // Restoring Ribbon Styling
    if(clickLocks.includes(true))
    {
      d3.selectAll(".ribbonPaths"+grouping)
      .transition()
      .duration(slowTransitionDur)
      .style("opacity", (d, i) => (clickLocks[d.cent])? 0.95: 0.1)
      // d3.selectAll('.ribbonPaths').transition().duration(fastTransitionDur).style("stroke-width", 1)
      // Restoring Arc Styliing
      // Changing Arc Opacity
      d3.selectAll(".arcPaths"+grouping)
        .transition()
        .duration(slowTransitionDur)
        .style("opacity", function(d, i)
        { 
          if(groupsSelected.includes(d.slice))
          {
            return 1.0
          } 
          else if(clickedArcs[selectedG.indexOf(d.slice)] == true)
          { 
            return 1.0
          } 
          else {
            return 0.4
          }
        })
        .style("stroke", (d, i) => clickedArcs[selectedG.indexOf(d.slice)] == false ? 'white': "#cf8217")
        .style("stroke-width", 1)
    }
    else{
      d3.selectAll(".ribbonPaths"+grouping)
      .transition()
      .duration(slowTransitionDur)
      .style("opacity", (d, i) => 0.5)
      // d3.selectAll('.ribbonPaths').transition().duration(fastTransitionDur).style("stroke-width", 1)
      // Restoring Arc Styliing
      // Changing Arc Opacity
      d3.selectAll(".arcPaths"+grouping)
        .transition()
        .duration(slowTransitionDur)
        .style("opacity", 1.0)
        .style("stroke", (d, i) => clickedArcs[selectedG.indexOf(d.slice)] == false ? 'white' : "#cf8217")
        .style("stroke-width", 1)
    }
    // d3.selectAll('#arc_'+ chordGroup).transition().duration(fastTransitionDur).style('opacity', 1.0)
    // d3.selectAll('#r_'+ chordGroup).style('opacity', 0.95)
    }
    else{
      // Restore ribbon group:
      d3.selectAll('.ribbonPaths_'+chordGroup)
        .transition()
        .duration(slowTransitionDur)
        .style("opacity", (d, i) => (chordCentScale(d.cent) == centClicked) ? 0.95 : 0.1)

      for(let i = 0; i < selectedG.length; i++)
      {
        if(groupsSelected.indexOf(selectedG[i]) == -1)
        {
          d3.selectAll("#arc_"+selectedG[i])
            .transition()
            .duration(fastTransitionDur)
            .style("opacity", (d, i) => clickedArcs[selectedG.indexOf(d.slice)] == false ? 0.4: 1.0)
            .style("stroke", (d, i) => clickedArcs[selectedG.indexOf(d.slice)] == false ? 'white' : "#cf8217")
            .style("stroke-width", 1)
        }
      }
    }
  }

  export const HighlightButton = (chordTime: string, chordGroups: any) => {
      // ...
      // console.log('Button hover for: ' + chordTime + ', ')
  }

  export const RestoreButton = (chordTime: string) => {
      // ...
      // console.log('Button hover-leave for: ' + chordTime)
  }

  export const Initialize = (
    locs: Types.ArtistLocation[],
    groupLocs: Types.ArtistMedium[] | Types.ArtistData
  ) => {
    if (locs && groupLocs) {

      if (grouping == "Medium") {
        selectedG = gtMediums
        selectedColorScheme = Helpers.ColorSchemeMediums
        gtCents = gtCentsMedium
      } else {
        selectedG = gtDeaths
        selectedColorScheme = Helpers.ColorSchemeDeaths
        gtCents = gtCentsDeath
      }

      clickLocks = new Array(gtCents.length).fill(false)

      clickedArcs = new Array(selectedG.length).fill(false)

      centStatus = new Array(gtCents.length).fill(false)
      
      let chordColorScale = d3
        .scaleOrdinal()
        .domain(selectedG)
        .range(selectedColorScheme)
      
      chordCentScale = d3
        .scaleOrdinal()
        .domain(d3.range(gtCents.length))
        .range(gtCents)
      
      // chordClickedScale = d3.
      //   scaleLinear()
      //   .domain(gtCents)
      //   .range([0, gtCents.length])

      for (let i = 0; i < selectedG.length; i++) {
        groupedData.push({
          slice: selectedG[i],
          groups: new Array(gtCents.length).fill(0),
        })
      }

      allGroupings = d3.groups(groupLocs, (d) => d.artist)

      allLocations = d3.groups(locs, (d) => d.artist)
      // console.log(allLocations)

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

                  if(allLocations[i][1].length > 1)
                  {
                    groupedData[k].groups[
                    Math.floor(Number(allLocations[i][1][1].year) / 100) - 10
                     ] += 1
                    centStatus[
                    Math.floor(Number(allLocations[i][1][1].year) / 100) - 10
                    ] = true
                    break
                  }
                  else{
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
      }
      // console.log(centStatus)

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
        // console.log(groupedData)

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
          return chordColorScale(d.slice)
        })
        .style("stroke", (d, i) =>
          d3.rgb(chordColorScale(d.slice)).darker()
        )
        .style("stroke-width", 1)
        .attr("id", (d, i) => "r_" + d.slice + "_" + i)
        .attr("class", function (d, i) {
          return (
            "ribbonPaths_" +
            d.slice +
            " " +
            "ribbonPaths_" +
            chordCentScale(d.cent) + '_' + grouping
          )
        })
        // .classed(`ribbonPaths_${(d, i) => chordCentScale(d.cent)}`, true)
        .classed("ribbonPaths"+grouping, true)
        // .classed(function(d, i){ return 'ribbonPaths_' + d.slice }, true)
        .style("opacity", 0.5)
        .on("mouseover", function (e, d) {
          OnMouseOverRibbons(d.slice, d.defIndex, chordCentScale(d.cent))
          // d3.select(this).style('opacity', 0.95)
        })
        .on("mouseout", (e, d) => OnMouseLeaveRibbons(d.slice, d.defIndex, d.cent))
        .on('click', (e, d) => OnClickRibbons(d.slice, chordCentScale(d.cent)))

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
          return chordColorScale(d.slice)
        })
        .style("stroke", "white")
        .attr("d", arcGen)
        .attr("id", (d, i) => "arc_" + d.slice)
        .attr("class", (d, i) => "arcPaths_" + chordCentScale(d.cent))
        .classed("arcPaths"+grouping, true)
        .classed("cursor-pointer", true)
        .on("mouseover", (e, d) => OnMouseOverArcs(d.slice, d.cent))
        .on("mouseout", (e, d) => OnMouseLeaveArcs(d.slice, d.cent))
        .on("click", (e, d) => OnClickArcs(d.slice))

      // Century butttons:
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
            // Selecting groups of arcs, not just individual one
            let groupsSelected = []
            let mainGroupsSelected = []
            let centSelected = Number(d) / 100 - 10
            for (let k = 0; k < groupedData.length; k++) {
              if (groupedData[k].groups[centSelected] > 0) {
                groupsSelected.push(groupedData[k].slice)
              }
              if(groupedData[k].groups[gtCents.indexOf(centClicked)] > 0)
              {
                mainGroupsSelected.push(groupedData[k].slice)
              }
            }
          if(!clickLocks[gtCents.indexOf(d)])
          {
            let checkStat = centStatus[gtCents.indexOf(d)]

            // console.log(gtCents.indexOf(d))
            d3.select(this)
              .transition()
              .duration(buttonDurr)
              .attr("fill", checkStat ? "#cf8217" : "#00005C")
            // Highlighting connecting ribbons
            d3.selectAll(".ribbonPaths"+grouping)
              .transition()
              .duration(buttonDurr)
              .style("opacity", function(d, i){

                return clickLocks[d.cent] ? 0.95 : 0.1
            })

            d3.selectAll(".ribbonPaths_" + d + '_' +grouping)
              .transition()
              .duration(buttonDurr)
              .style("opacity", 0.95)
            // Focusing for Arcs
            // d3.selectAll(".arcPaths"+grouping)
            //   .transition()
            //   .duration(buttonDurr)
            //   .style("opacity", function(d, i){

            //     return clickLocks[d.cent] ? 1.0 : 0.4
            // })
            // for (let k = 0; k < groupsSelected.length; k++) {
              d3.selectAll(".arcPaths" + grouping)
                .transition()
                .duration(buttonDurr)
                .style("opacity", function(d, i){
                  if(groupsSelected.includes(d.slice) || mainGroupsSelected.includes(d.slice))
                  {
                    return 1.0
                  }
                  else if(clickedArcs[selectedG.indexOf(d.slice)] == true)
                  {
                    return 1.0
                  }
                  else{
                    return 0.4
                  }
                })
                .style("stroke", (d, i) => clickedArcs[selectedG.indexOf(d.slice)] == false ? 'white' : "#cf8217")
            // }
            OnMouseOverButtons(d, groupsSelected)
          }
          else if(centClicked == d)
          {

            // let groupsSelected = []
            // let centSelected = Number(d) / 100 - 10
            // for (let k = 0; k < groupedData.length; k++) {
            //   if (groupedData[k].groups[centSelected] > 0) {
            //     groupsSelected.push(groupedData[k].slice)
            //   }
            // }
            OnMouseOverButtons(d, groupsSelected)
          }
        })
        .on("mouseout", function (e, d) {
          if(!clickLocks[gtCents.indexOf(d)])
          {
            // console.log("hmmmmmmmmmmmmmmmm")
            d3.select(this)
            .transition()
            .duration(buttonDurr)
            .attr("fill", "#00005C")
            // Highlighting connecting ribbons
            d3.selectAll(".ribbonPaths"+grouping)
            .transition()
            .duration(buttonDurr)
            .style("opacity", function(d, i){

                if(clickLocks.includes(true))
                {
                  return clickLocks[d.cent] ? 0.95 : 0.1
                }
                return 0.5
            })
            // Focusing for Arcs
            // d3.selectAll(".arcPaths"+grouping)
            // .transition()
            // .duration(buttonDurr)
            // .style("opacity", 1.0)
            let groupsSelected = []
            let centSelected = Number(centClicked) / 100 - 10
            for (let k = 0; k < groupedData.length; k++) {
              if (groupedData[k].groups[centSelected] > 0) {
                groupsSelected.push(groupedData[k].slice)
              }
            }

            // for (let k = 0; k < groupsSelected.length; k++) {
            if(clickLocks.includes(true))
            {
              d3.selectAll(".arcPaths" + grouping)
                .transition()
                .duration(buttonDurr)
                .style("opacity", (d, i) => (groupsSelected.indexOf(d.slice) == -1 && clickedArcs[selectedG.indexOf(d.slice)] == false) ? 0.4 : 1.0 )
                .style("stroke", (d, i) => clickedArcs[selectedG.indexOf(d.slice)] == false ? 'white' : "#cf8217")
            }
            else{
              d3.selectAll(".arcPaths" + grouping)
                .transition()
                .duration(buttonDurr)
                .style("opacity", (d, i) => 1.0 )
                .style("stroke", (d, i) => clickedArcs[selectedG.indexOf(d.slice)] == false ? 'white' : "#cf8217")
            }
            // }
            OnMouseLeaveButtons(d)
          }
          else if(centClicked == d)
          {
            OnMouseLeaveButtons(d)
          }          
        })
        .on('click', function(e, d) {
          if(centStatus[gtCents.indexOf(d)])
          {
            let groupsSelected = []
            let centSelected = Number(d) / 100 - 10
           for (let k = 0; k < groupedData.length; k++) {
              if (groupedData[k].groups[centSelected] > 0) {
                groupsSelected.push(groupedData[k].slice)
              }
            }
            OnClickButtons(d, groupsSelected)
            if(!clickLocks[gtCents.indexOf(d)])
            {
              d3.select(this).transition()
              .duration(buttonDurr).attr("fill", '#3C1900')
              d3.select('#centText_'+d+'_'+grouping).transition()
              .duration(buttonDurr).attr("fill", "#cf8217")//'#3C1900'
              if(clickLocks.includes(true))
              {
                d3.select('#centRect_'+centClicked+'_'+grouping).transition()
                .duration(buttonDurr).attr("fill", '#00005C')
                d3.select('#centText_'+centClicked+'_'+grouping).transition()
                .duration(buttonDurr).attr("fill", "white")//'#3C1900'
              }
              
              // console.log(chordCentScale.invert(d))
              if(centClicked != '')
              {
                clickLocks[gtCents.indexOf(centClicked)] = false
              }
              clickLocks[gtCents.indexOf(d)] = true

              centClicked = d
              d3.selectAll(".ribbonPaths"+grouping)
              .transition()
              .duration(buttonDurr)
              .style("opacity", function(d, i){

                return clickLocks[d.cent] ? 0.95 : 0.1
            })
            d3.selectAll(".arcPaths" + grouping)
                .transition()
                .duration(buttonDurr)
                .style("opacity", (d, i) => (groupsSelected.includes(d.slice) || clickedArcs[selectedG.indexOf(d.slice)] == true) ? 1.0: 0.4)
            }
            else{

              d3.select(this).transition()
              .duration(buttonDurr).attr("fill", "#cf8217")
              d3.select('#centText_'+d+'_'+grouping).transition()
              .duration(buttonDurr).attr("fill", "white")//'#3C1900'
              clickLocks[gtCents.indexOf(d)] = false
              centClicked = ''
            }
          }
          // console.log(clickLocks)s
        })
        .classed("centRect"+grouping, true)
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
        .attr("id", (d, i) => "centText_" + d + '_' + grouping)
        .on("mouseover", function (e, d) {
                      // Selecting groups of arcs, not just individual one
                      let groupsSelected = []
            let mainGroupsSelected = []
            let centSelected = Number(d) / 100 - 10
            for (let k = 0; k < groupedData.length; k++) {
              if (groupedData[k].groups[centSelected] > 0) {
                groupsSelected.push(groupedData[k].slice)
              }
              if(groupedData[k].groups[gtCents.indexOf(centClicked)] > 0)
              {
                mainGroupsSelected.push(groupedData[k].slice)
              }
            }
          if(!clickLocks[gtCents.indexOf(d)])
          {
            let checkStat = centStatus[gtCents.indexOf(d)]

            // console.log(gtCents.indexOf(d))
            d3.select('#centRect_'+d+'_'+grouping)
              .transition()
              .duration(buttonDurr)
              .attr("fill", checkStat ? "#cf8217" : "#00005C")
            // Highlighting connecting ribbons
            d3.selectAll(".ribbonPaths"+grouping)
              .transition()
              .duration(buttonDurr)
              .style("opacity", function(d, i){

                return clickLocks[d.cent] ? 0.95 : 0.1
            })

            d3.selectAll(".ribbonPaths_" + d + '_' +grouping)
              .transition()
              .duration(buttonDurr)
              .style("opacity", 0.95)
            // Focusing for Arcs
            // d3.selectAll(".arcPaths"+grouping)
            //   .transition()
            //   .duration(buttonDurr)
            //   .style("opacity", function(d, i){

            //     return clickLocks[d.cent] ? 1.0 : 0.4
            // })
            // for (let k = 0; k < groupsSelected.length; k++) {
              d3.selectAll(".arcPaths" + grouping)
                .transition()
                .duration(buttonDurr)
                .style("opacity", function(d, i){
                  if(groupsSelected.includes(d.slice) || mainGroupsSelected.includes(d.slice))
                  {
                    return 1.0 
                  } 
                  else if(clickedArcs[selectedG.indexOf(d.slice)] == true)
                  {
                    return 1.0
                  }
                  else{
                    return 0.4
                  }
                })
                .style("stroke", (d, i) => clickedArcs[selectedG.indexOf(d.slice)] == false ? 'white' : "#cf8217")
            // }
            OnMouseOverButtons(d, groupsSelected)
          }
          else if(centClicked == d)
          {

            // let groupsSelected = []
            // let centSelected = Number(d) / 100 - 10
            // for (let k = 0; k < groupedData.length; k++) {
            //   if (groupedData[k].groups[centSelected] > 0) {
            //     groupsSelected.push(groupedData[k].slice)
            //   }
            // }
            OnMouseOverButtons(d, groupsSelected)
          }
        })
        .on("mouseout", function (e, d) {
          if(!clickLocks[gtCents.indexOf(d)])
          {
            // console.log("hmmmmmmmmmmmmmmmm")
            d3.select('#centRect_'+d+'_'+grouping)
            .transition()
            .duration(buttonDurr)
            .attr("fill", "#00005C")
            // Highlighting connecting ribbons
            d3.selectAll(".ribbonPaths"+grouping)
            .transition()
            .duration(buttonDurr)
            .style("opacity", function(d, i){

                if(clickLocks.includes(true))
                {
                  return clickLocks[d.cent] ? 0.95 : 0.1
                }
                return 0.5
            })
            // Focusing for Arcs
            // d3.selectAll(".arcPaths"+grouping)
            // .transition()
            // .duration(buttonDurr)
            // .style("opacity", 1.0)
            let groupsSelected = []
            let centSelected = Number(centClicked) / 100 - 10
            for (let k = 0; k < groupedData.length; k++) {
              if (groupedData[k].groups[centSelected] > 0) {
                groupsSelected.push(groupedData[k].slice)
              }
            }

            // for (let k = 0; k < groupsSelected.length; k++) {
            if(clickLocks.includes(true))
            {
              d3.selectAll(".arcPaths" + grouping)
                .transition()
                .duration(buttonDurr)
                .style("opacity", (d, i) => (groupsSelected.indexOf(d.slice) == -1 && clickedArcs[selectedG.indexOf(d.slice)] == false) ? 0.4 : 1.0 )
            }
            else{
              d3.selectAll(".arcPaths" + grouping)
                .transition()
                .duration(buttonDurr)
                .style("opacity", (d, i) => 1.0 )
            }
            // }
            OnMouseLeaveButtons(d)
          }
          else if(centClicked == d)
          {
            OnMouseLeaveButtons(d)
          } 
        })
       .on('click', function(e, d) {
        if(centStatus[gtCents.indexOf(d)])
          {
            let groupsSelected = []
            let centSelected = Number(d) / 100 - 10
           for (let k = 0; k < groupedData.length; k++) {
              if (groupedData[k].groups[centSelected] > 0) {
                groupsSelected.push(groupedData[k].slice)
              }
            }
            OnClickButtons(d, groupsSelected)
            if(!clickLocks[gtCents.indexOf(d)])
            {
              d3.select('#centRect_'+d+'_'+grouping).transition()
              .duration(buttonDurr).attr("fill", '#3C1900')
              d3.select(this).transition()
              .duration(buttonDurr).attr("fill", "#cf8217")//'#3C1900'
              if(clickLocks.includes(true))
              {
                d3.select('#centRect_'+centClicked+'_'+grouping).transition()
                .duration(buttonDurr).attr("fill", '#00005C')
                d3.select('#centText_'+centClicked+'_'+grouping).transition()
                .duration(buttonDurr).attr("fill", "white")//'#3C1900'
              }
              
              // console.log(chordCentScale.invert(d))
              if(centClicked != '')
              {
                clickLocks[gtCents.indexOf(centClicked)] = false
              }
              clickLocks[gtCents.indexOf(d)] = true

              centClicked = d
              d3.selectAll(".ribbonPaths"+grouping)
              .transition()
              .duration(buttonDurr)
              .style("opacity", function(d, i){

                return clickLocks[d.cent] ? 0.95 : 0.1
            })
            d3.selectAll(".arcPaths" + grouping)
                .transition()
                .duration(buttonDurr)
                .style("opacity", function(d, i){
                  if(groupsSelected.includes(d.slice)){
                    return 1.0
                   } 
                   else if(clickedArcs[selectedG.indexOf(d.slice)] == true)
                   {
                    return 1.0
                   }
                   else{
                    return 0.4
                  }
                })
            }
            else{

              d3.select(this).transition()
              .duration(buttonDurr).attr("fill", "white")
              d3.select('#centRect_'+d+'_'+grouping).transition()
              .duration(buttonDurr).attr("fill", "#cf8217")//'#3C1900'
              clickLocks[gtCents.indexOf(d)] = false
              centClicked = ''
            }
          }
          // console.log(clickLocks)
        })
      text
        .append("tspan")
        .attr("baseline-shift", "super")
        .attr("font-size", attrFontSize * 0.6)
        .text(function(d, i) {
          if(d == '2000')
          {
            return "ST"
          }
          return "TH"
        })
      
      // Group for title text that only gets written once
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
