import { Keypair, LAMPORTS_PER_SOL, SystemInstruction, SystemProgram, Transaction, TransactionInstruction } from "@solana/web3.js";
import { expect, test } from "bun:test";
import { LiteSVM } from "litesvm";

test("count test", () => {

    const svm = new LiteSVM();

    const contractKey = Keypair.generate();
    const userAcc = Keypair.generate();

    svm.addProgramFromFile(contractKey.publicKey, "./count.so");
    svm.airdrop(userAcc.publicKey, BigInt(LAMPORTS_PER_SOL));
    
    const dataAcc = Keypair.generate();

    const ix1 = [
        SystemProgram.createAccount({
            fromPubkey: userAcc.publicKey,
            newAccountPubkey: dataAcc.publicKey,
            lamports: Number(svm.minimumBalanceForRentExemption(BigInt(4))),
            space: 4,
            programId: contractKey.publicKey
        })
    ];

    const tx1 = new Transaction();
    tx1.add(...ix1);
    tx1.recentBlockhash = svm.latestBlockhash();
    tx1.feePayer = userAcc.publicKey;
    tx1.sign(userAcc, dataAcc);

    svm.sendTransaction(tx1);

    const balance = svm.getBalance(dataAcc.publicKey);

    expect(balance).toBe(svm.minimumBalanceForRentExemption(BigInt(4)));

    add(svm, dataAcc, userAcc, contractKey);

});

const add = (svm: LiteSVM, dataAcc: Keypair, userAcc: Keypair, contractKey: Keypair) => {
    const ixn = new TransactionInstruction({
        keys: [
            { pubkey: dataAcc.publicKey, isSigner: true, isWritable: true }
        ],
        programId: contractKey.publicKey,
        data: 
    })
}

class Add {
    public value: number;
    constructor(props: { value: number }) {
        this.value = props.value;
    }
}