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
    // group,
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

  let grouping = 'century';
  let attribute = 'medium';

  const chordCHeight = 800;
  const chartRad = 400;
  const angleD = 90;

  type ArtistLocation = {
    artist: string
    year: number
    city: string
    country: string
    lat: number
    lon: number
  }

  type ArtistMedium = {
    artist: string
    medium: string
  }

  type PossibleMediums = {
    sculptor: number
    painter: number
    printmaker: number
    draughtsman: number
    photography: number
    film: number
    watercolourist: number
    oilpainter: number
    illustrator: number
    muralist: number
    architect: number
    ink: number
    ceramicist: number
    caligrapher: number
    engraving: number
  }

  let svg: SVGSVGElement
  let chordViz: SVGGElement

  let data: any
  $: data = null

  let allLocations: [string, ArtistLocation[]][]
  $: allLocations = []
  let locations: [string, ArtistLocation[]][]
  $: locations = []
  let allMediums: [string, ArtistMedium[]][]
  $: allMediums = []

  let mediumTypes: [PossibleMediums[]][]
  $: mediumTypes = []

  $: cursor_pos = 'translate(9, 38)'
  $: dragging = false
  let oldestYear: number | undefined
  $: oldestYear = 0
  let youngestYear: number | undefined
  $: youngestYear = 2100

  const graticuleGen = geoGraticule()

  const projection = geoEquirectangular()

  let tl_x_scale: ScaleLinear<number, number, never>
  let tl_x_axis = null

  let chordColors = [
    'rgb(211, 157, 69)',
    '#ff69b4',
    '#ffe4c4',
    // 'rgb(19, 11, 75)',
    'rgb(20, 57, 59)',
    'rgb(163, 0, 48)',
    'rgb(222, 182, 254)',
    // 'rgb(20, 4, 61)',
    '#1e90ff',
    // 'rgb(62, 40, 73)',
    '#00ff00',
    // 'rgb(178, 73, 81)',
    // 'rgb(142, 45, 49)',
    '#7624C2',
    'rgb(195, 72, 54)',
    'rgb(52, 25, 58)',
    'rgb(252, 179, 75)',
  ];
  // let chordColors = [
  //   '#2f4f4f',
  //   '#7f0000',
  //   '#008000',
  //   '#00008b',
  //   '#ff8c00',
  //   '#ffff00',
  //   '#00ff00',
  //   '#00ffff',
  //   '#ff00ff',
  //   '#1e90ff',
  //   '#ff69b4',
  //   '#ffe4c4',
  // ];

  let matrixD = [
            [11975, 5871, 8916, 2868],
            [1951, 10048, 2060, 6171],
            [8010, 16145, 8090, 8045],
            [1013, 990, 940, 6907]
        ];

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
  
  // {name: 'sculptor', number: 0},
  //     {name: 'painter', number: 0},
  //     {name: 'printmaker', number: 0},
  //     {name: 'draughtsman', number: 0},
  //     {name: 'photography', number: 0},
  //     {name: 'film', number: 0},
  //     {name: 'watercolourist', number: 0},
  //     {name: 'oilpainter', number: 0},
  //     {name: 'illustrator', number: 0},
  //     {name: 'muralist', number: 0},
  //     {name: 'architect', number: 0},
  //     {name: 'ink', number: 0},
  //     {name: 'ceramicist', number: 0},
  //     {name: 'caligrapher', number: 0},
  //     {name: 'engraving', number: 0}
  let gtMediums = [ 'sculptor',
                        'painter',
                        'printmaker',
                        'draughtsman',
                        'photography',
                        'film',
                        'watercolourist',
                        'oilpainter',
                        'illustrator',
                        'muralist',
                        'architect',
                        'ink',
                        'ceramicist',
                        'calligrapher',
                        'engraving']
  let medN = gtMediums.length;
        
  let chordMediumScale = scaleOrdinal().domain(gtMediums).range(range(medN));

  let centuryGroupedData = [
    {cent: 1000, people: [], nums: [1], death: [0], meds: new Array(medN).fill(0)},
    {cent: 1100, people: [], nums: [1], death: [1], meds: new Array(medN).fill(0)},
    {cent: 1200, people: [], nums: [1], death: [2], meds: new Array(medN).fill(0)},
    {cent: 1300, people: [], nums: [1], death: [3], meds: new Array(medN).fill(0)},
    {cent: 1400, people: [], nums: [1], death: [4], meds: new Array(medN).fill(0)},
    {cent: 1500, people: [], nums: [1], death: [0], meds: new Array(medN).fill(0)},
    {cent: 1600, people: [], nums: [1], death: [1], meds: new Array(medN).fill(0)},
    {cent: 1700, people: [], nums: [1], death: [2], meds: new Array(medN).fill(0)},
    {cent: 1800, people: [], nums: [1], death: [3], meds: new Array(medN).fill(0)},
    {cent: 1900, people: [], nums: [1], death: [4], meds: new Array(medN).fill(0)},
    // {cent: 2000, people: [], nums: [1], death: [0], meds: new Array(medN).fill(0)},
  ];

  let chordColorScale = scaleOrdinal().domain(range(12)).range(chordColors);
  let chordGen = chord().padAngle(0.05);
  let arcGen = arc().innerRadius(chartRad - 30).outerRadius(chartRad).cornerRadius(3);
  let ribbonGen = ribbon().radius(140);

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
    var buffer,
        // s = source.apply(this, arguments),
        // t = target.apply(this, arguments),
        ap = 0.02,
        // argv = slice.call(arguments),
        // sr = 300.0, // source radius
        sr = chartRad - 35, // source radius
        middleDist = 40,
        middleRad = 0,
        sa0 = 13, // start angle source
        sa1 = 35, // end angle source
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
        context.arc(0, 0, sr, sa0 * Math.PI / 180, sa1 * Math.PI / 180);
        var hr = 10;
        var tr2 = tr - hr;
        var ta2 = (ta0 + ta1) / 2;

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
        }
        let horTCoord = horT/2 + adjustH
        // let argg = [-157, -65, 25, 118, 208];
        let argg = [];
        for(let m = 0; m < gtMediums.length; m++)
        {
          argg.push((m * (((chartRad) * 2 + 20) / gtMediums.length)) - (chartRad-35))
        }
        
        context.quadraticCurveTo(
          horCoord, 
        vertCoord, 
          (d.half == 0)? (60) : (-60) , 
          argg[d.death]);// to

        context.quadraticCurveTo(
         horTCoord,
          vertTCoord, 
          sr * Math.cos(sa0 * Math.PI / 180), 
          sr * Math.sin(sa0 * Math.PI / 180)); //back
        if (buffer) return context = null, buffer + "" || null;
  }

  onMount(async () => {
    // const bbox = select(map).node()!.getBoundingClientRect()

    // tl_pos = `translate(${20}, ${bbox.height + 20 + 20})`

    const features: any = await json(`${server_url}/data/world.json`)
    data = feature(features, features.objects.countries)

    const locs: ArtistLocation[] | undefined = await json(`${server_url}/data/artist-locations.json`)

    const medLocs: ArtistMedium[] | undefined = await json(`${server_url}/data/artist-mediums.json`)

    if (locs && medLocs) {
      allMediums = groups(medLocs, d => d.artist);

      oldestYear = min(locs, d => d.year)
      youngestYear = max(locs, d => d.year)
      allLocations = groups(locs, d => d.artist)
      filterLocations(oldestYear!)


      for(let i = 0; i < allLocations.length; i++)
      {
        centuryGroupedData[Math.floor((Number(allLocations[i][1][0].year)) / 100) - 10].nums[0]++;
        centuryGroupedData[Math.floor((Number(allLocations[i][1][0].year)) / 100) - 10].people.push(allLocations[i][0]);
      }
      for(let i = 0; i < centuryGroupedData.length; i++)
      {
        for(let j = 0; j < centuryGroupedData[i].people.length; j++)
        {
          for(let k = 0; k < allMediums.length; k++)
          {
            if(centuryGroupedData[i].people[j] == allMediums[k][0])
            {
              for(let l = 0; l < allMediums[k][1].length; l++)
              {
                centuryGroupedData[i].meds[chordMediumScale(allMediums[k][1][l].medium)]+=1;
              }
              break;
            }
          }
        }
      }

      let mediumsTotalEntries = 0;
      for(let i = 0; i < centuryGroupedData.length; i++)
      {
        for(let j = 0; j < centuryGroupedData[i].meds.length; j++)
        {
          mediumsTotalEntries += centuryGroupedData[i].meds[j];
        }
      }
      
      select(chordViz).datum(function(d, i) {
        let sortedArr = centuryGroupedData.sort(function(a, b) {
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
        let retArr = [];
        let n = centuryGroupedData.length;
        // let angleD = 90;
        let angleR = angleD * Math.PI / 180;
        let totalAngle = 2 * angleD;
        let totalAngleR = totalAngle * Math.PI / 180;
        // let unitAngleR = totalAngleR / megaTotal;
        let unitAngleR = totalAngleR / mediumsTotalEntries;
        // let unitAngleR = angleR / mediumsTotalEntries;
        let padR = 0.02;
        let colorIndex = -1;
        let forwardAngle = ((Math.PI - angleR) / 2);
        let forwardAngleD = ((Math.PI - angleR) / 2);
        let runningRTally = 0.0;

        // placeholder for data gaps
        sortedArr[0].meds[5] = 1;
        sortedArr[1].meds[11] = 1;

        console.log(centuryGroupedData);
        

        // for(let i = 0; i < Math.floor(n/2); i++)
        let padCheck = false;
        for(let i = 0; i < n; i++)
        {
          colorIndex++;
          padCheck = true;
          for(let j = 0; j < sortedArr[i].meds.length; j++)
          {
            if(sortedArr[i].meds[j] > 0)
            {
            let currSegment = sortedArr[i].meds[j];
            runningRTally += ((unitAngleR * currSegment));
            if(runningRTally < (angleD * Math.PI / 180))
            {
              retArr.push(
              {
                'index' : colorIndex,
                // 'startAngle' : (i * ((angleR) / Math.floor(n/2))) + ((Math.PI - angleR) / 2) + padR,
                'startAngle' : (padCheck && i > 0) ? (padR + forwardAngle) : (forwardAngle),
                // 'endAngle' : ((i + 1) * ((angleR) / Math.floor(n/2))) + ((Math.PI - angleR) / 2) - padR,
                'endAngle' : (padCheck && i > 0) ? (padR + (unitAngleR * currSegment) + forwardAngle) : ((unitAngleR * currSegment) + forwardAngle),
                'value' : 29630,
                // 'nums': sortedArr[i].nums[j],
                'nums': sortedArr[i].meds[j],
                // 'death': sortedArr[i].death[j],
                'death': j,
                'colorIndex': colorIndex,
                'half': 0
              }
              );
              forwardAngle += (padCheck && i > 0) ? (padR + (unitAngleR * currSegment)) : ((unitAngleR * currSegment));
            }
            else{
              let baseTerm = (2 * Math.PI);
              retArr.push(
                {
                  'index' : colorIndex,
                  // 'startAngle' : Math.PI + (i * ((angleR) / (n - Math.floor(n/2)))) + ((Math.PI - angleR) / 2) + padR,
                  // 'startAngle' : (j == 0) ? ((baseTerm) + padR + forwardAngleD) : (baseTerm + forwardAngleD),
                  'startAngle' : (padCheck && i > 0) ? (baseTerm - padR - (unitAngleR * currSegment) - forwardAngleD) : (baseTerm - (unitAngleR * currSegment) - forwardAngleD),
                  // 'endAngle' : Math.PI + ((i + 1) * ((angleR) / (n - Math.floor(n/2)))) + ((Math.PI - angleR) / 2) - padR,
                  // 'endAngle' : (j == 0) ? (baseTerm + padR + (unitAngleR * currSegment) + forwardAngleD) : (baseTerm + (unitAngleR * currSegment) + forwardAngleD),
                  'endAngle' : (padCheck && i > 0) ? ((baseTerm) - padR - forwardAngleD) : (baseTerm - forwardAngleD),
                  'value' : 29630,
                  // 'nums': sortedArr[i].nums[j],
                  'nums': sortedArr[i].meds[j],
                  // 'death': sortedArr[i].death[j],
                  'death': j,
                  'colorIndex': colorIndex,
                  'half': 1

                }
              );
              forwardAngleD += (padCheck && i > 0) ? (padR + (unitAngleR * currSegment)) : ((unitAngleR * currSegment));
            }
            if(padCheck)
            {
              padCheck = false;
            }
            }
          }
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
          return chordColorScale(d.index);
        })
        // .style("stroke", (d, i) => rgb(chordColorScale(d.index)).darker())
        .style("stroke", "white")
        .attr("d", arcGen);
      let ribbons = select(chordViz).append("g") 
            .attr("class", "ribbons")
            .selectAll("path")
            .data(chords => chords)
            .enter().append("path")
            .attr("d", ribbonBasket)
            .style("fill", function(d) {
              // return chordColorScale(d.index);
              return chordColorScale(d.colorIndex);
            })
            // .style("stroke", d => rgb(chordColorScale(d.index)).darker())
            .style("stroke", (d, i) => rgb(chordColorScale(d.colorIndex)).darker())
            .style("opacity", 0.5);
      let deathArr = ['Natural Causes', 'Unknown', 'Heart Attack', 'Suicide', 'Currently Alive'];
      let mediumArr = ['Water Color', 'Oil Paint', 'Pastel', 'Sculptures', 'Acrylic'];
      let groupChordD = select(chordViz).append('g')
            .attr("class", "groups")
            .selectAll("g")
            // .data(chords => chords.groups)
            .data(chords => chords)
            .enter().append("g");
      groupChordD.append('rect')
        .data(gtMediums)
        .attr('x', -60)
        .attr('y', (d, i) => (i * (((chartRad) * 2 + 20) / gtMediums.length)) - (chartRad-35) - 20)
        .attr("rx", 6)
        .attr("ry", 6)
        .attr('width', 120)
        .attr('height', 30)
        .attr('fill', '#00005C')
        .attr('opacity', 1.0);
      groupChordD.append('text')
        .data(gtMediums)
        .attr('x', 0)
        .attr('y', (d, i) => (i * (((chartRad) * 2 + 20) / gtMediums.length)) - (chartRad-35))
        .attr('fill', 'white')
        .style('text-anchor', 'middle')
        .text((d) => (d.charAt(0).toUpperCase() + d.slice(1)));

    } else {
      console.error('Unable to load Artist Locations!')
    }
  })
</script>

<div class="absolute inset-0 select-none" on:mousemove={drag} on:mouseup={stopDrag}>
  <svg id="svg" bind:this={svg} class="block w-full h-full">
    <g id="chordViz" bind:this={chordViz} transform="translate(600, 450)">
    </g>
  </svg>
</div>
