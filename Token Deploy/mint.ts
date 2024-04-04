import { percentAmount, generateSigner, signerIdentity, createSignerFromKeypair } from '@metaplex-foundation/umi'
import { TokenStandard, createAndMint } from '@metaplex-foundation/mpl-token-metadata'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { mplCandyMachine } from "@metaplex-foundation/mpl-candy-machine";
import  "@solana/web3.js";
import secret from './guideSecret1.json';
import bs58 from 'bs58';

const umi = createUmi('https://nameless-yolo-wildflower.solana-devnet.quiknode.pro/bc1a10f6711e303aa62a75d4b3c809bcdd77ed92/'); //Replace with your QuickNode RPC Endpoint

const userWallet = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(secret));
const userWalletSigner = createSignerFromKeypair(umi, userWallet);

console.log(userWallet.publicKey);

const metadata = {
    name: "HappyHamster",
    symbol: "HHAM",
    uri: "https://ipfs.moralis.io:2053/ipfs/QmawB6YQSa5tyN8tezrdg5RtXy8HMLqjd3Rf1NcRvThQ8t/token.json",
};

const mint = generateSigner(umi);
umi.use(signerIdentity(userWalletSigner));
umi.use(mplCandyMachine())

createAndMint(umi, {
    mint,
    authority: umi.identity,
    name: metadata.name,
    symbol: metadata.symbol,
    uri: metadata.uri,
    sellerFeeBasisPoints: percentAmount(0),
    decimals: 8,
    amount: 500000000000000_000,
    tokenOwner: userWallet.publicKey,
    tokenStandard: TokenStandard.Fungible,
    }).sendAndConfirm(umi).then(() => {
    console.log("Successfully minted 5000 million tokens (", mint.publicKey, ")");
});
