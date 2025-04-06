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
Object.defineProperty(exports, "__esModule", { value: true });
const borsh = __importStar(require("borsh"));
const node_test_1 = require("node:test");
const web3_js_1 = require("@solana/web3.js");
const types_1 = require("./types");
let adminAccount = web3_js_1.Keypair.generate();
let dataAccount = web3_js_1.Keypair.generate();
const PROGRAM_ID = new web3_js_1.PublicKey("7jcTggL1Vh3Xb7Koc6ju6XmKc1NHyrmDvJKmC6aTWh5a");
(0, node_test_1.test)('Initializing Account', () => __awaiter(void 0, void 0, void 0, function* () {
    const connection = new web3_js_1.Connection("http://localhost:8899", "confirmed");
    // airdropping 1 sol
    const txn = yield connection.requestAirdrop(adminAccount.publicKey, 1 * web3_js_1.LAMPORTS_PER_SOL);
    yield connection.confirmTransaction(txn);
    const data = yield connection.getAccountInfo(adminAccount.publicKey);
    // this stores the min amount of sol required to store COUNTER_SIZE amount of data
    const lamports = yield connection.getMinimumBalanceForRentExemption(types_1.COUNTER_SIZE);
    console.log("1st");
    // this will create a fresh account
    const ix = web3_js_1.SystemProgram.createAccount({
        fromPubkey: adminAccount.publicKey, // using adminPubkey to create account
        lamports: lamports, // it will take some lamports to exist in blockchain
        space: types_1.COUNTER_SIZE, // the account will have some data
        programId: PROGRAM_ID, // program id of deployed contract
        newAccountPubkey: dataAccount.publicKey
    });
    console.log("2nd");
    // creating new transaction to create a new account
    const createAccountTxn = new web3_js_1.Transaction();
    // adding the pre-requisites to the transaction
    createAccountTxn.add(ix);
    // sending the transaction to the blockchain, but it requires 3 things transation, creator acc, and the creating acc
    const signature = yield connection.sendTransaction(createAccountTxn, [adminAccount, dataAccount]);
    // finally confirming the transaction
    yield connection.confirmTransaction(signature);
    console.log("3rd");
    console.log(dataAccount.publicKey.toBase58());
    // getting info of data account, as it has a storage now
    const dataAccountInfo = yield connection.getAccountInfo(dataAccount.publicKey);
    if (!dataAccountInfo)
        return;
    const deserializedData = borsh.deserialize(types_1.schema, dataAccountInfo.data);
    console.log(deserializedData);
}));
