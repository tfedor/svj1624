import {mount} from "svelte";
import App from "./App.svelte";

mount(App, {
    target: document.querySelector<HTMLElement>("#app")!
});

// live reload
new EventSource('/esbuild').addEventListener('change', () => location.reload())
