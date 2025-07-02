import * as borsh from "borsh";

import { test } from 'node:test';
import assert from "node:assert/strict";

import { Keypair, Connection, LAMPORTS_PER_SOL, SystemProgram, PublicKey, Transaction } from "@solana/web3.js";
import { COUNTER_SIZE, schema } from './types';

let adminAccount = Keypair.generate();
let dataAccount = Keypair.generate();

const PROGRAM_ID = new PublicKey("7jcTggL1Vh3Xb7Koc6ju6XmKc1NHyrmDvJKmC6aTWh5a");

test('Initializing Account', async () => {
    
    const connection = new Connection("http://localhost:8899", "confirmed");

    // airdropping 1 sol
    const txn = await connection.requestAirdrop(adminAccount.publicKey, 1 * LAMPORTS_PER_SOL);
    await connection.confirmTransaction(txn);


    const data = await connection.getAccountInfo(adminAccount.publicKey);

    // this stores the min amount of sol required to store COUNTER_SIZE amount of data
    const lamports = await connection.getMinimumBalanceForRentExemption(COUNTER_SIZE);
    console.log("1st");

    // this will create a fresh account
    const ix = SystemProgram.createAccount({
        fromPubkey: adminAccount.publicKey, // using adminPubkey to create account
        lamports: lamports, // it will take some lamports to exist in blockchain
        space: COUNTER_SIZE, // the account will have some data
        programId: PROGRAM_ID, // program id of deployed contract
        newAccountPubkey: dataAccount.publicKey
    });
    console.log("2nd");

    // creating new transaction to create a new account
    const createAccountTxn = new Transaction();
    // adding the pre-requisites to the transaction
    createAccountTxn.add(ix);
    // sending the transaction to the blockchain, but it requires 3 things transation, creator acc, and the creating acc
    const signature = await connection.sendTransaction(createAccountTxn, [adminAccount, dataAccount]);
    // finally confirming the transaction
    await connection.confirmTransaction(signature);
    console.log("3rd");

    console.log(dataAccount.publicKey.toBase58());

    // getting info of data account, as it has a storage now
    const dataAccountInfo = await connection.getAccountInfo(dataAccount.publicKey);

    if(!dataAccountInfo) return;

    const deserializedData = borsh.deserialize(schema, dataAccountInfo.data);
    console.log(deserializedData);

});
