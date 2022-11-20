<script lang="ts">
  import * as d3 from 'd3'
  import { json } from 'd3-fetch'
  import { feature } from 'topojson'
  import { onMount } from 'svelte'
  import { Config } from '$lib/utilities'

  let grouping = 'century'
  let attribute = 'medium'

  export let width: number
  export let height: number

  $: chordCHeight = ((height * 0.45) > 275) ? 275 : (height * 0.45)
  $: chartRad = ((width * 0.45) > 390) ? 390 : (width * 0.45) // Max size for more possible screens
  $: angleD = (chordCHeight / 270) * 90 - 5
  $: rectWidth = (chartRad / 370) * 120
  $: attrFontSize = (height <= width) ? ((chordCHeight / 270) * 15) : ((chartRad / 370) * 15)

  type ArtistLocation = {
    artist: string
    year: number
    city: string
    country: string
    lat: number
    lon: number
  }

  type ArtistMedium = {
    artist: string
    medium: string
  }

  type PossibleMediums = {
    sculptor: number
    painter: number
    printmaker: number
    draughtsman: number
    photography: number
    film: number
    watercolourist: number
    oilpainter: number
    illustrator: number
    muralist: number
    architect: number
    ink: number
    ceramicist: number
    caligrapher: number
    engraving: number
  }

  let svg: SVGSVGElement
  let chordViz: SVGGElement

  let data: any
  $: data = null

  let allLocations: [string, ArtistLocation[]][]
  $: allLocations = []
  let locations: [string, ArtistLocation[]][]
  $: locations = []
  let allMediums: [string, ArtistMedium[]][]
  $: allMediums = []

  let mediumTypes: [PossibleMediums[]][]
  $: mediumTypes = []

  let oldestYear: number | undefined
  $: oldestYear = 0
  let youngestYear: number | undefined
  $: youngestYear = 2100

  let chordColors = [
    'rgb(211, 157, 69)',
    '#ff69b4',
    '#ffe4c4',
    // 'rgb(19, 11, 75)',
    'rgb(20, 57, 59)',
    'rgb(163, 0, 48)',
    'rgb(222, 182, 254)',
    // 'rgb(20, 4, 61)',
    '#1e90ff',
    // 'rgb(62, 40, 73)',
    '#00ff00',
    // 'rgb(178, 73, 81)',
    // 'rgb(142, 45, 49)',
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
    // {cent: 2000, people: [], nums: [1], death: [0], meds: new Array(medN).fill(0)},
  ]

  let chordColorScale = d3.scaleOrdinal().domain(d3.range(12)).range(chordColors)
  // let chordGen = chord().padAngle(0.05);
  // let ribbonGen = ribbon().radius(140);

  const filterLocations = (year: number) => {
    locations = allLocations.filter(([, locations]) => {
      if (locations.length > 1) {
        return locations[0].year <= year && locations[1].year > year
      } else {
        return locations[0].year <= year
      }
    })
  }

  function ribbonBasket(d) {
    var buffer,
      // s = source.apply(this, arguments),
      // t = target.apply(this, arguments),
      ap = 0.02,
      // argv = slice.call(arguments),
      // sr = 300.0, // source radius
      sr = chartRad * 0.9125, // source radius
      middleDist = 40,
      middleRad = 0,
      sa0 = 13, // start angle source
      sa1 = 35, // end angle source
      sa0 = (d.startAngle * 180) / Math.PI - 90, // start angle source
      sa1 = (d.endAngle * 180) / Math.PI - 90, // end angle source
      tr = 300.0, // Target radius
      ta0 = 180,
      ta1 = Math.PI * 1.25
    var context = null
    if (!context) {
      context = buffer = d3.path()
    }
    context.moveTo(sr * Math.cos((sa0 * Math.PI) / 180), sr * Math.sin((sa0 * Math.PI) / 180)) // Good
    context.arc(0, 0, sr, (sa0 * Math.PI) / 180, (sa1 * Math.PI) / 180)
    var hr = 10
    var tr2 = tr - hr
    var ta2 = (ta0 + ta1) / 2

    // calc coords for control point
    // let missAngle = 180 - 90 - (90-(((sa1 - sa0) * 0.1) + sa0));
    let missAngle
    let mMult = (sa1 > 0 && sa1 < 90) || (sa1 < -90 && sa1 > -180) ? 0.4 : 1.1
    missAngle = 180 - 90 - (90 - (Math.abs(sa1 - sa0) * mMult + sa0))
    let vert = sr * Math.sin((missAngle * Math.PI) / 180)
    let hor = sr * Math.cos((missAngle * Math.PI) / 180)
    // let vertCoord = (sa1 > 90 || sa1 < -90) ? vert/2 + ((Math.abs(sa1-sa0) * 0.1) * 5) : vert/2 + ((Math.abs(sa1-sa0) * 0.1) * 5);
    // let horCoord = (sa1 > 90 || sa1 < -90) ? hor/2 + ((Math.abs(sa1-sa0) * 0.1) * 10) : hor/2 + ((Math.abs(sa1-sa0) * 0.1) * 10);
    let vertCoord = vert / 2 + Math.abs(sa1 - sa0) * 0.1 * 5
    let adjustHi = -1
    if (sa1 > -90 && sa1 < 90) {
      adjustHi = Math.abs(sa1 - sa0) * 0.1 * 10
    } else {
      adjustHi = -1 * (Math.abs(sa1 - sa0) * 0.1 * 10)
    }
    let horCoord = hor / 2 + adjustHi

    // second control point
    // let missTangle = 180 - 90 - (90-(sa0 - ((sa1 - sa0) * 0.6)));
    let missTangle
    let mMultT = (sa1 > 0 && sa1 < 90) || (sa1 < -90 && sa1 > -180) ? 1.1 : 0.4
    missTangle = 180 - 90 - (90 - (sa1 - Math.abs(sa1 - sa0) * mMultT))
    let vertT = sr * Math.sin((missTangle * Math.PI) / 180)
    let horT = sr * Math.cos((missTangle * Math.PI) / 180)
    // let vertTCoord = (sa1 > 90 || sa1 < -90) ? vertT/2 + ((Math.abs(sa1-sa0) * 0.1) * 5) : vertT/2 + ((Math.abs(sa1-sa0) * 0.1) * 5);
    // let horTCoord = (sa1 > 90 || sa1 < -90) ? horT/2 + ((Math.abs(sa1-sa0) * 0.1) * 10) : horT/2 + ((Math.abs(sa1-sa0) * 0.1) * 10);
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
      argg.push(m * ((chordCHeight * 2 + (0.05 * chordCHeight)) / gtMediums.length) - (chordCHeight * 0.9125))
    }

    context.quadraticCurveTo(horCoord, vertCoord, d.half == 0 ? rectWidth/2 : -rectWidth/2, argg[d.death]) // to

    context.quadraticCurveTo(
      horTCoord,
      vertTCoord,
      sr * Math.cos((sa0 * Math.PI) / 180),
      sr * Math.sin((sa0 * Math.PI) / 180)
    ) //back
    if (buffer) return (context = null), buffer + '' || null
  }

  onMount(async () => {
    const locs: ArtistLocation[] | undefined = await json(`${Config.server_url}/data/artist-locations.json`)

    const medLocs: ArtistMedium[] | undefined = await json(`${Config.server_url}/data/artist-mediums.json`)

    if (locs && medLocs) {
      allMediums = d3.groups(medLocs, d => d.artist)

      oldestYear = d3.min(locs, d => d.year)
      youngestYear = d3.max(locs, d => d.year)
      allLocations = d3.groups(locs, d => d.artist)
      filterLocations(oldestYear!)

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
        // let unitAngleR = angleR / mediumsTotalEntries;
        let padR = (chordCHeight / 270) * 0.02
        let colorIndex = -1
        let forwardAngle = (Math.PI - angleR) / 2
        let forwardAngleD = (Math.PI - angleR) / 2
        let runningRTally = 0.0

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
                  // 'startAngle' : (i * ((angleR) / Math.floor(n/2))) + ((Math.PI - angleR) / 2) + padR,
                  startAngle: padCheck && i > 0 ? padR + forwardAngle : forwardAngle,
                  // 'endAngle' : ((i + 1) * ((angleR) / Math.floor(n/2))) + ((Math.PI - angleR) / 2) - padR,
                  endAngle:
                    padCheck && i > 0
                      ? padR + unitAngleR * currSegment + forwardAngle
                      : unitAngleR * currSegment + forwardAngle,
                  value: 29630,
                  // 'nums': sortedArr[i].nums[j],
                  nums: sortedArr[i].meds[j],
                  // 'death': sortedArr[i].death[j],
                  death: j,
                  colorIndex: colorIndex,
                  half: 0,
                })
                forwardAngle += padCheck && i > 0 ? padR + unitAngleR * currSegment : unitAngleR * currSegment
              } else {
                let baseTerm = 2 * Math.PI
                retArr.push({
                  index: colorIndex,
                  // 'startAngle' : Math.PI + (i * ((angleR) / (n - Math.floor(n/2)))) + ((Math.PI - angleR) / 2) + padR,
                  // 'startAngle' : (j == 0) ? ((baseTerm) + padR + forwardAngleD) : (baseTerm + forwardAngleD),
                  startAngle:
                    padCheck && i > 0
                      ? baseTerm - padR - unitAngleR * currSegment - forwardAngleD
                      : baseTerm - unitAngleR * currSegment - forwardAngleD,
                  // 'endAngle' : Math.PI + ((i + 1) * ((angleR) / (n - Math.floor(n/2)))) + ((Math.PI - angleR) / 2) - padR,
                  // 'endAngle' : (j == 0) ? (baseTerm + padR + (unitAngleR * currSegment) + forwardAngleD) : (baseTerm + (unitAngleR * currSegment) + forwardAngleD),
                  endAngle: padCheck && i > 0 ? baseTerm - padR - forwardAngleD : baseTerm - forwardAngleD,
                  value: 29630,
                  // 'nums': sortedArr[i].nums[j],
                  nums: sortedArr[i].meds[j],
                  // 'death': sortedArr[i].death[j],
                  death: j,
                  colorIndex: colorIndex,
                  half: 1,
                })
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
        .attr('x', -1* rectWidth/2)
        .attr('y', (d, i) => i * ((chordCHeight * 2 + + (0.05 * chordCHeight)) / gtMediums.length) - (chordCHeight * 0.9) - (0.05 * chordCHeight))
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
        .attr('y', (d, i) => i * ((chordCHeight * 2 + + (0.05 * chordCHeight)) / gtMediums.length) - (chordCHeight * 0.875))
        .attr('fill', 'white')
        .style('text-anchor', 'middle')
        .style('font-size', attrFontSize)
        .text(d => d.charAt(0).toUpperCase() + d.slice(1))
    } else {
      console.error('Unable to load Artist Locations!')
    }
  })
</script>

<svg id="svg" bind:this={svg} class="inline-block" width={width} height={height}>
  <!-- <g id="chordViz" bind:this={chordViz} transform="translate(600, 450)" /> -->
  <g id="chordViz" bind:this={chordViz} transform="translate({chartRad * 1.1}, {chordCHeight * 1.1})" width={width} height={height} />
</svg>
