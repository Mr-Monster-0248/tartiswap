/// <reference types="@sveltejs/kit" />

// See https://kit.svelte.dev/docs/types#the-app-namespace
// for information about these interfaces
declare namespace App {
	interface Locals {
		userid: string;
	}

	// interface Platform {}

	// interface Session {}

	// interface Stuff {}
}

interface Window {
	ethereum: any;
}

interface ImportMetaEnv {
	VITE_TARTISWAP_ADDRESS: string;
	VITE_TARTINE_ADDRESS: string;
	VITE_BISCOTTE_ADDRESS: string;
	VITE_BAGUETTE_ADDRESS: string;
}
