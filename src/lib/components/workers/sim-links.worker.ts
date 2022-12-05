importScripts("https://d3js.org/d3-collection.v1.min.js")
importScripts("https://d3js.org/d3-dispatch.v1.min.js")
importScripts("https://d3js.org/d3-quadtree.v1.min.js")
importScripts("https://d3js.org/d3-timer.v1.min.js")
importScripts("https://d3js.org/d3-force.v1.min.js")

onmessage = (event) => {
  const nodes = event.data.nodes
  const links = event.data.links
  const RADIUS = event.data.radius
  const HEIGHT = event.data.height
  const FORCE_FACTOR = 1.75
  const DISTANCE_FACTOR = 1.5

  let sim = d3
    .forceSimulation(nodes)
    .force(
      "link",
      d3
        .forceLink()
        .id((d) => d["artist"])
        .distance(RADIUS * DISTANCE_FACTOR)
        .strength(2)
    )
    .force("charge", d3.forceManyBody().strength(5))
    .force("y", d3.forceY(HEIGHT / 2))
    .force(
      "collide",
      d3.forceCollide().radius((d) => RADIUS * FORCE_FACTOR)
    )
    .stop()

  sim.force("link")!.links(links)

  for (
    let i = 0,
      n = Math.ceil(Math.log(sim.alphaMin()) / Math.log(1 - sim.alphaDecay()));
    i < n;
    ++i
  ) {
    //postMessage({ type: "tick", nodes: nodes, links: links })
    sim.tick()
  }

  postMessage({ type: "end", nodes: nodes, links: links })
}
