#[derive(Debug)]
struct User {
    username: String,
    password: String,
    age: u16
}

fn main() {
    
    // hello_ji!();
    let u = User {
        username: String::from("Anjan"),
        password: String::from("anjansuman"),
        age: 18
    };

    println!("{:#?}", u);

}