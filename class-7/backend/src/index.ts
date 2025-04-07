import express from "express";

const app = express();
app.use(express.json());

app.post("/bet", async (req, res) => {
    try {
        
        const signature = req.body.signature;
        // verify the signature use whatever.
        // fetch the amount sent by user from this signature

        const random = Math.random();

        if(random < 0.5) {
            res.status(200).json({
                message: "You lost"
            });
            return;
        }

        // logic to transfer the won amount
        res.status(200).json({
            message: "You won"
        });
        return;

    } catch (error) {
        res.status(500).json({
            message: "Internal server error!"
        });
        return;
    }
})

app.listen(3004, () => {
    console.log("Listening to PORT 3004");
})