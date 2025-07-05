use solana_program::{
    account_info::{AccountInfo, next_account_info},
    entrypoint,
    entrypoint::ProgramResult,
    instruction::{AccountMeta, Instruction},
    program::invoke,
    pubkey::Pubkey,
};

entrypoint!(process_instruction);
pub fn process_instruction(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    instruction_data: &[u8],
) -> ProgramResult {
    
    let mut iter = accounts.iter();

    let data_account = next_account_info(&mut iter)?;
    let double_contract_address = next_account_info(&mut iter)?;

    let instruction = Instruction {
        program_id: *double_contract_address.key,
        accounts: vec![AccountMeta {
            pubkey: *data_account.key,
            is_signer: true,
            is_writable: true,
        }],
        data: vec![],
    };

    invoke(
        &instruction,
        &[data_account.clone()],
    )?;

    Ok(())
}
