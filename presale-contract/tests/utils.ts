import * as anchor from "@project-serum/anchor";
import { PublicKey } from "@solana/web3.js"
import { PresaleContract } from "../target/types/presale_contract";
import { Program, web3 } from '@project-serum/anchor';

const program = anchor.workspace.PresaleContract as Program<PresaleContract>;

export const getUserInfoAddress = async (
    userPubkey: web3.PublicKey
) => {
    const [userInfoAddress, bump] = PublicKey.findProgramAddressSync(
        [
            anchor.utils.bytes.utf8.encode('users'),
            userPubkey.toBuffer(),
        ],
        program.programId,
    );
    return userInfoAddress;
}

export const getPresaleInfoAddress = async (
    adminPubkey: web3.PublicKey
) => {
    const [presaleInfoAddress, bump] = PublicKey.findProgramAddressSync(
        [
            anchor.utils.bytes.utf8.encode('presalse'),
            adminPubkey.toBuffer(),
        ],
        program.programId,
    );
    return presaleInfoAddress;
}
