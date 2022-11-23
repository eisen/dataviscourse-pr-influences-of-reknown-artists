importScripts("https://d3js.org/d3-collection.v1.min.js")
importScripts("https://d3js.org/d3-dispatch.v1.min.js")
importScripts("https://d3js.org/d3-quadtree.v1.min.js")
importScripts("https://d3js.org/d3-timer.v1.min.js")
importScripts("https://d3js.org/d3-force.v1.min.js")

let sim: any
let i: any
let n: any
let nodes: any
let links: any

onmessage = (event) => {
  if (event.data.type === "init") {
    nodes = event.data.nodes
    links = event.data.links
    const RADIUS = event.data.radius
    const HEIGHT = event.data.height
    const FORCE_FACTOR = 2

    sim = d3
      .forceSimulation(nodes)
      .force(
        "link",
        d3
          .forceLink()
          .id((d) => d["artist"])
          .distance(RADIUS * FORCE_FACTOR)
          .strength(1)
      )
      .force("charge", d3.forceManyBody().strength(-5))
      .force("y", d3.forceY(HEIGHT / 2))
      .force(
        "collide",
        d3.forceCollide().radius((d) => RADIUS * FORCE_FACTOR)
      )
      .stop()

    sim.force("link")!.links(links)

    i = 0
    n = Math.ceil(Math.log(sim.alphaMin()) / Math.log(1 - sim.alphaDecay()))

    postMessage({ type: "tick", nodes: nodes, links: links })
    sim.tick()
  } else if (event.data.type === "tick")
    if (i < n) {
      postMessage({ type: "tick", nodes: nodes, links: links })
      sim.tick()
    } else {
      postMessage({ type: "end", nodes: nodes, links: links })
    }
}
