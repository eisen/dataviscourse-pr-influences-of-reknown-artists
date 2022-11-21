<script lang="ts">
  import { Types } from '$lib/utilities'
  import * as d3 from 'd3'

  export let width: number
  export let height: number

  let adjMatrix: Types.AdjacencyData[][]
  $: adjMatrix = []
  let matrix_size: number = 0
  let lines: any[]
  $: lines = []
  let matrixScale: any
  let offset_x: number
  let offset_y: number

  const PADDING = { left: 50, right: 50, top: 50, bottom: 50 }
  const CHART = { side: 200 }

  const ArrayDomain = (matrix_size: number) => {
    let arr_domain = new Array(matrix_size)
    for (let i = 0; i < matrix_size; i++) {
      arr_domain[i] = i
    }
    return arr_domain // MAKE 500 a parameter
  }

  function createAdjacencyMatrix(artist_data: Types.ArtistData[] | undefined) {
    // console.log("artist_data: ", artist_data)

    matrix_size = artist_data!.length
    // console.log('matrix_size', matrix_size)

    // Create rows for the matrix
    for (let [index] of artist_data!.entries()) {
      artist_data![index].index = index
    }

    for (let indexRow = 0; indexRow < matrix_size!; indexRow++) {
      // creating each row
      // console.log(indexRow)
      const adjacencyRow: Types.AdjacencyData[] = []
      for (let indexCol = 0; indexCol < matrix_size!; indexCol++) {
        const adjacency: Types.AdjacencyData = {
          x: indexCol,
          y: indexRow,
          z: 0,
        }
        adjacencyRow.push(adjacency)
      }
      adjMatrix.push(adjacencyRow)
    }
    // console.log('initial adjMatrix', adjMatrix)
    return artist_data // MIGHT not be needed
  }

  function populateAdjacencyMatrix(
    influence_data: Types.ArtistInfluence[] | undefined,
    artist_data_with_index: Types.ArtistData[] | undefined
  ) {
    // console.log('influence_data: ', influence_data)
    // console.log('artist_data_with_index', artist_data_with_index)

    for (let [entry] of influence_data!.entries()) {
      // take each row in infuence_data
      // console.log('entry', entry)
      var row: number = 0
      var col = 0
      for (let [idx] of artist_data_with_index!.entries()) {
        // find index of the artist in artist_data
        if (influence_data![entry].artist === artist_data_with_index![idx].artist) {
          row! = artist_data_with_index![idx].index
          // console.log('artist', influence_data![entry].artist, row)
        }
        if (influence_data![entry].influenced === artist_data_with_index![idx].artist) {
          col! = artist_data_with_index![idx].index
          // console.log('influenced', influence_data![entry].influenced, col)
        }
      }
      adjMatrix[row][col].z = 1
    }
    // console.log('final adjMatrix', adjMatrix)
  }

  function drawMatrix() {
    let side = 500
    // let num = matrix_size
    // let arr_domain = new Array(matrix_size);
    // for(let i=0; i<matrix_size; i++){
    //     arr_domain[i] = i
    // }
    // let matrixScale = d3.scaleBand().range([0+PADDING.left, side-PADDING.right]).domain(arr_domain);
    let colourRelation = '#6a87a3'
    let colourNoRelation = 'transparent'

    let svg = d3.select('#adjacency_matrix')

    let rows = svg
      .selectAll('.row')
      .data(adjMatrix)
      .enter()
      .append('g')
      .attr('class', 'row')
      .attr('transform', (d, i) => {
        // console.log('d', d)
        // console.log('i', i)
        return 'translate(0,' + (matrixScale(i) + offset_y) + ')'
      })

    let squares = rows
      .selectAll('.cell')
      .data(d => {
        // console.log('d', d)
        // return d.filter(item => {
        //     // console.log('item', item)
        //     return item.z > 0
        // })
        return d
      })
      .enter()
      .append('rect')
      .attr('class', 'cell')
      .attr('x', d => {
        // console.log('d', d)
        return matrixScale(d.x) + offset_x
      })
      .attr('width', matrixScale.bandwidth())
      .attr('height', matrixScale.bandwidth())
      .style('opacity', 1)
      .style('fill', d => {
        return d.z > 0 ? colourRelation : colourNoRelation
      })
    // .on("mouseover", mouseover)
    // .on("mouseout", mouseout);

    // var linesVertical = rows.selectAll('line')
    //     .data(d => {
    //         return adjMatrix
    //         // console.log(d)
    //         // return d
    //     })
    //     .join('line')
    //     .attr('x1',(d,i)=> matrixScale(i)) // DRAWING multiple right now, should minimise
    //     .attr('y1',(d,i)=> PADDING.top)
    //     .attr('x2',(d,i)=> matrixScale(i))
    //     .attr('y2',(d,i)=> side - PADDING.right)
    //     .style('stroke-width', 0.5)
    //     .style('stroke', 'black')

    // lines = arr_domain
    // console.log(lines)

    // var linesHorizontal = rows.selectAll('line')
    //     .data(d => {
    //         return adjMatrix
    //         // console.log(d)
    //         // return d
    //     })
    //     .join('line')
    //     .attr('x1',(d,i)=> PADDING.left)
    //     .attr('y1',(d,i)=> matrixScale(i))
    //     .attr('x2',(d,i)=> side - PADDING.right)
    //     .attr('y2',(d,i)=> matrixScale(i))
    //     .style('stroke-width', 0.5)
    //     .style('stroke', 'black')
  }

  export const Initialize = (artist_data: Types.ArtistData[], influence_data: Types.ArtistInfluence[]) => {
    const sorted_artist_data = artist_data!.sort((a, b) => (a['artist'] < b['artist'] ? -1 : 1))

    lines = ArrayDomain(sorted_artist_data.length)
    let shorter = width < height ? width : height
    CHART.side = shorter - (PADDING.right + PADDING.left)
    offset_x = (width - CHART.side) / 2
    offset_y = (height - CHART.side) / 2
    // matrixScale = d3.scaleBand().range([0+PADDING.left, 500-PADDING.right]).domain(lines)
    matrixScale = d3.scaleBand().range([0, CHART.side]).domain(lines)

    //matrixScale()
    // if (influence_data) {
    // allInfluencees = groups(influence_data, (d: ArtistInfluence) => d.artist)
    // allInfluencers = groups(influence_data, (d: ArtistInfluence) => d.influenced)
    // }

    // sort artist data in ascending
    const artist_data_with_index = createAdjacencyMatrix(sorted_artist_data)
    populateAdjacencyMatrix(influence_data, artist_data_with_index)
    drawMatrix()
  }
</script>

<div
  id="container"
  class="inline-block relative align-top overflow-hidden"
  style="width: {width}px; height: {height}px;"
>
  <svg class="inline-block absolute top-0 left-0" viewBox="0, 0, {width}, {height}" preserveAspectRatio="xMidYMid meet">
    <g id="adjacency_matrix" />
    <g id="linesVertical">
      {#each lines as line}
        <g>
          <line
            x1={offset_x + matrixScale(line)}
            y1={PADDING.top}
            x2={offset_x + matrixScale(line)}
            y2={height - PADDING.bottom}
            stroke-width="0.5"
            stroke="#ccc"
          />
        </g>
      {/each}
    </g>

    <g id="linesHorizontal">
      {#each lines as line}
        <g>
          <line
            x1={offset_x}
            y1={offset_y + matrixScale(line)}
            x2={offset_x + CHART.side}
            y2={offset_y + matrixScale(line)}
            stroke-width="0.5"
            stroke="#ccc"
          />
        </g>
      {/each}
    </g>

    <g>
      <rect
        x={offset_x - 0.5}
        y={offset_y - 0.5}
        width={CHART.side + 1}
        height={CHART.side + 1}
        stroke="#000000"
        fill="none"
      />
    </g>
  </svg>
</div>
