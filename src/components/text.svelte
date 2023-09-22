<script lang="ts">
  import { fade, fly } from "svelte/transition";
  import { cubicOut, quadOut } from "svelte/easing";
  import { tweened } from "svelte/motion";
  import { connect_websocket, type DataResponse } from "../lib/api";
  import { onDestroy, onMount } from "svelte";

  export let source: string;

  let sutle_text = "connecting...";
  let temp: string = "44.50";

  const onConnect = () => {
    sutle_text = "connected";
  };

  const onDisconnect = () => {
    sutle_text = "disconnected";
  };

  const onUpdate = (temperature: number) => {
    sutle_text = "connected";
    temp = temperature.toFixed(2).padStart(5, "0");
  };

  const onError = (error: string) => {
    sutle_text = error;
  };

  let destroyer: (() => void) | null = null;

  onMount(() => {
    destroyer = connect_websocket(
      source,
      onUpdate,
      onConnect,
      onDisconnect,
      onError
    );
  });

  onDestroy(() => {
    destroyer && destroyer();
  });

  function flipDown(node: HTMLElement, { delay = 0 }) {
    return {
      duration: 500,
      delay,
      css: (t: any) => `
        transform: perspective(400px) rotateX(${(1 - quadOut(t)) * 90}deg);
        z-index: 100;
        transform-origin: bottom;
        filter: blur(${t * 1}px);
        `,
    };
  }
  function flipFromUp(node: HTMLElement, { delay = 0 }) {
    return {
      duration: 500,
      delay: 500 + delay,
      css: (t: any) => `
        transform: perspective(400px) rotateX(${(1 - quadOut(t)) * 90}deg);
        transform-origin: top;
        `,
    };
  }

  let tweened_temp = tweened(Number(temp), {
    duration: 1000,
    easing: cubicOut,
  });

  $: tweened_temp.update((_) => Number(temp));
</script>

<div
  class="flex flex-col gap-4 items-center text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold"
>
  <div class="flex flex-col">
    <h1 class="text-2xl font-light tracking-widest">
      {source}
    </h1>
    <div class="relative h-12 w-full">
      {#key sutle_text}
        <p
          class:text-green-300={sutle_text === "connected"}
          class:text-red-300={sutle_text === "disconnected"}
          class="text-xl font-light absolute m-auto w-fit opacity-70 left-0 right-0 animate-pulse"
          in:fly={{ duration: 1000, delay: 400, y: 20 }}
          out:fly={{ duration: 1000, delay: 400, y: -20 }}
        >
          {sutle_text}
        </p>
      {/key}
    </div>
  </div>
  <!-- a horizontal temparatur bar -->
  <div
    class="relative w-full bg-gradient-to-r from-green-500 via-amber-500 to-red-500 h-3 rounded-xl"
  >
    <div
      class="h-[200%] w-[4px] bg-white rounded-full bottom-0 absolute"
      style="left: {$tweened_temp}%;"
    />
  </div>
  <div class="flex flex-row gap-1 select-none items-center">
    {#each String(temp) as num, i}
      <div class="relative h-[1.45em] w-[1em] p-1">
        {#key num}
          <div
            class="top rounded-t-md absolute top-0 drop-shadow-md"
            out:flipDown={{ delay: i * 100 }}
          >
            {num}
          </div>
          <div
            class="buttom rounded-b-md absolute bottom-0 drop-shadow-md"
            out:fade={{ delay: 1000 }}
            in:flipFromUp={{ delay: i * 100 }}
          >
            {num}
          </div>
        {/key}
      </div>
    {/each}
    <span class="px-2"> &#176;C</span>
  </div>
</div>

<style lang="postcss">
  .top,
  .buttom {
    width: 1em;
    height: 0.7em;
    line-height: 1;
    padding: 0.25em;
    overflow: hidden;
    user-select: none;
    -webkit-user-select: none; /* Safari */
    -khtml-user-select: none; /* Konqueror HTML */
    -moz-user-select: none; /* Firefox */
    -ms-user-select: none; /* Internet Explorer/Edge */
    -webkit-tap-highlight-color: transparent;
    @apply bg-slate-600 flex justify-center cursor-default;
  }
  .buttom {
    line-height: 0.9;
    display: flex;
    align-items: flex-end;
  }
</style>
