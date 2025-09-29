<script>
	import '../app.css';
	import logo from '$lib/assets/logo.svg';
	import Navbar from '$lib/components/navbar.svelte';

	const { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={logo} />
	<meta name="viewport" content="width=device-width, initial-scale=1" />
</svelte:head>

<Navbar />
<main>
	{@render children?.()}
</main>

<!--
<Footer />
-->
