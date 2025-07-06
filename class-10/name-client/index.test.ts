import { Keypair, LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction, TransactionInstruction } from "@solana/web3.js";
import { test, expect, describe } from "bun:test";
import { LiteSVM } from "litesvm";


describe("create pda for client", () => {

    const svm = new LiteSVM();

    const contractAcc = Keypair.generate();
    svm.addProgramFromFile(contractAcc.publicKey, "./contract.so");

    const userAcc = Keypair.generate();
    svm.airdrop(userAcc.publicKey, BigInt(LAMPORTS_PER_SOL));

    const [pda, bump] = PublicKey.findProgramAddressSync([userAcc.publicKey.toBuffer(), Buffer.from("user")], contractAcc.publicKey);

    const ix = new TransactionInstruction({
        programId: contractAcc.publicKey,
        keys: [
            { pubkey: userAcc.publicKey, isSigner: true, isWritable: false },
            { pubkey: pda, isSigner: false, isWritable: true },
            { pubkey: SystemProgram.programId, isSigner: false, isWritable: false }
        ],
        data: Buffer.from("")
    });

    const txn = new Transaction().add(ix);

    txn.recentBlockhash = svm.latestBlockhash();
    txn.sign(userAcc);

    const res = svm.sendTransaction(txn);

    test("create pda", () => {
        const balance = svm.getBalance(pda);

        console.log(balance);

        expect(Number(balance)).toBeGreaterThan(0);
        expect(Number(balance)).toBe(1000000000)

    });
});