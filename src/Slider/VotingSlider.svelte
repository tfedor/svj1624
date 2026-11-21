<script lang="ts">
    import Handle from "./Parts/Handle.svelte";
    import SliderArea from "./Parts/SliderArea.svelte";
    import SliderFill from "./Parts/SliderFill.svelte";
    import Value from "./Value.svelte.ts";

    interface Props {
        min?: number;
        max?: number;
        value1?: number;
        value2?: number;
        formatter?: (value: number) => string;
        ticks?: number|number[]; // ticks each {x} units, not number of ticks
    }

    let {
        min = 0,
        max = 100,
        value1 = $bindable(min),
        value2 = $bindable(max)
    }: Props = $props();

    const v1 = $derived(new Value({initial: value1, min, max}));
    const v2 = $derived(new Value({initial: value2, min, max}));

    let activeHandle = $state(0);

    function handleSliderValue(value: number) {
        if (activeHandle == 0) {
            let perc = value * 100;
            let to1 = Math.abs(v1.position - perc);
            let to2 = Math.abs(v2.position - perc);

            if (to1 < to2) {
                activeHandle = 1;
            } else {
                activeHandle = 2;
            }
        }

        if (activeHandle == 1) {
            v1.setPercentage(Math.min(value, v2.position / 100));
        } else {
            v2.setPercentage(Math.max(value, v1.position / 100));
        }
        sortValues();
    }

    function sortValues() {
        if (activeHandle !== 0) {
            return;
        }

        if (v2.value < v1.value) {
            let tmp = v1.value;
            v1.setValue(v2.value);
            v2.setValue(tmp);
        }
    }

    $effect(() => {
        value1 = v1.value;
    });
    $effect(() => {
        value2 = v2.value;
    })
</script>


<SliderArea isActive={activeHandle !== 0}
        onValue={handleSliderValue}
        onEnd={() => activeHandle = 0}>

    {#snippet fill()}
        <SliderFill render="min" type="favor" from={0} to={Math.min(v1.position, v2.position)}>
            <div>PRO</div>
            <div lang="en">In Favor</div>
        </SliderFill>

        <SliderFill render="range" type="abstain" from={Math.min(v1.position, v2.position)} to={Math.max(v1.position, v2.position)}>
            <div>ZDRŽEL SE</div>
            <div lang="en">Abstain</div>
        </SliderFill>

        <SliderFill render="max" type="against" from={Math.max(v1.position, v2.position)} to={100}>
            <div>PROTI</div>
            <div lang="en">Against</div>
        </SliderFill>
    {/snippet}

    <Handle value={v1} isActive={activeHandle === 1}>
        <span class="favor">{v1.value}%</span>
    </Handle>
    <Handle value={v2} isActive={activeHandle === 2} type="top">
        <span class="against">{100 - v2.value}%</span>
    </Handle>
</SliderArea>


<style>
    span {
        position: relative;

        &.favor {
            top: -40px;
        }
        &.against {
            bottom: -40px;
        }
    }
</style>