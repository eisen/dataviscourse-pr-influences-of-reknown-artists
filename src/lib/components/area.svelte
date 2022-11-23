<script lang="ts">
  import * as d3 from "d3"

  export let width: number = 0
  export let height: number = 0

  export const Initialize = () => {}
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
  />
</div>
