import { expect, test } from "bun:test";
import { LiteSVM } from "litesvm";
import {
    PublicKey,
    Transaction,
    LAMPORTS_PER_SOL,
    SystemProgram,
    Keypair,
    TransactionInstruction
} from "@solana/web3.js";

test("double contract", () => {
    const svm = new LiteSVM();

    const contractKey = Keypair.generate();
    svm.addProgramFromFile(contractKey.publicKey, "./double.so");

    const payer = new Keypair();
    svm.airdrop(payer.publicKey, BigInt(LAMPORTS_PER_SOL));

    const dataAccount = Keypair.generate();

    const blockhash = svm.latestBlockhash();

    const ix1 = [
        SystemProgram.createAccount({
            fromPubkey: payer.publicKey,
            newAccountPubkey: dataAccount.publicKey,
            lamports: Number(svm.minimumBalanceForRentExemption(BigInt(4))),
            space: 4,
            programId: contractKey.publicKey
        }),
    ];

    const tx1 = new Transaction();
    tx1.recentBlockhash = blockhash;
    tx1.add(...ix1);
    tx1.sign(payer, dataAccount);

    svm.sendTransaction(tx1);

    const balanceAfter = svm.getBalance(dataAccount.publicKey);

    expect(balanceAfter).toBe(svm.minimumBalanceForRentExemption(BigInt(4)));

    function doubleIt() {
        const ix2 = new TransactionInstruction({
            programId: contractKey.publicKey,
            keys: [
                { pubkey: dataAccount.publicKey, isSigner: false, isWritable: true },
                { pubkey: payer.publicKey, isSigner: true, isWritable: false }
            ],
            data: Buffer.from("")
        });

        const blockhash2 = svm.latestBlockhash();
        const tx2 = new Transaction();
        tx2.recentBlockhash = blockhash2;
        tx2.feePayer = payer.publicKey;
        tx2.add(ix2);
        tx2.sign(payer);
        svm.sendTransaction(tx2);

        svm.expireBlockhash();
    }

    doubleIt();
    doubleIt();
    doubleIt();
    doubleIt();

    const newDataAcc = svm.getAccount(dataAccount.publicKey);

    expect(newDataAcc?.data[0]).toBe(8);
    expect(newDataAcc?.data[1]).toBe(0);
    expect(newDataAcc?.data[2]).toBe(0);
    expect(newDataAcc?.data[3]).toBe(0);

});