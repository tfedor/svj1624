<script lang="ts">
    import {onMount, untrack} from "svelte";
    import QuorumSlider from "./Slider/QuorumSlider.svelte";
    import VotingSlider from "./Slider/VotingSlider.svelte";
    import VoteResults from "./VoteResults.svelte";
    import VoteStrength from "./VoteStrength.svelte";

    const allVotes = 251423;
    const garageVotes = 81571;
    const houseVotes = allVotes - garageVotes;

    const garageCut = Math.round((garageVotes/allVotes)*100);

    let quorum: number = $state(60);
    let voting1: number = $state(45);
    let voting2: number = $state(100 - 30);

    let votesPresent = $derived(Math.min(Math.max(garageVotes, Math.round(allVotes * (quorum / 100))), allVotes));
    let houseVotesPresent = $derived(Math.max(0, votesPresent - garageVotes));

    const garageStrength: number = $derived(garageVotes / votesPresent);
    const houseStrength: number = $derived(1 - garageStrength);
    const strengthSplit = $derived(Math.round(garageStrength*100));

    function clampVotes(perc: number, total: number): number {
        return Math.min(Math.max(0, Math.round((perc / 100) * total)), total);
    }

    // house votes
    const favor = $derived(clampVotes(voting1, houseVotesPresent));
    const against = $derived(clampVotes(100 - voting2, houseVotesPresent));
    const abstained = $derived(clampVotes(voting2 - voting1, houseVotesPresent));

    const garageShouldVote: number = $derived.by(() => {
        if (favor > against && favor > abstained) {
            return 1
        }

        if (against > favor && against > abstained) {
            return -1
        }

        return 0;
    });

    // final votes
    const finalVotes = $derived({
        favor:     favor     + garageVotes * (garageShouldVote  > 0 ? 1 : 0),
        abstained: abstained + garageVotes * (garageShouldVote == 0 ? 1 : 0),
        against:   against   + garageVotes * (garageShouldVote  < 0 ? 1 : 0)
    });
    const results = $derived({
        favor:     Math.round((finalVotes.favor     / votesPresent) * 100),
        abstained: Math.round((finalVotes.abstained / votesPresent) * 100),
        against:   Math.round((finalVotes.against   / votesPresent) * 100)
    });

    function onupdate() {
        const url = new URL(window.location.href);
        url.searchParams.set("q", String(quorum));
        url.searchParams.set("v1", String(voting1));
        url.searchParams.set("v2", String(voting2));

        history.pushState(null, "", url);
    }

    function onurl() {
        const url = new URL(window.location.href);
        const q  = url.searchParams.get("q");
        const v1 = url.searchParams.get("v1");
        const v2 = url.searchParams.get("v2");

        if (q) { quorum = Number(q); }
        if (v1) { voting1 = Number(v1); }
        if (v2) { voting2 = Number(v2); }
    }

    onMount(() => {
        onurl();
        window.addEventListener("popstate", onurl);
    });
</script>

<main>
    <h1>Hlasovanie SVJ</h1>

    <section>
        <header>
            <div class="title">
                Účasť na zhromaždení
                <div lang="en">Participation</div>
            </div>

            <aside>
                <div>Vyžaduje sa aspoň 50% účasť aby bolo zhromaždenie uznášania schopné, {garageCut}% tvorí garáž.</div>
                <div lang="en">At least 50% participation is required, out of which {garageCut}% is made by garage unit.</div>
            </aside>
        </header>

        <div class="slider">
            <QuorumSlider garage={garageCut} bind:value={quorum} {onupdate} />
        </div>
    </section>

    <section>
        <header>
            <div class="title">
                Váha hlasu garáže
                <div lang="en">Garage vote strength</div>
            </div>
        </header>

        <VoteStrength split={strengthSplit} />
    </section>

    <section>
        <header>
            <div class="title">
                Hlasovanie domu (bez garáží)
                <div lang="en">House voting (without garage unit)</div>
            </div>

            <aside>
                <div>Hlasujú majitelia okrem garáže. Výsledok tohto hlasovania rozhodne ako bude hlasovať garáž.</div>
                <div lang="en">Everyone except garage unit votes. The results determine what will be the garage's vote.</div>
            </aside>
        </header>

        <div class="slider">
            <VotingSlider bind:value1={voting1} bind:value2={voting2} {onupdate} />
        </div>

        <footer>
            <div>
                Garáž by mala hlasovať
                {#if garageShouldVote > 0}
                    PRO
                {:else if garageShouldVote < 0}
                    PROTI
                {:else}
                    ZDRŽEL SE
                {/if}
            </div>
            <div lang="en">
                Garage should
                {#if garageShouldVote > 0}
                    vote in favor
                {:else if garageShouldVote < 0}
                    vote against
                {:else}
                    abstain
                {/if}
            </div>
        </footer>
    </section>

    <section>
        <header>
            <div class="title">
                Výsledky
                <div lang="en">Result</div>
            </div>

            <aside>
                <div>Finálne výsledky s hlasom garáží.</div>
                <div lang="en">Final results with garage vote.</div>
            </aside>
        </header>

        <VoteResults favor={results.favor}
                     abstained={results.abstained}
                     against={results.against} />
    </section>
</main>


<style>
    main {
        width: 1150px;
        max-width: 95vw;
        margin: auto auto 500px;
    }

    section {
        margin-top: 50px;

        & + section {
            padding-top: 50px;
            border-top: 1px dashed var(--primary);
        }
    }

    header {
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        gap: 15px;
        flex-wrap: wrap;
        margin-bottom: 15px;

        .title {
            font-size: 21px;

            & div {
                font-size: 16px;
            }
        }

        & aside {
            flex-grow: 1;
            text-align: right;
            font-size: var(--size-small);
        }
    }

    .slider {
        margin: 50px 0 30px;
    }

    footer {
        margin-top: 40px;
        text-align: center;
        font-size: 15px;
    }

</style>