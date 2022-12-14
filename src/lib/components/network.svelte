<script lang="ts">
  import * as d3 from "d3"
  import { fade } from "svelte/transition"
  import { createEventDispatcher, tick } from "svelte"
  import { Config, Helpers, Types } from "$lib/utilities"

  const DURATION = 500
  const PADDING = 20
  const OFFSET_X = 40
  const OFFSET_Y = 0
  const HIGHLIGHT_RADIUS = 50

  const LEGEND_WIDTH = 140
  const LEGEND_HEIGHT = 60
  const LEGEND_SCALE = 0.8

  let simWorker: Worker | undefined = new Worker(
    new URL("workers/sim-links.worker.ts?worker", import.meta.url)
  )

  const OnWorkerMessage = (event: any) => {
    artists = event.data.nodes
    links = event.data.links
  }

  simWorker.onmessage = OnWorkerMessage

  let artists: Types.ArtistData[]
  $: artists = []
  let links: Types.ArtistLink[]
  $: links = []
  let positions: Types.ArtistPosition[]
  $: positions = []
  let influences: string[]
  $: influences = []

  $: current_count = 0

  let allArtists: Types.ArtistData[]
  let allLinks: Types.ArtistLink[]
  let allInfluences: Types.ArtistInfluence[]

  export let width: number = 0
  export let height: number = 0

  const dispatch = createEventDispatcher()

  $: RADIUS = height / 37

  $: blurb_x = 0
  $: blurb_y = 0
  $: blurb_text = ""
  $: display_blurb = false

  const Translate = (x: number | undefined, y: number | undefined) =>
    `translate(${x! - OFFSET_X}, ${y! - OFFSET_Y})`

  const OnMouseOver = (name: any) => {
    dispatch("highlight_artist", {
      artist: name,
      influence_type: Types.InfluenceType.Both,
    })
  }
  const OnMouseOut = (name: any) => {
    dispatch("restore_artist", {
      artist: name,
      influence_type: Types.InfluenceType.Both,
    })
  }

  export const HighlightPair = (influencer: string, influencee: string) => {
    HighlightArtist(influencer, influencee)
    HighlightArtist(influencee, influencer)
  }

  export const HighlightArtist = (name: string, other?: string) => {
    const target = "#" + Helpers.ArtistID(name)
    d3.select(target + "-group").raise()
    d3.select(target + "-text")
      .transition()
      .duration(DURATION)
      .attr("opacity", 1)

    d3.select(target + "-rect")
      .transition()
      .duration(DURATION)
      .attr("opacity", 1)

    d3.select(target + "-image")
      .transition()
      .duration(DURATION)
      .attr("width", 100)
      .attr("height", 100)
      .attr("x", -HIGHLIGHT_RADIUS)
      .attr("y", -HIGHLIGHT_RADIUS)

    d3.select(target + "-circle")
      .transition()
      .duration(DURATION)
      .attr("r", HIGHLIGHT_RADIUS)

    const this_artist = artists.find((d) => d.artist === name)
    if (other) {
      let sign = 1
      const other_artist = artists.find((d) => d.artist === other)
      let distance = Helpers.Distance(
        this_artist!.x!,
        this_artist!.y!,
        other_artist!.x!,
        other_artist!.y!
      )
      if (this_artist!.x! < other_artist!.x!) {
        sign = -1
      }
      if (distance < HIGHLIGHT_RADIUS * 3) {
        const group_target = "#" + Helpers.ArtistID(name) + "-group"
        const group = d3.select(group_target)
        const transform = group.attr("transform")
        const translate = Helpers.GetTransformValues(transform)
        const node = group!.node()! as Element
        const width = node!.getBoundingClientRect()!.width

        group
          .transition()
          .duration(DURATION)
          .attr(
            "transform",
            `translate(${translate[0] + (sign * width) / 2},${translate[1]})`
          )
      }
    } else {
      if (this_artist!.blurb) {
        display_blurb = true
        blurb_text = this_artist!.blurb
        blurb_x = width / 2 + this_artist!.x! + RADIUS * 1.5

        tick().then(() => {
          const node = d3.select("#blurb_node").node()! as Element
          const box_height = node!.getBoundingClientRect()!.height
          blurb_y = this_artist!.y! - box_height / 2
        })
      }
    }
  }

  export const RestorePair = (influencer: string, influencee: string) => {
    RestoreArtist(influencer, influencee)
    RestoreArtist(influencee, influencer)
  }

  export const RestoreArtist = (name: any, other?: string) => {
    const target = "#" + Helpers.ArtistID(name)
    d3.select(target + "-text")
      .transition()
      .duration(DURATION)
      .attr("opacity", 0)

    d3.select(target + "-rect")
      .transition()
      .duration(DURATION)
      .attr("opacity", 0)

    d3.select(target + "-image")
      .transition()
      .duration(DURATION)
      .attr("width", RADIUS * 2)
      .attr("height", RADIUS * 2)
      .attr("x", -RADIUS)
      .attr("y", -RADIUS)

    d3.select(target + "-circle")
      .transition()
      .duration(DURATION)
      .attr("r", RADIUS)

    display_blurb = false

    if (other) {
      const this_artist = artists.find((d) => d.artist === name)
      const group_target = "#" + Helpers.ArtistID(name) + "-group"
      const group = d3.select(group_target)

      group
        .transition()
        .duration(DURATION)
        .attr(
          "transform",
          Translate(this_artist!.x! + width / 2, this_artist!.y!)
        )
    }
  }

  export const DisplayInfluence = (in_influences: string[]) => {
    positions = []
    for (const influence of in_influences) {
      const position = artists.filter((d) => d.artist === influence)[0]
      positions.push({ x: position.x!, y: position.y! })
    }
    influences = in_influences
    current_count += 1
  }

  export const ResetInfluences = () => {
    positions = []
    influences = []
    current_count += 1
  }

  const IsInfluenceLink = (link: any) => {
    return (
      influences.includes(link.source.artist) &&
      influences.includes(link.target.artist)
    )
  }

  const OnMouseClick = (target: any) => {
    dispatch("display_influence", {
      artist: target,
    })
  }

  const OnMouseClickReset = () => {
    dispatch("reset_influences", {})
  }

  export const Initialize = (
    artist_data: Types.ArtistData[],
    influence_data: Types.ArtistInfluence[]
  ) => {
    for (let artist of artist_data) {
      artist.x = 0
      artist.y = height / 2
    }
    allArtists = artist_data
    allInfluences = influence_data
    allLinks = d3.map(
      influence_data,
      (d: Types.ArtistInfluence): Types.ArtistLink => {
        const link: Types.ArtistLink = {
          source: d.artist,
          target: d.influenced,
        }
        return link
      }
    )

    artists = allArtists // Render them before starting the sim to calculate text bounding boxes

    simWorker!.postMessage({
      nodes: allArtists,
      links: allLinks,
      radius: RADIUS,
      height: height,
    })
  }
</script>

<div
  id="container"
  class="inline-block relative align-top overflow-hidden"
  style="width: {width}px; height: {height}px;"
>
  <div
    class="absolute left-1/2 -translate-x-1/2 bottom-0"
    style="width: {LEGEND_WIDTH * LEGEND_SCALE}px; height: {LEGEND_HEIGHT *
      LEGEND_SCALE}px;"
  >
    <svg
      id="legend"
      class="inline-block absolute top-0 left-0"
      style="padding-top: 10px;"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 {LEGEND_WIDTH} {LEGEND_HEIGHT}"
      preserveAspectRatio="xMidYMid meet"
    >
      <g transform="scale({LEGEND_SCALE})">
        <rect
          x="2"
          y="2"
          width={LEGEND_WIDTH - 8}
          height={LEGEND_HEIGHT - 4}
          fill="white"
          stroke="black"
          rx="15"
        />
        <line
          marker-end="url(#arrowhead)"
          marker-start="url(#arrowtail)"
          x1="20"
          y1="20"
          x2="115"
          y2="20"
          stroke="black"
        />
        <circle
          cx="20"
          cy="20"
          r={RADIUS * LEGEND_SCALE}
          fill="white"
          stroke="black"
        />
        <text x="15" y="25">A</text>
        <circle
          cx="115"
          cy="20"
          r={RADIUS * LEGEND_SCALE}
          fill="white"
          stroke="black"
        />
        <text x="110" y="25">B</text>
        <text x="15" y="50">A influenced B</text>
      </g>
    </svg>
  </div>
  <svg
    class="inline-block absolute top-0 left-0"
    viewBox="0, 0, {width}, {height}"
    preserveAspectRatio="xMidYMid meet"
  >
    <defs>
      <marker
        id="arrowhead"
        viewBox="-0 -5 10 10"
        refX={RADIUS * 2}
        refY="0"
        orient="auto"
        markerWidth="7"
        markerHeight="7"
      >
        <path d="M 0,-5 L 10 ,0 L 0,5" fill="black" stroke="none" />
      </marker>
      <marker
        id="arrowtail"
        viewBox="-0 -5 10 10"
        refX={RADIUS * 2}
        refY="0"
        orient="auto-start-reverse"
        markerWidth="7"
        markerHeight="7"
      >
        <circle cx="8" cy="0" r="5" fill="black" stroke="none" />
      </marker>
    </defs>
    <g on:click={OnMouseClickReset}>
      <rect x="0" y="0" {width} {height} fill="transparent" />
    </g>
    <g id="splat">
      {#each positions as position}
        <circle
          cx={position.x + width / 2 - OFFSET_X}
          cy={position.y}
          r={RADIUS * 1.75}
          fill="#c00"
          transition:fade
        />
      {/each}
    </g>

    <g id="links">
      {#key current_count}
        {#each links as link}
          {#if IsInfluenceLink(link)}
            <g>
              <line
                x1={link.source.x + width / 2 - OFFSET_X}
                y1={link.source.y - OFFSET_Y}
                x2={link.target.x + width / 2 - OFFSET_X}
                y2={link.target.y - OFFSET_Y}
                stroke="#c00"
                stroke-width={RADIUS * 1.5}
                transition:fade
              />
            </g>
          {/if}
        {/each}
      {/key}
      {#each links as link}
        <g>
          <line
            marker-end="url(#arrowhead)"
            marker-start="url(#arrowtail)"
            x1={link.source.x + width / 2 - OFFSET_X}
            y1={link.source.y - OFFSET_Y}
            x2={link.target.x + width / 2 - OFFSET_X}
            y2={link.target.y - OFFSET_Y}
            stroke="black"
          />
        </g>
      {/each}
    </g>
    <g id="nodes">
      {#each artists as artist}
        <g
          transform={Translate(artist.x + width / 2, artist.y)}
          id={Helpers.ArtistName(artist) + "-group"}
          class="cursor-pointer"
        >
          <image
            id={Helpers.ArtistName(artist) + "-image"}
            href={Config.server_url + artist.thumbnail}
            height={RADIUS * 2}
            width={RADIUS * 2}
            x={-RADIUS}
            y={-RADIUS}
            style="outline: none;"
            on:focus={(ev) => OnMouseOver(artist.artist)}
            on:mouseover={(ev) => OnMouseOver(artist.artist)}
            on:blur={(ev) => OnMouseOut(artist.artist)}
            on:mouseout={(ev) => OnMouseOut(artist.artist)}
            on:click={(ev) => OnMouseClick(artist.artist)}
          />
          <circle
            id={Helpers.ArtistName(artist) + "-circle"}
            cx="0"
            cy="0"
            r={RADIUS}
            stroke={artist.blurb ? "#c00" : "black"}
            stroke-width={artist.blurb ? "3" : "1"}
            fill="none"
          />
          <rect
            id={Helpers.ArtistName(artist) + "-rect"}
            x={-(
              Helpers.TextWidth(
                "#" + Helpers.ArtistName(artist) + "-text",
                artist.artist
              ) + PADDING
            ) / 2}
            width={Helpers.TextWidth(
              "#" + Helpers.ArtistName(artist) + "-text",
              artist.artist
            ) + PADDING}
            y={RADIUS +
              65 -
              (Helpers.TextHeight(
                "#" + Helpers.ArtistName(artist) + "-text",
                artist.artist
              ) +
                PADDING) /
                2}
            height={Helpers.TextHeight(
              "#" + Helpers.ArtistName(artist) + "-text",
              artist.artist
            ) +
              PADDING -
              10}
            fill="white"
            stroke="black"
            rx="15"
            opacity="0"
            class="pointer-events-none"
          />
          <text
            class="cursor-default pointer-events-none"
            id={Helpers.ArtistName(artist) + "-text"}
            x="0"
            y={RADIUS + 65}
            opacity="0"
            text-anchor="middle">{artist.artist}</text
          >
        </g>
      {/each}
    </g>
  </svg>
  {#if display_blurb}
    <div
      id="blurb_node"
      class="absolute border border-black border-solid rounded-lg p-4 w-80 bg-white"
      style="top: {blurb_y}px; left: {blurb_x}px;"
      transition:fade
    >
      {blurb_text}
    </div>
  {/if}
</div>
