
#[derive(Debug)]
struct User {
    username: String,
    password: String,
    age: u16
}

fn main() {
    let u = User {
        username: String::from("Anjan"),
        password: String::from("anjansuman"),
        age: 18
    };

    println!("{:?}", u);
}


//////////////////////////////////////////////////////////////
/// {} => means, it uses Display trait to print
/// {:?} => means, it uses Debug trait to print
/// {:#?} => means, it prints the Debug trait's print in a pretty fashion, I guess
//////////////////////////////////////////////////////////////