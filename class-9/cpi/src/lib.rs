use solana_program::{
    account_info::{next_account_info, AccountInfo},
    entrypoint::ProgramResult,
    entrypoint,
    instruction::{AccountMeta, Instruction},
    program::invoke,
    pubkey::Pubkey
};



entrypoint!(process_instruction);
pub fn process_instruction(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    instruction_data: &[u8]
) -> ProgramResult {

    let data_account = next_account_info(&mut accounts.iter())?;
    let double_contract_address = next_account_info(&mut accounts.iter())?;

    let instruction =Instruction {
        program_id: *double_contract_address.key,
        accounts: vec![AccountMeta {
            pubkey: *data_account.key,
            is_signer: true,
            is_writable: true
        }],
        data: vec![]
    };

    invoke(&instruction, &[data_account.clone()])?;

    Ok(())

}