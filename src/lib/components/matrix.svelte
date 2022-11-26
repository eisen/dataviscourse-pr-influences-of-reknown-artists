<script lang="ts">
  import { Helpers, Types } from "$lib/utilities"
  import * as d3 from "d3"
  import { createEventDispatcher, tick } from "svelte"

  const dispatch = createEventDispatcher()

  export let width: number = 0
  export let height: number = 0

  const colourRelation = "#800080"
  const colourNoRelation = "transparent"
  const colourHoverRelation = "#F93B3B"
  const colourHoverBackground = "#dddddd"
  const DURATION = 100

  let adjMatrix: Types.AdjacencyData[][]
  $: adjMatrix = []
  let matrix_size: number = 0
  let lines: any[]
  $: lines = []
  let matrixScale: any
  let offset_x: number = 0
  let offset_y: number = 0

  let influences: Types.ArtistInfluence[]
  $: influences
  let artists: Types.ArtistData[]
  $: artists

  let influencers: string[]
  $: influencers = []
  let influencees: string[]
  $: influencees = []

  let tabScale: number
  $: tabScale = 0
  let tabPadding: number
  $: tabPadding = 0

  let chart_height: number
  $: chart_height = 0
  let chart_width: number
  $: chart_width = 0
  let text_width: number
  $: text_width = 0

  const PADDING = { left: 50, right: 50, top: 150, bottom: 5 }
  const CHART = { side: 200 }

  const ArrayDomain = (matrix_size: number) => {
    let arr_domain = new Array(matrix_size)
    for (let i = 0; i < matrix_size; i++) {
      arr_domain[i] = i
    }
    return arr_domain // MAKE 500 a parameter
  }

  const ArtistName = (datum: string) => {
    return datum.replace(/[\s\.]/g, "")
  }

  const CreateAdjacencyMatrix = () => {
    // console.log("artist_data: ", artist_data)

    matrix_size = artists!.length
    // console.log('matrix_size', matrix_size)

    // Create rows for the matrix
    for (let [index] of artists!.entries()) {
      artists![index].index = index
    }

    for (let index = 0; index < matrix_size!; index++) {
      const artist = artists[index].artist
      const list_influencer = influences.filter((d) => d.artist === artist)

      if (list_influencer.length > 0) {
        // console.log('row', index, 'artist_influencer', artist, 'list_influencer', list_influencer)
        influencers.push(artist)
      }
      const list_influencee = influences.filter((d) => d.influenced === artist)

      if (list_influencee.length > 0) {
        // console.log('col', index, 'artist_influencee', artist, 'list_influencee', list_influencee)
        influencees.push(artist)
      }
    }
    // console.log("Influencers", influencers)
    // console.log("Influencees", influencees)

    for (let row = 0; row < influencers.length!; row++) {
      const adjacencyRow: Types.AdjacencyData[] = []
      const influencer_name = influencers[row]
      for (let col = 0; col < influencees.length; col++) {
        const influencee_name = influencees[col]
        const adjacency: Types.AdjacencyData = {
          x: row,
          y: col,
          z: 0,
          influencer: influencer_name,
          influencee: influencee_name,
        }
        adjacencyRow.push(adjacency)
      }
      adjMatrix.push(adjacencyRow)
    }
    // console.log('initial adjMatrix', adjMatrix)
    return artists // MIGHT not be needed
  }

  const PopulateAdjacencyMatrix = (
    artist_data_with_index: Types.ArtistData[]
  ) => {
    // console.log('influence_data: ', influences)
    // console.log('artist_data_with_index', artist_data_with_index)

    const matrixRow = influencers.length //adjMatrix.length
    const matrixCol = influencees.length //adjMatrix[0].length

    for (let row = 0; row < matrixRow; row++) {
      for (let col = 0; col < matrixCol; col++) {
        let influencer_name = influencers[row] //adjMatrix[row][col].influencer
        let influencee_name = influencees[col] //adjMatrix[row][col].influencee

        const list_influencee = influences.filter(
          (d) =>
            d.artist === influencer_name && d.influenced === influencee_name
        )
        if (list_influencee.length > 0) {
          adjMatrix[row][col].z = 1
        }
      }
    }
    // console.log('final adjMatrix', adjMatrix)
  }

  const DisplayInfluencers = (
    all_influencers: Types.ArtistInfluence[],
    col_name: string
  ) => {
    // All text to display
    let string_influencers = ""
    let i = 0
    for (i = 0; i < all_influencers.length - 2; i++) {
      string_influencers = string_influencers + all_influencers[i].artist + ", "
    }
    string_influencers =
      string_influencers +
      all_influencers[i].artist +
      " and " +
      all_influencers[i++].artist

    d3.select("#text-display")
      .append("text")
      .attr("x", PADDING.left)
      .attr("y", offset_y - 2.5 * tabPadding)
      .text((d) => {
        return col_name + " was influenced by " + string_influencers
      })
      .attr("opacity", 1)
  }

  const DisplayInfluencees = (
    all_influencees: Types.ArtistInfluence[],
    row_name: string
  ) => {
    // All text to display
    let string_influencees = ""
    let i = 0
    for (i = 0; i < all_influencees.length - 2; i++) {
      string_influencees = string_influencees + all_influencees[i].artist + ", "
    }
    string_influencees =
      string_influencees +
      all_influencees[i].artist +
      " and " +
      all_influencees[i++].artist

    d3.select("#text-display")
      .append("text")
      .attr("x", PADDING.left)
      .attr("y", offset_y - 2.5 * tabPadding)
      .text((d) => {
        return row_name + " influenced " + string_influencees
      })
      .attr("opacity", 1)
  }

  const OnMouseOverInfluencee = (name: string) => {
    dispatch("highlight_artist", {
      artist: name,
      influence_type: Types.InfluenceType.Influencee,
    })
  }

  const OnMouseOverInfluencer = (name: string) => {
    dispatch("highlight_artist", {
      artist: name,
      influence_type: Types.InfluenceType.Influencer,
    })
  }

  const OnMouseOutInfluencee = (name: string) => {
    dispatch("restore_artist", {
      artist: name,
      influence_type: Types.InfluenceType.Influencee,
    })
  }

  const OnMouseOutInfluencer = (name: string) => {
    dispatch("restore_artist", {
      artist: name,
      influence_type: Types.InfluenceType.Influencer,
    })
  }

  const HighlightInfluencer = (row_name: string) => {
    d3.select("#" + Helpers.ArtistID(row_name) + "-rows-path-fill").attr(
      "fill",
      "black"
    )

    let all_influencees = influences.filter((d) => d.artist === row_name) // all influences

    let y = 0
    for (let relation of all_influencees) {
      for (let row in influencers) {
        for (let col in influencees) {
          if (
            adjMatrix[row][col].influencer === row_name &&
            adjMatrix[row][col].influencee === relation.influenced
          ) {
            let rect_id =
              "#" +
              ArtistName(
                adjMatrix[row][col].influencer +
                  "_" +
                  adjMatrix[row][col].influencee
              )
            d3.select(rect_id).attr("fill", colourHoverRelation)

            // y for the rect
            y = matrixScale(adjMatrix[row][col].x) + offset_y
          }
        }
      }
    }

    if (y > 0) {
      // add a group to add more rectangles for the whle row and column
      let rect_hover = d3.select("#rect-hover")
      rect_hover
        .append("rect")
        .attr("id", "hover-row")
        .attr("x", offset_x)
        .attr("y", y)
        .attr("width", chart_width)
        .attr("height", matrixScale.bandwidth())
        .attr("fill", colourHoverBackground)
        .transition()
        .duration(DURATION)
        .attr("opacity", 1)
    }
  }

  const HighlightInfluencee = (col_name: string) => {
    console.log("#" + Helpers.ArtistID(col_name) + "-cols-path-fill")
    d3.select("#" + Helpers.ArtistID(col_name) + "-cols-path-fill").attr(
      "fill",
      "black"
    )

    let all_influencers = influences.filter((d) => d.influenced === col_name)

    let x = 0
    for (let relation of all_influencers) {
      for (let row in influencers) {
        for (let col in influencees) {
          if (
            adjMatrix[row][col].influencer === relation.artist &&
            adjMatrix[row][col].influencee === col_name
          ) {
            let rect_id =
              "#" +
              ArtistName(
                adjMatrix[row][col].influencer +
                  "_" +
                  adjMatrix[row][col].influencee
              )
            d3.select(rect_id).attr("fill", colourHoverRelation)

            // x for the rect
            x = matrixScale(adjMatrix[row][col].y) + offset_x
          }
        }
      }
    }

    if (x > 0) {
      // add a group to add more rectangles for the whle row and column
      let rect_hover = d3.select("#rect-hover")
      rect_hover
        .append("rect")
        .attr("id", "hover-col")
        .attr("x", x)
        .attr("y", offset_y)
        .attr("width", matrixScale.bandwidth())
        .attr("height", chart_height)
        .attr("fill", colourHoverBackground)
        .transition()
        .duration(DURATION)
        .attr("opacity", 1)
    }
  }

  export const RestoreInfluencer = (target: string) => {
    d3.select(target + "-rows-path-fill").attr("fill", "white")
    d3.select("#adjacency_matrix")
      .selectAll("rect")
      .attr("fill", colourRelation)
    d3.select("#rect-hover")
      .selectAll("rect")
      .transition()
      .duration(DURATION)
      .attr("opacity", 0)
  }

  export const RestoreInfluencee = (target: string) => {
    d3.select(target + "-cols-path-fill").attr("fill", "white")
    d3.select("#adjacency_matrix")
      .selectAll("rect")
      .attr("fill", colourRelation)
    d3.select("#rect-hover")
      .selectAll("rect")
      .transition()
      .duration(DURATION)
      .attr("opacity", 0)
  }

  export const HighlightArtist = (
    name: string,
    influence_type: Types.InfluenceType
  ) => {
    if (
      influence_type === Types.InfluenceType.Influencer ||
      influence_type === Types.InfluenceType.Both
    ) {
      HighlightInfluencer(name)
    }

    if (
      influence_type === Types.InfluenceType.Influencee ||
      influence_type === Types.InfluenceType.Both
    ) {
      HighlightInfluencee(name)
    }
  }

  export const RestoreArtist = (
    name: string,
    influence_type: Types.InfluenceType
  ) => {
    const target = "#" + Helpers.ArtistID(name)
    if (
      influence_type === Types.InfluenceType.Influencer ||
      influence_type === Types.InfluenceType.Both
    ) {
      RestoreInfluencer(target)
    }

    if (
      influence_type === Types.InfluenceType.Influencee ||
      influence_type === Types.InfluenceType.Both
    ) {
      RestoreInfluencee(target)
    }
  }

  const OnMouseOverRect = (target: any, row: number, col: number) => {
    // console.log('in row', target, x, y)
    let x = matrixScale(adjMatrix[row][col].y) + offset_x
    let y = matrixScale(adjMatrix[row][col].x) + offset_y
    d3.select(target).attr("fill", colourHoverRelation)

    // add a group to add more rectangles for the whle row and column
    let rect_hover = d3.select("#rect-hover")
    rect_hover
      .append("rect")
      .attr("id", "hover-col")
      .attr("x", x)
      .attr("y", offset_y)
      .attr("width", matrixScale.bandwidth())
      .attr("height", chart_height)
      .attr("fill", colourHoverBackground)
      .attr("opacity", 1)
    rect_hover
      .append("rect")
      .attr("id", "hover-col")
      .attr("x", offset_x)
      .attr("y", y)
      .attr("width", chart_width)
      .attr("height", matrixScale.bandwidth())
      .attr("fill", colourHoverBackground)
      .attr("opacity", 1)

    // let influencerName = adjMatrix[row][col].influencer
    // let influenceeName = adjMatrix[row][col].influencee
    // d3.select("#text-display")
    //   .append("text")
    //   .attr("x", offset_x)
    //   .attr("y", offset_y - 2.5 * tabPadding)
    //   .text((d) => {
    //     return influencerName + " influenced " + influenceeName
    //   })
    //   .attr("opacity", 1)

    let row_path_id =
      "#" + ArtistName(adjMatrix[row][col].influencer) + "-rows-path-fill"
    let col_path_id =
      "#" + ArtistName(adjMatrix[row][col].influencee) + "-cols-path-fill"
    d3.select(row_path_id).attr("fill", "black")
    d3.select(col_path_id).attr("fill", "black")
  }

  const OnMouseOutRect = (target: any, row: number, col: number) => {
    // console.log('out')
    d3.select(target).attr("fill", colourRelation)
    d3.select("#rect-hover").selectAll("rect").attr("opacity", 0)
    //d3.select("#text-display").selectAll("text").attr("opacity", 0)

    let row_path_id =
      "#" + ArtistName(adjMatrix[row][col].influencer) + "-rows-path-fill"
    let col_path_id =
      "#" + ArtistName(adjMatrix[row][col].influencee) + "-cols-path-fill"
    d3.select(row_path_id).attr("fill", "white")
    d3.select(col_path_id).attr("fill", "white")
  }

  const OnMouseClickInfluencer = (row_name: any) => {
    d3.select("#text-display").selectAll("text").attr("opacity", 0)
    let all_influencees = influences.filter((d) => d.artist === row_name) //all influences
    DisplayInfluencees(all_influencees, row_name)
    dispatch("select_influencer", {
      artist: row_name,
    })
  }

  const OnMouseClickInfluencee = (col_name: string) => {
    d3.select("#text-display").selectAll("text").attr("opacity", 0)
    let all_influencers = influences.filter((d) => d.influenced === col_name)
    DisplayInfluencers(all_influencers, col_name)
    dispatch("select_influencee", {
      artist: col_name,
    })
  }

  export const Initialize = (
    artist_data: Types.ArtistData[],
    influence_data: Types.ArtistInfluence[]
  ) => {
    influences = influence_data
    artists = artist_data!.sort((a, b) => (a.artist < b.artist ? -1 : 1))

    let shorter = width < height ? width : height
    let chart_padding =
      width < height
        ? PADDING.right + PADDING.left
        : PADDING.top + PADDING.bottom
    CHART.side = shorter - chart_padding
    offset_x = (width - CHART.side) / 2
    offset_y = (height - CHART.side) / 2

    // sort artist data in ascending
    const artist_data_with_index = CreateAdjacencyMatrix()
    PopulateAdjacencyMatrix(artist_data_with_index)
    lines = ArrayDomain(
      adjMatrix[0].length > adjMatrix.length
        ? adjMatrix[0].length
        : adjMatrix.length
    )
    matrixScale = d3
      .scaleBand()
      .range([0, height - offset_y])
      .domain(lines)

    tabScale = matrixScale.bandwidth() / 32
    tabPadding = tabScale * 57 + 2

    text_width = 100
    chart_height = influencers.length * matrixScale.bandwidth()
    chart_width = influencees.length * matrixScale.bandwidth()
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
    <g id="text-display" />
    <g id="rect-hover" />
    <g id="adjacency_matrix">
      <g id="rect-hover" />
      {#each influencers as i, row}
        {#each influencees as j, col}
          {#if adjMatrix[row][col].z === 1}
            <!-- TODO: check the x and y, I changed them as the boxes were diff -->
            <rect
              on:mouseover={(ev) =>
                OnMouseOverRect(
                  "#" +
                    ArtistName(
                      adjMatrix[row][col].influencer +
                        "_" +
                        adjMatrix[row][col].influencee
                    ),
                  row,
                  col
                )}
              on:focus={(ev) =>
                OnMouseOverRect(
                  "#" +
                    ArtistName(
                      adjMatrix[row][col].influencer +
                        "_" +
                        adjMatrix[row][col].influencee
                    ),
                  row,
                  col
                )}
              on:mouseout={(ev) =>
                OnMouseOutRect(
                  "#" +
                    ArtistName(
                      adjMatrix[row][col].influencer +
                        "_" +
                        adjMatrix[row][col].influencee
                    ),
                  row,
                  col
                )}
              on:blur={(ev) =>
                OnMouseOutRect(
                  "#" +
                    ArtistName(
                      adjMatrix[row][col].influencer +
                        "_" +
                        adjMatrix[row][col].influencee
                    ),
                  row,
                  col
                )}
              id={ArtistName(
                adjMatrix[row][col].influencer +
                  "_" +
                  adjMatrix[row][col].influencee
              )}
              x={matrixScale(adjMatrix[row][col].y) + offset_x}
              y={matrixScale(adjMatrix[row][col].x) + offset_y}
              width={matrixScale.bandwidth()}
              height={matrixScale.bandwidth()}
              fill={colourRelation}
            />
          {/if}
        {/each}
      {/each}
    </g>

    <g id="linesVertical">
      {#each influencees as influencer, idx}
        <g>
          <line
            x1={offset_x + (matrixScale ? matrixScale(idx) : 0)}
            y1={offset_y}
            x2={offset_x + (matrixScale ? matrixScale(idx) : 0)}
            y2={offset_y + chart_height}
            stroke-width="0.5"
            stroke="#ccc"
          />
        </g>
      {/each}
    </g>

    <g id="linesHorizontal">
      {#each influencers as influencer, idx}
        <g>
          <line
            x1={offset_x}
            y1={offset_y + (matrixScale ? matrixScale(idx) : 0)}
            x2={offset_x + chart_width}
            y2={offset_y + (matrixScale ? matrixScale(idx) : 0)}
            stroke-width="0.5"
            stroke="#ccc"
          />
        </g>
      {/each}
    </g>

    <g id="influencer_tabs">
      {#each influencers as influencer, idx}
        <g
          id={ArtistName(influencer) + "-row"}
          class="cursor-pointer"
          style="outline: none;"
          on:click={(ev) => OnMouseClickInfluencer(influencer)}
          on:mouseover={(ev) => OnMouseOverInfluencer(influencer)}
          on:focus={(ev) => OnMouseOverInfluencer(influencer)}
          on:mouseout={(ev) => OnMouseOutInfluencer(influencer)}
          on:blur={(ev) => OnMouseOutInfluencer(influencer)}
          transform="translate({offset_x - tabPadding} {matrixScale(idx) +
            offset_y +
            1}) scale({tabScale}, {tabScale})"
        >
          <path
            id={ArtistName(influencer) + "-rows-path-fill"}
            d="M39.66-.09H-.05s0,28.18,0,28.18H39.66s14.08-14.09,14.08-14.09L39.66-.09Z"
            fill="white"
          />
          <path
            d="M39.71-.09H0S0,28.09,0,28.09H39.71s14.08-14.09,14.08-14.09L39.71-.09Zm-1.31,23.84H10.68s0-.02,0-.02H5.01s0-19.7,0-19.7H15.64s0,.05,0,.05h22.75s9.83,9.84,9.83,9.84l-9.83,9.83Z"
          />
        </g>
      {/each}
    </g>

    <g id="influencee_tabs">
      {#each influencees as influencee, idx}
        <g
          id={ArtistName(influencee) + "-col"}
          class="cursor-pointer"
          style="outline: none;"
          on:click={(ev) => OnMouseClickInfluencee(influencee)}
          on:mouseover={(ev) => OnMouseOverInfluencee(influencee)}
          on:focus={(ev) => OnMouseOverInfluencee(influencee)}
          on:mouseout={(ev) => OnMouseOutInfluencee(influencee)}
          on:blur={(ev) => OnMouseOutInfluencee(influencee)}
          transform="translate({matrixScale(idx) + offset_x + 1}, {offset_y -
            tabPadding}) scale({tabScale}, {tabScale})"
        >
          <path
            id={ArtistName(influencee) + "-cols-path-fill"}
            d="M28.18,39.66V-.05S0-.04,0-.04V39.66s14.09,14.08,14.09,14.08l14.1-14.09Z"
            fill="white"
          />
          <path
            d="M28.18,39.71V0S0,0,0,0V39.71s14.09,14.08,14.09,14.08l14.1-14.09Zm-23.84-1.31V10.68s.02,0,.02,0V5.01s19.7,0,19.7,0V15.64s-.05,0-.05,0v22.75s-9.84,9.83-9.84,9.83l-9.83-9.83Z"
          />
        </g>
      {/each}
    </g>

    <g id="matrix_outline">
      <rect
        x={offset_x - 0.5}
        y={offset_y - 0.5}
        width={chart_width}
        height={chart_height}
        stroke="#000000"
        fill="none"
      />
    </g>

    <g id="axes-titles">
      <text
        class="cursor-default"
        transform="translate({offset_x +
          chart_width / 2 -
          text_width / 2}, {offset_y - tabPadding - 5})"
        font-weight="700">Influencees</text
      >
      <text
        class="cursor-default"
        transform="translate({offset_x - tabPadding - 5}, {offset_y +
          chart_height / 2 +
          text_width / 2}) rotate(-90)"
        font-weight="700">Influencers</text
      >
    </g>
  </svg>
</div>
