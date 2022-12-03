<script lang="ts">
  import { Types, Helpers } from "$lib/utilities"
  import type {
    ArtistData,
    ArtistInfluence,
    ArtistLocation,
    ArtistMedium,
  } from "$lib/utilities/types"
  import * as d3 from "d3"
  import { createEventDispatcher } from "svelte"

  const dispatch = createEventDispatcher()

  export let width: number = 0
  export let height: number = 0
  export let topOffset: number = 0

  const PADDING = { left: 50, right: 50, top: 50, bottom: 50 }

  let chart_height: number
  $: chart_height = 0
  let chart_width: number
  $: chart_width = 0

  let artists: ArtistLocation[]
  $: artists
  let mediums: ArtistMedium[]
  $: mediums

  let oldestYear: number
  $: oldestYear = 0
  let youngestYear: number
  $: youngestYear = 2100
  $: year = 0
  const tickEvery = 50 // TODO: hardcoded right now
  const yearEvery = 100
  const yearEverySingle = 10
  const title_length = 80

  let tl_x_scale: d3.ScaleLinear<number, number, never>
  $: tl_x_scale
  let tl_x_axis = null
  let tl_y_scale: d3.ScaleLinear<number, number, never>
  $: tl_y_scale
  let tl_y_axis = null

  let size_years: number | undefined
  let years = new Array<number>(size_years!)

  let group_artists: any = []
  let artists_alive: any = []
  let num_categories = new Array<number>(5)
  $: num_categories = []

  let area_lines: number[][]
  $: area_lines = []
  let area_lines_percentage: number[][]
  $: area_lines_percentage = []
  let each_area_line: number[][]
  $: each_area_line = []

  let font_size: number
  $: font_size = 30
  let highlight_medium: boolean
  $: highlight_medium = false

  let chordColorScale
  let gtMediums:any = []

  let xAxisGroup

  let manualColors = []
  for (let i = d3.schemePaired.length - 1; i >= 0; i--) {
    manualColors.push(d3.schemePaired[i])
  }

  const DataForAreaChartLine = (category: string) => {
    let area_values = new Array<number>(size_years!)

    let i = 0
    for (var year of years) {
      // console.log(i)
      let total_mediums_one_year = 0
      let alive = AliveArtists(year)
      // console.log('alive', alive)
      area_values[i] = 0
      let alive_artist_medium_list: any = []
      for (var alive_artist of alive) {
        // console.log(alive_artist)
        alive_artist_medium_list = mediums.filter(
          (d) => d.artist === alive_artist[0]
        )
        for (var medium of alive_artist_medium_list) {
          if (medium.medium === category) {
            area_values[i] = area_values[i] + 1
          }
          total_mediums_one_year = total_mediums_one_year + 1 //TODO: check logic, should check if its there in the category_names
        }
      }
      area_values[i] = (area_values[i] / total_mediums_one_year) * 100
      i = i + 1
    }
    // console.log(area_values)
    return area_values //these are percentages
  }

  const DataForAllAreaChartLine = () => {
    // For each category
    let num = 0
    area_lines = []
    area_lines_percentage = []
    for (var category of gtMediums) {
      let area_values = new Array<number>(size_years!)
      let i = 0

      for (var year of years) {
        let total_mediums_one_year = 0
        let alive = AliveArtists(year)
        area_values[i] = 0
        let alive_artist_medium_list: any = []

        for (var alive_artist of alive) {
          alive_artist_medium_list = mediums.filter(
            (d) => d.artist === alive_artist[0]
          )

          for (var medium of alive_artist_medium_list) {
            if (medium.medium === category) {
              area_values[i] = area_values[i] + 1
            }
            total_mediums_one_year = total_mediums_one_year + 1
          }
        }
        // convert to percentage
        if (total_mediums_one_year) {
          area_values[i] = (area_values[i] / total_mediums_one_year) * 100
        }
        i = i + 1
      }
      // console.log('area_values', area_values)
      area_lines[num] = area_values
      num = num + 1
    }
    // console.log('final area_lines', area_lines)
    area_lines_percentage = { ...area_lines }

    // Calculate percentage
    for (var n = 0; n < gtMediums.length - 1; n++) {
      for (var y = 0; y < years.length; y++) {
        // area_lines[n+1][y] = area_lines[n][y] + area_lines[n+1][y]
        area_lines_percentage[n + 1][y] =
          area_lines[n][y] + area_lines[n + 1][y]
      }
    }

    // console.log('final area_lines_percentage', area_lines_percentage)
  }

  const AllAreaChart = () => {
    d3.select("#individual-area-chart").attr("opacity", "0.0")

    // X SCALE
    var xScale = d3
      .scaleLinear()
      .domain([0, size_years!])
      .range([0, chart_width])

    // Y SCALE
    var yScale = d3.scaleLinear().domain([0, 100]).range([chart_height, 0])

    const areaGenerator1 = d3
      .area()
      .x((d) => xScale(d.x - oldestYear!) + PADDING.left)
      .y1(d => yScale(d.y) + PADDING.top)
      .y0(d => yScale(d.prev) + PADDING.top)
      // .curve(d3.curveCatmullRom.alpha(0.6))
      .curve(d3.curveStep)
      .context(null);

    // Draw all in category
    let num = 0
    for (var category of gtMediums) {
      console.log("whiich category we on? " + category)
      // console.log(gtMediums.length - 1 - num)
      let area_line_values = area_lines_percentage[gtMediums.length - 1 - num]
      let area_line_values_prev: any = []
      if (num < gtMediums.length - 1) {
        area_line_values_prev =
          area_lines_percentage[gtMediums.length - 1 - num - 1]
      } else {
        for (var j = 0; j < size_years!; j++) area_line_values_prev[j] = 0
      }
      num = num + 1
      each_area_line = []
      for (let i = 0; i < years.length; i++) {
        const each_pair: any = {
          x: years[i],
          y: area_line_values[i],
          prev: area_line_values_prev[i],
        }
        each_area_line.push(each_pair)
      }
      let area_id = "area-chart-" + (gtMediums.length - num).toString()
      // console.log(area_id)
      d3.select("#all-area-chart")
        .append("path")
        .attr("id", area_id)
        .datum(each_area_line)
        .attr("d", areaGenerator1)
        .style("fill", manualColors[num - 1])
        .attr("opacity", "1.0")
      console.log("heyoooo which num tell me please " + (num - 1))
    }
  }

  const IndividualAreaChart = (category: string) => {
    let idx = gtMediums.indexOf(category)
    console.log(idx)
    // Make all category area chart transparent
    // d3.select('#all-area-chart')
    // .attr('opacity', '0.0')

    // let area_line_values = DataForAreaChartLine(category)
    let area_line_values = area_lines[idx]
    let area_line_values_prev:any = []
    if(idx !== 0){
      area_line_values_prev = area_lines_percentage[idx - 1]
    }
    else{
      for(var j=0; j<size_years!; j++)
      area_line_values_prev[j] = 0
    }
    // console.log('area_line_values', area_line_values)

    // X SCALE
    var xScale = d3
      .scaleLinear()
      .domain([0, size_years!])
      .range([0, chart_width])

    // Y SCALE
    var yScale = d3.scaleLinear().domain([0, 100]).range([chart_height, 0])

    const areaGenerator = d3
      .area()
      .x((d) => xScale(d.x - oldestYear!) + PADDING.left)
      .y1(d => yScale(d.y) + PADDING.top)
      .y0(d => yScale(d.prev) + PADDING.top)
      // .y0(chart_height + PADDING.top)
      .curve(d3.curveStep)
      .context(null);

    each_area_line = []
    for (let i = 0; i < years.length; i++) {
      const each_pair: any = {
        x: years[i],
        y: area_line_values[i],
        prev: area_line_values_prev[i]
      }
      each_area_line.push(each_pair)
    }
    
    ClearAreaChart()

    d3.select('#individual-area-chart') // It is a path in svg
    .datum(each_area_line)
    .attr("d", areaGenerator)
    .style('fill', '#ee7722') // TODO: change this colour selection 
    .attr('opacity', '1.0')
    
  }

  const HighlightCategory = (category: string) => {
    highlight_medium = true
    let idx = gtMediums.indexOf(category)
    // idx = 5
    console.log('idx', idx)

    // X SCALE
    var xScale = d3
      .scaleLinear()
      .domain([0, size_years!])
      .range([0, chart_width])

    // Y SCALE
    var yScale = d3.scaleLinear().domain([0, 100]).range([chart_height, 0])

    const lineGenerator = d3.line()
    .x((d,i) => xScale(d.x - oldestYear!) + PADDING.left)
    .y(d => yScale(d.y) + PADDING.top)
    // .curve(d3.curveCatmullRom.alpha(0.6))
    .curve(d3.curveStep)
    .context(null);

    // Draw left line
    d3.select('#highlight-area')  // selects the components 
    .append('line')
    .attr('id', '#highlight-border-left')
    .attr('x1', xScale(0) + PADDING.left)
    .attr('y1', yScale(area_lines[idx][0]) + PADDING.top)
    .attr('x2', xScale(0) + PADDING.left) 
    .attr('y2', (!idx)? chart_height + PADDING.top: yScale(area_lines[idx-1][0]) + PADDING.top)
    .attr("fill", "none")
    .style('stroke', 'black')
    .style('stroke-width', '1')
    .attr('opacity', '1.0')

    // Draw right line 
    d3.select('#highlight-area')  // selects the components 
    .append('line')
    .attr('id', '#highlight-border-right')
    .attr('x1', xScale(size_years!-1) + PADDING.left) // why -1 needed? some issue in area 
    .attr('y1', yScale(area_lines[idx][size_years!-1]) + PADDING.top)
    .attr('x2', xScale(size_years!-1) + PADDING.left)
    .attr('y2', (!idx)? chart_height + PADDING.top: yScale(area_lines[idx-1][size_years!-1]) + PADDING.top)
    .attr("fill", "none")
    .style('stroke', 'black')
    .style('stroke-width', '1')
    .attr('opacity', '1.0')

    // Draw upper line
    let area_line_values = area_lines_percentage[idx]
    each_area_line = []
    for (let i = 0; i < years.length; i++) {
      const each_pair: any = {
        x: years[i],
        y: area_line_values[i],
      }
      each_area_line.push(each_pair)
    }

    d3.select('#highlight-area')  // selects the components 
    .append('path')
    .attr('id', '#highlight-border-up')
    .datum(each_area_line)
    .attr("d", lineGenerator)
    .attr("fill", "none")
    .style('stroke', 'black')
    .style('stroke-width', '1')
    .attr('opacity', '1.0')

    // Draw lower line
    if(idx!==0){
      area_line_values = area_lines_percentage[idx-1]
    }
    else{
      for(var j=0; j<area_line_values.length; j++){
        area_line_values[j] = 0
      }
    }

    each_area_line = []
    for (let i = 0; i < years.length; i++) {
      const each_pair: any = {
        x: years[i],
        y: area_line_values[i],
      }
      each_area_line.push(each_pair)
    }

    d3.select('#highlight-area')  // selects the components 
    .append('path')
    .attr('id', '#highlight-border-bottom')
    .datum(each_area_line)
    .attr("d", lineGenerator)
    .attr("fill", "none")
    .style('stroke', 'black')
    .style('stroke-width', '1')
    .attr('opacity', '1.0')

    // Make everything else opacity = 0.0
    d3.select("#individual-area-chart").attr("opacity", "0.0")

    let i = 0
    for (var category of gtMediums) {
      // Make everyone opacity = 0.2
      let select_area_id = "#area-chart-" + i
      d3.select(select_area_id).attr("opacity", "0.3")
      i = i + 1
    }

    // Area darker when highlighted
    let select_area_id = "#area-chart-" + idx
    // console.log('selected', select_area_id)
    d3.select(select_area_id).attr("opacity", "1.0")
  }

  const RestoreAfterHover = () => {
    let i = 0
    for(var category of gtMediums){
      // Make everyone opacity = 0.2
      let select_area_id = '#area-chart-' + i
      d3.select(select_area_id)
        .attr('opacity', '1.0')
      i = i + 1
    }
  }

  const OnMouseMoveAreaChart = (ev:any) => {
    // console.log('move')
    // console.log(ev.offsetX, ev.offsetY)

    // X SCALE
    var xScale = d3
      .scaleLinear()
      .domain([0, size_years!])
      .range([0, chart_width])

    // Y SCALE
    var yScale = d3.scaleLinear().domain([0, 100]).range([chart_height, 0])

    let year_hover_idx = Math.floor(xScale.invert(ev.offsetX - PADDING.left))

    if (
      ev.offsetX > PADDING.left &&
      ev.offsetX < PADDING.left + chart_width &&
      !highlight_medium
    ) {
      d3.select("#hover-overlay").attr("opacity", "1.0")

      // d3.select('#hover-overlay')
      //   .selectAll('*')
      //   .attr('opacity', '1.0')
      

      // Vertical line on hover 
      d3.select('#hover-overlay')
          .select('line')
          .attr("x1", ev.offsetX)
          .attr("x2", ev.offsetX)
          .attr("y1", PADDING.top)
          .attr("y2", chart_height + PADDING.top)
          .attr("stroke", "black")
          .attr('stroke-width', '2')
          .attr('opacity', '1.0')

      // Put rectangles
      d3.select("#hover-overlay-rect")
        .selectAll("rect")
        .data((d) => {
          for (var category of gtMediums) {
            let idx = gtMediums.indexOf(category)
          }
          let non_zero_categories = gtMediums.filter((d) => {
            let idx_cat = gtMediums.indexOf(d)
            let val = 0
            if (idx_cat !== 0) {
              val =
                area_lines_percentage[idx_cat][year_hover_idx] -
                area_lines_percentage[idx_cat - 1][year_hover_idx]
            } else {
              val = area_lines_percentage[0][year_hover_idx]
            }
            if (val) {
              return d
            }
          })
          return non_zero_categories.reverse()
        })
        .join("rect")
        .attr("x", (d) => {
          if (ev.offsetX < chart_width - 200) {
            return ev.offsetX + font_size - 10
          }
          return ev.offsetX - 210
        })
        .attr("y", (d, i) => {
          return font_size * i + font_size / 3 + PADDING.top
        })
        .attr("width", 200)
        .attr("height", font_size)
        .attr("rx", "10")
        .style("fill", "white")
        .style("opacity", "0.8")

      // Put text
      d3.select("#hover-overlay-text")
        .selectAll("text")
        .data((d) => {
          for (var category of gtMediums) {
            let idx = gtMediums.indexOf(category)
          }
          let non_zero_categories = gtMediums.filter((d) => {
            let idx_cat = gtMediums.indexOf(d)
            let val = 0
            if (idx_cat !== 0) {
              val =
                area_lines_percentage[idx_cat][year_hover_idx] -
                area_lines_percentage[idx_cat - 1][year_hover_idx]
            } else {
              val = area_lines_percentage[0][year_hover_idx]
            }
            if (val) {
              return d
            }
          })
          return non_zero_categories.reverse()
        })
        .join("text")
        .text((d) => {
          let updatedWording = d
          if (d == "architect") {
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
            updatedWording = "Paints"
          } else if (d == "printmaker") {
            updatedWording = "Prints"
          } else if (d == "sculptor") {
            updatedWording = "Sculptures"
          } else if (d == "photography-film") {
            updatedWording = "Photography/Film"
          }
          let str = ""
          let idx_cat = gtMediums.indexOf(d)
          let val = 0
          if (idx_cat !== 0) {
            val =
              area_lines_percentage[idx_cat][year_hover_idx] -
              area_lines_percentage[idx_cat - 1][year_hover_idx]
          } else {
            val = area_lines_percentage[0][year_hover_idx]
          }
          str =
            str +
            `${d3.format(".3s")(val)}` +
            "% " +
            updatedWording.charAt(0).toUpperCase() +
            updatedWording.slice(1)
          return str
          // return d
        })
        .attr("x", (d) => {
          if (ev.offsetX < chart_width - 200) {
            return ev.offsetX + font_size
          }
          return ev.offsetX - 200
        })
        .attr("y", (d, i) => {
          // let idx_cat = gtMediums.indexOf(d)
          // return yScale(area_lines_percentage[idx_cat][year_hover_idx]) + font_size + PADDING.top
          return font_size * i + font_size + PADDING.top
        })
        .attr("fill", (d, i) => {
          let idx_cat = gtMediums.indexOf(d)
          return ColourFunc(gtMediums.indexOf(d)) // This fixed it
        })
        .style(
          "text-shadow",
          "1px 0 0 black,0 1px 0 black,-1px 0 0 black,0 -1px 0 black"
        )
        .style("font-family", "sans-serif")
        .style("font-size", "1.2em")
    }
    // else {
    //   d3.select('#hover-overlay').selectAll('*').remove(); // TODO: not working
    // }

    // Draw year
    d3.select("#hover-overlay-year")
      .selectAll("text")
      .data([0])
      .join("text")
      .text((d) => `In year ${year_hover_idx + oldestYear}`)
      .attr("x", (d) => {
        if (ev.offsetX < chart_width - 200) {
          return ev.offsetX + font_size
        }
        return ev.offsetX - 200
      })
      .attr("y", (d) => {
        return PADDING.top - font_size / 3
      })
      .attr("fill", (d, i) => {
        return "black"
      })
      .style('font-family', 'sans-serif')
      .style('font-size','1.3em')
      .attr('opacity', '1.0')
  }

  const OnMouseOutAreaChart = (ev:any) => {
    // console.log('out')
    if(ev.offsetX < PADDING.left || (PADDING.left+chart_width) < ev.offsetX){
      console.log('outttt')
      
    }
    // d3.select('#hover-overlay')
    // .selectAll('*')
    // .attr('opacity', '0.0')
  }

  const AliveArtists = (year: number) => {
    let alive = group_artists.filter(([, locations]) => {
      if (locations.length > 1) {
        return locations[0].year <= year && locations[1].year > year
      } else {
        return locations[0].year <= year // if alive
      }
    })
    return alive
  }

  const ColourFunc = (num: number): string => {
    if (num >= 0 && num < gtMediums.length) {
      // console.log(chordColorScale(gtMediums[0]))
      return chordColorScale(gtMediums[num]) as string
    } else {
      return "black"
    }
  }

  const ClearAreaChart = () => {
    d3.select("#all-area-chart").selectAll("*").attr("opacity", "0.0")
  }

  const ClearHover = () => {
    d3.select('#highlight-area')
      .selectAll('*')
      .attr('opacity', '0.0')
  }

  const DrawAxesSingle = () => {
    tl_x_scale = d3
      .scaleLinear()
      .domain([oldestYear!, youngestYear!])
      .range([0, chart_width])
    tl_x_axis = d3
      .axisBottom(tl_x_scale)
      .tickFormat((d) => {
        return Number(d) % yearEverySingle === 0 ? String(d) : ""
      })
      .ticks((youngestYear! - oldestYear!) / tickEvery)
    d3.select("#x-axis")
      .transition()
      .duration(1000)
      .attr(
        "transform",
        `translate(${PADDING.left}, ${chart_height + PADDING.top})`
      )
      .call(tl_x_axis)

    // percentage
    tl_y_scale = d3.scaleLinear().domain([0, 100]).range([chart_height, 0])
    tl_y_axis = d3.axisLeft(tl_y_scale)
    d3.select("#y-axis")
      .attr("transform", `translate(${PADDING.left}, ${PADDING.top})`)
      .call(tl_y_axis)
  }

  const DrawRectangleCentury = (century:string) => {
    console.log(century)

    // X scale
    var xScale = d3.scaleLinear()
    .domain([0, size_years!])
    .range([0, chart_width]);

    d3.select('#hover-rect-century')
      .attr('x',xScale(+century - oldestYear) + PADDING.left)
      .attr('y',PADDING.top)
      .attr('width',xScale(100))
      .attr('height',chart_height)
      .attr('stroke', 'black')
      .attr('stroke-width', '4')
      .attr('fill', 'none')

  }






  // Receiving sign from chord that a medium arc was highlighted/is no longer highlighted
  export const chordMedGroupFocus = (chordMedium: string) => {
    // Will implement logic for highlighting area in this component that corresponds to chordMedium
    console.log('Chord medium was highlighted on chord: ', chordMedium)
    // IndividualAreaChart(chordMedium) // TODO: for click medium 
    HighlightCategory(chordMedium)
  }

  export const chordMedGroupReFocus = () => {
    // Will implement logic for making all areas equal in focus again
    console.log('Chord medium is no longer highlighted on chord.')
    ClearHover()
    RestoreAfterHover()
  }

  // Receiving sign from chord that a ribbon got highlighted/is no longer highlighted
  export const chordMedRibbonFocus = (
    chordMedium: string,
    chordCentury: string
  ) => {
    // Will implement logic for highlighting area in this component that corresponds to chordMedium and chordCentury
    // We also gotta put some indication of the century's time frame on the chart when this happens for focus
    console.log('Chord ribbon was highlighted on chord for medium: ', chordMedium, ' and century: ', chordCentury)
    HighlightCategory(chordMedium)
  }

  export const chordMedRibbonReFocus = () => {
    // Will implement logic for removing highlights from medium area and indication of century time frame on x axis
    console.log('That ribbon is no longer highlighted...')
    ClearHover()
    RestoreAfterHover()
  }

  // Receiving sign from chord that a button got clicked in any way
  export const chordMedButtonClick = (chordCentury: string) => {
    // Will implement logic for zooming in to the century associated with the button clicked
    // And then either returning to regular scale or another century if that is clicked

    // So we can have:
    // Click 1200 ---> Click 1200
    //    This zooms to 1200 ------> and then back to the full range of time
    // Or
    // Click 1200 ---> Click 1800
    //    This zooms to 1200 ------> and then zooms to 1800
    // You can check out the scatter plot's click handle function (chordButtonClick)
    //    and this: https://bl.ocks.org/guilhermesimoes/15ed216d14175d8165e6 for help.
    console.log("Chord says to zoom to this century: ", chordCentury)

    oldestYear = +chordCentury
    youngestYear = +chordCentury + 100
    SetYears(youngestYear, oldestYear)
    ClearAreaChart()
    DrawAxesSingle()
    DataForAllAreaChartLine()
    AllAreaChart()

    // You should probably create an array of booleans of length = centuries.length and then
    // update accordingly with this function!
  }

  // Clicking on medium in arc
  export const chordArcMedButtonClick = (chordMedium: string) => {
    console.log('here', chordMedium)
    IndividualAreaChart(chordMedium)
  }

  // Receiving sign from chord a century button is highlighted/not anymore
  export const chordMedButtonFocus = (chordCentury: string) => {
    // Will implement logic for some indication of the century's time span (like a rectangle or something)
    console.log('User highlighted button for century: ', chordCentury)
    DrawRectangleCentury(chordCentury)
  }

  export const chordMedButtonReFocus = () => {
    // Will implement logic to get rid of some indication of the century's time span
    console.log('User is no longer highlighting century button...')
    
  }





  const SetYears = (young: number, old: number) => {
    size_years = young - old // TODO: change this when clicking on century button to show only that century
    years = []
    for (let i = 0; i < size_years; i++) {
      years[i] = old + i
    }
  }

  export const Initialize = (
    location_data: Types.ArtistLocation[],
    medium_data: Types.ArtistMedium[]
  ) => {
    artists = location_data
    mediums = medium_data

    chart_width = width * 0.8
    chart_height = height * 0.7
    PADDING.top = height * 0.05
    PADDING.bottom = height * 0.25
    PADDING.left = width * 0.15
    PADDING.right = width * 0.05
    group_artists = d3.groups(artists, (d) => d.artist)
    num_categories = d3.range(gtMediums.length).reverse()

    oldestYear = +d3.min(location_data, (d) => d.year)! // TODO: Change this
    youngestYear = +d3.max(location_data, (d) => d.year)!

    let mediumRoll = d3.groups(medium_data, (d) => d.medium)
    for (let l = 0; l < mediumRoll.length; l++) {
      gtMediums.push(mediumRoll[l][0])
    }
    gtMediums.sort(d3.ascending)
    console.log("mediums over here: ", gtMediums)
    chordColorScale = d3.scaleOrdinal().domain(gtMediums).range(d3.schemePaired)

    // TODO: change this when clicking on century button to show only that century

    // // Change to individual area chart
    // oldestYear = 1600
    // youngestYear = 1700
    // SetYears(youngestYear, oldestYear)
    // DrawAxesSingle()
    // DataForAllAreaChartLine()
    // IndividualAreaChart('painter')

    // Change to show all categories of aea chart
    oldestYear = 1400
    // youngestYear = 1800
    SetYears(youngestYear, oldestYear)
    // TODO: onClick, selecting the medium should display only that category
    DrawAxesSingle() //TODO: call again when selecting a century to change x axis
    DataForAllAreaChartLine()
    AllAreaChart()

    // To highlight selected category
    // HighlightCategory('painter')
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
    <!-- #each for all years, call function for each year calc mediums % , #each give line generater -->
    <g id="axes-titles">
      <text
        transform="translate({PADDING.left +
          chart_width / 2 -
          title_length / 2}, 
        {PADDING.top + chart_height + font_size + PADDING.bottom / 3})"
        font-weight="700"
        >Years
      </text>
      <text
        transform="translate({PADDING.left - font_size - 5}, 
        {PADDING.top + chart_height / 2 + title_length / 2}) rotate(-90)"
        font-weight="700"
        >Percentage
      </text>
    </g>
    <g id="area-chart">
      <g id="x-axis" />
      <g id="y-axis" />

      <g id="single-area">
        <path id="individual-area-chart" />
      </g>

      <g id='all-area-chart'
          on:mousemove={(ev) => OnMouseMoveAreaChart(ev)}
          on:focus={(ev) => OnMouseMoveAreaChart(ev)}
          on:mouseout={(ev) => OnMouseOutAreaChart(ev)}
          on:blur={(ev) => OnMouseOutAreaChart(ev)}>
      </g>
      <g id="highlight-area"></g>
      <g id="hover-century">
        <rect id="hover-rect-century"></rect>
      </g>
      <g id="hover-overlay">
        <line />
        <g id="hover-overlay-year" />
        <g id="hover-overlay-rect" />
        <g id="hover-overlay-text" />
      </g>
    </g>
  </svg>
</div>
