<script lang="ts">
  import { geoGraticule, geoEquirectangular, geoPath } from 'd3-geo'
  import {
    group,
    InternMap,
    axisBottom,
    select,
    min,
    max,
    scaleLinear,
    scaleOrdinal,
    type AxisScale,
    type NumberValue,
    type ScaleLinear,
    groups,
    range,
    chord,
    arc,
    ribbon,
    rgb,
    path
  } from 'd3'
  import { json } from 'd3-fetch'
  import { feature } from 'topojson'
  import { onMount } from 'svelte'
    import { compute_slots } from 'svelte/internal'
  // import { path } from 'd3-path'

  const port = 5173
  const server_url = `http://localhost:${port}`

  type ArtistLocation = {
    artist: string
    year: number
    city: string
    country: string
    lat: number
    lon: number
  }

  let svg: SVGSVGElement
  let map: SVGGElement
  let timeline: SVGGElement
  let chordViz: SVGGElement

  let data: any
  $: data = null

  let allLocations: [string, ArtistLocation[]][]
  $: allLocations = []
  let locations: [string, ArtistLocation[]][]
  $: locations = []

  $: tl_pos = ''
  $: map_pos = 'translate(20, 20)'
  $: cursor_pos = 'translate(9, 38)'
  $: dragging = false
  let oldestYear: number | undefined
  $: oldestYear = 0
  let youngestYear: number | undefined
  $: youngestYear = 2100

  const graticuleGen = geoGraticule()
  const graticuleUle = graticuleGen.lines()
  const graticuleOutline = graticuleGen.outline()

  const projection = geoEquirectangular()
  const pathGG = geoPath().projection(projection)

  const tickEvery = 20
  const yearEvery = 100
  const chordHeight = 350;

  let tl_x_scale: ScaleLinear<number, number, never>
  let tl_x_axis = null

  let chordColors = [
    'rgb(211, 157, 69)',
    'rgb(195, 72, 54)',
    'rgb(19, 11, 75)',
    'rgb(20, 57, 59)',
    'rgb(163, 0, 48)',
    'rgb(222, 182, 254)',
    'rgb(20, 4, 61)',
    'rgb(62, 40, 73)',
    'rgb(178, 73, 81)',
    'rgb(142, 45, 49)',
    'rgb(52, 25, 58)',
    'rgb(252, 179, 75)',
    
  ];

  let matrixD = [
            [11975, 5871, 8916, 2868],
            [1951, 10048, 2060, 6171],
            [8010, 16145, 8090, 8045],
            [1013, 990, 940, 6907]
        ];

  let chordColorScale = scaleOrdinal().domain(range(4)).range(chordColors);
  let chordGen = chord().padAngle(0.05);
  let arcGen = arc().innerRadius(250).outerRadius(300);
  let ribbonGen = ribbon().radius(140);
  console.log(chordGen(matrixD));


  const startDrag = () => {
    dragging = true
  }

  const drag = (ev: { offsetX: number }) => {
    if (dragging) {
      let year = tl_x_scale!.invert(Number(ev.offsetX - 9))
      filterLocations(year!)
      let pos = ev.offsetX - 9
      if (year < oldestYear!) {
        pos = tl_x_scale!(oldestYear!) + 9
      } else if (year > youngestYear!) {
        pos = tl_x_scale!(youngestYear!) + 9
      }
      cursor_pos = `translate(${pos}, 38)`
    }
  }

  const stopDrag = () => {
    dragging = false
  }

  const filterLocations = (year: number) => {
    locations = allLocations.filter(([, locations]) => {
      if (locations.length > 1) {
        return locations[0].year <= year && locations[1].year > year
      } else {
        return locations[0].year <= year
      }
    })
  }

  const getXfromLatLon = (
    loc: {
      lat: number
      lon: number
    }[]
  ) => {
    const pos = projection([loc[0].lon, loc[0].lat])!
    return pos[0]
  }

  const getYfromLatLon = (
    loc: {
      lat: number
      lon: number
    }[]
  ) => {
    const pos = projection([loc[0].lon, loc[0].lat])!
    return pos[1]
  }

  function ribbonBasket() {
        var buffer,
        // s = source.apply(this, arguments),
        // t = target.apply(this, arguments),
        ap = 0.02,
        // argv = slice.call(arguments),
        sr = 200.0, // source radius
        sa0 = 0.0, // start angle source
        sa1 = Math.PI / 2, // end angle source
        tr = 200.0, // Target radius
        ta0 = Math.PI,
        ta1 = Math.PI * 1.25;
        var context = null;
        if(!context)
        {
          context = buffer = path();
        }
        context.moveTo(sr * Math.cos(sa0), sr * Math.sin(sa0));
        // context.arc(0, 0, sr, sa0, sa1);
        var hr = 10;
        var tr2 = tr - hr;
        var ta2 = (ta0 + ta1) / 2;
        // context.quadraticCurveTo(0, 0, tr2 * Math.cos(ta0), tr2 * Math.sin(ta0));
        // context.lineTo(tr * Math.cos(ta2), tr * Math.sin(ta2));
        // context.lineTo(tr2 * Math.cos(ta1), tr2 * Math.sin(ta1));
        // context.quadraticCurveTo(tr/2, tr * Math.tan((sa1-sa0) / 2), tr * Math.cos(ta0), tr * Math.sin(ta0));
        context.quadraticCurveTo(100, 200, -200, 2.4492935982947064e-14);
        context.arc(0, 0, tr, ta0, ta1);
        // context.closePath();
        // context.quadraticCurveTo(sr/2, sr * Math.tan((sa1 - sa0) / 2), sr * Math.cos(sa0),  sr * Math.sin(sa0));
        context.quadraticCurveTo(50, 200, 200,  0);
        // context.closePath();
        if (buffer) return context = null, buffer + "" || null;
  }

  onMount(async () => {
    const bbox = select(map).node()!.getBoundingClientRect()

    tl_pos = `translate(${20}, ${bbox.height + 20 + 20})`

    const features: any = await json(`${server_url}/data/world.json`)
    data = feature(features, features.objects.countries)

    const locs: ArtistLocation[] | undefined = await json(`${server_url}/data/artist-locations.json`)
    if (locs) {
      oldestYear = min(locs, d => d.year)
      youngestYear = max(locs, d => d.year)
      allLocations = groups(locs, d => d.artist)
      filterLocations(oldestYear!)

      tl_x_scale = scaleLinear().domain([oldestYear!, youngestYear!]).range([0, bbox.width])
      tl_x_axis = axisBottom(tl_x_scale)
        .tickFormat(d => {
          return Number(d) % yearEvery === 0 ? String(d) : ''
        })
        .ticks((youngestYear! - oldestYear!) / tickEvery)
      select(timeline).call(tl_x_axis)
      // select(chordViz).datum(chordGen(matrixD));
      // console.log(chordGen(matrixD));
      select(chordViz).datum(function(d, i) {
        let retArr = [];
        let n = 10;
        let angleD = 120;
        let angleR = angleD * Math.PI / 180;
        let padR = 0.02;
        for(let i = 0; i < Math.floor(n/2); i++)
        {
          console.log(n/2);
          retArr.push(
            {
              'endAngle' : ((i + 1) * ((angleR) / Math.floor(n/2))) + ((Math.PI - angleR) / 2) - padR,
              'index' : i,
              'startAngle' : (i * ((angleR) / Math.floor(n/2))) + ((Math.PI - angleR) / 2) + padR,
              'value' : 29630
            }
          );
        }
        for(let i = 0; i < n - Math.floor(n/2); i++)
        {
          console.log(n - (n / 2))
          retArr.push(
            {
              'endAngle' : Math.PI + ((i + 1) * ((angleR) / (n - Math.floor(n/2)))) + ((Math.PI - angleR) / 2) - padR,
              'index' : i + (Math.floor(n/2)),
              'startAngle' : Math.PI + (i * ((angleR) / (n - Math.floor(n/2)))) + ((Math.PI - angleR) / 2) + padR,
              'value' : 29630
            }
          );
        }
        return retArr;
      });
      let groupChord = select(chordViz).append('g')
            .attr("class", "groups")
            .selectAll("g")
            // .data(chords => chords.groups)
            .data(chords => chords)
            .enter().append("g");
      groupChord.append('path')
        // .style('fill', (d, i) => chordColorScale(d.index))
        .style('fill', function(d, i){
          // console.log(d);
          return chordColorScale(d.index);
        })
        .style("stroke", (d, i) => rgb(chordColorScale(d.index)).darker())
        .attr("d", arcGen);
      // let ribbons = select(chordViz).append("g") -> Work in progress.
      //       .attr("class", "ribbons")
      //       .selectAll("path")
      //       .data(chords => chords)
      //       .enter().append("path")
      //       .attr("d", ribbonBasket)
      //       .style("fill", function(d) {
      //         console.log('fr');
      //         console.log(d);
      //         // return chordColorScale(d.index);
      //         return 'rgb(222, 182, 254)';
      //       })
      //       // .style("stroke", d => rgb(chordColorScale(d.index)).darker())
      //       .style("stroke", 'rgb(222, 182, 254)')
      //       .style("opacity", 1.0);
      let deathArr = ['Natural Causes', 'Unknown', 'Heart Attack', 'Suicide', 'Currently Alive'];
      let mediumArr = ['Water Color', 'Oil Paint', 'Pastel', 'Sculptures', 'Acrylic'];
      groupChord.append('text')
        .data(deathArr)
        .attr('x', -50)
        .attr('y', (d, i) => (i * ((350 * 0.5) / deathArr.length)) - 70)
        .text((d) => d);

    } else {
      console.error('Unable to load Artist Locations!')
    }
  })
</script>

<div class="absolute inset-0 select-none" on:mousemove={drag} on:mouseup={stopDrag}>
  <svg id="svg" bind:this={svg} class="block w-full h-full">
    <g id="map" bind:this={map} transform={map_pos}>
      <g id="graticules">
        {#each graticuleUle as line}
          <path d={pathGG(line)} fill="none" stroke="lightgray" />
        {/each}
      </g>
      <g id="countries">
        {#if data}
          {#each data.features as feature}
            <path id={feature.id} d={pathGG(feature)} stroke="lightgray" fill="white" />
          {/each}
        {/if}
      </g>
      <g id="artists">
        {#each locations as location}
          <circle
            cx={getXfromLatLon(location[1])}
            cy={getYfromLatLon(location[1])}
            r="10"
            stroke="black"
            fill="white"
          />
          <text x={getXfromLatLon(location[1])} y={getYfromLatLon(location[1]) + 25} text-anchor="middle"
            >{location[0]}</text
          >
        {/each}
      </g>
      <g id="outline">
        <path d={pathGG(graticuleOutline)} fill="none" stroke="black" stroke-width="2" />
      </g>
    </g>
    <g id="timeline" bind:this={timeline} transform={tl_pos}>
      <g transform={cursor_pos} on:mousedown={startDrag}>
        <path
          d="M6.75469 17.2828L5.32612 7.28284C5.154 6.07798 6.08892 5 7.30602 5H10.694C11.9111 5 12.846 6.07797 12.6739 7.28284L11.2453 17.2828C11.1046 18.2681 10.2607 19 9.26541 19H8.73459C7.73929 19 6.89545 18.2681 6.75469 17.2828Z"
          stroke="currentColor"
          fill="white"
          stroke-width="1.5"
          transform="rotate(180)"
        />
      </g>
    </g>
    <g id="chordViz" bind:this={chordViz} transform="translate(1375, 300)">
    </g>
  </svg>
</div>
