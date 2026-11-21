<script lang="ts">
    interface Props {
        favor: number,
        abstained: number,
        against: number
    }

    let {favor, abstained, against}: Props = $props();
</script>


<div class="results">
    <div class="part favor" style:right="{100 - favor}%">
        <div>
            <div>PRO</div>
            <div lang="en">In favor</div>
        </div>
    </div>
    <div class="part abstained" style:left="{favor}%" style:right="{against}%">
        <div>
            <div>ZDRŽEL SE</div>
            <div lang="en">Abstained</div>
        </div>
    </div>

    <div class="part against" style:left="{100 - against}%">
        <div>
            <div>PROTI</div>
            <div lang="en">Against</div>
        </div>
    </div>
</div>

<ul class="values">
    <li class="favor" style:right="{100 - favor}%">
        <div>{favor}%</div>
    </li>
    <li class="abstained" style:left="{favor}%" style:right="{against}%">
        <div>{abstained}%</div>
    </li>

    <li class="against" style:left="{100 - against}%">
        <div>{against}%</div>
    </li>
</ul>


<style>
    .results {
        height: 80px;
        position: relative;
        border-radius: 8px;
        overflow: hidden;

        & .part {
            position: absolute;
            height: 100%;
            padding: 10px;
            box-sizing: border-box;
            display: flex;
            align-items: center;
            overflow: hidden;
            white-space: nowrap;
            opacity: 0.8;
            transition: left 200ms ease, right 200ms ease;

            & div {
                overflow: hidden;
            }
        }

        & .favor {
            left: 0;
            background: linear-gradient(to right, var(--positive-dim), var(--positive));
            color: var(--background);
        }

        & .abstained {
            background: var(--secondary);
        }

        & .against {
            right: 0;
            background: linear-gradient(to left, var(--negative-dim), var(--negative));
            color: var(--background);
            justify-content: flex-end;
        }
    }


    ul {
        position: relative;
        font-size: 30px;
        list-style-type: none;
        margin: 0;
        padding: 0;
        height: 36px;
        display: flex;
        align-items: center;

        & li {
            position: absolute;
            overflow: hidden;
            transition: left 200ms ease, right 200ms ease;

            & div {
                padding: 0 15px;
                overflow: hidden;
            }
        }
    }
</style>