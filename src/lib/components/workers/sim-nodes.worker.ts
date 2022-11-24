importScripts("https://d3js.org/d3-collection.v1.min.js")
importScripts("https://d3js.org/d3-dispatch.v1.min.js")
importScripts("https://d3js.org/d3-quadtree.v1.min.js")
importScripts("https://d3js.org/d3-timer.v1.min.js")
importScripts("https://d3js.org/d3-force.v1.min.js")

onmessage = (event) => {
  const nodes = event.data.nodes
  const RADIUS = event.data.radius

  let sim = d3
    .forceSimulation(nodes)
    .force(
      "x",
      d3.forceX().x((d) => {
        const artist: Array<any> = d as Array<any>
        return artist.x
      })
    )
    .force(
      "y",
      d3.forceY().y((d) => {
        const artist: Array<any> = d as Array<any>
        return artist.y
      })
    )
    .force(
      "collide",
      d3.forceCollide().radius((d) => RADIUS * 3)
    )
    .stop()

  for (
    let i = 0,
      n = Math.ceil(Math.log(sim.alphaMin()) / Math.log(1 - sim.alphaDecay()));
    i < n;
    ++i
  ) {
    sim.tick()
  }

  postMessage({ type: "end", nodes: nodes })
}
