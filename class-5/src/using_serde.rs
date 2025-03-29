use serde::{Serialize, Deserialize};

#[derive(Serialize, Deserialize)]
struct User {
    username: String,
    password: String
}

pub fn using_serde() {

    let u = User {
        username: String::from("Anjan"),
        password: String::from("password")
    };

    let serialized_string = serde_json::to_string(&u);

    match serialized_string {
        Ok(str) => println!("{}", str),
        Err(e) => println!("Error while converting to string: {}", e)
    };

    // similarly we can do this for converting from string to JSON object using from_str();
    // And similarly we can import serde for converting Json, toml, yaml

}