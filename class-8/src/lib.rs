use borsh::{BorshSerialize, BorshDeserialize};
use solana_program::{
    pubkey::Pubkey,
    account_info::{next_account_info, AccountInfo},
    entrypoint::ProgramResult,
    entrypoint,
    msg
};


#[derive(BorshSerialize, BorshDeserialize)]
pub struct userAccount {
    pub authority: Pubkey,
    pub name: String
}

#[derive(BorshSerialize, BorshDeserialize)]
pub struct balanceAccount {
    pub owner: Pubkey,
    pub symbol: String,
    pub amount: u64
}


entrypoint!(zerodha_contract);
pub fn zerodha_contract(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    instruction_data: &[u8]    
) -> ProgramResult {

    let acc = next_account_info(&mut accounts.iter())?;
    

    Ok(())

}