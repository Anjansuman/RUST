use solana_program::{
    pubkey::Pubkey,
    entrypoint::ProgramResult,
    entrypoint,
    account_info::{next_account_info, AccountInfo},
    system_instruction::{create_account},
    program::{invoke_signed}
};

entrypoint!(process_instruction);

fn process_instruction(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    insttruction_data: &[u8]
) -> ProgramResult {

    let iter = &mut accounts.iter();

    let user_acc = next_account_info(iter)?;
    let pda = next_account_info(iter)?;
    let system_program = next_account_info(iter)?;

    let seeds = &[user_acc.key.as_ref(), b"user"];

    let (pda_public_key, bump) = Pubkey::find_program_address(seeds, program_id);

    let ix = create_account(
        user_acc.key,
        pda.key,
        1000000000,
        8,
        program_id
    );

    invoke_signed(
        &ix,
        accounts,
        &[seeds, &[&[bump]]]
    );
    
    Ok(())
}


/*

the invoke_signed() requires three arguments
    1. &instruction [what is the instruction]
    2. &accounts [what are all the accounts involved in it]
    3. signers_seeds [
        as PDAs can't sign their transactions as they don't have privateKey, so they require program account to sign the transaction,
        not basically sign but somewhat like that
        and here it takes input in form of => &[&[&[u8]]]

        and in the above program i've given the input named as seeds,
        inside that, 
        => user_acc.key.as_ref() returns an &[u8],
        => b"user" returns an &[u8]

        and they are covered in an array 
        and then they are parsed in the function as &[&seeds] => which is making it &[&[&[u8]]]

    ]

*/