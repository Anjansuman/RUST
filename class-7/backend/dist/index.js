"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bs58_1 = __importDefault(require("bs58"));
const web3_js_1 = require("@solana/web3.js");
const dotenv = __importStar(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
dotenv.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.post("/bet", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const privateKey = process.env.PLATFORM_PRIVATE_KEY;
        if (!privateKey) {
            console.log("Private key not found!");
            res.status(500).json({
                message: "Internal server error!"
            });
            return;
        }
        // this stores the public-private key of the platform
        const secretKey = bs58_1.default.decode(privateKey);
        const sender = web3_js_1.Keypair.fromSecretKey(secretKey);
        // remember to use database that will store the signature so that in future if anyone puts same signature, our database should check it and it should refuse to proceed further
        const signature = req.body.signature;
        let playerPublicKey;
        let sentLamports;
        // connection to the solana mainnet
        const connection = new web3_js_1.Connection("https://api.mainnet-beta.solana.com");
        // this will check if the transaction exists in the blockchain
        const checkTransaction = yield connection.getParsedTransaction(signature, {
            commitment: "confirmed" // commitment is confirmed only if atleast 1 miner confirms it
        });
        if (!checkTransaction || !checkTransaction.transaction || !checkTransaction.meta || !(checkTransaction === null || checkTransaction === void 0 ? void 0 : checkTransaction.blockTime)) {
            res.status(404).json({
                message: "Transaction not found!"
            });
            return;
        }
        // check if the transaction is done within a day
        const blockTime = checkTransaction.blockTime;
        const now = Math.floor(Date.now() / 1000);
        if ((now - blockTime) > 86400) {
            console.log("Expired!");
            res.status(422).json({
                message: "Invalid Transaction"
            });
            return;
        }
        // this stores the instructions like transfers, program calls, and details about transaction, etc
        const instructions = checkTransaction.transaction.message.instructions;
        // this verifies the transaction that it is sent to us
        for (const ix of instructions) {
            if ('parsed' in ix && ix.program === 'system' && ix.parsed.type === 'transfer') {
                playerPublicKey = new web3_js_1.PublicKey(ix.parsed.info.source);
                sentLamports = ix.parsed.info.lamports;
                const receiverPublicKey = new web3_js_1.PublicKey(ix.parsed.info.destination);
                if (!receiverPublicKey.equals(sender.publicKey)) {
                    res.status(422).json({
                        message: "Mismatched transaction!"
                    });
                    return;
                }
            }
        }
        // check if player's public key and lamports are present in the transaction
        if (!playerPublicKey || !sentLamports) {
            res.status(422).json({
                message: "Invalid transaction"
            });
            return;
        }
        // store the signature in the database
        // make it more complex using crypto library
        const random = Math.random();
        if (random < 0.5) {
            res.status(200).json({
                message: "You lost"
            });
            return;
        }
        // logic to transfer the won amount
        const PLATFROM_FEE = 0.03; // platform fee = 3%
        const wonLamports = (2 * sentLamports) - (PLATFROM_FEE * sentLamports);
        const transaction = new web3_js_1.Transaction().add(web3_js_1.SystemProgram.transfer({
            fromPubkey: sender.publicKey,
            toPubkey: playerPublicKey,
            lamports: wonLamports
        }));
        // send the transaction and confirm it
        const sentTransactionSignature = yield (0, web3_js_1.sendAndConfirmTransaction)(connection, transaction, [sender]);
        if (!sentTransactionSignature) {
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
    }
    catch (error) {
        console.log("Error: ", error);
        res.status(500).json({
            message: "Internal server error!"
        });
        return;
    }
}));
app.listen(3004, () => {
    console.log("Listening to PORT 3004");
});
