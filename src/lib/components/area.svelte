<script lang="ts">
  import { Types } from "$lib/utilities"
  import type { ArtistData, ArtistInfluence, ArtistLocation, ArtistMedium } from "$lib/utilities/types"
  import * as d3 from "d3"
    import { geoConicConformal } from "d3";

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

  let tl_x_scale: d3.ScaleLinear<number, number, never>
  let tl_x_axis = null

  let size_years: number | undefined
  let years = new Array<number>(size_years!);

  let group_artists: any = []
  let num_categories = new Array<number>(5)
  // $: num_categories 


  const calculate_percentage = (year: number) => {
    // console.log('year', year)
    // group_artists = d3.groups(artists, d => d.artist)
    // console.log('group_artists', group_artists)
    
    const artists_alive = group_artists.filter(([, locations]) => {
      if (locations.length > 1) {
        return locations[0].year <= year && locations[1].year > year
      } else {
        return locations[0].year <= year // if alive 
      }
    })
    // console.log(artists_alive)
    let category_mediums = [0,0,0,0,0]; // number of categories considered, [painter, sculptor, watercolourist, printmaker, draughtsman]
    // console.log('arr', category_mediums[0])
    for(var alive_artist of artists_alive){
      // console.log(alive_artist)
      const artist_medium_list = mediums.filter(d => d.artist===alive_artist[0])
      // console.log(artist_medium_list)
      for(var medium of artist_medium_list){
        // console.log(medium.medium)
        if(medium.medium === 'painter'){
          category_mediums[0] = category_mediums[0] + 1
        }
        if(medium.medium === 'watercolourist'){
          category_mediums[1] = category_mediums[1] + 1
        }
        if(medium.medium === 'sculptor'){
          category_mediums[2] = category_mediums[2] + 1
        }
        if(medium.medium === 'printmaker'){
          category_mediums[3] = category_mediums[3] + 1
        }
        if(medium.medium === 'draughtsman'){
          category_mediums[4] = category_mediums[4] + 1
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

    // return 100;
    

    // for a year
    // for a medium 
    // take all medium 


    //chart from hw3
    //vertical line hover from hw4

  }

  const colourFunc = (num: number) => {
    // console.log('num', num)
    if(num===0){
      return "#ff0000"
    }
    if(num===1){
      return "#00ff00"
    }
    if(num===2){
      return "#0000ff"
    }
    if(num===3){
      return "#00ffff"
    }
    if(num===4){
      return "#ff00ff"
    }
  }

  const areaChart = () => {
    console.log('here')
    
  }

  export const Initialize = (
    location_data: Types.ArtistLocation[],
    medium_data: Types.ArtistMedium[]
    ) => {
    artists = location_data
    mediums = medium_data

    chart_width = height - PADDING.left - PADDING.right
    chart_height = width - PADDING.top - PADDING.bottom

    chart_height = 400

    oldestYear = +d3.min(location_data, (d) => d.year)! // TODO: CHANGE THIS
    oldestYear = 1700
    year = oldestYear!
    youngestYear = +d3.max(location_data, (d) => d.year)!
    size_years = youngestYear - oldestYear
    for(let i=0; i<size_years; i++){
      years[i] = oldestYear + i
    }
    console.log('years', years)

    // let all_years =  

    tl_x_scale = d3
        .scaleLinear()
        .domain([oldestYear!, youngestYear!])
        .range([0, width])
    tl_x_axis = d3
      .axisBottom(tl_x_scale)
      .tickFormat((d) => {
        return Number(d) % yearEvery === 0 ? String(d) : ""
      })
      .ticks((youngestYear! - oldestYear!) / tickEvery)
 
    areaChart()

    group_artists = d3.groups(artists, d => d.artist)

    num_categories = [5, 4 , 3 , 2 , 1 ,0]
    calculate_percentage(1900)
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
    <!-- {#each category_mediums as category, category_num} -->
      {#each years as year, idx}
        <!-- {#each num_categories as num}
          <g/>
        {/each} -->
        <g>
          <line
            x1={idx}
            y1={PADDING.top + chart_height - (calculate_percentage ? calculate_percentage(+year)[4] : 200)}
            x2={idx}
            y2={PADDING.top + chart_height}
            stroke-width="1.0"
            stroke={colourFunc(4)}
            opacity="0.2"
          />
          <line
            x1={idx}
            y1={PADDING.top + chart_height - (calculate_percentage ? calculate_percentage(+year)[3] : 200)}
            x2={idx}
            y2={PADDING.top + chart_height}
            stroke-width="1.0"
            stroke={colourFunc(3)}
            opacity="0.2"
          />
          <line
            x1={idx}
            y1={PADDING.top + chart_height - (calculate_percentage ? calculate_percentage(+year)[2] : 200)}
            x2={idx}
            y2={PADDING.top + chart_height}
            stroke-width="1.0"
            stroke={colourFunc(2)}
            opacity="0.2"
          />
          <line
            x1={idx}
            y1={PADDING.top + chart_height - (calculate_percentage ? calculate_percentage(+year)[1] : 200)}
            x2={idx}
            y2={PADDING.top + chart_height}
            stroke-width="1.0"
            stroke={colourFunc(1)}
            opacity="0.2"
          />
          <line
            x1={idx}
            y1={PADDING.top + chart_height - (calculate_percentage ? calculate_percentage(+year)[0] : 200)}
            x2={idx}
            y2={PADDING.top + chart_height}
            stroke-width="1.0"
            stroke={colourFunc(0)}
            opacity="0.2"
          />
        </g>
      {/each}
    <!-- {/each} -->
  </g>
  <!-- each, each, out, line, out -->
<!-- vertical lines -->
  </svg>
</div>
