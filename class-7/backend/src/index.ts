import express from "express";
import bs58 from "bs58";
import { Connection, Keypair, PublicKey, sendAndConfirmTransaction, SystemProgram, Transaction } from "@solana/web3.js";
import * as dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.post("/bet", async (req, res) => {
    try {

        const privateKey = process.env.PLATFORM_PRIVATE_KEY;

        if(!privateKey) {
            console.log("Private key not found!");
            res.status(500).json({
                message: "Internal server error!"
            });
            return;
        }

        // this stores the public-private key of the platform
        const secretKey = bs58.decode(privateKey);
        const sender = Keypair.fromSecretKey(secretKey);
        
        // remember to use database that will store the signature so that in future if anyone puts same signature, our database should check it and it should refuse to proceed further
        const signature = req.body.signature;
        let playerPublicKey;
        let sentLamports;

        // connection to the solana mainnet
        const connection = new Connection("https://api.mainnet-beta.solana.com");


        // this will check if the transaction exists in the blockchain
        const checkTransaction = await connection.getParsedTransaction(signature, {
            commitment: "confirmed" // commitment is confirmed only if atleast 1 miner confirms it
        });

        if(!checkTransaction || !checkTransaction.transaction || !checkTransaction.meta || !checkTransaction?.blockTime) {
            res.status(404).json({
                message: "Transaction not found!"
            });
            return;
        }

        // check if the transaction is done within a day
        const blockTime = checkTransaction.blockTime;
        const now = Math.floor(Date.now() / 1000);

        if((now - blockTime) > 86400) {
            console.log("Expired!");
            res.status(422).json({
                message: "Invalid Transaction"
            });
            return;
        }

        // this stores the instructions like transfers, program calls, and details about transaction, etc
        const instructions = checkTransaction.transaction.message.instructions;

        // this verifies the transaction that it is sent to us
        for(const ix of instructions) {
            if ('parsed' in ix && ix.program === 'system' && ix.parsed.type === 'transfer') {
                playerPublicKey = new PublicKey(ix.parsed.info.source);
                sentLamports = ix.parsed.info.lamports;

                const receiverPublicKey = new PublicKey(ix.parsed.info.destination);


                if(!receiverPublicKey.equals(sender.publicKey)) {
                    res.status(422).json({
                        message: "Mismatched transaction!"
                    });
                    return;
                }

            }
        }

        // check if player's public key and lamports are present in the transaction
        if(!playerPublicKey || !sentLamports) {
            res.status(422).json({
                message: "Invalid transaction"
            });
            return;
        }

        // store the signature in the database

        // make it more complex using crypto library
        const random = Math.random();

        if(random < 0.5) {
            res.status(200).json({
                message: "You lost"
            });
            return;
        }

        // logic to transfer the won amount
        const PLATFROM_FEE = 0.03; // platform fee = 3%

        const wonLamports = (2 * sentLamports) - (PLATFROM_FEE * sentLamports);

        const transaction = new Transaction().add(
            SystemProgram.transfer({
                fromPubkey: sender.publicKey,
                toPubkey: playerPublicKey,
                lamports: wonLamports
            })
        );

        // send the transaction and confirm it
        const sentTransactionSignature = await sendAndConfirmTransaction(connection, transaction, [sender]);

        if(!sentTransactionSignature) {
            console.log("Transaction failed!");
            res.status(500).json({
                message: "Internal server error"
            });
            return;
        }

        res.status(200).json({
            message: "You won",
            signature: sentTransactionSignature
        });
        return;

    } catch (error) {
        console.log("Error: ", error);
        res.status(500).json({
            message: "Internal server error!"
        });
        return;
    }
})

app.listen(3004, () => {
    console.log("Listening to PORT 3004");
})