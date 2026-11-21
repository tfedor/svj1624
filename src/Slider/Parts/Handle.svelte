<script lang="ts">
    import type {Snippet} from "svelte";
    import type Value from "../Value.svelte.ts";

    interface Props {
        value: Value,
        type?: "bottom" | "top",
        isActive?: boolean;
        children?: Snippet<[void]>
    }

    let {
        value,
        type = "bottom",
        isActive = false,
        children
    }: Props = $props();
</script>


<div class={[isActive && "is-active", {bottom: type === "bottom", top: type === "top"}]}
     style:left="{value.position}%">
    {@render children?.()}
</div>


<style>
    div {
        position: absolute;
        top: -4px;
        height: 56px;
        width: 14px;
        margin-left: -7px;
        margin-right: -7px;
        background-color: var(--accent);
        cursor: pointer;
        transition: left 100ms ease, background-color 100ms ease;
        display: flex;
        justify-content: center;
        align-items: center;

        &.bottom {
            border-radius: 2px 2px 7px 7px;
        }
        &.top {
            border-radius: 7px 7px 2px 2px;
        }
    }
    div.is-active,
    div:hover {
        background: hsl(from var(--accent) h s calc(l * 1.05));
    }
</style>
