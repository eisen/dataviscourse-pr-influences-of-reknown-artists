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
    path,
    sort
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

  // let eDataArg = [
  //   {cat: 0, nums: [100], death: ['Natural Causes']},
  //   {cat: 1, nums: [20, 20, 20, 20, 20], death: ['Natural Causes', 'Unknown', 'Heart Attack', 'Suicide', 'Currently Alive']},
  //   {cat: 2, nums: [2, 98], death: ['Natural Causes', 'Currently Alive']},
  //   {cat: 3, nums: [33, 67], death: ['Unknown', 'Natural Causes']},
  //   {cat: 4, nums: [33, 33, 34], death: ['Unknown', 'Heart Attack', 'Currently Alive']},
  //   {cat: 5, nums: [100], death: ['Currently Alive']},
  //   {cat: 6, nums: [10, 45, 15, 15, 15], death: ['Natural Causes', 'Unknown', 'Heart Attack', 'Suicide', 'Currently Alive']}
  // ];

  let eDataArg = [
    {cat: 0, nums: [2], death: [0], half: -1},
    {cat: 1, nums: [1, 5, 2, 1, 1], death: [4, 0, 2, 3, 1], half: -1},
    {cat: 2, nums: [2, 2], death: [2, 4], half: -1},
    {cat: 3, nums: [3, 4], death: [3, 0], half: -1},
    {cat: 4, nums: [41, 2, 1], death: [4, 2, 1], half: -1},
    {cat: 5, nums: [1], death: [1], half:-1},
    {cat: 6, nums: [4, 1, 1, 1, 1], death: [0, 1, 2, 3, 4], half: -1}
  ];
  let megaTotal = 0;
  for(let i = 0; i < eDataArg.length; i++)
  {
    for(let j = 0; j < eDataArg[i].nums.length; j++)
    {
      megaTotal += eDataArg[i].nums[j];
    }
  }

  // let decisiveTally = 0;
  // for(let i = 0; i < eDataArg.length; i++)
  // nah calc offset.

  let chordColorScale = scaleOrdinal().domain(range(4)).range(chordColors);
  let chordGen = chord().padAngle(0.05);
  let arcGen = arc().innerRadius(315).outerRadius(335);
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

  function ribbonBasket(d) {
    console.log(d);    
    var buffer,
        // s = source.apply(this, arguments),
        // t = target.apply(this, arguments),
        ap = 0.02,
        // argv = slice.call(arguments),
        sr = 300.0, // source radius
        middleDist = 40,
        middleRad = 0,
        sa0 = 13, // start angle source
        sa1 = 35, // end angle source
        // sa0 = 300, // start angle source
        // sa1 = 330, // end angle source
        // sa0 = -160, // start angle source
        // sa1 = -120, // end angle source
        sa0 = (d.startAngle * 180 / Math.PI) - 90, // start angle source
        sa1 = (d.endAngle * 180 / Math.PI) - 90, // end angle source
        tr = 300.0, // Target radius
        ta0 = 180,
        ta1 = Math.PI * 1.25;
        var context = null;
        if(!context)
        {
          context = buffer = path();
        }
        context.moveTo(sr * Math.cos(sa0 * Math.PI / 180), sr * Math.sin(sa0 * Math.PI / 180)); // Good
        // console.log('Hmm: ' + sr * Math.cos(sa0 * Math.PI / 180) + ', ' + sr * Math.sin(sa0 * Math.PI / 180));
        context.arc(0, 0, sr, sa0 * Math.PI / 180, sa1 * Math.PI / 180);
        var hr = 10;
        var tr2 = tr - hr;
        var ta2 = (ta0 + ta1) / 2;
        // context.quadraticCurveTo(0, 0, tr2 * Math.cos(ta0), tr2 * Math.sin(ta0));
        // context.lineTo(tr * Math.cos(ta2), tr * Math.sin(ta2));
        // context.lineTo(tr2 * Math.cos(ta1), tr2 * Math.sin(ta1));

        // calc coords for control point
        // let missAngle = 180 - 90 - (90-(((sa1 - sa0) * 0.1) + sa0));
        let missAngle;
        let mMult = ((sa1 > 0 && sa1 < 90) || (sa1 < -90 && sa1 > -180)) ? 0.4 : 1.1;
        missAngle = 180 - 90 - (90-((Math.abs(sa1 - sa0) * mMult) + sa0));
        let vert = sr * Math.sin(missAngle * Math.PI / 180);
        let hor = sr * Math.cos(missAngle * Math.PI / 180);
        // let vertCoord = (sa1 > 90 || sa1 < -90) ? vert/2 + ((Math.abs(sa1-sa0) * 0.1) * 5) : vert/2 + ((Math.abs(sa1-sa0) * 0.1) * 5);
        // let horCoord = (sa1 > 90 || sa1 < -90) ? hor/2 + ((Math.abs(sa1-sa0) * 0.1) * 10) : hor/2 + ((Math.abs(sa1-sa0) * 0.1) * 10);
        let vertCoord = vert/2 + ((Math.abs(sa1-sa0) * 0.1) * 5);
        let adjustHi = -1;
        if(sa1 > -90 && sa1 < 90)
        {
          adjustHi = ((Math.abs(sa1-sa0) * 0.1) * 10);
        }
        else{
          adjustHi = -1 * ((Math.abs(sa1-sa0) * 0.1) * 10);
          // console.log("what's poooping?");
        }
        let horCoord = hor/2 + adjustHi;

        // second control point
        // let missTangle = 180 - 90 - (90-(sa0 - ((sa1 - sa0) * 0.6)));
        let missTangle;
        let mMultT = ((sa1 > 0 && sa1 < 90) || (sa1 < -90 && sa1 > -180)) ? 1.1 : 0.4;
        missTangle = 180 - 90 - (90-(sa1 - (Math.abs(sa1 - sa0) * mMultT)));
        let vertT = sr * Math.sin(missTangle * Math.PI / 180);
        let horT = sr * Math.cos(missTangle * Math.PI / 180);
        // let vertTCoord = (sa1 > 90 || sa1 < -90) ? vertT/2 + ((Math.abs(sa1-sa0) * 0.1) * 5) : vertT/2 + ((Math.abs(sa1-sa0) * 0.1) * 5);
        // let horTCoord = (sa1 > 90 || sa1 < -90) ? horT/2 + ((Math.abs(sa1-sa0) * 0.1) * 10) : horT/2 + ((Math.abs(sa1-sa0) * 0.1) * 10);
        let vertTCoord = vertT/2 + ((Math.abs(sa1-sa0) * 0.1) * 5);
        let adjustH = -1;
        if(sa1 > -90 && sa1 < 90)
        {
          adjustH = ((Math.abs(sa1-sa0) * 0.1) * 10);
        }
        else{
          adjustH = -1 * ((Math.abs(sa1-sa0) * 0.1) * 10);
          // console.log("what's poooping?");
        }
        let horTCoord = horT/2 + adjustH

        // second control point
        // let missVangle = 180 - 90 - (90-(sa1 + ((sa1 - sa0) * 0.1)));
        // let vertV = sr * Math.sin(missVangle * Math.PI / 180);
        // let horV = sr * Math.cos(missVangle * Math.PI / 180);
        // let vertVCoord = vertV/2;
        // let horVCoord = horV/2;

        // //quirky point
        // let missUAngle = 180 - 90 - (90-(((sa1 - sa0) * 0.6) + sa0));
        // let vertU = sr * Math.sin(missUAngle * Math.PI / 180);
        // let horU = sr * Math.cos(missUAngle * Math.PI / 180);
        // let vertUCoord = vertU/2;
        // let horUCoord = horU/2;
        let argg = [-157, -65, 25, 118, 208];
        
        context.quadraticCurveTo(
          // ((sr * Math.cos(sa1 * Math.PI / 180)) - (sr * Math.cos(sa1 * Math.PI / 180))), 
         
          horCoord, 
        vertCoord, 
        // horVCoord, 
        // vertVCoord, 
          // ((sr * Math.cos(sa1 * Math.PI / 180)) - 2 * (sr * Math.cos(sa1 * Math.PI / 180))) , 
          // (- ((-middleRad) * Math.cos(ta0 * Math.PI / 180))) , 
          // (-middleRad) * Math.sin(ta0 * Math.PI / 180));// to
          (0) , 
          // (208));// to
          argg[d.death]);// to

        context.quadraticCurveTo(
         horTCoord,
          vertTCoord, 
        // horUCoord,
          // vertUCoord, 
          sr * Math.cos(sa0 * Math.PI / 180), 
          sr * Math.sin(sa0 * Math.PI / 180)); //back

        // context.quadraticCurveTo(100, 200, -200, 2.4492935982947064e-14);
        // context.arc(0, 0, tr, ta0, ta1);
        // context.closePath();
        // context.quadraticCurveTo(sr/2, sr * Math.tan((sa1 - sa0) / 2), sr * Math.cos(sa0),  sr * Math.sin(sa0));
        // context.quadraticCurveTo(50, 200, 200,  0);
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
        let sortedArr = eDataArg.sort(function(a, b) {
          let totA = 0;
          let totB = 0;
          for(let i = 0; i < a.nums.length; i++)
          {
            totA += a.nums[i];
          }
          for(let i = 0; i < b.nums.length; i++)
          {
            totB += b.nums[i];
          }
          if(totA > totB)
          {
            return 1;
          }
          else if(totB > totA){
            return -1;
          }
          return 0;
        });
        console.log('Ayooooo!');
        console.log(sortedArr);
        let retArr = [];
        let n = eDataArg.length;
        let angleD = 120;
        let angleR = angleD * Math.PI / 180;
        let totalAngle = 240;
        let totalAngleR = totalAngle * Math.PI / 180;
        let unitAngleR = totalAngleR / megaTotal;
        let padR = 0.02;
        let colorIndex = -1;
        let forwardAngle = ((Math.PI - angleR) / 2);
        let forwardAngleD = ((Math.PI - angleR) / 2);
        let runningRTally = 0.0;

        // for(let i = 0; i < Math.floor(n/2); i++)
        for(let i = 0; i < n; i++)
        {
          colorIndex++;
          console.log(n/2);
          for(let j = 0; j < sortedArr[i].death.length; j++)
          {
            let currSegment = sortedArr[i].nums[j];
            runningRTally += ((unitAngleR * currSegment));
            if(runningRTally < (120 * Math.PI / 180))
            {
              retArr.push(
              {
                'index' : colorIndex,
                // 'startAngle' : (i * ((angleR) / Math.floor(n/2))) + ((Math.PI - angleR) / 2) + padR,
                'startAngle' : (j == 0) ? (padR + forwardAngle) : (forwardAngle),
                // 'endAngle' : ((i + 1) * ((angleR) / Math.floor(n/2))) + ((Math.PI - angleR) / 2) - padR,
                'endAngle' : (j == 0) ? (padR + (unitAngleR * currSegment) + forwardAngle) : ((unitAngleR * currSegment) + forwardAngle),
                'value' : 29630,
                'nums': sortedArr[i].nums[j],
                'death': sortedArr[i].death[j],
                'colorIndex': colorIndex
              }
              );
              forwardAngle += (j == 0) ? (padR + (unitAngleR * currSegment)) : ((unitAngleR * currSegment));
            }
            else{
              // retArr.push(
              // {
              //   'index' : colorIndex,
              //   // 'startAngle' : (i * ((angleR) / Math.floor(n/2))) + ((Math.PI - angleR) / 2) + padR,
              //   'startAngle' : (j == 0) ? (padR + forwardAngle) : (forwardAngle),
              //   // 'endAngle' : ((i + 1) * ((angleR) / Math.floor(n/2))) + ((Math.PI - angleR) / 2) - padR,
              //   'endAngle' : (j == 0) ? (padR + (unitAngleR * currSegment) + forwardAngle) : ((unitAngleR * currSegment) + forwardAngle),
              //   'value' : 29630,
              //   'nums': sortedArr[i].nums[j],
              //   'death': sortedArr[i].death[j],
              //   'colorIndex': colorIndex
              // }
              // );
              // let baseTerm = ((3/2) * Math.PI) - ((Math.PI - angleR) / 2);
              let baseTerm = (2 * Math.PI);
              retArr.push(
                {
                  'index' : colorIndex,
                  // 'startAngle' : Math.PI + (i * ((angleR) / (n - Math.floor(n/2)))) + ((Math.PI - angleR) / 2) + padR,
                  // 'startAngle' : (j == 0) ? ((baseTerm) + padR + forwardAngleD) : (baseTerm + forwardAngleD),
                  'startAngle' : (j == 0) ? (baseTerm - padR - (unitAngleR * currSegment) - forwardAngleD) : (baseTerm - (unitAngleR * currSegment) - forwardAngleD),
                  // 'endAngle' : Math.PI + ((i + 1) * ((angleR) / (n - Math.floor(n/2)))) + ((Math.PI - angleR) / 2) - padR,
                  // 'endAngle' : (j == 0) ? (baseTerm + padR + (unitAngleR * currSegment) + forwardAngleD) : (baseTerm + (unitAngleR * currSegment) + forwardAngleD),
                  'endAngle' : (j == 0) ? ((baseTerm) - padR - forwardAngleD) : (baseTerm - forwardAngleD),
                  'value' : 29630,
                  'nums': eDataArg[i].nums[j],
                  'death': eDataArg[i].death[j],
                  'colorIndex': colorIndex

                }
              );
              forwardAngleD += (j == 0) ? (padR + (unitAngleR * currSegment)) : ((unitAngleR * currSegment));
            }
            // if(i % 2 == 0)
            // {
              // retArr.push(
              // {
              //   'index' : colorIndex,
              //   // 'startAngle' : (i * ((angleR) / Math.floor(n/2))) + ((Math.PI - angleR) / 2) + padR,
              //   'startAngle' : (j == 0) ? (padR + forwardAngle) : (forwardAngle),
              //   // 'endAngle' : ((i + 1) * ((angleR) / Math.floor(n/2))) + ((Math.PI - angleR) / 2) - padR,
              //   'endAngle' : (j == 0) ? (padR + (unitAngleR * currSegment) + forwardAngle) : ((unitAngleR * currSegment) + forwardAngle),
              //   'value' : 29630,
              //   'nums': sortedArr[i].nums[j],
              //   'death': sortedArr[i].death[j],
              //   'colorIndex': colorIndex
              // }
              // );
              // forwardAngle += (j == 0) ? (padR + (unitAngleR * currSegment)) : ((unitAngleR * currSegment));
            // }
            // else{
            //   retArr.push(
            //   {
            //     'index' : colorIndex,
            //     // 'startAngle' : (i * ((angleR) / Math.floor(n/2))) + ((Math.PI - angleR) / 2) + padR,
            //     'startAngle' : (j == 0) ? (Math.PI + padR + forwardAngleD) : (Math.PI + forwardAngleD),
            //     // 'endAngle' : ((i + 1) * ((angleR) / Math.floor(n/2))) + ((Math.PI - angleR) / 2) - padR,
            //     'endAngle' : (j == 0) ? (Math.PI + padR + (unitAngleR * currSegment) + forwardAngleD) : (Math.PI + (unitAngleR * currSegment) + forwardAngleD),
            //     'value' : 29630,
            //     'nums': sortedArr[i].nums[j],
            //     'death': sortedArr[i].death[j],
            //     'colorIndex': colorIndex
            //   }
            // );
            // forwardAngleD += (j == 0) ? (padR + (unitAngleR * currSegment)) : ((unitAngleR * currSegment));
            // }
          }
        }
        // for(let i = 0; i < n - Math.floor(n/2); i++)
        // {
        //   // console.log(n - (n / 2))
        //   retArr.push(
        //     {
        //       'endAngle' : Math.PI + ((i + 1) * ((angleR) / (n - Math.floor(n/2)))) + ((Math.PI - angleR) / 2) - padR,
        //       'index' : i + (Math.floor(n/2)),
        //       'startAngle' : Math.PI + (i * ((angleR) / (n - Math.floor(n/2)))) + ((Math.PI - angleR) / 2) + padR,
        //       'value' : 29630,
        //       'nums': eDataArg[i + (Math.floor(n/2))].nums,
        //       'death': eDataArg[i + (Math.floor(n/2))].death
        //     }
        //   );
        // }
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
      let ribbons = select(chordViz).append("g") 
            .attr("class", "ribbons")
            .selectAll("path")
            .data(chords => chords)
            .enter().append("path")
            .attr("d", ribbonBasket)
            .style("fill", function(d) {
              // console.log('fr');
              // console.log(d);
              // return chordColorScale(d.index);
              return chordColorScale(d.index);
            })
            // .style("stroke", d => rgb(chordColorScale(d.index)).darker())
            .style("stroke", (d, i) => rgb(chordColorScale(d.index)).darker())
            .style("opacity", 0.6);
      let deathArr = ['Natural Causes', 'Unknown', 'Heart Attack', 'Suicide', 'Currently Alive'];
      let mediumArr = ['Water Color', 'Oil Paint', 'Pastel', 'Sculptures', 'Acrylic'];
      groupChord.append('text')
        .data(deathArr)
        .attr('x', -50)
        .attr('y', (d, i) => (i * ((450) / deathArr.length)) - 150)
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
