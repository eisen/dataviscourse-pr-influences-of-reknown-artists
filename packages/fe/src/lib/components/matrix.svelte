<script lang="ts">
  import { Types } from '$lib/utilities'
  import type { ArtistData, ArtistInfluence } from '$lib/utilities/types'
  import * as d3 from 'd3'

  export let width: number = 0
  export let height: number = 0

  const colourRelation = '#6a87a3'
  const colourNoRelation = 'transparent'

  let adjMatrix: Types.AdjacencyData[][]
  $: adjMatrix = []
  let matrix_size: number = 0
  let lines: any[]
  $: lines = []
  let matrixScale: any
  let offset_x: number = 0
  let offset_y: number = 0

  let influences: ArtistInfluence[]
  $: influences
  let artists: ArtistData[]
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

  const PADDING = { left: 50, right: 50, top: 50, bottom: 50 }
  const CHART = { side: 200 }

  const ArrayDomain = (matrix_size: number) => {
    let arr_domain = new Array(matrix_size)
    for (let i = 0; i < matrix_size; i++) {
      arr_domain[i] = i
    }
    return arr_domain // MAKE 500 a parameter
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
      const list_influencer = influences.filter(d => d.artist === artist)

      if (list_influencer.length > 0) {
        // console.log('row', index, 'artist_influencer', artist, 'list_influencer', list_influencer)
        influencers.push(artist)
      }
      const list_influencee = influences.filter(d => d.influenced === artist)

      if (list_influencee.length > 0) {
        // console.log('col', index, 'artist_influencee', artist, 'list_influencee', list_influencee)
        influencees.push(artist)
      }
    }
    console.log("Influencers", influencers)
    console.log("Influencees", influencees)

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

  const PopulateAdjacencyMatrix = (artist_data_with_index: Types.ArtistData[]) => {
    // console.log('influence_data: ', influences)
    // console.log('artist_data_with_index', artist_data_with_index)

    const matrixRow = influencers.length//adjMatrix.length
    const matrixCol = influencees.length//adjMatrix[0].length

    for (let row = 0; row < matrixRow; row++) {
      for (let col = 0; col < matrixCol; col++) {
        let influencer_name = influencers[row]//adjMatrix[row][col].influencer
        let influencee_name = influencees[col]//adjMatrix[row][col].influencee

        const list_influencee = influences.filter(d => d.artist === influencer_name && d.influenced === influencee_name)
        if (list_influencee.length > 0) {
          adjMatrix[row][col].z = 1
        }
      }
    }

    console.log('final adjMatrix', adjMatrix)
    console.log(adjMatrix[5][5])
  }

  export const Initialize = (artist_data: Types.ArtistData[], influence_data: Types.ArtistInfluence[]) => {
    influences = influence_data
    artists = artist_data!.sort((a, b) => (a.artist < b.artist ? -1 : 1))

    let shorter = width < height ? width : height
    CHART.side = shorter - (PADDING.right + PADDING.left)
    offset_x = (width - CHART.side) / 2
    offset_y = (height - CHART.side) / 2

    // sort artist data in ascending
    const artist_data_with_index = CreateAdjacencyMatrix()
    PopulateAdjacencyMatrix(artist_data_with_index)
    lines = ArrayDomain(adjMatrix[0].length > adjMatrix.length ? adjMatrix[0].length : adjMatrix.length)
    matrixScale = d3.scaleBand().range([0, CHART.side]).domain(lines)

    tabScale = matrixScale.bandwidth() / 32
    tabPadding = tabScale * 55 + 2

    chart_height = influencers.length * matrixScale.bandwidth()
    chart_width = influencees.length * matrixScale.bandwidth()
  }
</script>

<svg class="inline-block" {width} {height}>
  <g id="adjacency_matrix">
    {#each influencers as i, row}
      {#each influencees as j, col}
        {#if adjMatrix[row][col].z === 1}
        <!-- TODO: check the x and y, I changed them as the boxes were diff -->
          <rect
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
      <g transform="translate({offset_x - tabPadding}, {matrixScale(idx) + offset_y + 1}) scale({tabScale}, {tabScale})">
        <path d="M39.66-.09H-.05s0,28.18,0,28.18H39.66s14.08-14.09,14.08-14.09L39.66-.09Z" fill="white"/>
        <path d="M39.71-.09H0S0,28.09,0,28.09H39.71s14.08-14.09,14.08-14.09L39.71-.09Zm-1.31,23.84H10.68s0-.02,0-.02H5.01s0-19.7,0-19.7H15.64s0,.05,0,.05h22.75s9.83,9.84,9.83,9.84l-9.83,9.83Z"/>
      </g>
    {/each}
  </g>

  <g id="influencee_tabs">
    {#each influencees as influencee, idx}
      <g transform="translate({matrixScale(idx) + offset_x + 1}, {offset_y - tabPadding}) scale({tabScale}, {tabScale})">
        <path d="M28.18,39.66V-.05S0-.04,0-.04V39.66s14.09,14.08,14.09,14.08l14.1-14.09Z" fill="white"/>
        <path d="M28.18,39.71V0S0,0,0,0V39.71s14.09,14.08,14.09,14.08l14.1-14.09Zm-23.84-1.31V10.68s.02,0,.02,0V5.01s19.7,0,19.7,0V15.64s-.05,0-.05,0v22.75s-9.84,9.83-9.84,9.83l-9.83-9.83Z"/>
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
</svg>
