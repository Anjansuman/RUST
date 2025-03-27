use std::fmt::{Debug, Formatter, Result};

struct User {
    username: String,
    password: String,
    age: u16
}

/// this is done manually and hard to do, so use the #[derive(Debug)] syntax, which is pre-defined

//////////////////////////////////////////////////////////////
/// what is it doing?
/// Debug is a pre-defined trait present in std::fmt, and that is implemented to User
/// and the inside fn uses the functionalities of the Debug trait
//////////////////////////////////////////////////////////////

impl Debug for User {
    fn fmt(&self, f: &mut Formatter<'_>) -> Result {
        return write!(f, "Username is {}", self.username);
    }
}
fn main() {
    let u = User {
        username: String::from("Anjan"),
        password: String::from("anjansuman"),
        age: 18
    };

    println!("{:?}", u);
}