<script lang="ts">
    interface Props {
        split: number
    }

    const {split}: Props = $props();
</script>


<div class="strength">
    <div class="part garage" style:right="{100-split}%">
        <div>
            <div>Garáž</div>
            <div lang="en">Garage</div>
        </div>
        <div class="value">{split}%</div>
    </div>
    <div class="part house" style:left="{split}%">
        <div>
            <div>Dom</div>
            <div lang="en">House</div>
        </div>
        <div class="value">{100 - split}%</div>
    </div>
</div>


<style>
    .strength {
        height: 48px;
        position: relative;
        border-radius: 8px;
        overflow: hidden;
    }

    .part {
        position: absolute;
        height: 100%;
        padding: 10px;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        overflow: hidden;
    }

    .value {
        position: absolute;
        font-size: 30px
    }

    .garage {
        --c1: var(--primary);
        --c2: var(--secondary);
        border-right: 1px solid var(--text);
        background: repeating-linear-gradient(
                135deg,
                var(--c1),
                var(--c1) 15px,
                var(--c2) 15px,
                var(--c2) 30px
        );
        color: var(--text);
        left: 0;

        & .value {
            right: 10px
        }
    }

    .house {
        right: 0;
        background: hsl(from var(--accent) h s calc(l * 1.4));
        justify-content: flex-end;
        text-align: right;

        & .value {
            left: 10px
        }
    }
</style>