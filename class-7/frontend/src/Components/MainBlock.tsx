import { Moon, Sun } from "lucide-react";
import { Button } from "./Button";
import { useRef, useState } from "react";

import axios from "axios";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction } from "@solana/web3.js";


type amountType = 0.1 | 0.2 | 0.3 | 0.4 | 0.5 | 0.6;
const BACKEND_URL = "http://localhost:3004";
const Platform_Fee = 0.03; // 3% of the total amount
const Platform_PublicKey = new PublicKey("4kqKHFe3abVs8LymTTdzuSxCn5RFd3FRHoJ4Ttow3GR2");

export const MainBlock = () => {

    const { connection } = useConnection();
    const { publicKey, sendTransaction } = useWallet();

    const [selectedSide, setSelectedSide] = useState<"Head" | "Tail" | null>(null);
    const [amount, setAmount] = useState<amountType | null>(null);

    const handleBet = async () => {

        // return if no wallet is connected or no side is selected
        if(!publicKey || !selectedSide || !amount) return;

        try {

            const betAmount = amount * LAMPORTS_PER_SOL; // IG something sus in this it seems it will send in multiple of lamports not in multiple of sol
            const feeAmount = amount * Platform_Fee;

            const transaction = new Transaction().add(
                SystemProgram.transfer({
                    fromPubkey: publicKey,
                    toPubkey: Platform_PublicKey,
                    lamports: betAmount
                })
            );

            // Send the transaction
            const signature = await sendTransaction(transaction, connection);

            await connection.confirmTransaction(signature);


            const response = await axios.post(`${BACKEND_URL}/bet`, {
                signature
            });

            const message = await response.data.message;

            if(message === "You won") {
                // logic to show user won
                alert("You won");
            } else {
                alert("You lost");
            }

            // respond accordingly
        } catch (error) {
            alert("Error occured!");
        }
    }

    return <div className="h-auto max-w-[385px] py-4 px-10 bg-gray-800 rounded-lg flex flex-col gap-y-4 shadow-md">
        <div className="flex justify-center items-center text-2xl font-semibold ">
            Choose Your Side
        </div>
        <div className="flex justify-center items-center gap-3">
            <Button text={'Heads'} w={'100px'} logo={<Sun></Sun>} onClick={() => setSelectedSide("Head")} select={selectedSide === "Head"} />
            <Button text={'Tails'} w={'100px'} logo={<Moon></Moon>} onClick={() => setSelectedSide("Tail")} select={selectedSide === "Tail"} />
        </div>
        <div className="flex justify-center items-center text-xl font-semibold">
            Select Amount
        </div>

        {/* buttons to select amount */}
        <div className="flex flex-wrap justify-center gap-3 ">
            {[0.1, 0.2, 0.3, 0.4, 0.5, 0.6].map((e) => (
                <Button key={e} text={`${e} SOL`} onClick={() => {
                    setAmount(e as amountType);
                }} select={amount === e} />
            ))}

        </div>
        <div className="text-lg font-semibold ">
            <Button text={'Place Bet'} w={'100%'} onClick={handleBet} />
        </div>
        <div className="flex justify-center items-center text-sm text-gray-500">
            Platform Fee: 3%
        </div>
    </div>
}