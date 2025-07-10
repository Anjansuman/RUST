use borsh::{BorshSerialize, BorshDeserialize};
use solana_program::{
    account_info::{next_account_info, AccountInfo},
    entrypoint::ProgramResult,
    entrypoint,
    program_error::ProgramError,
    pubkey::Pubkey
};


#[derive(BorshSerialize, BorshDeserialize)]
struct Counter {
    count: u32
}

#[derive(BorshSerialize, BorshDeserialize)]
enum Instruction {
    Init,
    Double,
    Add { value: u32 },
    Sub { value: u32 }
}

entrypoint!(process_instruction);
pub fn process_instruction(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    instruction_data: &[u8]
) -> ProgramResult {

    let iter = &mut accounts.iter();
    let data_account = next_account_info(iter)?;

    if !data_account.is_signer {
        return  Err(ProgramError::IllegalOwner);
    }

    let mut counter = Counter::try_from_slice(&data_account.data.borrow())?;

    let instruction = Instruction::try_from_slice(instruction_data)?;

    match instruction {
        Instruction::Init => {
            counter.count = 0;
        },
        Instruction::Double => {
            if counter.count == 0 {
                counter.count = 1;
            } else {
                counter.count = counter.count * 2;
            }
        },
        Instruction::Add {value} => {
            counter.count = counter.count + value
        },
        Instruction::Sub { value } => {
            if counter.count - value < 0 {
                return Err(ProgramError::InvalidInstructionData);
            }
            counter.count = counter.count - value;
        }
    };

    counter.serialize(&mut *data_account.data.borrow_mut());

    Ok(())
}