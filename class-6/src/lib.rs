use borsh::{BorshSerialize, BorshDeserialize};
use solana_program::{
    account_info::{next_account_info, AccountInfo},
    entrypoint::ProgramResult, entrypoint,
    msg,
    pubkey::Pubkey
};


// this is to store the whether the user has chosen to increment or decrement
#[derive(BorshSerialize, BorshDeserialize)]
enum InstructionType {
    increment(u32),
    decrement(u32)
}

#[derive(BorshSerialize, BorshDeserialize)]
struct Counter {
    count: u32
}

entrypoint!(counter_contract);

pub fn counter_contract(
    program_id: &Pubkey,
    accounts: &[AccountInfo], // this stores the accounts info, on what accounts do the user wants to interact with
    instruction_data: &[u8] // this store what the user wants to do with it's arguments
) -> ProgramResult {

    // the '?' at the end means same as pattern matching

    // this is reading account info
    let acc = next_account_info(&mut accounts.iter())?;

    // this is defining what type of thingy the user want to do (in this case either increment or decrement)
    let instruction_type = InstructionType::try_from_slice(instruction_data)?;

    let mut counter_data = Counter::try_from_slice(&acc.data.borrow())?;

    match instruction_type {
        InstructionType::increment(value) => {
            // logic to increment
            msg!("Executing increment");
            counter_data.count += value;
        },
        InstructionType::decrement(value) => {
            // logic to decrement
            msg!("Executing decrement");
            counter_data.count -= value;
        }
    };

    counter_data.serialize(&mut *acc.data.borrow_mut());

    msg!("Contract succeeded");
    Ok(())


}