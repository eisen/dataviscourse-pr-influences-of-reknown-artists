<script lang="ts">
  import * as d3 from 'd3'
  import { Types } from '$lib/utilities'
  import { attr, once } from 'svelte/internal'

  let grouping = 'Century'
  let attribute = 'Artistic Mediums'

  export let width: number
  export let height: number

  // Sizing dependent on window
  $: chordCHeight = height * 0.45 > 275 ? 275 : height * 0.45
  $: chartRad = width * 0.45 > 390 ? 390 : width * 0.45 // Max size for more possible screens
//   $: angleD = (chordCHeight / 270) * 90 - 5
  $: angleD = (chordCHeight / 270) * 90 - 10
  $: rectWidth = (chartRad / 370) * 120
  $: attrFontSize = height <= width ? (chordCHeight / 270) * 15 : (chartRad / 370) * 15
  $: titleFontSize = height <= width ? (chordCHeight / 170) * 20 : (chartRad / 270) * 20

  let svg: SVGSVGElement
  let chordViz: SVGGElement

  let allLocations: [string, Types.ArtistLocation[]][]
  $: allLocations = []

  let allMediums: [string, Types.ArtistMedium[]][]
  $: allMediums = []

  let chordColors = [
    'rgb(211, 157, 69)',
    '#ff69b4',
    '#ffe4c4',
    'rgb(20, 57, 59)',
    'rgb(163, 0, 48)',
    'rgb(222, 182, 254)',
    '#1e90ff',
    '#00ff00',
    '#7624C2',
    'rgb(195, 72, 54)',
    'rgb(52, 25, 58)',
    'rgb(252, 179, 75)',
  ]

  let gtMediums = [
    'sculptor',
    'painter',
    'printmaker',
    'draughtsman',
    'photography',
    'film',
    'watercolourist',
    'oilpainter',
    'illustrator',
    'muralist',
    'architect',
    'ink',
    'ceramicist',
    'calligrapher',
    'engraving',
  ]
  let medN = gtMediums.length

  let chordMediumScale = d3.scaleOrdinal().domain(gtMediums).range(d3.range(medN))

  let centuryGroupedData = [
    { cent: 1000, people: [], nums: [1], death: [0], meds: new Array(medN).fill(0) },
    { cent: 1100, people: [], nums: [1], death: [1], meds: new Array(medN).fill(0) },
    { cent: 1200, people: [], nums: [1], death: [2], meds: new Array(medN).fill(0) },
    { cent: 1300, people: [], nums: [1], death: [3], meds: new Array(medN).fill(0) },
    { cent: 1400, people: [], nums: [1], death: [4], meds: new Array(medN).fill(0) },
    { cent: 1500, people: [], nums: [1], death: [0], meds: new Array(medN).fill(0) },
    { cent: 1600, people: [], nums: [1], death: [1], meds: new Array(medN).fill(0) },
    { cent: 1700, people: [], nums: [1], death: [2], meds: new Array(medN).fill(0) },
    { cent: 1800, people: [], nums: [1], death: [3], meds: new Array(medN).fill(0) },
    { cent: 1900, people: [], nums: [1], death: [4], meds: new Array(medN).fill(0) },
    // {cent: 2000, people: [], nums: [1], death: [0], meds: new Array(medN).fill(0)}, // We probably will have 0 entries for this
  ]

  let chordColorScale = d3.scaleOrdinal().domain(d3.range(12)).range(chordColors)

  function ribbonBasket(d) {
    var buffer,
      sr = chartRad * 0.9125, // source radius
      sa0 = (d.startAngle * 180) / Math.PI - 90, // start angle source
      sa1 = (d.endAngle * 180) / Math.PI - 90 // end angle source

    var context = null
    if (!context) {
      context = buffer = d3.path()
    }
    context.moveTo(sr * Math.cos((sa0 * Math.PI) / 180), sr * Math.sin((sa0 * Math.PI) / 180)) // Good
    context.arc(0, 0, sr, (sa0 * Math.PI) / 180, (sa1 * Math.PI) / 180)
    var hr = 10

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
      adjustH = Math.abs(sa1 - sa0) * 0.1 * 10
    } else {
      adjustH = -1 * (Math.abs(sa1 - sa0) * 0.1 * 10)
    }
    let horTCoord = horT / 2 + adjustH

    let argg = []
    for (let m = 0; m < gtMediums.length; m++) {
      argg.push(m * ((chordCHeight * 2 + 0.05 * chordCHeight) / gtMediums.length) - chordCHeight * 0.9125)
    }

    context.quadraticCurveTo(horCoord, vertCoord, d.half == 0 ? rectWidth / 2 : -rectWidth / 2, argg[d.death]) // to

    context.quadraticCurveTo(
      horTCoord,
      vertTCoord,
      sr * Math.cos((sa0 * Math.PI) / 180),
      sr * Math.sin((sa0 * Math.PI) / 180)
    ) //back

    if (buffer) return (context = null), buffer + '' || null
  }

  export const Initialize = (locs: Types.ArtistLocation[], medLocs: Types.ArtistMedium[]) => {
    if (locs && medLocs) {
      allMediums = d3.groups(medLocs, d => d.artist)

      allLocations = d3.groups(locs, d => d.artist)

      for (let i = 0; i < allLocations.length; i++) {
        centuryGroupedData[Math.floor(Number(allLocations[i][1][0].year) / 100) - 10].nums[0]++
        centuryGroupedData[Math.floor(Number(allLocations[i][1][0].year) / 100) - 10].people.push(allLocations[i][0])
      }
      for (let i = 0; i < centuryGroupedData.length; i++) {
        for (let j = 0; j < centuryGroupedData[i].people.length; j++) {
          for (let k = 0; k < allMediums.length; k++) {
            if (centuryGroupedData[i].people[j] == allMediums[k][0]) {
              for (let l = 0; l < allMediums[k][1].length; l++) {
                centuryGroupedData[i].meds[chordMediumScale(allMediums[k][1][l].medium)] += 1
              }
              break
            }
          }
        }
      }

      let mediumsTotalEntries = 0
      for (let i = 0; i < centuryGroupedData.length; i++) {
        for (let j = 0; j < centuryGroupedData[i].meds.length; j++) {
          mediumsTotalEntries += centuryGroupedData[i].meds[j]
        }
      }

      let arcGen = d3
        .arc()
        .innerRadius(chartRad * 0.925)
        .outerRadius(chartRad)
        .cornerRadius(3)

      d3.select(chordViz).datum(function (d, i) {
        let sortedArr = centuryGroupedData.sort(function (a, b) {
          let totA = 0
          let totB = 0
          for (let i = 0; i < a.nums.length; i++) {
            totA += a.nums[i]
          }
          for (let i = 0; i < b.nums.length; i++) {
            totB += b.nums[i]
          }
          if (totA > totB) {
            return 1
          } else if (totB > totA) {
            return -1
          }
          return 0
        })
        let retArr = []
        let n = centuryGroupedData.length
        let angleR = (angleD * Math.PI) / 180
        let totalAngle = 2 * angleD
        let totalAngleR = (totalAngle * Math.PI) / 180
        let unitAngleR = totalAngleR / mediumsTotalEntries
        // let unitAngleR = angleR / mediumsTotalEntries; // Old way just in case
        let padR = (chordCHeight / 270) * 0.02
        let colorIndex = -1
        let forwardAngle = (Math.PI - angleR) / 2
        let forwardAngleD = (Math.PI - angleR) / 2
        let runningRTally = 0.0
        let otherSide = false;

        // placeholder for data gaps
        sortedArr[0].meds[5] = 1
        sortedArr[1].meds[11] = 1

        console.log(centuryGroupedData)

        let padCheck = false
        for (let i = 0; i < n; i++) {
          colorIndex++
          padCheck = true
          for (let j = 0; j < sortedArr[i].meds.length; j++) {
            if (sortedArr[i].meds[j] > 0) {
              let currSegment = sortedArr[i].meds[j]
              runningRTally += unitAngleR * currSegment
              if (runningRTally < (angleD * Math.PI) / 180) {
                retArr.push({
                  index: colorIndex,
                  startAngle: padCheck && i > 0 ? padR + forwardAngle : forwardAngle,
                  endAngle:
                    padCheck && i > 0
                      ? padR + unitAngleR * currSegment + forwardAngle
                      : unitAngleR * currSegment + forwardAngle,
                  value: 29630,
                  nums: sortedArr[i].meds[j],
                  death: j,
                  colorIndex: colorIndex,
                  half: 0,
                  cent: sortedArr[i].cent,
                  addLabel: (padCheck) ? true : false
                })
                forwardAngle += padCheck && i > 0 ? padR + unitAngleR * currSegment : unitAngleR * currSegment
              } else {
                let baseTerm = 2 * Math.PI
                retArr.push({
                  index: colorIndex,
                  startAngle:
                    padCheck && i > 0
                      ? baseTerm - padR - unitAngleR * currSegment - forwardAngleD
                      : baseTerm - unitAngleR * currSegment - forwardAngleD,
                  endAngle: padCheck && i > 0 ? baseTerm - padR - forwardAngleD : baseTerm - forwardAngleD,
                  value: 29630,
                  nums: sortedArr[i].meds[j],
                  death: j,
                  colorIndex: colorIndex,
                  half: 1,
                  cent: sortedArr[i].cent,
                  addLabel: (padCheck || !otherSide) ? true : false
                })
                if(!otherSide)
                {
                    otherSide = true
                }
                forwardAngleD += padCheck && i > 0 ? padR + unitAngleR * currSegment : unitAngleR * currSegment
              }
              if (padCheck) {
                padCheck = false
              }
            }
          }
        }
        return retArr
      })
      let deathArr = ['Natural Causes', 'Unknown', 'Heart Attack', 'Suicide', 'Currently Alive']
      let mediumArr = ['Water Color', 'Oil Paint', 'Pastel', 'Sculptures', 'Acrylic']

      // Ribbons
      let ribbons = d3
        .select(chordViz)
        .append('g')
        .attr('class', 'ribbons')
        .selectAll('path')
        .data(chords => chords)
        .enter()
        .append('path')
        .attr('d', ribbonBasket)
        .style('fill', function (d) {
          return chordColorScale(d.colorIndex)
        })
        .style('stroke', (d, i) => d3.rgb(chordColorScale(d.colorIndex)).darker())
        .style('opacity', 0.5)

      // Group for everything but the ribbons
      let groupChord = d3
        .select(chordViz)
        .append('g')
        .attr('class', 'groups')
        .selectAll('g')
        .data(chords => chords)
        .enter()
        .append('g')
      groupChord
        .append('path')
        .style('fill', function (d, i) {
          return chordColorScale(d.index)
        })
        .style('stroke', 'white')
        .attr('d', arcGen)
      groupChord
        .append('g')
        .attr('class', 'groups')
        .selectAll('g')
        .data(chords => chords)
        .enter()
        .append('g')
      groupChord
        .append('rect')
        .data(gtMediums)
        .attr('x', (-1 * rectWidth) / 2)
        .attr(
          'y',
          (d, i) =>
            i * ((chordCHeight * 2 + +(0.05 * chordCHeight)) / gtMediums.length) -
            chordCHeight * 0.9 -
            0.05 * chordCHeight
        )
        .attr('rx', 6)
        .attr('ry', 6)
        .attr('width', rectWidth)
        .attr('height', 0.1 * chordCHeight)
        .attr('fill', '#00005C')
        .attr('opacity', 1.0)
      groupChord
        .append('text')
        .data(gtMediums)
        .attr('x', 0)
        .attr(
          'y',
          (d, i) => i * ((chordCHeight * 2 + +(0.05 * chordCHeight)) / gtMediums.length) - chordCHeight * 0.875
        )
        .attr('fill', 'white')
        .style('text-anchor', 'middle')
        .style('font-size', attrFontSize)
        .text(d => d.charAt(0).toUpperCase() + d.slice(1))
    
    let srT = chartRad * 0.9125
      groupChord
          .append('text')
          .data(chords=>chords)
          .attr('x', function(d, i){
            let retX = (d.half == 0) ? srT * Math.cos((((d.endAngle * 180) / Math.PI - 90) * Math.PI) / 180) : srT * Math.cos((((d.startAngle * 180) / Math.PI - 90) * Math.PI) / 180)
            if(d.half == 0)
            {
                retX += 65 * (width / 930)
            }
            else{
                retX -= 65 * (width / 930)
            }
            if(d.addLabel)
            {
                console.log('Angle: ', (d.startAngle * 180) / Math.PI - 90)
            }
            return retX
          })
          .attr('y', function(d, i)
          {
            let retY = (d.half == 0) ? srT * Math.sin((((d.endAngle * 180) / Math.PI - 90) * Math.PI) / 180) : srT * Math.sin((((d.startAngle * 180) / Math.PI - 90) * Math.PI) / 180)
            if(Math.abs(((d.startAngle * 180) / Math.PI - 90) - ((d.endAngle * 180) / Math.PI - 90)) < 1.5 * (((2 * angleD)) / mediumsTotalEntries))
            {
                retY -= 15
            }
            return retY;
          })
          .attr('fill', 'black')
        //   .attr('transform', function(d, i){
        //     return 'rotate(' + (1) + ')'
        // })
          .style('text-anchor', 'middle')
          .style('font-size', attrFontSize)
          .text(d => (d.addLabel) ? d.cent : '')
    //   Placeholders / title
      let onceGroupChord = d3.select(chordViz).append('g').attr('class', 'groups')
      onceGroupChord
        .append('text')
        .attr('x', 0)
        .attr('y', (chordCHeight / 270) * -270)
        .style('text-anchor', 'middle')
        .style('font-size', titleFontSize > 20 ? 20 : titleFontSize)
        .text('Distribution of Artists by ' + grouping + ' Over ' + attribute)
      onceGroupChord
        .append('rect')
        .attr('x', chartRad * 0.17 + 125)
        .attr('y', (chordCHeight / 270) * 300 - 15)
        .attr('width', rectWidth * 0.5)
        .attr('height', 0.05 * chordCHeight)
        .attr('fill', 'white')
        .attr('stroke', 'black')
      onceGroupChord
        .append('rect')
        .attr('x', -chartRad * 0.7 + 120)
        .attr('y', (chordCHeight / 270) * 300 - 15)
        .attr('width', rectWidth * 0.5)
        .attr('height', 0.05 * chordCHeight)
        .attr('fill', 'white')
        .attr('stroke', 'black')
      onceGroupChord
        .append('text')
        .attr('x', chartRad * 0.17)
        .attr('y', (chordCHeight / 270) * 300 -5 )
        .style('font-size', (titleFontSize - 6) > 14 ? 14 : titleFontSize - 6)
        .text('Select an Attribute:')
      onceGroupChord
        .append('text')
        .attr('x', -chartRad * 0.7)
        .attr('y', (chordCHeight / 270) * 300 -5)
        .style('font-size', (titleFontSize - 6) > 14 ? 14 : titleFontSize - 6)
        .text('Select a Grouping:')
    } else {
      console.error('Unable to load Artist Locations!')
    }
  }
</script>

<div
  id="container"
  class="inline-block relative align-top overflow-hidden"
  style="width: {width}px; height: {height}px;"
>
  <svg class="inline-block absolute top-0 left-0" viewBox="0, 0, {width}, {height}" preserveAspectRatio="xMidYMid meet">
    <g id="chordViz" bind:this={chordViz} transform="translate({width / 2}, {chordCHeight * 1.1})" />
  </svg>
</div>
