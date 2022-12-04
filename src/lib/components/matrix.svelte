<script lang="ts">
  import { Helpers, Types } from "$lib/utilities"
  import * as d3 from "d3"
  import { createEventDispatcher } from "svelte"

  const dispatch = createEventDispatcher()

  export let width: number = 0
  export let height: number = 0

  const colourRelation = "#a2ebf5"
  const colourNoRelation = "transparent"
  const colourHoverRelation = "#c00"
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

  const CreateAdjacencyMatrix = (init: boolean = true) => {
    // console.log("artist_data: ", artist_data)
    // adjMatrix = []
    if (init) {
      matrix_size = artists!.length
      // console.log('matrix_size', matrix_size)

      // Create rows for the matrix
      for (let [index] of artists!.entries()) {
        artists![index].index = index
      }

      influencers = []
      influencees = []
      for (let index = 0; index < matrix_size!; index++) {
        const artist = artists[index].artist
        const list_influencer = influences.filter((d) => d.artist === artist)

        if (list_influencer.length > 0) {
          // console.log('row', index, 'artist_influencer', artist, 'list_influencer', list_influencer)
          influencers.push(artist)
        }
        const list_influencee = influences.filter(
          (d) => d.influenced === artist
        )

        if (list_influencee.length > 0) {
          // console.log('col', index, 'artist_influencee', artist, 'list_influencee', list_influencee)
          influencees.push(artist)
        }
      }
    }
    // console.log("Influencers", influencers)
    // console.log("Influencees", influencees)

    // let temp_adj_mat:Types.AdjacencyData[][] = []
    adjMatrix = []

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

    // adjMatrix = temp_adj_mat
    // console.log('initial adjMatrix', adjMatrix)
    // return artists // MIGHT not be needed
  }

  const PopulateAdjacencyMatrix = () =>
    //artist_data_with_index: Types.ArtistData[]
    {
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
    d3.select("#" + Helpers.ArtistID(col_name) + "-cols-path-fill")
      .attr("fill", colourHoverRelation)
      .classed("highlight", true)

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

    // d3.select("#text-display")
    //   .append("text")
    //   .attr("x", PADDING.left)
    //   .attr("y", offset_y - 2.5 * tabPadding)
    //   .text((d) => {
    //     return col_name + " was influenced by " + string_influencers
    //   })
    //   .attr("opacity", 1)

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
          }
        }
      }
    }
  }

  const DisplayInfluencees = (
    all_influencees: Types.ArtistInfluence[],
    row_name: string
  ) => {
    d3.select("#" + Helpers.ArtistID(row_name) + "-rows-path-fill")
      .attr("fill", colourHoverRelation)
      .classed("highlight", true)

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

    // d3.select("#text-display")
    //   .append("text")
    //   .attr("x", PADDING.left)
    //   .attr("y", offset_y - 2.5 * tabPadding)
    //   .text((d) => {
    //     return row_name + " influenced " + string_influencees
    //   })
    //   .attr("opacity", 1)

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
          }
        }
      }
    }
  }

  export const DisplayPair = (influencer: string, influencee: string) => {
    ClearMatrix()
    d3.select("#" + Helpers.ArtistID(influencer) + "-rows-path-fill")
      .attr("fill", colourHoverRelation)
      .classed("highlight", true)
    d3.select("#" + Helpers.ArtistID(influencee) + "-cols-path-fill")
      .attr("fill", colourHoverRelation)
      .classed("highlight", true)
    let rect_id = "#" + ArtistName(influencer + "_" + influencee)
    d3.select(rect_id).attr("fill", colourHoverRelation)
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
    d3.select(
      "#" + Helpers.ArtistID(row_name) + "-rows-path-fill:not(.highlight)"
    )
      .attr("fill", "black")
      .classed("hover", true)

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
    d3.select(
      "#" + Helpers.ArtistID(col_name) + "-cols-path-fill:not(.highlight)"
    )
      .attr("fill", "black")
      .classed("hover", true)

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
    d3.select(target + "-rows-path-fill.hover:not(.highlight)")
      .attr("fill", "white")
      .classed("hover", false)
    d3.select("#rect-hover")
      .selectAll("rect")
      .transition()
      .duration(DURATION)
      .attr("opacity", 0)
  }

  export const RestoreInfluencee = (target: string) => {
    d3.select(target + "-cols-path-fill.hover:not(.highlight)")
      .attr("fill", "white")
      .classed("hover", false)
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

  const OnMouseClickReset = () => {
    dispatch("reset_influences", {})
  }

  export const ResetInfluences = () => {
    d3.selectAll(".highlight")
      .attr("fill", "white")
      .classed("hover", false)
      .classed("highlight", false)

    d3.select("#adjacency_matrix")
      .selectAll("rect.used")
      .attr("fill", colourRelation)
  }

  const OnMouseOverRect = (
    influencer: string,
    influencee: string,
    row: number,
    col: number
  ) => {
    dispatch("highlight_influence_pair", {
      influencer: influencer,
      influencee: influencee,
      row: row,
      col: col,
    })
  }

  export const HighlightPair = (
    influencer: string,
    influencee: string,
    row: number,
    col: number
  ) => {
    const target = `#${ArtistName(influencer)}_"${ArtistName(influencee)}`
    // console.log('in row', target, x, y)
    let x = matrixScale(adjMatrix[row][col].y) + offset_x
    let y = matrixScale(adjMatrix[row][col].x) + offset_y
    //d3.select(target).attr("fill", colourHoverRelation)

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

    let row_path_id =
      "#" + ArtistName(influencer) + "-rows-path-fill:not(.highlight)"
    let col_path_id =
      "#" + ArtistName(influencee) + "-cols-path-fill:not(.highlight)"
    d3.select(row_path_id).attr("fill", "black").classed("hover", true)
    d3.select(col_path_id).attr("fill", "black").classed("hover", true)
  }

  const OnMouseOutRect = (
    influencer: string,
    influencee: string,
    row: number,
    col: number
  ) => {
    dispatch("restore_influence_pair", {
      influencer: influencer,
      influencee: influencee,
      row: row,
      col: col,
    })
  }

  export const RestorePair = (
    influencer: string,
    influencee: string,
    row: number,
    col: number
  ) => {
    // console.log('out')
    //d3.select(target).attr("fill", colourRelation)
    d3.select("#rect-hover").selectAll("rect").attr("opacity", 0)
    //d3.select("#text-display").selectAll("text").attr("opacity", 0)

    let row_path_id =
      "#" + ArtistName(influencer) + "-rows-path-fill:not(.highlight)"
    let col_path_id =
      "#" + ArtistName(influencee) + "-cols-path-fill:not(.highlight)"
    d3.select(row_path_id).attr("fill", "white").classed("hover", true)
    d3.select(col_path_id).attr("fill", "white").classed("hover", true)
  }

  const ClearMatrix = () => {
    d3.select("#adjacency_matrix")
      .selectAll("rect.used")
      .attr("fill", Helpers.SeaColor)
    // d3.select("#text-display").selectAll("text").attr("opacity", 0)
    d3.selectAll(".highlight").attr("fill", "white").classed("highlight", false)
  }

  export const DisplayInfluence = (name: string) => {
    ClearMatrix()
    let all_influencees = influences.filter((d) => d.artist === name) //all influences
    let all_influencers = influences.filter((d) => d.influenced === name)
    if (all_influencees.length > 0) DisplayInfluencees(all_influencees, name)
    if (all_influencers.length > 0) DisplayInfluencers(all_influencers, name)
  }

  export const SelectInfluencer = (row_name: string) => {
    ClearMatrix()
    let all_influencees = influences.filter((d) => d.artist === row_name) //all influences
    if (all_influencees.length > 0)
      DisplayInfluencees(all_influencees, row_name)
  }

  export const SelectInfluencee = (col_name: string) => {
    ClearMatrix()
    let all_influencers = influences.filter((d) => d.influenced === col_name)
    if (all_influencers.length > 0)
      DisplayInfluencers(all_influencers, col_name)
  }

  const OnMouseClickInfluencer = (row_name: string) => {
    dispatch("select_influencer", {
      artist: row_name,
    })
  }

  const OnMouseClickInfluencee = (col_name: string) => {
    dispatch("select_influencee", {
      artist: col_name,
    })
  }

  const OnMouseClickPair = (influencer: string, influencee: string) => {
    dispatch("select_pair", {
      influencer: influencer,
      influencee: influencee,
    })
  }

  const OnMouseClickDescSortInfluencer = () => {
    influencers = influencers.sort((a, b) => {
      let influencer_num_a = influences.filter((d) => d.artist === a)
      let influencer_num_b = influences.filter((d) => d.artist === b)
      return influencer_num_a.length <= influencer_num_b.length ? 1 : -1
    })
    influencees = influencees
    CreateAdjacencyMatrix(false)
    PopulateAdjacencyMatrix()
  }

  const OnMouseClickAsceSortInfluencer = () => {
    influencers = influencers.sort((a, b) => {
      let influencer_num_a = influences.filter((d) => d.artist === a)
      let influencer_num_b = influences.filter((d) => d.artist === b)
      return influencer_num_a.length <= influencer_num_b.length ? -1 : 1
    })
    influencees = influencees
    CreateAdjacencyMatrix(false)
    PopulateAdjacencyMatrix()
  }

  const OnMouseClickAlphabeticalSortInfluencer = () => {
    influencers = influencers.sort((a, b) => (a < b ? -1 : 1))
    influencees = influencees
    CreateAdjacencyMatrix(false)
    PopulateAdjacencyMatrix()
  }

  const OnMouseClickDescSortInfluencee = () => {
    influencees = influencees.sort((a, b) => {
      let influencee_num_a = influences.filter((d) => d.influenced === a)
      let influencee_num_b = influences.filter((d) => d.influenced === b)
      return influencee_num_a.length <= influencee_num_b.length ? 1 : -1
    })
    influencers = influencers
    CreateAdjacencyMatrix(false)
    PopulateAdjacencyMatrix()
  }

  const OnMouseClickAsceSortInfluencee = () => {
    influencees = influencees.sort((a, b) => {
      let influencee_num_a = influences.filter((d) => d.influenced === a)
      let influencee_num_b = influences.filter((d) => d.influenced === b)
      return influencee_num_a.length <= influencee_num_b.length ? -1 : 1
    })
    influencers = influencers
    CreateAdjacencyMatrix(false)
    PopulateAdjacencyMatrix()
  }

  const OnMouseClickAlphabeticalSortInfluencee = () => {
    // console.log('here')
    influencees = influencees.sort((a, b) => (a < b ? -1 : 1))
    influencers = influencers
    CreateAdjacencyMatrix(false)
    PopulateAdjacencyMatrix()
    // console.log(influencers)
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
    CreateAdjacencyMatrix()
    PopulateAdjacencyMatrix()
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
    <!-- <g id="text-display" /> -->
    <g id="rect-hover" />
    <g id="adjacency_matrix">
      <g id="rect-hover" />
      {#each influencers as i, row}
        {#each influencees as j, col}
          {#if adjMatrix.length > 0}
            <!-- TODO: check the x and y, I changed them as the boxes were diff -->
            <rect
              on:mouseover={(ev) =>
                OnMouseOverRect(
                  adjMatrix[row][col].influencer,
                  adjMatrix[row][col].influencee,
                  row,
                  col
                )}
              on:focus={(ev) =>
                OnMouseOverRect(
                  adjMatrix[row][col].influencer,
                  adjMatrix[row][col].influencee,
                  row,
                  col
                )}
              on:mouseout={(ev) =>
                OnMouseOutRect(
                  adjMatrix[row][col].influencer,
                  adjMatrix[row][col].influencee,
                  row,
                  col
                )}
              on:blur={(ev) =>
                OnMouseOutRect(
                  adjMatrix[row][col].influencer,
                  adjMatrix[row][col].influencee,
                  row,
                  col
                )}
              on:click={(ev) =>
                adjMatrix[row][col].z === 1
                  ? OnMouseClickPair(
                      adjMatrix[row][col].influencer,
                      adjMatrix[row][col].influencee
                    )
                  : null}
              id={ArtistName(
                adjMatrix[row][col].influencer +
                  "_" +
                  adjMatrix[row][col].influencee
              )}
              style="outline: none;"
              x={matrixScale(adjMatrix[row][col].y) + offset_x}
              y={matrixScale(adjMatrix[row][col].x) + offset_y}
              on:click={() =>
                adjMatrix[row][col].z === 1 ? null : OnMouseClickReset()}
              width={matrixScale.bandwidth()}
              height={matrixScale.bandwidth()}
              class={adjMatrix[row][col].z === 1 ? "used" : "empty"}
              fill={adjMatrix[row][col].z === 1
                ? colourRelation
                : colourNoRelation}
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
  <span
    class="absolute isolate inline-flex flex-col rounded-md shadow-sm"
    style={`left:${width * 0.24}px; top: ${offset_y}px;`}
  >
    <button
      type="button"
      class="cursor-pointer relative inline-flex items-center rounded-t-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-10 focus:border-utah-red focus:outline-none focus:ring-1 focus:ring-utah-red"
      on:click={(ev) => OnMouseClickDescSortInfluencer()}
    >
      <svg
        class="h-5 w-5"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 576 512"
        fill="currentColor"
        aria-hidden="true"
      >
        <!--! Font Awesome Pro 6.2.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. -->
        <path
          d="M360 432h-48c-13.25 0-24 10.75-24 24S298.8 480 312 480h48c13.25 0 23.1-10.75 23.1-24S373.2 432 360 432zM423.1 304H312C298.8 304 288 314.8 288 328S298.8 352 312 352h111.1c13.25 0 24-10.75 24-24S437.2 304 423.1 304zM487.1 176H312C298.8 176 288 186.8 288 200S298.8 224 312 224h175.1c13.25 0 24-10.75 24-24S501.2 176 487.1 176zM551.1 48H312C298.8 48 288 58.75 288 72S298.8 96 312 96h239.1c13.25 0 24-10.75 24-24S565.2 48 551.1 48zM206.4 335.1L152 394.9V56.02C152 42.76 141.3 32 128 32S104 42.76 104 56.02v338.9l-54.37-58.95c-4.719-5.125-11.16-7.719-17.62-7.719c-5.812 0-11.66 2.094-16.28 6.375c-9.75 8.977-10.34 24.18-1.344 33.94l95.1 104.1c9.062 9.82 26.19 9.82 35.25 0l95.1-104.1c9-9.758 8.406-24.96-1.344-33.94C230.5 325.5 215.3 326.2 206.4 335.1z"
        />
      </svg>
    </button>
    <button
      type="button"
      class="cursor-pointer relative -ml-px inline-flex items-center border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-10 focus:border-utah-red focus:outline-none focus:ring-1 focus:ring-utah-red"
      on:click={(ev) => OnMouseClickAlphabeticalSortInfluencer()}
    >
      <svg
        class="h-5 w-5"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 512 512"
        fill="currentColor"
        aria-hidden="true"
      >
        <!--! Font Awesome Pro 6.2.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. -->
        <path
          d="M439.1 432H377.1l81.87-105.3c5.625-7.25 6.656-17.06 2.625-25.28C457.5 293.2 449.1 288 439.1 288h-111.1c-13.25 0-23.1 10.75-23.1 24s10.75 24 23.1 24h62.94L309.1 441.3c-5.623 7.25-6.654 17.06-2.625 25.28C310.5 474.8 318.8 480 327.1 480h111.1c13.25 0 23.1-10.75 23.1-24S453.2 432 439.1 432zM477.5 189.3l-71.1-144c-8.123-16.31-34.81-16.31-42.94 0l-71.1 144c-5.938 11.84-1.125 26.25 10.75 32.19c11.9 5.938 26.25 1.156 32.19-10.75L338.8 200h90.34l5.359 10.72C438.7 219.2 447.2 224 456 224c3.594 0 7.25-.8125 10.69-2.531C478.6 215.5 483.4 201.1 477.5 189.3zM362.8 152l21.17-42.34L405.2 152H362.8zM206.4 335.1L152 394.9V56.02c0-13.27-10.75-24.02-24-24.02S104 42.76 104 56.02v338.9l-54.37-58.95c-4.719-5.125-11.16-7.719-17.62-7.719c-5.812 0-11.66 2.094-16.28 6.375c-9.75 8.977-10.34 24.18-1.344 33.94l95.1 104.1c9.062 9.82 26.19 9.82 35.25 0l95.1-104.1c9-9.758 8.406-24.96-1.344-33.94C230.5 325.5 215.3 326.2 206.4 335.1z"
        />
      </svg>
    </button>
    <button
      type="button"
      class="cursor-pointer relative -ml-px inline-flex items-center rounded-b-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-10 focus:border-utah-red focus:outline-none focus:ring-1 focus:ring-utah-red"
      on:click={(ev) => OnMouseClickAsceSortInfluencer()}
    >
      <svg
        class="h-5 w-5"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 576 512"
        fill="currentColor"
        aria-hidden="true"
      >
        <!--! Font Awesome Pro 6.2.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. -->
        <path
          d="M312 96h48c13.25 0 23.1-10.75 23.1-24S373.2 48 360 48h-48C298.8 48 288 58.75 288 72S298.8 96 312 96zM312 224h111.1c13.25 0 24-10.75 24-24s-10.75-24-24-24H312C298.8 176 288 186.8 288 200S298.8 224 312 224zM551.1 432H312c-13.25 0-24 10.75-24 24S298.8 480 312 480h239.1c13.25 0 24-10.75 24-24S565.2 432 551.1 432zM312 352h175.1c13.25 0 24-10.75 24-24s-10.75-24-24-24H312C298.8 304 288 314.8 288 328S298.8 352 312 352zM206.4 335.1L152 394.9V56.02C152 42.76 141.3 32 128 32S104 42.76 104 56.02v338.9l-54.37-58.95c-4.719-5.125-11.16-7.719-17.62-7.719c-5.812 0-11.66 2.094-16.28 6.375c-9.75 8.977-10.34 24.18-1.344 33.94l95.1 104.1c9.062 9.82 26.19 9.82 35.25 0l95.1-104.1c9-9.758 8.406-24.96-1.344-33.94C230.5 325.5 215.3 326.2 206.4 335.1z"
        />
      </svg>
    </button>
  </span>
  <span
    class="absolute isolate inline-flex rounded-md shadow-sm"
    style={`left:${width * 0.3}px; top: ${offset_y - 60}px;`}
  >
    <button
      type="button"
      class="cursor-pointer relative inline-flex items-center rounded-l-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-10 focus:border-utah-red focus:outline-none focus:ring-1 focus:ring-utah-red"
      on:click={(ev) => OnMouseClickDescSortInfluencee()}
    >
      <svg
        class="h-5 w-5"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 576 512"
        fill="currentColor"
        aria-hidden="true"
        transform="rotate(-90)"
      >
        <!--! Font Awesome Pro 6.2.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. -->
        <path
          d="M360 432h-48c-13.25 0-24 10.75-24 24S298.8 480 312 480h48c13.25 0 23.1-10.75 23.1-24S373.2 432 360 432zM423.1 304H312C298.8 304 288 314.8 288 328S298.8 352 312 352h111.1c13.25 0 24-10.75 24-24S437.2 304 423.1 304zM487.1 176H312C298.8 176 288 186.8 288 200S298.8 224 312 224h175.1c13.25 0 24-10.75 24-24S501.2 176 487.1 176zM551.1 48H312C298.8 48 288 58.75 288 72S298.8 96 312 96h239.1c13.25 0 24-10.75 24-24S565.2 48 551.1 48zM206.4 335.1L152 394.9V56.02C152 42.76 141.3 32 128 32S104 42.76 104 56.02v338.9l-54.37-58.95c-4.719-5.125-11.16-7.719-17.62-7.719c-5.812 0-11.66 2.094-16.28 6.375c-9.75 8.977-10.34 24.18-1.344 33.94l95.1 104.1c9.062 9.82 26.19 9.82 35.25 0l95.1-104.1c9-9.758 8.406-24.96-1.344-33.94C230.5 325.5 215.3 326.2 206.4 335.1z"
        />
      </svg>
    </button>
    <button
      type="button"
      class="cursor-pointer relative -ml-px inline-flex items-center border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-10 focus:border-utah-red focus:outline-none focus:ring-1 focus:ring-utah-red"
      on:click={(ev) => OnMouseClickAlphabeticalSortInfluencee()}
    >
      <svg
        class="h-5 w-5"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 512 512"
        fill="currentColor"
        transform="rotate(-90)"
        aria-hidden="true"
      >
        <!--! Font Awesome Pro 6.2.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. -->
        <path
          d="M439.1 432H377.1l81.87-105.3c5.625-7.25 6.656-17.06 2.625-25.28C457.5 293.2 449.1 288 439.1 288h-111.1c-13.25 0-23.1 10.75-23.1 24s10.75 24 23.1 24h62.94L309.1 441.3c-5.623 7.25-6.654 17.06-2.625 25.28C310.5 474.8 318.8 480 327.1 480h111.1c13.25 0 23.1-10.75 23.1-24S453.2 432 439.1 432zM477.5 189.3l-71.1-144c-8.123-16.31-34.81-16.31-42.94 0l-71.1 144c-5.938 11.84-1.125 26.25 10.75 32.19c11.9 5.938 26.25 1.156 32.19-10.75L338.8 200h90.34l5.359 10.72C438.7 219.2 447.2 224 456 224c3.594 0 7.25-.8125 10.69-2.531C478.6 215.5 483.4 201.1 477.5 189.3zM362.8 152l21.17-42.34L405.2 152H362.8zM206.4 335.1L152 394.9V56.02c0-13.27-10.75-24.02-24-24.02S104 42.76 104 56.02v338.9l-54.37-58.95c-4.719-5.125-11.16-7.719-17.62-7.719c-5.812 0-11.66 2.094-16.28 6.375c-9.75 8.977-10.34 24.18-1.344 33.94l95.1 104.1c9.062 9.82 26.19 9.82 35.25 0l95.1-104.1c9-9.758 8.406-24.96-1.344-33.94C230.5 325.5 215.3 326.2 206.4 335.1z"
        />
      </svg>
    </button>
    <button
      type="button"
      class="cursor-pointer relative -ml-px inline-flex items-center rounded-r-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-10 focus:border-utah-red focus:outline-none focus:ring-1 focus:ring-utah-red"
      on:click={(ev) => OnMouseClickAsceSortInfluencee()}
    >
      <svg
        class="h-5 w-5"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 576 512"
        fill="currentColor"
        transform="rotate(-90)"
        aria-hidden="true"
      >
        <!--! Font Awesome Pro 6.2.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. -->
        <path
          d="M312 96h48c13.25 0 23.1-10.75 23.1-24S373.2 48 360 48h-48C298.8 48 288 58.75 288 72S298.8 96 312 96zM312 224h111.1c13.25 0 24-10.75 24-24s-10.75-24-24-24H312C298.8 176 288 186.8 288 200S298.8 224 312 224zM551.1 432H312c-13.25 0-24 10.75-24 24S298.8 480 312 480h239.1c13.25 0 24-10.75 24-24S565.2 432 551.1 432zM312 352h175.1c13.25 0 24-10.75 24-24s-10.75-24-24-24H312C298.8 304 288 314.8 288 328S298.8 352 312 352zM206.4 335.1L152 394.9V56.02C152 42.76 141.3 32 128 32S104 42.76 104 56.02v338.9l-54.37-58.95c-4.719-5.125-11.16-7.719-17.62-7.719c-5.812 0-11.66 2.094-16.28 6.375c-9.75 8.977-10.34 24.18-1.344 33.94l95.1 104.1c9.062 9.82 26.19 9.82 35.25 0l95.1-104.1c9-9.758 8.406-24.96-1.344-33.94C230.5 325.5 215.3 326.2 206.4 335.1z"
        />
      </svg>
    </button>
  </span>
</div>
