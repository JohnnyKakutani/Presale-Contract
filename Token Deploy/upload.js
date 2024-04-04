const Moralis = require("moralis").default;
async function uploadToIpfs() {
    await Moralis.start({
        apiKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub25jZSI6IjY1MGU1NjE1LWZkZjktNDZkYS1hYTZkLTQzMjU4ZTQxZjc2NyIsIm9yZ0lkIjoiMzg1MzE2IiwidXNlcklkIjoiMzk1OTIzIiwidHlwZUlkIjoiYjQyYTYyZjUtYmQ4OS00ZWJjLTg4ZGItOTNiZjE4NjVlODQ5IiwidHlwZSI6IlBST0pFQ1QiLCJpYXQiOjE3MTE3MTI0MzAsImV4cCI6NDg2NzQ3MjQzMH0.dqzUjv1Yp8pJnuaZYpP024JjLXNPBBVcT4QoldbBUyw",
    });
    const uploadArray = [
        {
            path: "token.json",
            content: {
                "name": "HappyHamster",
                "symbol": "HHAM",
                "desription": "HAHA is a cryptocurrency that revolves around laughter, humor, and memes. Its primary objective is to enable users to earn and trade digital assets by sharing hilarious MEME images. HahaCoin fosters a community built on entertainment, wit, and creativity, aiming to infuse joy and amusement into the digital realm.",
                "image": "https://ufsdrive.com/api?shared=diFShrk6mv",
                "tags": [
                    "Meme",
                    "Airdrop",
                    "FanToken",
                    "Tokenization",
                    "RWA"
                ],
                "creator": {
                    "name": "HappyHamster.ai",
                    "site": "https://happyhamster.ai"
                }
            }
        },
    ];
    const response = await Moralis.EvmApi.ipfs.uploadFolder({
        abi: uploadArray,
    });
    console.log(response.result)
}
uploadToIpfs();
