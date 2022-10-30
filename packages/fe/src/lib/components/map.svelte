<script lang="ts">
	import { geoGraticule } from 'd3-geo'

	export let data;

	const graticuleGen = geoGraticule();
</script>

<svg>
	<g id="graticules" />
	<g id="countries" />
</svg>
