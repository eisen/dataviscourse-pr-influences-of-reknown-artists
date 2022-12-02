<script lang="ts">
  import { Types, Helpers } from "$lib/utilities"
  import type { ArtistData, ArtistInfluence, ArtistLocation, ArtistMedium } from "$lib/utilities/types"
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
  let mediums : ArtistMedium[]
  $: mediums
  // let category_mediums : number[];
  // $: category_mediums= [0,0,0,0,0];

  let oldestYear: number | undefined
  $: oldestYear = 0
  let youngestYear: number | undefined
  $: youngestYear = 2100
  $: year = 0
  const tickEvery = 20
  const yearEvery = 100
  const yearEverySingle = 10

  let tl_x_scale: d3.ScaleLinear<number, number, never>
  $: tl_x_scale
  let tl_x_axis = null
  let tl_y_scale: d3.ScaleLinear<number, number, never>
  $: tl_y_scale
  let tl_y_axis = null

  let size_years: number | undefined
  let years = new Array<number>(size_years!);

  let group_artists: any = []
  let artists_alive: any = []
  let num_categories = new Array<number>(5)
  $: num_categories = []

  let area_lines:number[][]
  $: area_lines = []

  let single_total:number
  // $: single_total

  let category_names = ['painter', 'watercolourist', 'oilpainter', 'sculptor', 'printmaker', 'draughtsman', 'muralist']//,
//'photography', 'film', 'illustrator', 'architect', 'ink', 'ceramicist', 'calligrapher', 'engraving', 'calligrapher']

  // let chordColorScale = d3
  //   .scaleOrdinal()
  //   .domain(d3.range(Helpers.ColorScheme.length))
  //   .range(Helpers.ColorScheme)

  let chordColorScale = d3
    .scaleOrdinal()
    .domain(d3.range(10))
    .range(d3.schemeCategory10)

  const DataForAreaChartLine = (category:string) => {
    let area_values = new Array<number>(size_years!)

    let i=0
    for(var year of years){
      // console.log(i)
      let total_mediums_one_year = 0
      let alive = AliveArtists(year)
      // console.log('alive', alive)
      area_values[i] = 0
      let alive_artist_medium_list:any = []
      for(var alive_artist of alive){
        // console.log(alive_artist)
        alive_artist_medium_list = mediums.filter(d => d.artist===alive_artist[0])
        for(var medium of alive_artist_medium_list){
          if(medium.medium === category){
            area_values[i] = area_values[i] + 1
          }
          total_mediums_one_year = total_mediums_one_year + 1
        }
      }
      // console.log(i, total_mediums_one_year)
      single_total = single_total > total_mediums_one_year? single_total : total_mediums_one_year // Used for y axis 
      // console.log(area_values[i])
      // convert to percentage
      area_values[i] = (area_values[i] / total_mediums_one_year) * 100
      i=i+1
    }
    // console.log(area_values)
    return area_values

    // for(let i=0; i<years.length; i++){
    //   area_values[i] = (area_values[i]/total) * chart_height
    // }
    
  }
  
  const IndividualAreaChart = (category:string) => {
    let area_line_values = DataForAreaChartLine(category)
    // console.log(area_line_values)

    // X SCALE
    var xScale = d3.scaleLinear()
    .domain([0, size_years!])
    .range([0, chart_width]);

    // Y SCALE
    // let maxY = d3.max(area_line_values!)
    let maxY = single_total
    var yScale = d3.scaleLinear()
    .domain([0, 100])
    .range([chart_height, 0]);

    
    const areaGenerator = d3.area()
      .x((d) => xScale(d.x - oldestYear!) + PADDING.left)
      .y1(d => yScale(d.y) + PADDING.top)
      // .x((d) => tl_x_scale(d.x) + PADDING.left)
      // .y1(d => tl_y_scale(d.y) + PADDING.top)
      .y0(chart_height + PADDING.top)
      .curve(d3.curveCatmullRom.alpha(0.6))
      .context(null);

    for(let i=0; i<years.length; i++){
      const each_pair: any = {
        x: years[i],
        y: area_line_values[i],
      }
      area_lines.push(each_pair)
    }
    
    d3.select('#area-chart')
    .datum(area_lines)
    .attr("d", areaGenerator)
    .style('fill', '#ee7722') // TODO: change this colour selection 
    
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

  const CalculatePercentage = (year: number) => {
    
    artists_alive = AliveArtists(year)

    let category_mediums = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]; // number of categories considered, [painter, sculptor, watercolourist, printmaker, draughtsman]

    for(var alive_artist of artists_alive){
      const artist_medium_list = mediums.filter(d => d.artist===alive_artist[0])
      for(var medium of artist_medium_list){
        for(var category of category_names){
          if(medium.medium === category){
            let index = category_names.indexOf(category)
            category_mediums[index] = category_mediums[index] + 1
          }
        }
      }
    }
  
    // console.log('before category_mediums', category_mediums)
    let total = 0
    for(let i=0; i<category_mediums.length; i++){
      total = total + category_mediums[i]
      category_mediums[i] = total
    }
    // console.log('after category_mediums', category_mediums)
    for(let i=0; i<category_mediums.length; i++){
      category_mediums[i] = (category_mediums[i]/total) * chart_height
    }
    // console.log('percentage+caliberate category_mediums', category_mediums)

    return category_mediums;

    //vertical line hover from hw4

  }

  const ColourFunc = (num: number):string => {
    if(num){
      return chordColorScale(num.toString()) as string
    }
    else{
      return 'black'
    }
  }

  const Stroke_size = () => {
    let stroke_width = chart_width / size_years!
    return stroke_width
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
    d3.select('#x-axis')
    .attr('transform', `translate(${PADDING.left}, ${chart_height + PADDING.top})`)
    .call(tl_x_axis)

    // percentage 
    tl_y_scale = d3
      .scaleLinear()
      // .domain([0, single_total!])
      .domain([0, 100])
      .range([chart_height, 0])
    tl_y_axis = d3
      .axisLeft(tl_y_scale)
    d3.select('#y-axis')
    .attr('transform', `translate(${PADDING.left}, ${PADDING.top})`)
    .call(tl_y_axis)

  }

  // Receiving sign from chord that a medium arc was highlighted/is no longer highlighted
  export const chordMedGroupFocus = (chordMedium: string) => {
    // Will implement logic for highlighting area in this component that corresponds to chordMedium
    console.log('Chord medium was highlighted on chord: ', chordMedium)
  }

  export const chordMedGroupReFocus = () => {
    // Will implement logic for making all areas equal in focus again
    console.log('Chord medium is no longer highlighted on chord.')
  }

  // Receiving sign from chord that a ribbon got highlighted/is no longer highlighted
  export const chordMedRibbonFocus = (chordMedium: string, chordCentury: string) => {
    // Will implement logic for highlighting area in this component that corresponds to chordMedium and chordCentury
    // We also gotta put some indication of the century's time frame on the chart when this happens for focus
    console.log('Chord ribbon was highlighted on chord for medium: ', chordMedium, ' and century: ', chordCentury)
  }

  export const chordMedRibbonReFocus = () => {
    // Will implement logic for removing highlights from medium area and indication of century time frame on x axis
    console.log('That ribbon is no longer highlighted...')
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
    console.log('Chord says to zoom to this century: ', chordCentury)
    // You should probably create an array of booleans of length = centuries.length and then
    // update accordingly with this function!
  }

  // Receiving sign from chord a century button is highlighted/not anymore
  export const chordMedButtonFocus = (chordCentury: string) => {
    // Will implement logic for some indication of the century's time span (like a rectangle or something)
    console.log('User highlighted button for century: ', chordCentury)
  }

  export const chordMedButtonReFocus = () => {
    // Will implement logic to get rid of some indication of the century's time span
    console.log('User is no longer highlighting century button...')
  }

  export const Initialize = (
    location_data: Types.ArtistLocation[],
    medium_data: Types.ArtistMedium[]
    ) => {
    artists = location_data
    mediums = medium_data

    chart_width = width - PADDING.left - PADDING.right
    chart_height = height - PADDING.top - PADDING.bottom


    oldestYear = +d3.min(location_data, (d) => d.year)! // TODO: Change this
    oldestYear = 1500
    youngestYear = +d3.max(location_data, (d) => d.year)!
    youngestYear = 1600
    size_years = youngestYear - oldestYear // TODO: change this when clicking on century button to show only that century
    for(let i=0; i<size_years; i++){
      years[i] = oldestYear + i 
    }

    group_artists = d3.groups(artists, d => d.artist)
    num_categories = d3.range(category_names.length).reverse()
    // CalculatePercentage(1900)
    // Stroke_size()

    // TODO: onClick, selecting the medium should display only that category
    IndividualAreaChart('painter')
    DrawAxesSingle()
  }
</script>

<div
  id="container"
  class="inline-block relative align-top overflow-hidden"
  style="width: {width}px; height: {height}px; top: {(topOffset) > 50 ? 50 : topOffset * 0.9}px;"
>
  <svg
    class="inline-block absolute top-0 left-0"
    viewBox="0, 0, {width}, {height}"
    preserveAspectRatio="xMidYMid meet"

    >
  <!-- #each for all years, call function for each year calc mediums % , #each give line generater -->
  <g id="lines-chart">
    <g id="x-axis"></g>
    <g id="y-axis"></g>
    <g id="single-area">
      <path id="area-chart"></path>
    </g>
    
    <!-- <g id="all-area">
      {#each years as year, idx}
        {#each num_categories as num}
          <g>
            <line
            x1={PADDING.left + idx*Stroke_size()}
            y1={PADDING.top + chart_height - (CalculatePercentage ? CalculatePercentage(+year)[num] : 200)}
            x2={PADDING.left + idx*Stroke_size()}
            y2={PADDING.top + chart_height}
            stroke-width={Stroke_size()}
            stroke={ColourFunc(num)}
            opacity="1.0"
            />
          </g>
        {/each}
      {/each}
    </g> -->
      
  </g>
  <!-- each, each, out, line, out -->
<!-- vertical lines -->
  </svg>
</div>
