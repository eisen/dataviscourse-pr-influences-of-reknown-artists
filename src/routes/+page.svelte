<script lang="ts">
  import * as d3 from "d3"
  import { Area, Chord, Map, Matrix, Network, Scatter } from "$lib/components"
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
  const footer_height = 24

  $: area_width = Math.abs(width - horizontalPadding) / 2
  $: area_height = Math.abs(
    height - verticalPadding - header_height - footer_height
  )

  $: network_width = width
  $: network_height =
    Math.abs(height - verticalPadding - header_height - footer_height) / 2

  $: chord_width = Math.abs(width - horizontalPadding) / 2
  $: chord_height = Math.abs(
    height - verticalPadding - header_height - footer_height
  )

  $: matrix_width = Math.abs(width - horizontalPadding) / 2
  $: matrix_height =
    Math.abs(height - verticalPadding - header_height - footer_height) / 2

  $: map_width = Math.abs(width - horizontalPadding) / 2
  $: map_height =
    Math.abs(height - verticalPadding - header_height - footer_height) / 2

  $: scatter_width = Math.abs(width - horizontalPadding) / 2
  $: scatter_height = Math.abs(
    height - verticalPadding - header_height - footer_height
  )

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
  let map: Map
  let matrix: Matrix
  let scatter: Scatter

  const ScrollCharts = (target: any, pos: number) => {
    d3.selectAll(".highlight")
      .classed("bg-utah-red", false)
      .classed("bg-transparent", true)

    d3.select(target)
      .select(".highlight")
      .classed("bg-utah-red", true)
      .classed("bg-transparent", false)

    d3.select("#scrollable-container").attr(
      "style",
      `height: ${height}px; width: ${
        width * 3
      }px; transition: 1.0s ease all; transform: translateX(${pos}px)`
    )
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
      // console.log("Influencers")
      for (let influence of artistInfluencers[0][1]) {
        const data = allLocations.find(
          (loc) => loc[1][0].artist === influence.artist
        )
        if (data) {
          influencers.push(data)
          // console.log(
          //   allLocations.find((loc) => loc[1][0].artist === influence.artist)
          // )
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
      //console.log("Influencees")
      for (let influence of artistInfluencees[0][1]) {
        const data = allLocations.find(
          (loc) => loc[1][0].artist === influence.influenced
        )
        if (data) {
          influencees.push(data)
          // console.log(
          //   allLocations.find(
          //     (loc) => loc[1][0].artist === influence.influenced
          //   )
          // )
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
  }

  const SelectInfluencee = (ev: any) => {
    const artist = ev.detail.artist

    const influences = GetArtistInfluencers(artist)

    map.DisplayInfluences(artist, influences)
    network.DisplayInfluence(influences.map((d) => d[0]))
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

    area.Initialize()
    chord_deaths.Initialize(locs!, medLocs!)
    chord_mediums.Initialize(locs!, medLocs!)
    map.Initialize(
      features,
      allInfluencers!,
      allInfluencees!,
      locs!,
      artist_data!
    )
    matrix.Initialize(artist_data!, influence_data!)
    network.Initialize(artist_data!, influence_data!)
    scatter.Initialize()

    data_loaded = true
  })
</script>

<svelte:window bind:innerWidth={width} bind:innerHeight={height} />

<header
  class="flex justify-between fixed top-4 left-4 w-full font-bold text-4xl z-20 p-4"
  style="height: {header_height};"
>
  <span>Influences, Deaths, and Mediums of Renown Artists</span>
  <div class="ml-4 mt-1 cursor-pointer">
    <div class="block">
      <nav class="isolate flex divide-x divide-gray-200 rounded-lg shadow">
        <!-- Current: "text-gray-900", Default: "text-gray-500 hover:text-gray-700" -->
        <div
          class="text-gray-900 rounded-l-lg group relative min-w-0 flex-1 overflow-hidden bg-white py-2 px-4 text-sm font-medium text-center hover:bg-gray-50 focus:z-10"
          on:click={DisplayInfluences}
        >
          <span class="pointer-events-none">Influences</span>
          <span
            class="highlight bg-utah-red absolute inset-x-0 bottom-0 h-0.5"
          />
        </div>

        <div
          class="text-gray-500 hover:text-gray-700 group relative min-w-0 flex-1 overflow-hidden bg-white py-2 px-4 text-sm font-medium text-center hover:bg-gray-50 focus:z-10"
          on:click={DisplayDeaths}
        >
          <span class="pointer-events-none">Deaths</span>
          <span
            class="highlight bg-transparent absolute inset-x-0 bottom-0 h-0.5"
          />
        </div>

        <div
          class="text-gray-500 hover:text-gray-700 group relative min-w-0 flex-1 overflow-hidden bg-white py-2 px-4 text-sm font-medium text-center hover:bg-gray-50 focus:z-10"
          on:click={DisplayMediums}
        >
          <span class="pointer-events-none">Mediums</span>
          <span
            class="highlight bg-transparent absolute inset-x-0 bottom-0 h-0.5"
          />
        </div>
      </nav>
    </div>
  </div>
  <div class="pr-4">
    <img
      style="height: 40px;"
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
      class="grid-cols-2 inline-block"
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
      />
      <Matrix
        bind:this={matrix}
        width={matrix_width}
        height={matrix_height}
        on:highlight_artist={HighlightArtist}
        on:restore_artist={RestoreArtist}
        on:select_influencer={SelectInfluencer}
        on:select_influencee={SelectInfluencee}
      />
      <Map bind:this={map} width={map_width} height={map_height} />
    </div>
    <div
      class="grid-cols-2 inline-block"
      style={(data_loaded ? "opacity: 1;" : "opacity:0;") +
        "margin-top: " +
        header_height +
        "px; width: " +
        width +
        "px;"}
    >
      <Chord
        bind:this={chord_deaths}
        width={chord_width}
        height={chord_height}
      />
      <Scatter
        bind:this={scatter}
        width={scatter_width}
        height={scatter_height}
      />
    </div>
    <div
      class="grid-cols-2 inline-block"
      style={(data_loaded ? "opacity: 1;" : "opacity:0;") +
        "margin-top: " +
        header_height +
        "px; width: " +
        width +
        "px;"}
    >
      <Chord
        bind:this={chord_mediums}
        width={chord_width}
        height={chord_height}
      />
      <Area bind:this={area} width={area_width} height={area_height} />
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
<footer class="flex fixed justify-center bottom-0 w-full">
  <span
    >Team members: Nishita Kharche, Nick Lord-Ender-Laing, Eisen Montalvo</span
  >
</footer>
