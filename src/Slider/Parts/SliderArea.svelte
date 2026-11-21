<script lang="ts">
    import {onMount, type Snippet} from "svelte";

    interface Props {
        isActive?: boolean;
        fill?: Snippet;
        onStart?: () => void,
        onValue?: (value: number) => void,
        onEnd?: () => void,
        children: Snippet;
    }

    let {
        isActive = false,
        fill,
        onStart,
        onValue,
        onEnd,
        children
    }: Props = $props();

    let sliderWidth = $state(0);
    let nodeSlider = $state() as HTMLElement;

    function handleSliderValueUpdate(e: Event) {
        let value = ("targetTouches" in e && e.targetTouches
                ? (e.targetTouches as Touch[])[0].clientX
                : (e as MouseEvent).clientX) - nodeSlider.getBoundingClientRect().left;

        value = value / sliderWidth;
        value = Math.min(value, 1);
        value = Math.max(0, value);

        onValue?.(value);
    }

    function sliderStart(e: MouseEvent | TouchEvent) {
        if (e instanceof MouseEvent && e.button && e.button !== 0) { return; } // only lmb
        e.preventDefault();

        onStart?.();
        handleSliderValueUpdate(e);
        document.addEventListener("mousemove", sliderMove);
        document.addEventListener("mouseup", sliderEnd);
    }

    function sliderMove(e: MouseEvent | TouchEvent) {
        if ("touches" in e) {
            e.preventDefault();
        }
        handleSliderValueUpdate(e);
    }

    function sliderEnd() {
        onEnd?.();
        document.removeEventListener("mousemove", sliderMove);
        document.removeEventListener("mouseup", sliderEnd);
        nodeSlider.dispatchEvent(new Event("change", {bubbles: true}));
    }

    onMount(() => {
        nodeSlider.addEventListener("touchstart", sliderStart, {passive: false});
        nodeSlider.addEventListener("touchmove", sliderMove, {passive: false});
        nodeSlider.addEventListener("touchend", sliderEnd, {passive: false});
    });
</script>

<div>
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div class="slider"
         bind:this={nodeSlider}
         bind:clientWidth={sliderWidth}
         onmousedown={sliderStart}>

        <div class={["bg", isActive && "is-active"]}>
            {@render fill?.()}
        </div>

        {@render children()}
    </div>
</div>


<style>
    .slider {
        position: relative;
        display: block;
        margin: 4px 8px;
        flex-grow: 2;
    }

    .bg {
        background: var(--secondary);
        border: 1px solid var(--background);
        height: 48px;
        border-radius: 8px;
        overflow: hidden;
        position: relative;
        transition: background-color 100ms ease;
    }

    .bg.is-active,
    .slider:hover .bg {
        cursor: pointer;
    }
</style>
