
export default class {
    readonly #min: number = 0;
    readonly #max: number = 100;
    readonly #softmin: number = 0;

    #raw: number = $state() as number;
    #value: number = $derived.by(() => {
        if (this.#raw < this.#softmin) {
            return this.#softmin;
        }
        if (this.#raw > this.#max) {
            return this.#max;
        }
        return Math.round(this.#raw);
    });
    private _position = $derived(((this.#value - this.#min) / (this.#max - this.#min)) * 100);

    constructor(props: {
        initial: number,
        min: number,
        max: number,
        softmin?: number
    }) {
        this.#min = props.min;
        this.#max = props.max;
        this.#raw = props.initial;
        this.#softmin = Math.max(props.softmin ?? props.min, props.min);
    }

    setValue(value: number) {
        this.#raw = value;
    }

    setPercentage(perc: number) {
        this.#raw = this.#min + perc * (this.#max - this.#min);
    }

    get value() {
        return this.#value;
    }

    get position() {
        return this._position;
    }
};
