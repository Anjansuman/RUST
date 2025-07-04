use borsh::{BorshDeserialize, BorshSerialize};
use solana_program::{
    account_info::{next_account_info, AccountInfo},
    entrypoint::ProgramResult,
    entrypoint,
    pubkey::Pubkey
};

#[derive(BorshSerialize, BorshDeserialize)]
struct on_chain_data {
    count: u32
}

entrypoint!(program_double);

pub fn program_double(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    instruction_data: &[u8]
) -> ProgramResult {

    let acc = next_account_info(&mut accounts.iter())?;

    let mut data = on_chain_data::try_from_slice(&acc.data.borrow_mut())?;

    if data.count == 0 {
        data.count = 1;
    } else {
        data.count = data.count * 2;
    }

    data.serialize(&mut *acc.data.borrow_mut());

    Ok(())

}