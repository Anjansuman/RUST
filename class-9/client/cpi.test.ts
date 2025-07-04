import { Keypair, LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction, TransactionInstruction } from "@solana/web3.js";
import { test, expect } from "bun:test";
import { LiteSVM } from "litesvm";


test("cpi test", () => {

    const svm = new LiteSVM();

    const doubleContract = PublicKey.unique();
    svm.addProgramFromFile(doubleContract, "./double.so");

    const cpiContract = PublicKey.unique();
    svm.addProgramFromFile(cpiContract, "./cpi.so");

    const payer = Keypair.generate();
    svm.airdrop(payer.publicKey, BigInt(LAMPORTS_PER_SOL));

    const dataAccount = Keypair.generate();

    createDataAccount(svm, payer, doubleContract, dataAccount);

    cpiCall(svm, dataAccount, doubleContract, cpiContract, payer);

    const dataAccountData = svm.getAccount(dataAccount.publicKey);
    expect(dataAccountData?.data[0]).toBe(1);
    expect(dataAccountData?.data[1]).toBe(0);
    expect(dataAccountData?.data[2]).toBe(0);
    expect(dataAccountData?.data[3]).toBe(0);

});

function createDataAccount(svm: LiteSVM, payer: Keypair, doubleContract: PublicKey, dataAccount: Keypair) {
    const blockhash = svm.latestBlockhash();

    const ix = [
        SystemProgram.createAccount({
            programId: doubleContract,
            fromPubkey: payer.publicKey,
            newAccountPubkey: dataAccount.publicKey,
            space: 4,
            lamports: Number(svm.minimumBalanceForRentExemption(BigInt(4)))
        })
    ];

    const tx = new Transaction();
    tx.recentBlockhash = blockhash;
    tx.add(...ix);
    tx.sign(payer, dataAccount);
    svm.sendTransaction(tx);
}

function cpiCall(svm: LiteSVM, dataAccount: Keypair, doubleContract: PublicKey, cpiContract: PublicKey, payer: Keypair) {
    const blockhash = svm.latestBlockhash();
    const ix = new TransactionInstruction({
        keys: [
            { pubkey: dataAccount.publicKey, isSigner: true, isWritable: true },
            { pubkey: doubleContract, isSigner: false, isWritable: false }
        ],
        programId: cpiContract,
        data: Buffer.from(""),
    });

    const tx = new Transaction();
    tx.recentBlockhash = blockhash;
    tx.add(ix);
    tx.sign(payer, dataAccount);

    svm.sendTransaction(tx);
}