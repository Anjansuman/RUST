use borsh::{BorshSerialize, BorshDeserialize};

#[derive(BorshSerialize, BorshDeserialize)]
pub struct User {
    username: String,
    password: String
}

// as borsh is used in derive so the struct will have a function call like serialize and de_serialize
// I used serialize call from the "u" struct-object

pub fn basic_borsh() {
    let u = User {
        username: String::from("Anjan"),
        password: String::from("password")
    };

    // this is a byte array to store the bit data of the struct
    let mut v = vec!();

    let ans = u.serialize(&mut v);

    match ans {
        Ok(_) => println!("{:?}", v),
        Err(_) => println!("Serialization failed!")
    }

    // converting from byte to back to user struct
    let user = User::try_from_slice(&v);

    match user {
        Ok(user) => println!("{}", user.username),
        Err(_) => println!("Error while deserialization")
    }

}