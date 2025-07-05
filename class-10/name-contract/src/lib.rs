use solana_program::{
    pubkey::Pubkey,
    entrypoint::ProgramResult,
    entrypoint,
    account_info::{next_account_info, AccountInfo}
}

entrypoint!(process_instruction);

fn process_instruction(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    insttruction_data: &[u8]
) -> ProgramResult {

    let iter = &mut accounts.iter();

    let data_account = next_account_info(iter);
    
    Ok(())
}