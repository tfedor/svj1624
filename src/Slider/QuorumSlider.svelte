<script lang="ts">
    import {onMount} from "svelte";
    import Handle from "./Parts/Handle.svelte";
    import SliderArea from "./Parts/SliderArea.svelte";
    import SliderFill from "./Parts/SliderFill.svelte";
    import Value from "./Value.svelte.js";

    interface Props {
        garage: number,
        value?: number,
        onupdate: () => void
    }

    const min = 0;
    const max = 100;

    let {
        garage,
        value = $bindable(max),
        onupdate
    }: Props = $props();

    let activeHandle = $state(false);

    let v = $derived(new Value({initial: value, min, max, softmin: 50}));
    let x = $derived(v.position);

    function onEnd(): void {
        activeHandle = false;
        onupdate();
    }

    onMount(() => {
        if (value < min || value > max) {
            throw new Error("Invalid slider setup");
        }
    })

    $effect(() => {
        value = v.value;
    });
</script>


<SliderArea isActive={activeHandle}
            onValue={value => v.setPercentage(value)}
            onStart={() => activeHandle = true}
            {onEnd}>

    {#snippet fill()}
        <SliderFill from={0} to={garage} render="min" type="garage">
            <div>Garážový podiel</div>
            <div lang="en">Garage cut</div>
        </SliderFill>
        <SliderFill from={garage} to={x} render="min">
            <div>Ostatné jednotky</div>
            <div lang="en">Other units</div>
        </SliderFill>
        <SliderFill from={x} to={100} render="max">
            <div>Neprítomní</div>
            <div lang="en">Absent</div>
        </SliderFill>

        <div class="split"></div>
    {/snippet}

    <Handle value={v} isActive={activeHandle}>
        <span>{v.value}%</span>
    </Handle>
</SliderArea>

<style>
    span {
        position: relative;
        top: -40px;
    }

    .split {
        position: absolute;
        left: 50%;
        height: 100%;
        border-left: 1px dashed var(--accent);
    }
</style>