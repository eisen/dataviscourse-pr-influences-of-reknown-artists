importScripts("https://d3js.org/d3-collection.v1.min.js")
importScripts("https://d3js.org/d3-dispatch.v1.min.js")
importScripts("https://d3js.org/d3-quadtree.v1.min.js")
importScripts("https://d3js.org/d3-timer.v1.min.js")
importScripts("https://d3js.org/d3-force.v1.min.js")

const getXfromLatLon = (
  projection: any,
  loc: {
    lat: number
    lon: number
  }[]
) => {
  const pos = projection([loc[0].lon, loc[0].lat])!
  return pos[0]
}

const getYfromLatLon = (
  projection: any,
  loc: {
    lat: number
    lon: number
  }[]
) => {
  const pos = projection([loc[0].lon, loc[0].lat])!
  return pos[1]
}

onmessage = (event) => {
  const nodes = event.data.nodes
  const RADIUS = event.data.radius
  const PROJECTION = event.data.projection

  let sim = d3
    .forceSimulation(nodes)
    .force(
      "x",
      d3.forceX().x((d) => {
        const artist: Array<any> = d as Array<any>
        return getXfromLatLon(PROJECTION, artist[1])
      })
    )
    .force(
      "y",
      d3.forceY().y((d) => {
        const artist: Array<any> = d as Array<any>
        return getYfromLatLon(PROJECTION, artist[1])
      })
    )
    .force(
      "collide",
      d3.forceCollide().radius((d) => RADIUS * 2)
    )
    .stop()

  for (
    let i = 0,
      n = Math.ceil(Math.log(sim.alphaMin()) / Math.log(1 - sim.alphaDecay()));
    i < n;
    ++i
  ) {
    //postMessage({ type: "tick", nodes: nodes, links: links })
    sim.tick()
  }

  postMessage({ type: "end", nodes: nodes })
}
