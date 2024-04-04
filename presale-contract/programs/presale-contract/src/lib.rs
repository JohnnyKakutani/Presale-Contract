use anchor_lang::prelude::*;
use anchor_spl::token::{self, Transfer};
use anchor_spl::token_interface::{TokenAccount, TokenInterface};

declare_id!("83wQtKodW8yUfWpNBMvjDbA1b8Bt15gTsyZW9oPVKnki");

#[program]
pub mod presale_contract {

    use anchor_lang::system_program;

    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Instruction Initialize");

        let presale_info = &mut ctx.accounts.presale_info;

        if !presale_info.is_initialized {
            presale_info.is_initialized = true;
            presale_info.round = PresaleRound::None;
            presale_info.total_amount = 0;
            presale_info.round_amount = 0;
            presale_info.rate = 8;
        }
        Ok(msg!("Intialize Success"))
    }

    pub fn setPresaleInfo(ctx: Context<SetPresaleInfo>, round: u64) -> Result<()> {
        msg!("Instruction Setting Presale Infos");

        let presale_info = &mut ctx.accounts.presale_info;
        match round {
            0 => {
                presale_info.round = PresaleRound::None;
            },
            1 => {
                presale_info.round = PresaleRound::First;
                presale_info.rate = 8;
            },
            2 => {
                presale_info.round = PresaleRound::Second;
                presale_info.rate = 24;
            },
            3 => {
                presale_info.round = PresaleRound::Third;
                presale_info.rate = 64;
            },
            4 => {
                presale_info.round = PresaleRound::Fourth;
                presale_info.rate = 80;
            },
            _ => { return err!(ErrCode::InvalidCommand); }
        }
        Ok(msg!("Successfully Setting Round"))
    }

    pub fn purchaseToken(ctx: Context<PurchaseToken>, amount: u64) -> Result<()> {
        msg!("Instruction Purchase Token");
        
        let presale_info = &mut ctx.accounts.presale_info;
        let user_info = &mut ctx.accounts.user_info;
        if !user_info.is_initialized {
            user_info.is_initialized = true;
            user_info.purchase_amount = 0;
            user_info.purchase_count = 0;
        }
        match presale_info.round {
            PresaleRound::None => {
                return err!(ErrCode::InvalidDuration);
            },
            PresaleRound::First | PresaleRound::Second | PresaleRound::Third | PresaleRound::Fourth => {
                let cpi_context = CpiContext::new(
                    ctx.accounts.system_program.to_account_info(),
                    system_program::Transfer {
                        from: ctx.accounts.user.to_account_info(),
                        to: ctx.accounts.initializer.to_account_info(),
                    }
                );

                system_program::transfer(cpi_context, amount * presale_info.rate / 10000)?;

                let cpi_accounts = Transfer {
                    from: ctx.accounts.admin_token_address.to_account_info(),
                    to: ctx.accounts.user_token_address.to_account_info(),
                    authority: ctx.accounts.initializer.to_account_info(),
                };
                let cpi_program = ctx.accounts.token_program.to_account_info();
                let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);

                token::transfer(cpi_ctx, amount)?;

                presale_info.total_amount += amount;
                presale_info.round_amount += amount;
                user_info.purchase_amount += amount;
                user_info.purchase_count += 1;
            },
            _ => { return err!(ErrCode::InvalidCommand); }
        }
        Ok(msg!("Purchase Success"))
    }

}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(init_if_needed, seeds=[b"presalse", initializer.key().as_ref()], bump, payer = initializer, space = 8 + PresaleInfo::LEN)]
    pub presale_info: Account<'info, PresaleInfo>,

    #[account(mut)]
    pub initializer: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct SetPresaleInfo<'info> {
    #[account(mut, seeds=[b"presalse", initializer.key().as_ref()], bump)]
    pub presale_info: Account<'info, PresaleInfo>,

    #[account(mut)]
    pub initializer: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct PurchaseToken<'info> {
    #[account(mut, seeds=[b"presalse", initializer.key().as_ref()], bump)]
    pub presale_info: Account<'info, PresaleInfo>,

    #[account(init_if_needed, seeds=[b"users", user.key().as_ref()], bump, payer = user, space = 8 + UserInfo::LEN)]
    pub user_info: Account<'info, UserInfo>,

    #[account(mut)]
    pub initializer: Signer<'info>,
    #[account(mut)]
    pub user: Signer<'info>,

    #[account(mut)]
    pub user_token_address: InterfaceAccount<'info, TokenAccount>,

    #[account(mut)]
    pub admin_token_address: InterfaceAccount<'info, TokenAccount>,

    pub token_program: Interface<'info, TokenInterface>,
    pub system_program: Program<'info, System>,
}

#[account]
pub struct PresaleInfo {
    pub is_initialized: bool,
    pub round: PresaleRound,
    pub rate: u64,
    pub total_amount: u64,
    pub round_amount: u64,
}

#[account]
pub struct UserInfo {
    pub is_initialized: bool,
    pub purchase_amount: u64,
    pub purchase_count: u64,
}

impl PresaleInfo {
    pub const LEN: usize = 1 + 8 + 8;
}

impl UserInfo {
    pub const LEN: usize = 1 + 1 + 8 + 8 + 8;
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub enum PresaleRound {
    None,
    First,
    Second,
    Third,
    Fourth
}

#[error_code]
pub enum ErrCode {
    #[msg("Non Active Presale")]
    InvalidDuration,

    #[msg("UnKnown Command to set Presale Round")]
    InvalidCommand
}