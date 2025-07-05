import { Keypair, SystemProgram, Transaction } from "@solana/web3.js";
import { LiteSVM } from "litesvm";

const svm = new LiteSVM();

async function main() {
    const userAcc = Keypair.generate();
    const dataAcc = Keypair.generate();

    svm.airdrop(userAcc.publicKey, 1000_000_000n);

    const ix = [
        SystemProgram.createAccount({
            fromPubkey: userAcc.publicKey,
            newAccountPubkey: dataAcc.publicKey,
            lamports: Number(svm.minimumBalanceForRentExemption(BigInt(8))),
            space: 8,
            programId: SystemProgram.programId
        })
    ];

    const tx = new Transaction();
    tx.add(...ix);
    tx.recentBlockhash = svm.latestBlockhash();
    tx.feePayer = userAcc.publicKey;
    tx.sign(userAcc, dataAcc);

    const res = svm.sendTransaction(tx);

    console.log(res);

}

main();