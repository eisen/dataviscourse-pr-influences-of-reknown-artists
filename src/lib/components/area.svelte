<script lang="ts">
  import { Types, Helpers } from "$lib/utilities"
  import type { ArtistData, ArtistInfluence, ArtistLocation, ArtistMedium } from "$lib/utilities/types"
  import * as d3 from "d3"

  export let width: number = 0
  export let height: number = 0

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
  let area_lines_percentage:number[][]
  $: area_lines_percentage = []
  let each_area_line:number[][]
  $: each_area_line = []

  let single_total:number
  $: single_total

  let category_names = ['painter', 'watercolourist', 'oilpainter', 'sculptor', 'printmaker', 'draughtsman', 'muralist',
'photography', 'film', 'illustrator', 'architect', 'ink', 'ceramicist', 'calligrapher', 'engraving']

  // let chordColorScale = d3
  //   .scaleOrdinal()
  //   .domain(d3.range(Helpers.ColorScheme.length))
  //   .range(Helpers.ColorScheme)

  let chordColorScale = d3
    .scaleOrdinal()
    .domain(d3.range(10))
    .range(d3.schemePaired)


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
          total_mediums_one_year = total_mediums_one_year + 1 //TODO: check logic, should check if its there in the category_names
        }
      }
      // console.log(i, total_mediums_one_year)
      // single_total = single_total > total_mediums_one_year? single_total : total_mediums_one_year // Used for y axis 
      // convert to percentage
      area_values[i] = (area_values[i] / total_mediums_one_year) * 100
      i=i+1
    }
    // console.log(area_values)
    return area_values //these are percentages 

    // for(let i=0; i<years.length; i++){
    //   area_values[i] = (area_values[i]/total) * chart_height
    // }
    
  }

  const DataForAllAreaChartLine = () => {
    // For each category 
    let num=0
    for(var category of category_names){
      let area_values = new Array<number>(size_years!)
      let i=0

      for(var year of years){
        let total_mediums_one_year = 0
        let alive = AliveArtists(year)
        area_values[i] = 0
        let alive_artist_medium_list:any = []

        for(var alive_artist of alive){
          alive_artist_medium_list = mediums.filter(d => d.artist===alive_artist[0])

          for(var medium of alive_artist_medium_list){
            if(medium.medium === category){
              area_values[i] = area_values[i] + 1
            }
            total_mediums_one_year = total_mediums_one_year + 1
          }
        }
        // convert to percentage
        if(total_mediums_one_year){
          area_values[i] = (area_values[i] / total_mediums_one_year) * 100
        }
        i=i+1
      }
      // console.log('area_values', area_values)
      area_lines[num] = area_values
      num = num + 1
    }
    console.log('final values', area_lines)
    area_lines_percentage = area_lines
  }

  const AllAreaChart = () => {

    // X SCALE
    var xScale = d3.scaleLinear()
    .domain([0, size_years!])
    .range([0, chart_width]);

    // Y SCALE
    // let maxY = d3.max(area_line_values!)
    // let maxY = single_total
    var yScale = d3.scaleLinear()
    .domain([0, 100])
    .range([chart_height, 0]);

    
    const areaGenerator = d3.area()
      .x((d) => xScale(d.x - oldestYear!) + PADDING.left)
      .y1(d => yScale(d.y) + PADDING.top)
      .y0(chart_height + PADDING.top)
      .curve(d3.curveCatmullRom.alpha(0.6))
      .context(null);

    // Calculate percentage 
    for(var n=0; n<category_names.length-1; n++){
      for(var y=0; y<years.length; y++){
        // area_lines[n+1][y] = area_lines[n][y] + area_lines[n+1][y]
        area_lines_percentage[n+1][y] = area_lines[n][y] + area_lines[n+1][y]
      }
    }

    // Draw all in category
    let num = 0
    for(var category of category_names){
      // console.log(category_names.length - 1 - num)
      let area_line_values = area_lines_percentage[category_names.length - 1 - num]
      num = num + 1
      each_area_line = []
      for(let i=0; i<years.length; i++){
        const each_pair: any = {
          x: years[i],
          y: area_line_values[i],
        }
        each_area_line.push(each_pair)
      }
      let area_id = '#area-chart-' + num.toString()
      // console.log(area_id)
      d3.select('#all-area-chart')
      .append('path')
      .attr('id', area_id)
      .datum(each_area_line)
      .attr("d", areaGenerator)
      .style('fill', ColourFunc(num))
      .attr('opacity', '1.0')

    }
    
  }
  
  const IndividualAreaChart = (category:string) => {
    let idx = category_names.indexOf(category)
    console.log(idx)
    // Make all category area chart transparent 
    d3.select('#all-area-chart')
    .attr('opacity', '0.0')

    // let area_line_values = DataForAreaChartLine(category)
    let area_line_values = area_lines[idx]
    console.log('area_line_values', area_line_values)

    // X SCALE
    var xScale = d3.scaleLinear()
    .domain([0, size_years!])
    .range([0, chart_width]);

    // Y SCALE
    // let maxY = d3.max(area_line_values!)
    // let maxY = single_total
    var yScale = d3.scaleLinear()
    .domain([0, 100])
    .range([chart_height, 0]);

    
    const areaGenerator = d3.area()
      .x((d) => xScale(d.x - oldestYear!) + PADDING.left)
      .y1(d => yScale(d.y) + PADDING.top)
      .y0(chart_height + PADDING.top)
      .curve(d3.curveCatmullRom.alpha(0.6))
      .context(null);

    each_area_line = []
    for(let i=0; i<years.length; i++){
      const each_pair: any = {
        x: years[i],
        y: area_line_values[i],
      }
      each_area_line.push(each_pair)
    }
    
    d3.select('#area-chart')
    .datum(each_area_line)
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

  const ColourFunc = (num: number):string => {
    if(num){
      return chordColorScale(num.toString()) as string
    }
    else{
      return 'black'
    }
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

  const SetYears = (young: number, old: number) => {
    size_years = young - old // TODO: change this when clicking on century button to show only that century
    for(let i=0; i<size_years; i++){
      years[i] = old + i 
    }
  }

  export const Initialize = (
    location_data: Types.ArtistLocation[],
    medium_data: Types.ArtistMedium[]
    ) => {
    artists = location_data
    mediums = medium_data

    chart_width = width - PADDING.left - PADDING.right
    chart_width = width * 0.8
    // chart_height = height - PADDING.top - PADDING.bottom
    chart_height = height * 0.75
    group_artists = d3.groups(artists, d => d.artist)
    num_categories = d3.range(category_names.length).reverse()


    oldestYear = +d3.min(location_data, (d) => d.year)! // TODO: Change this
    youngestYear = +d3.max(location_data, (d) => d.year)!


    
   
    // size_years = youngestYear - oldestYear // TODO: change this when clicking on century button to show only that century
    // for(let i=0; i<size_years; i++){
    //   years[i] = oldestYear + i 
    // }

    // Change to show all categories of aea chart 
    oldestYear = 1800
    youngestYear = 1900
    SetYears(youngestYear, oldestYear)


    // TODO: onClick, selecting the medium should display only that category
    DrawAxesSingle()
    DataForAllAreaChartLine()
    AllAreaChart()

    // HighlightCategory('sculptor')

    // Change to individual area chart 
    oldestYear = 1500
    youngestYear = 1700
    SetYears(youngestYear, oldestYear)
    DrawAxesSingle()
    DataForAllAreaChartLine()
    IndividualAreaChart('painter')

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
  <!-- #each for all years, call function for each year calc mediums % , #each give line generater -->
  <g id="lines-chart">
    <g id="x-axis"></g>
    <g id="y-axis"></g>

    <g id="single-area">
      <path id="area-chart"></path>
    </g>
    
    <g id='all-area-chart'>
    </g>
      
  </g>
  <!-- each, each, out, line, out -->
<!-- vertical lines -->
  </svg>
</div>
