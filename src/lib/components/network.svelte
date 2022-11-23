<script lang="ts">
  import * as d3 from "d3"
  import { Config, Types } from "$lib/utilities"

  const DURATION = 500
  const PADDING = 20
  const OFFSET_X = 40
  const OFFSET_Y = 0

  let simWorker: Worker | undefined = new Worker(
    new URL("workers/sim.worker.ts?worker", import.meta.url)
  )

  const OnWorkerMessage = (event: any) => {
    if (draw_links === false) {
      draw_links = true
    }
    artists = event.data.nodes
    links = event.data.links
    if (event.data.type === "tick") {
      setTimeout(() => {
        simWorker!.postMessage({
          type: "tick",
        })
      }, 50)
    }
  }

  simWorker.onmessage = OnWorkerMessage

  let artists: Types.ArtistData[]
  $: artists = []
  let links: Types.ArtistLink[]
  $: links = []

  $: draw_links = false

  let allArtists: Types.ArtistData[]
  let allLinks: Types.ArtistLink[]

  export let width: number = 0
  export let height: number = 0

  $: RADIUS = height / 37

  const Translate = (x: number | undefined, y: number | undefined) =>
    `translate(${x! - OFFSET_X}, ${y! - OFFSET_Y})`

  const ArtistName = (datum: Types.ArtistData) => {
    return datum.artist.replace(/[\s\.]/g, "")
  }

  const OnMouseOver = (target: any) => {
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
      .attr("x", -50)
      .attr("y", -50)
    d3.select(target + "-circle")
      .transition()
      .duration(DURATION)
      .attr("r", 50)
  }

  const OnMouseOut = (target: any) => {
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
  }

  const TextWidth = (id: string, text: string): number => {
    const node = d3.select(id).node()! as Element
    if (node) {
      const bbox = node.getBoundingClientRect()
      return bbox.width
    } else {
      return 0
    }
  }

  const TextHeight = (id: string, text: string): number => {
    const node = d3.select(id).node()! as Element
    if (node) {
      const bbox = node.getBoundingClientRect()
      return bbox.height
    } else {
      return 0
    }
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

    artists = allArtists
    links = allLinks

    simWorker!.postMessage({
      type: "init",
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

    <g id="links">
      {#if draw_links}
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
      {/if}
    </g>
    <g id="nodes">
      {#each artists as artist}
        <g
          transform={Translate(artist.x + width / 2, artist.y)}
          id={ArtistName(artist) + "-group"}
          class="cursor-pointer"
        >
          <image
            id={ArtistName(artist) + "-image"}
            href={Config.server_url + artist.thumbnail}
            height={RADIUS * 2}
            width={RADIUS * 2}
            x={-RADIUS}
            y={-RADIUS}
            on:focus={(ev) => OnMouseOver("#" + ArtistName(artist))}
            on:mouseover={(ev) => OnMouseOver("#" + ArtistName(artist))}
            on:blur={(ev) => OnMouseOut("#" + ArtistName(artist))}
            on:mouseout={(ev) => OnMouseOut("#" + ArtistName(artist))}
          />
          <circle
            id={ArtistName(artist) + "-circle"}
            cx="0"
            cy="0"
            r={RADIUS}
            stroke="black"
            fill="none"
          />
          <rect
            id={ArtistName(artist) + "-rect"}
            x={-(
              TextWidth("#" + ArtistName(artist) + "-text", artist.artist) +
              PADDING
            ) / 2}
            width={TextWidth(
              "#" + ArtistName(artist) + "-text",
              artist.artist
            ) + PADDING}
            y={RADIUS +
              60 -
              (TextHeight("#" + ArtistName(artist) + "-text", artist.artist) +
                PADDING) /
                2}
            height={TextHeight(
              "#" + ArtistName(artist) + "-text",
              artist.artist
            ) + PADDING}
            fill="white"
            stroke="black"
            rx="15"
            opacity="0"
            class="pointer-events-none"
          />
          <text
            class="cursor-default pointer-events-none"
            id={ArtistName(artist) + "-text"}
            x="0"
            y={RADIUS + 65}
            opacity="0"
            text-anchor="middle">{artist.artist}</text
          >
        </g>
      {/each}
    </g>
    <g transform={Translate(width - PADDING * 5, height - PADDING * 4)}>
      <rect
        x="-3"
        y="0"
        width="140"
        height="60"
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
      <circle cx="20" cy="20" r={RADIUS} fill="white" stroke="black" />
      <text x="15" y="25">A</text>
      <circle cx="115" cy="20" r={RADIUS} fill="white" stroke="black" />
      <text x="110" y="25">B</text>
      <text x="15" y="50">A influenced B</text>
    </g>
  </svg>
</div>
