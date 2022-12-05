<script lang="ts">
  import * as d3 from "d3"
  import {
    Area,
    Chord,
    Legend,
    Map,
    Matrix,
    Network,
    Scatter,
  } from "$lib/components"
  import { Config, Types } from "$lib/utilities"
  import { fade } from "svelte/transition"
  import { Jellyfish } from "svelte-loading-spinners"
  import { onMount } from "svelte"

  const DURATION = 1000

  $: data_loaded = false
  $: width = 0
  $: height = 0

  const horizontalPadding = 24
  const verticalPadding = 6
  const header_height = 72

  $: area_width = Math.abs(width - horizontalPadding) / 2
  $: area_height = Math.abs((height - verticalPadding - header_height) * 0.8)

  $: network_width = width
  $: network_height = Math.abs(height - verticalPadding - header_height) / 2

  $: chord_width = Math.abs(width - horizontalPadding) / 2
  $: chord_height = Math.abs((height - verticalPadding - header_height) * 0.8)

  $: matrix_width = Math.abs(width - horizontalPadding) / 2
  $: matrix_height = Math.abs(height - verticalPadding - header_height) / 2

  $: map_width = Math.abs(width - horizontalPadding) / 2
  $: map_height = Math.abs(height - verticalPadding - header_height) / 2

  $: scatter_width = Math.abs(width - horizontalPadding) / 2
  $: scatter_height = Math.abs((height - verticalPadding - header_height) * 0.8)

  $: legend_width = width
  $: legend_height = height / 9

  $: show_info = false
  $: show_screencast = false

  let allLocations: Types.LocationGroup[]
  $: allLocations = []
  let allInfluencees: Types.InfluenceGroup[]
  $: allInfluencees = []
  let allInfluencers: Types.InfluenceGroup[]
  $: allInfluencers = []

  let area: Area
  let network: Network
  let chord_deaths: Chord
  let chord_mediums: Chord
  let legend_deaths: Legend
  let legend_mediums: Legend
  let map: Map
  let matrix: Matrix
  let scatter: Scatter

  const ScrollCharts = (target: any, pos: number) => {
    d3.selectAll(".highlight-button")
      .classed("bg-utah-red", false)
      .classed("bg-transparent", true)

    d3.select(target)
      .select(".highlight-button")
      .classed("bg-utah-red", true)
      .classed("bg-transparent", false)

    d3.select("#scrollable-container").attr(
      "style",
      `height: ${height}px; width: ${
        width * 3
      }px; transition: 1.0s ease all; transform: translateX(${pos}px)`
    )
  }

  const OpenInNewTab = (url: string) => {
    window.open(url, "_blank")!.focus()
  }

  const DisplayInfluences = (ev: any) => {
    ScrollCharts(ev.target, 0)
  }
  const DisplayDeaths = (ev: any) => {
    ScrollCharts(ev.target, -width)
  }
  const DisplayMediums = (ev: any) => {
    ScrollCharts(ev.target, -width * 2)
  }

  const GetArtistInfluencers = (artist: string): Types.LocationGroup[] => {
    const influencers: Types.LocationGroup[] = []
    const artistInfluencers: Types.InfluenceGroup[] = allInfluencers.filter(
      (d) => d[0] === artist
    )
    if (artistInfluencers.length > 0) {
      for (let influence of artistInfluencers[0][1]) {
        const data = allLocations.find(
          (loc) => loc[1][0].artist === influence.artist
        )
        if (data) {
          influencers.push(data)
        }
      }
    }
    return influencers
  }

  const GetArtistInfluencees = (artist: string): Types.LocationGroup[] => {
    const influencees: Types.LocationGroup[] = []
    const artistInfluencees: Types.InfluenceGroup[] = allInfluencees.filter(
      (d) => d[0] === artist
    )
    if (artistInfluencees.length > 0) {
      for (let influence of artistInfluencees[0][1]) {
        const data = allLocations.find(
          (loc) => loc[1][0].artist === influence.influenced
        )
        if (data) {
          influencees.push(data)
        }
      }
    }

    return influencees
  }

  const DisplayInfluence = (ev: any) => {
    const artist = ev.detail.artist

    let influences: Types.LocationGroup[] = GetArtistInfluencers(artist)
    influences = influences.concat(GetArtistInfluencees(artist))

    map.DisplayInfluences(artist, influences)
    network.DisplayInfluence(influences.map((d) => d[0]))
    matrix.DisplayInfluence(artist)
  }

  const HighlightArtist = (ev: any) => {
    const artist = ev.detail.artist
    const influence_type = ev.detail.influence_type
    network.HighlightArtist(artist)
    matrix.HighlightArtist(artist, influence_type)
  }

  const RestoreArtist = (ev: any) => {
    const artist = ev.detail.artist
    const influence_type = ev.detail.influence_type
    network.RestoreArtist(artist)
    matrix.RestoreArtist(artist, influence_type)
  }

  const SelectInfluencer = (ev: any) => {
    const artist = ev.detail.artist

    const influences = GetArtistInfluencees(artist)

    map.DisplayInfluences(artist, influences)
    network.DisplayInfluence(influences.map((d) => d[0]))
    matrix.SelectInfluencer(artist)
  }

  const SelectInfluencee = (ev: any) => {
    const artist = ev.detail.artist

    const influences = GetArtistInfluencers(artist)

    map.DisplayInfluences(artist, influences)
    network.DisplayInfluence(influences.map((d) => d[0]))
    matrix.SelectInfluencee(artist)
  }

  const SelectPair = (ev: any) => {
    const influencer = ev.detail.influencer
    const influencee = ev.detail.influencee
    const row = ev.detail.row
    const col = ev.detail.col

    const influences = GetArtistInfluencees(influencer)

    map.DisplayInfluences(
      influencer,
      influences.filter((d) => d[0] === influencee)
    )
    network.DisplayInfluence([influencer, influencee])
    matrix.DisplayPair(influencer, influencee)
  }

  const ResetInfluences = () => {
    network.ResetInfluences()
    map.ResetInfluences()
    matrix.ResetInfluences()
  }

  const HighlightPair = (ev: any) => {
    const influencer = ev.detail.influencer
    const influencee = ev.detail.influencee
    const row = ev.detail.row
    const col = ev.detail.col
    network.HighlightPair(influencer, influencee)
    matrix.HighlightPair(influencer, influencee, row, col)
  }

  const RestorePair = (ev: any) => {
    const influencer = ev.detail.influencer
    const influencee = ev.detail.influencee
    const row = ev.detail.row
    const col = ev.detail.col

    network.RestorePair(influencer, influencee)
    matrix.RestorePair(influencer, influencee, row, col)
  }

  // Chord functions
  const HighlightGrouping_Deaths = (ev: any) => {
    const selectedGrouping = ev.detail.chordGroup
    const selectedCent = ev.detail.chordTimeNum
    chord_deaths.HighlightGrouping(selectedGrouping, selectedCent)
    scatter.chordGroupingFocus(selectedGrouping)
    legend_deaths.singleGroupingFocus(selectedGrouping)
  }

  const RestoreGrouping_Deaths = (ev: any) => {
    const selectedGrouping = ev.detail.chordGroup
    const selectedCent = ev.detail.chordTimeNum
    chord_deaths.RestoreGrouping(selectedGrouping, selectedCent)
    scatter.chordGroupingReFocus()
    legend_deaths.singleGroupingReFocus()
  }

  const HighlightRibbon_Deaths = (ev: any) => {
    const selectedGrouping = ev.detail.chordGroup
    const selectedRibbon = ev.detail.chordIdx
    const selectedCent = ev.detail.chordTime
    chord_deaths.HighlightRibbon(selectedGrouping, selectedRibbon)
    scatter.chordRibbonFocus(selectedGrouping, selectedCent)
    legend_deaths.singleGroupingFocus(selectedGrouping)
  }

  const RestoreRibbon_Deaths = (ev: any) => {
    const selectedGrouping = ev.detail.chordGroup
    const selectedIdx = ev.detail.chordIdx
    const selectedCent = ev.detail.chordTimeNum
    chord_deaths.RestoreRibbon(selectedGrouping, selectedIdx, selectedCent)
    scatter.chordRibbonReFocus()
    legend_deaths.singleGroupingReFocus()
  }

  // Will highlight corresponding medium's area on area chart
  const HighlightGrouping_Mediums = (ev: any) => {
    const selectedGrouping = ev.detail.chordGroup
    const selectedCent = ev.detail.chordTimeNum ? ev.detail.chordTimeNum : null
    chord_mediums.HighlightGrouping(selectedGrouping, selectedCent)
    area.chordMedGroupFocus(selectedGrouping)
    legend_mediums.singleGroupingFocus(selectedGrouping)
  }

  // Will restore all medium groupings to the same opacity on the area chart
  const RestoreGrouping_Mediums = (ev: any) => {
    const selectedGrouping = ev.detail.chordGroup
    const selectedCent = ev.detail.chordTimeNum
    chord_mediums.RestoreGrouping(selectedGrouping, selectedCent)
    area.chordMedGroupReFocus()
    legend_mediums.singleGroupingReFocus()
  }

  // Will highlight area chart's corresponding medium and generate some indication of the century's frame
  const HighlightRibbon_Mediums = (ev: any) => {
    const selectedGrouping = ev.detail.chordGroup
    const selectedRibbon = ev.detail.chordIdx
    const selectedCentury = ev.detail.chordTime
    chord_mediums.HighlightRibbon(selectedGrouping, selectedRibbon)
    area.chordMedRibbonFocus(selectedGrouping, selectedCentury)
    legend_mediums.singleGroupingFocus(selectedGrouping)
  }

  // Will remove/hide indication of century's time frame and restore all areas to same opacity
  const RestoreRibbon_Mediums = (ev: any) => {
    const selectedGrouping = ev.detail.chordGroup
    const selectedIdx = ev.detail.chordIdx
    const selectedCent = ev.detail.chordTimeNum
    chord_mediums.RestoreRibbon(selectedGrouping, selectedIdx, selectedCent)
    area.chordMedRibbonReFocus()
    legend_mediums.singleGroupingReFocus()
  }

  // Zooms on horizontal axis to selected time frame AND back (see: https://bl.ocks.org/guilhermesimoes/15ed216d14175d8165e6)
  const CenturyClick_Mediums = (ev: any) => {
    const selectedTime = ev.detail.chordTime
    const selectedGroups = ev.detail.chordGroups
    chord_mediums.ClickButton(selectedTime, selectedGroups)
    area.chordMedButtonClick(selectedTime)
  }

  // Generates some indication of century's time frame on the area chart
  const HighlightButton_Mediums = (ev: any) => {
    const selectedTime = ev.detail.chordTime
    const selectedGroupings = ev.detail.chordGroups
    chord_mediums.HighlightButton(selectedTime, selectedGroupings)
    area.chordMedButtonFocus(selectedTime)
    legend_mediums.multipleGroupingsFocus(selectedGroupings)
  }

  // Removes the indication of century's time frame on the area chart (maybe use x axis' scale to determine width and starting point for rectangle with no fill, but has an outliine color?)
  const RestoreButton_Mediums = (ev: any) => {
    const selectedTime = ev.detail.chordTime
    chord_mediums.RestoreButton(selectedTime)
    area.chordMedButtonReFocus()
    legend_mediums.multipleGroupingsReFocus()
  }

  // For showing only the clicked medium on the area chart
  const ArcClick_Mediums = (ev: any) => {
    const selectedGrouping = ev.detail.chordGroup
    chord_mediums.ClickGrouping(selectedGrouping)
    area.chordArcMedButtonClick(selectedGrouping)
    //...
  }

  // I don't think we need this on second thought
  const RibbonClick_Mediums = (ev: any) => {
    const selectedGrouping = ev.detail.chordGroup
    const selectedTime = ev.detail.chordTime
    chord_mediums.ClickRibbon(selectedGrouping, selectedTime)
  }

  const ArcClick_Deaths = (ev: any) => {
    const selectedGrouping = ev.detail.chordGroup
    chord_deaths.ClickGrouping(selectedGrouping)
    scatter.chordArcClick(selectedGrouping)
  }

  const RibbonClick_Deaths = (ev: any) => {
    const selectedGrouping = ev.detail.chordGroup
    const selectedTime = ev.detail.chordTime
    chord_deaths.ClickRibbon(selectedGrouping, selectedTime)
  }

  const CenturyClick_Deaths = (ev: any) => {
    const selectedTime = ev.detail.chordTime
    const selectedGroups = ev.detail.chordGroups
    chord_deaths.ClickButton(selectedTime, selectedGroups)
    scatter.chordButtonClick(selectedTime, selectedGroups)
  }

  const HighlightButton_Deaths = (ev: any) => {
    const selectedTime = ev.detail.chordTime
    const selectedGroupings = ev.detail.chordGroups
    chord_deaths.HighlightButton(selectedTime, selectedGroupings)
    scatter.chordButtonFocus(selectedTime, selectedGroupings)
    legend_deaths.multipleGroupingsFocus(selectedGroupings)
  }

  const RestoreButton_Deaths = (ev: any) => {
    const selectedTime = ev.detail.chordTime
    chord_deaths.RestoreButton(selectedTime)
    scatter.chordButtonReFocus(selectedTime)
    legend_deaths.multipleGroupingsReFocus()
  }

  // Scatter functions
  const HighlightScatterDots = (ev: any) => {
    const selectedGrouping = ev.detail.deathGroup
    legend_deaths.singleGroupingFocus(selectedGrouping)
  }
  const RestoreScatterDots = (ev: any) => {
    legend_deaths.singleGroupingReFocus()
  }

  const ResetMediums = (ev: any) => {
    // No data passed
    area.ResetAreaChart()
  }

  const ShowInfoDialog = () => {
    show_info = true
  }

  const HideInfoDialog = () => {
    show_info = false
  }

  const ShowScreencastDialog = () => {
    show_screencast = true
  }

  const HideScreencastDialog = () => {
    show_screencast = false
  }

  onMount(async () => {
    const features: any = await d3.json(`${Config.server_url}/data/world.json`)
    const locs: Types.ArtistLocation[] | undefined = await d3.json(
      `${Config.server_url}/data/artist-locations.json`
    )
    const medLocs: Types.ArtistMedium[] | undefined = await d3.json(
      `${Config.server_url}/data/artist-mediums.json`
    )
    const artist_data: Types.ArtistData[] | undefined = await d3.json(
      `${Config.server_url}/data/artist-data.json`
    )
    const influence_data: Types.ArtistInfluence[] | undefined = await d3.json(
      `${Config.server_url}/data/artist-influences.json`
    )

    if (influence_data) {
      allInfluencees = d3.groups(
        influence_data,
        (d: Types.ArtistInfluence) => d.artist
      )
      allInfluencers = d3.groups(
        influence_data,
        (d: Types.ArtistInfluence) => d.influenced
      )
    }

    if (locs) {
      allLocations = d3.groups(locs, (d) => d.artist)
    }

    area.Initialize(locs!, medLocs!)
    chord_deaths.Initialize(locs!, artist_data!)
    chord_mediums.Initialize(locs!, medLocs!)
    legend_deaths.Initialize(artist_data!)
    legend_mediums.Initialize(medLocs!)
    map.Initialize(
      features,
      allInfluencers!,
      allInfluencees!,
      locs!,
      artist_data!
    )
    matrix.Initialize(artist_data!, influence_data!)
    network.Initialize(artist_data!, influence_data!)
    scatter.Initialize(locs!, artist_data!)

    data_loaded = true
    // show_info = true
  })
</script>

<svelte:window bind:innerWidth={width} bind:innerHeight={height} />

<header
  class="flex justify-between fixed top-4 left-4 w-full font-bold 3xl:text-4xl text-sm z-20 p-4"
  style="height: {header_height};"
>
  <span class="pt-3 3xl:pt-0"
    >Influences, Deaths, and Mediums of Renowned Artists</span
  >
  <div class="ml-4 mt-1 cursor-pointer">
    <div class="block">
      <nav class="isolate flex divide-x divide-gray-200 rounded-lg shadow">
        <!-- Current: "text-gray-900", Default: "text-gray-500 hover:text-gray-700" -->
        <div
          class="text-gray-900 rounded-l-lg group relative min-w-0 overflow-hidden bg-white py-2 px-6 text-sm font-medium text-center hover:bg-gray-50 focus:z-10"
          on:click={DisplayInfluences}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 640 512"
            class="h-6 inline-block"
            ><!--! Font Awesome Pro 6.2.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path
              fill="#c00"
              d="M288 64C288 80.85 281.5 96.18 270.8 107.6L297.7 165.2C309.9 161.8 322.7 160 336 160C374.1 160 410.4 175.5 436.3 200.7L513.9 143.7C512.7 138.7 512 133.4 512 128C512 92.65 540.7 64 576 64C611.3 64 640 92.65 640 128C640 163.3 611.3 192 576 192C563.7 192 552.1 188.5 542.3 182.4L464.7 239.4C474.5 258.8 480 280.8 480 304C480 322.5 476.5 340.2 470.1 356.5L537.5 396.9C548.2 388.8 561.5 384 576 384C611.3 384 640 412.7 640 448C640 483.3 611.3 512 576 512C540.7 512 512 483.3 512 448C512 444.6 512.3 441.3 512.8 438.1L445.4 397.6C418.1 428.5 379.8 448 336 448C264.6 448 205.4 396.1 193.1 328H123.3C113.9 351.5 90.86 368 64 368C28.65 368 0 339.3 0 304C0 268.7 28.65 240 64 240C90.86 240 113.9 256.5 123.3 280H193.1C200.6 240.9 222.9 207.1 254.2 185.5L227.3 127.9C226.2 127.1 225.1 128 224 128C188.7 128 160 99.35 160 64C160 28.65 188.7 0 224 0C259.3 0 288 28.65 288 64V64zM336 400C389 400 432 357 432 304C432 250.1 389 208 336 208C282.1 208 240 250.1 240 304C240 357 282.1 400 336 400z"
            /></svg
          >
          <span class="pointer-events-none ml-2 hidden 3xl:inline-block"
            >Influences</span
          >
          <span
            class="highlight-button bg-utah-red absolute inset-x-0 bottom-0 h-0.5"
          />
        </div>

        <div
          class="text-gray-500 hover:text-gray-700 group relative min-w-0 overflow-hidden bg-white py-2 px-6 text-sm font-medium text-center hover:bg-gray-50 focus:z-10"
          on:click={DisplayDeaths}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 448 512"
            class="h-6 inline-block"
            ><!--! Font Awesome Pro 6.2.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path
              fill="#c00"
              d="M32 192C32 86 118 0 224 0S416 86 416 192V416H32V192zM0 480c0-17.7 14.3-32 32-32H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32c-17.7 0-32-14.3-32-32zM248 120c0-13.3-10.7-24-24-24s-24 10.7-24 24v40H152c-13.3 0-24 10.7-24 24s10.7 24 24 24h48V328c0 13.3 10.7 24 24 24s24-10.7 24-24V208h48c13.3 0 24-10.7 24-24s-10.7-24-24-24H248V120z"
            /></svg
          >
          <span class="pointer-events-none ml-2 hidden 3xl:inline-block"
            >Deaths</span
          >
          <span
            class="highlight-button bg-transparent absolute inset-x-0 bottom-0 h-0.5"
          />
        </div>

        <div
          class="text-gray-500 hover:text-gray-700 group relative min-w-0 overflow-hidden bg-white py-2 px-6 text-sm font-medium text-center hover:bg-gray-50 focus:z-10"
          on:click={DisplayMediums}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
            class="h-6 inline-block"
            ><!--! Font Awesome Pro 6.2.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path
              fill="#c00"
              d="M512 256c0 .9 0 1.8 0 2.7c-.4 36.5-33.6 61.3-70.1 61.3H344c-26.5 0-48 21.5-48 48c0 3.4 .4 6.7 1 9.9c2.1 10.2 6.5 20 10.8 29.9c6.1 13.8 12.1 27.5 12.1 42c0 31.8-21.6 60.7-53.4 62c-3.5 .1-7 .2-10.6 .2C114.6 512 0 397.4 0 256S114.6 0 256 0S512 114.6 512 256zM128 288c0-17.7-14.3-32-32-32s-32 14.3-32 32s14.3 32 32 32s32-14.3 32-32zm0-96c17.7 0 32-14.3 32-32s-14.3-32-32-32s-32 14.3-32 32s14.3 32 32 32zM288 96c0-17.7-14.3-32-32-32s-32 14.3-32 32s14.3 32 32 32s32-14.3 32-32zm96 96c17.7 0 32-14.3 32-32s-14.3-32-32-32s-32 14.3-32 32s14.3 32 32 32z"
            /></svg
          >
          <span class="pointer-events-none ml-2 hidden 3xl:inline-block"
            >Mediums</span
          >
          <span
            class="highlight-button bg-transparent absolute inset-x-0 bottom-0 h-0.5"
          />
        </div>
      </nav>
    </div>
  </div>
  <div class="ml-4 mt-1 cursor-pointer">
    <div class="block">
      <nav class="isolate flex divide-x divide-gray-200 rounded-lg shadow">
        <!-- Current: "text-gray-900", Default: "text-gray-500 hover:text-gray-700" -->
        <div
          class="text-gray-500 hover:text-gray-700 rounded-l-lg group relative min-w-0 overflow-hidden bg-white py-2 px-6 text-sm font-medium text-center hover:bg-gray-50 focus:z-10"
          on:click={() =>
            OpenInNewTab(
              Config.server_url +
                "/Influences_of_Renowned_Artists_Process_Book.pdf"
            )}
        >
          <span class="pointer-events-none"
            ><svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 448 512"
              class="h-6 inline-block"
              ><!--! Font Awesome Pro 6.2.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path
                fill="#c00"
                d="M96 0C43 0 0 43 0 96V416c0 53 43 96 96 96H384h32c17.7 0 32-14.3 32-32s-14.3-32-32-32V384c17.7 0 32-14.3 32-32V32c0-17.7-14.3-32-32-32H384 96zm0 384H352v64H96c-17.7 0-32-14.3-32-32s14.3-32 32-32zm32-240c0-8.8 7.2-16 16-16H336c8.8 0 16 7.2 16 16s-7.2 16-16 16H144c-8.8 0-16-7.2-16-16zm16 48H336c8.8 0 16 7.2 16 16s-7.2 16-16 16H144c-8.8 0-16-7.2-16-16s7.2-16 16-16z"
              /></svg
            ><span class="ml-2 hidden 3xl:inline-block">Process Book</span
            ></span
          >
        </div>

        <div
          class="text-gray-500 hover:text-gray-700 group relative min-w-0 overflow-hidden bg-white py-2 px-6 text-sm font-medium text-center hover:bg-gray-50 focus:z-10"
          on:click={ShowScreencastDialog}
        >
          <span class="pointer-events-none"
            ><svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 576 512"
              class="h-6 inline-block"
              ><!--! Font Awesome Pro 6.2.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path
                fill="#c00"
                d="M512 96H64v99c-13-2-26.4-3-40-3H0V96C0 60.7 28.7 32 64 32H512c35.3 0 64 28.7 64 64V416c0 35.3-28.7 64-64 64H288V456c0-13.6-1-27-3-40H512V96zM24 224c128.1 0 232 103.9 232 232c0 13.3-10.7 24-24 24s-24-10.7-24-24c0-101.6-82.4-184-184-184c-13.3 0-24-10.7-24-24s10.7-24 24-24zm8 256c-17.7 0-32-14.3-32-32s14.3-32 32-32s32 14.3 32 32s-14.3 32-32 32zM0 344c0-13.3 10.7-24 24-24c75.1 0 136 60.9 136 136c0 13.3-10.7 24-24 24s-24-10.7-24-24c0-48.6-39.4-88-88-88c-13.3 0-24-10.7-24-24z"
              /></svg
            ><span class="ml-2 hidden 3xl:inline-block">Screen-Cast</span></span
          >
        </div>
      </nav>
    </div>
  </div>
  <div class="pr-4">
    <img
      class="object-cover 3xl:h-10 h-6 3xl:mt-0 mt-3"
      src={Config.server_url + "/SofC_Logo.png"}
      alt="SofC Logo"
    />
  </div>
</header>
<div class="absolute inset-0 overflow-x-hidden">
  <div
    id="scrollable-container"
    class="flex flex-row"
    style="height: {height}px; width: {width * 3}px; transition: 0.5s ease all;"
  >
    <div
      class="flex flex-col"
      style={(data_loaded ? "opacity: 1;" : "opacity:0;") +
        "margin-top: " +
        header_height +
        "px; width: " +
        width +
        "px;"}
    >
      <Network
        bind:this={network}
        width={network_width}
        height={network_height}
        on:display_influence={DisplayInfluence}
        on:highlight_artist={HighlightArtist}
        on:restore_artist={RestoreArtist}
        on:reset_influences={ResetInfluences}
      />
      <div class="grid-cols-2 inline-block">
        <Matrix
          bind:this={matrix}
          width={matrix_width}
          height={matrix_height}
          on:highlight_artist={HighlightArtist}
          on:restore_artist={RestoreArtist}
          on:highlight_influence_pair={HighlightPair}
          on:restore_influence_pair={RestorePair}
          on:select_influencer={SelectInfluencer}
          on:select_influencee={SelectInfluencee}
          on:reset_influences={ResetInfluences}
          on:select_pair={SelectPair}
        />
        <Map
          bind:this={map}
          width={map_width}
          height={map_height}
          on:reset_influences={ResetInfluences}
        />
      </div>
    </div>
    <div
      class="flex flex-col"
      style={(data_loaded ? "opacity: 1;" : "opacity:0;") +
        "margin-top: " +
        header_height +
        "px; width: " +
        width +
        "px;"}
    >
      <div class="grid-cols-2 inline-block">
        <Chord
          bind:this={chord_deaths}
          width={chord_width}
          height={chord_height}
          grouping="Death"
          topOffset={legend_height}
          on:highlight_chord_group={HighlightGrouping_Deaths}
          on:restore_chord_group={RestoreGrouping_Deaths}
          on:highlight_chord_ribbon={HighlightRibbon_Deaths}
          on:restore_chord_ribbon={RestoreRibbon_Deaths}
          on:click_chord_by_arc={ArcClick_Deaths}
          on:click_chord_by_ribbon={RibbonClick_Deaths}
          on:click_chord_by_century={CenturyClick_Deaths}
          on:highlight_chord_button={HighlightButton_Deaths}
          on:restore_chord_button={RestoreButton_Deaths}
        />
        <Scatter
          bind:this={scatter}
          width={scatter_width}
          height={scatter_height}
          topOffset={legend_height}
          on:highlight_scatter_dots={HighlightScatterDots}
          on:restore_scatter_dots={RestoreScatterDots}
        />
      </div>
      <Legend
        bind:this={legend_deaths}
        width={legend_width}
        height={legend_height}
        grouping={"Death"}
        topOffset={header_height}
        on:highlight_element={HighlightGrouping_Deaths}
        on:restore_elements={RestoreGrouping_Deaths}
      />
    </div>
    <div
      class="flex flex-col"
      style={(data_loaded ? "opacity: 1;" : "opacity:0;") +
        "margin-top: " +
        header_height +
        "px; width: " +
        width +
        "px;"}
    >
      <div class="grid-cols-2 inline-block">
        <Chord
          bind:this={chord_mediums}
          width={chord_width}
          height={chord_height}
          grouping="Medium"
          topOffset={legend_height}
          on:highlight_chord_group={HighlightGrouping_Mediums}
          on:restore_chord_group={RestoreGrouping_Mediums}
          on:highlight_chord_ribbon={HighlightRibbon_Mediums}
          on:restore_chord_ribbon={RestoreRibbon_Mediums}
          on:click_chord_by_arc={ArcClick_Mediums}
          on:click_chord_by_ribbon={RibbonClick_Mediums}
          on:click_chord_by_century={CenturyClick_Mediums}
          on:highlight_chord_button={HighlightButton_Mediums}
          on:restore_chord_button={RestoreButton_Mediums}
          on:reset_mediums={ResetMediums}
        />
        <Area
          bind:this={area}
          width={area_width}
          height={area_height}
          on:reset_mediums={ResetMediums}
        />
      </div>
      <Legend
        bind:this={legend_mediums}
        width={legend_width}
        height={legend_height}
        grouping={"Medium"}
        topOffset={header_height}
        on:reset_mediums={ResetMediums}
        on:highlight_element={HighlightGrouping_Mediums}
        on:restore_elements={RestoreGrouping_Mediums}
      />
    </div>
  </div>
</div>
{#if data_loaded === false}
  <div class="absolute inset-0 z-10 bg-white" out:fade={{ duration: DURATION }}>
    <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
      <Jellyfish size="100" color="#CC0000" unit="px" duration="1s" />
    </div>
  </div>
{/if}
<div
  class="flex fixed justify-center bottom-4 left-4 w-8 h-8"
  on:click={ShowInfoDialog}
>
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="#c00"
    ><!--! Font Awesome Pro 6.2.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path
      d="M256 512c141.4 0 256-114.6 256-256S397.4 0 256 0S0 114.6 0 256S114.6 512 256 512zM216 336h24V272H216c-13.3 0-24-10.7-24-24s10.7-24 24-24h48c13.3 0 24 10.7 24 24v88h8c13.3 0 24 10.7 24 24s-10.7 24-24 24H216c-13.3 0-24-10.7-24-24s10.7-24 24-24zm40-144c-17.7 0-32-14.3-32-32s14.3-32 32-32s32 14.3 32 32s-14.3 32-32 32z"
    /></svg
  >
</div>

{#if show_info}
  <div
    class="fixed inset-0 z-20"
    style="background-color: rgba(0, 0, 0, 0.25);"
    transition:fade
    on:click={HideInfoDialog}
  >
    <div
      class="overflow-hidden bg-white shadow sm:rounded-lg absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-4"
    >
      <div class="px-4 py-5 sm:px-6">
        <h3 class="text-lg font-medium leading-6 text-utah-red">
          Influences, Deaths, and Mediums of Renowned Artists
        </h3>
        <p class="mt-1 max-w-2xl text-sm text-gray-500">
          A visualization project to fullfill the requirements of CS-6630
        </p>
      </div>
      <div class="border-t border-gray-200 px-4 py-5 sm:px-6">
        <dl class="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
          <div class="sm:col-span-1">
            <dt class="text-sm font-medium text-gray-500">Team Members</dt>
            <dd class="mt-1 text-sm text-gray-900">Nishita Kharche</dd>
            <dd class="mt-1 text-sm text-gray-900">Nick Lord-Ender-Laing</dd>
            <dd class="mt-1 text-sm text-gray-900">Eisen Montalvo</dd>
          </div>
          <div class="sm:col-span-1">
            <dt class="text-sm font-medium text-gray-500">Visualization for</dt>
            <dd class="mt-1 text-sm text-gray-900">
              CS-6630: Visualization for Data Sciences
            </dd>
          </div>
          <div class="sm:col-span-1">
            <dt class="text-sm font-medium text-gray-500">Professor</dt>
            <dd class="mt-1 text-sm text-gray-900">Dr. Alexander Lex</dd>
          </div>
          <div class="sm:col-span-1">
            <dt class="text-sm font-medium text-gray-500">Built with</dt>
            <dd class="mt-1 text-sm text-gray-900">
              <a
                class="underline underline-offset-1 text-utah-red"
                href="https://kit.svelte.dev"
                target="_blank"
                >SvelteKit<svg
                  class="w-4 h-4 inline-block pl-1 -mt-1/2"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 448 512"
                  fill="#c00"
                  ><!--! Font Awesome Pro 6.2.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path
                    d="M312 144H156.7c-13.25 0-24 10.75-24 24S143.5 192 156.7 192h97.34l-135 135c-9.375 9.375-9.375 24.56 0 33.94C123.7 365.7 129.8 368 136 368s12.28-2.344 16.97-7.031L288 225.9v97.34c0 13.25 10.75 24 24 24s24-10.75 24-24V168C336 154.8 325.3 144 312 144zM384 32H64C28.65 32 0 60.66 0 96v320c0 35.34 28.65 64 64 64h320c35.35 0 64-28.66 64-64V96C448 60.66 419.3 32 384 32zM400 416c0 8.82-7.178 16-16 16H64c-8.822 0-16-7.18-16-16V96c0-8.82 7.178-16 16-16h320c8.822 0 16 7.18 16 16V416z"
                  /></svg
                ></a
              >,
              <a
                class="underline underline-offset-1 text-utah-red"
                href="https://d3js.org"
                target="_blank"
                >D3.js<svg
                  class="w-4 h-4 inline-block pl-1 -mt-1/2"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 448 512"
                  fill="#c00"
                  ><!--! Font Awesome Pro 6.2.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path
                    d="M312 144H156.7c-13.25 0-24 10.75-24 24S143.5 192 156.7 192h97.34l-135 135c-9.375 9.375-9.375 24.56 0 33.94C123.7 365.7 129.8 368 136 368s12.28-2.344 16.97-7.031L288 225.9v97.34c0 13.25 10.75 24 24 24s24-10.75 24-24V168C336 154.8 325.3 144 312 144zM384 32H64C28.65 32 0 60.66 0 96v320c0 35.34 28.65 64 64 64h320c35.35 0 64-28.66 64-64V96C448 60.66 419.3 32 384 32zM400 416c0 8.82-7.178 16-16 16H64c-8.822 0-16-7.18-16-16V96c0-8.82 7.178-16 16-16h320c8.822 0 16 7.18 16 16V416z"
                  /></svg
                ></a
              >,
              <a
                class="underline underline-offset-1 text-utah-red"
                href="https://tailwindcss.com"
                target="_blank"
                >TailwindCSS<svg
                  class="w-4 h-4 inline-block pl-1 -mt-1/2"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 448 512"
                  fill="#c00"
                  ><!--! Font Awesome Pro 6.2.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path
                    d="M312 144H156.7c-13.25 0-24 10.75-24 24S143.5 192 156.7 192h97.34l-135 135c-9.375 9.375-9.375 24.56 0 33.94C123.7 365.7 129.8 368 136 368s12.28-2.344 16.97-7.031L288 225.9v97.34c0 13.25 10.75 24 24 24s24-10.75 24-24V168C336 154.8 325.3 144 312 144zM384 32H64C28.65 32 0 60.66 0 96v320c0 35.34 28.65 64 64 64h320c35.35 0 64-28.66 64-64V96C448 60.66 419.3 32 384 32zM400 416c0 8.82-7.178 16-16 16H64c-8.822 0-16-7.18-16-16V96c0-8.82 7.178-16 16-16h320c8.822 0 16 7.18 16 16V416z"
                  /></svg
                ></a
              >,
              <a
                class="underline underline-offset-1 text-utah-red"
                href="https://www.typescriptlang.org"
                target="_blank"
                >Typescript<svg
                  class="w-4 h-4 inline-block pl-1 -mt-1/2"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 448 512"
                  fill="#c00"
                  ><!--! Font Awesome Pro 6.2.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path
                    d="M312 144H156.7c-13.25 0-24 10.75-24 24S143.5 192 156.7 192h97.34l-135 135c-9.375 9.375-9.375 24.56 0 33.94C123.7 365.7 129.8 368 136 368s12.28-2.344 16.97-7.031L288 225.9v97.34c0 13.25 10.75 24 24 24s24-10.75 24-24V168C336 154.8 325.3 144 312 144zM384 32H64C28.65 32 0 60.66 0 96v320c0 35.34 28.65 64 64 64h320c35.35 0 64-28.66 64-64V96C448 60.66 419.3 32 384 32zM400 416c0 8.82-7.178 16-16 16H64c-8.822 0-16-7.18-16-16V96c0-8.82 7.178-16 16-16h320c8.822 0 16 7.18 16 16V416z"
                  /></svg
                ></a
              >, and
              <a
                class="underline underline-offset-1 text-utah-red"
                href="https://nodejs.dev/en/"
                target="_blank"
                >Node.js<svg
                  class="w-4 h-4 inline-block pl-1 -mt-1/2"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 448 512"
                  fill="#c00"
                  ><!--! Font Awesome Pro 6.2.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path
                    d="M312 144H156.7c-13.25 0-24 10.75-24 24S143.5 192 156.7 192h97.34l-135 135c-9.375 9.375-9.375 24.56 0 33.94C123.7 365.7 129.8 368 136 368s12.28-2.344 16.97-7.031L288 225.9v97.34c0 13.25 10.75 24 24 24s24-10.75 24-24V168C336 154.8 325.3 144 312 144zM384 32H64C28.65 32 0 60.66 0 96v320c0 35.34 28.65 64 64 64h320c35.35 0 64-28.66 64-64V96C448 60.66 419.3 32 384 32zM400 416c0 8.82-7.178 16-16 16H64c-8.822 0-16-7.18-16-16V96c0-8.82 7.178-16 16-16h320c8.822 0 16 7.18 16 16V416z"
                  /></svg
                ></a
              >
            </dd>
          </div>
          <div class="sm:col-span-2">
            <dt class="text-sm font-medium text-gray-500">About</dt>
            <dd class="mt-1 text-sm text-gray-900">
              In Influences, Deaths, and Mediums of Renowned Artists, we wanted
              to explore three areas: How do artistic influences transcend time
              and location? How true is the stereotype of the tortured artist
              with a tragic death? And how the prevalence of different artistic
              mediums change over time?
            </dd>
          </div>
        </dl>
      </div>
    </div>
  </div>
{/if}

{#if show_screencast}
  <div
    class="fixed inset-0 z-20"
    style="background-color: rgba(0, 0, 0, 0.25);"
    transition:fade
    on:click={HideScreencastDialog}
  >
    <iframe
      width={width / 2}
      height={height / 2}
      class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
      src="https://www.youtube.com/embed/P-stOChQhec"
      title="Project Screencast"
      frameborder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen
    />
  </div>
{/if}
