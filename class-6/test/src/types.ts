import * as borsh from "borsh";


// defining class for same thing in rust struct to work
export class CounterAccount {
    count: number;

    constructor({ count }: { count: number }) {
        this.count = count;
    }
}

// this is how we define struct in ts using borsh, so that the serialization doesn't get effected
// check the lib.rs code for more clarity
export const schema: borsh.Schema = {
    struct: {
        count: 'u32'
    }
}

// getting the length of the struct which is 4 in this case
export const COUNTER_SIZE = borsh.serialize(
    schema,
    new CounterAccount({ count: 0 })
).length;