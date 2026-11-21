<script lang="ts">
    import type {Snippet} from "svelte";

    interface Props {
        from: number;
        to: number;
        render: "min" | "max" | "range";
        type?: "garage" | "favor" | "against" | "abstain",
        children?: Snippet<[void]>
    }

    let { from, to, render, type, children }: Props = $props();
</script>


<div class={["fill", {
    minfill: render === "min",
    maxfill: render === "max",
    garage: type === "garage",
    favor: type === "favor",
    against: type === "against",
    abstain: type === "abstain"
}]} style:left="{from}%" style:right="{100 - to}%">
    <div>{@render children?.()}</div>
</div>


<style>
    .fill {
        background: var(--primary);
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        margin: 0 7px;
        transition: left 100ms ease, right 100ms ease;
        opacity: 0.8;
        display: flex;
        overflow: hidden;
        align-items: center;
        box-sizing: border-box;

        & > div {
            white-space: nowrap;
            padding: 10px;
            overflow: hidden;
        }
    }
    .minfill {
        margin-left: 0;
    }
    .maxfill {
        margin-right: 0;
    }

    .garage {
        --c1: var(--primary);
        --c2: var(--secondary);
        margin: 0;
        background: var(--secondary);
        border-right: 1px dotted var(--accent);
        background: repeating-linear-gradient(
                135deg,
                var(--c1),
                var(--c1) 15px,
                var(--c2) 15px,
                var(--c2) 30px
        );
        color: var(--text);
    }
    .favor {
        background: linear-gradient(to right, var(--positive-dim), var(--positive));
        color: var(--background);
    }
    .abstain {
        background: transparent;
    }
    .against {
        background: linear-gradient(to left, var(--negative-dim), var(--negative));
        color: var(--background);
        justify-content: flex-end;
    }
</style>
