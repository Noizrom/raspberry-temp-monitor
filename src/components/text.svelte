<script lang="ts">
  import { fade } from "svelte/transition";
  import { cubicOut, quadOut } from "svelte/easing";
  import { tweened } from "svelte/motion";
  import { get_temp } from "../lib/api";
  import { onMount } from "svelte";

  let sutle_text = "connecting...";
  let temp: string = "44.50";

  onMount(() => {
    get_temp(
      (data) => {
        const _temp = data.temperature;
        // console.log(_temp);
        temp = _temp.toFixed(2).padStart(5, "0");
      },
      () => {
        sutle_text = "connected";
      },
      () => {
        sutle_text = "disconnected";
      }
    );
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

  $: tweened_temp.update((_) => Number(temp) - 2);

  const onclick = () => {
    navigator.vibrate(1);

    // generate a random temparature value
    let _temp = Math.random() * 100;
    // lim
    temp = _temp.toFixed(2).padStart(5, "0");
    // make sure that the value if in xx.xx )format. andd 0 to pad the value
    // console.log(temp);
  };
</script>

{#key sutle_text}
  <h1
    class:text-green-300={sutle_text === "connected"}
    class:text-red-300={sutle_text === "disconnected"}
    class="text-xl font-light leading-10 pb-10 text-center absolute top-0 left-2 opacity-70 animate-pulse"
    transition:fade={{ duration: 1000, delay: 400 }}
  >
    {sutle_text}
  </h1>
{/key}
<div class="flex flex-col gap-4 items-center text-4xl lg:text-6xl font-bold">
  <!-- a horizontal temparatur bar -->
  <div
    class="relative w-full bg-gradient-to-r from-green-500 via-amber-500 to-red-500 h-3 rounded-xl"
  >
    <div
      class="h-[200%] w-[4px] bg-white rounded-full bottom-0 absolute"
      style="left: {$tweened_temp}%;"
    />
  </div>
  <div class="flex flex-row gap-1 select-none">
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
    &#176;C
  </div>
  <!-- <button
    on:click={onclick}
    class="text-base font-normal border p-2 rounded-md hover:bg-gray-700 transition-colors animate-pulse hover:animate-none select-none"
    >randomize</button
  > -->
</div>

<style lang="postcss">
  .top,
  .buttom {
    width: 1em;
    height: 0.7em;
    line-height: 1;
    padding: 0.25em;
    overflow: hidden;
    @apply bg-slate-600 flex justify-center;
  }
  .buttom {
    user-select: none;
    -webkit-user-select: none; /* Safari */
    -khtml-user-select: none; /* Konqueror HTML */
    -moz-user-select: none; /* Firefox */
    -ms-user-select: none; /* Internet Explorer/Edge */
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
    line-height: 0.9;
    display: flex;
    align-items: flex-end;
  }
</style>
