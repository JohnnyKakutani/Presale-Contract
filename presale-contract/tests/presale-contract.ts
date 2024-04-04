import * as anchor from '@project-serum/anchor';
import { Program } from '@project-serum/anchor';
import { PresaleContract } from "../target/types/presale_contract";
import { NodeWallet, Provider } from "@project-serum/common";
import { PublicKey, Transaction, Connection, Keypair, Account} from '@solana/web3.js';
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
	createMint,
	getMint,
	getOrCreateAssociatedTokenAccount,
	mintTo,
	TOKEN_PROGRAM_ID,
} from '@solana/spl-token';
import { getPresaleInfoAddress, getUserInfoAddress } from "./utils";
import { BN } from 'bn.js';

describe("presale-contract", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.PresaleContract as Program<PresaleContract>;
  
  //@ts-ignore
  const admin: NodeWallet = provider.wallet;
  
  const DECIMALS = 8;
  let mint: PublicKey;
  let adminTokenAddress;
  let userTokenAddress;
  let user = anchor.web3.Keypair.generate();
  let userInfoAddress: anchor.web3.PublicKey;
  let presaleInfoAddress: anchor.web3.PublicKey;

  before(async () => {
    await provider.connection.requestAirdrop(user.publicKey, 1 * anchor.web3.LAMPORTS_PER_SOL);
    await provider.connection.requestAirdrop(admin.publicKey, 1 * anchor.web3.LAMPORTS_PER_SOL);
    mint = await createMint(
      provider.connection,
      admin.payer,
      admin.publicKey,
      admin.publicKey,
      DECIMALS
    );
    //get admin associated token account
    userTokenAddress = await getOrCreateAssociatedTokenAccount(
      provider.connection,
      admin.payer,
      mint,
      user.publicKey
    );
    console.log('userToken Address', userTokenAddress.address.toString());
    adminTokenAddress = await getOrCreateAssociatedTokenAccount(
      provider.connection,
      admin.payer,
      mint,
      admin.publicKey
    );
    console.log('adminToken Address', adminTokenAddress.address.toString());
    // mint user
    await mintTo (
      provider.connection,
      admin.payer,
      mint,
      adminTokenAddress.address,
      admin.publicKey,
      100 * anchor.web3.LAMPORTS_PER_SOL
    );
    userInfoAddress = await getUserInfoAddress(user.publicKey);
    presaleInfoAddress = await getPresaleInfoAddress(admin.publicKey);
  })

  it("Is initialized!", async () => {
    // Add your test here.
    const tx = await program.methods
                    .initialize()
                    .accounts({
                      initializer: admin.publicKey,
                    })
                    .rpc();
    console.log("Your transaction signature", tx);
    const presaleInfo = await program.account.presaleInfo.fetch(presaleInfoAddress);
    console.log('presaleInfo', presaleInfo);
  });

  it("SetPresaleInfo  0", async () => {
    const tx = await program.methods
                      .setPresaleInfo(new BN(0), new BN(1))
                      .accounts({
                          initializer: admin.publicKey
                      })
                      .rpc();
    console.log("Your transaction signature", tx);
    const presaleInfo = await program.account.presaleInfo.fetch(presaleInfoAddress);
    console.log('presaleInfo', presaleInfo);
  });

  it("SetPresaleInfo  1", async () => {
    const tx = await program.methods
                      .setPresaleInfo(new BN(1), new BN(1))
                      .accounts({
                          initializer: admin.publicKey
                      })
                      .rpc();
    console.log("Your transaction signature", tx);
    const presaleInfo = await program.account.presaleInfo.fetch(presaleInfoAddress);
    console.log('presaleInfo', presaleInfo);
  });

  it("SetPresaleInfo  2", async () => {
    const tx = await program.methods
                      .setPresaleInfo(new BN(2), new BN(1))
                      .accounts({
                          initializer: admin.publicKey
                      })
                      .rpc();
    console.log("Your transaction signature", tx);
    const presaleInfo = await program.account.presaleInfo.fetch(presaleInfoAddress);
    console.log('presaleInfo', presaleInfo);
  });

  it("SetPresaleInfo  3", async () => {
    const tx = await program.methods
                      .setPresaleInfo(new BN(3), new BN(1))
                      .accounts({
                          initializer: admin.publicKey
                      })
                      .rpc();
    console.log("Your transaction signature", tx);
    const presaleInfo = await program.account.presaleInfo.fetch(presaleInfoAddress);
    console.log('presaleInfo', presaleInfo);
  });

  it("SetPresaleInfo  4", async () => {
    const tx = await program.methods
                      .setPresaleInfo(new BN(4), new BN(1))
                      .accounts({
                          initializer: admin.publicKey
                      })
                      .rpc();
    console.log("Your transaction signature", tx);
    const presaleInfo = await program.account.presaleInfo.fetch(presaleInfoAddress);
    console.log('presaleInfo', presaleInfo);
  });

  // it("SetPresaleInfo  5", async () => {
  //   const tx = await program.methods
  //                     .setPresaleInfo(new BN(5))
  //                     .accounts({
  //                         initializer: admin.publicKey
  //                     })
  //                     .rpc();
  //   console.log("Your transaction signature", tx);
  //   const presaleInfo = await program.account.presaleInfo.fetch(presaleInfoAddress);
  //   console.log('presaleInfo', presaleInfo);
  // });

  it("Purchase Token", async () => {
    const tx = await program.methods
                      .purchaseToken(new BN(10))
                      .accounts({
                          initializer: admin.publicKey,
                          user: user.publicKey,
                          userTokenAddress: userTokenAddress.address,
                          adminTokenAddress: adminTokenAddress.address,
                      })
                      .signers([user, admin.payer])
                      .rpc();
    console.log("Your transaction signature", tx);
    const presaleInfo = await program.account.presaleInfo.fetch(presaleInfoAddress);
    console.log('presaleInfo', presaleInfo);
    const userInfo = await program.account.userInfo.fetch(userInfoAddress);
    console.log('userInfo', userInfo);
  })
});
