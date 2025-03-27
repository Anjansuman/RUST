use dotenv::dotenv;
use std::env;

pub fn using_env() {
    dotenv().ok(); // this is just like dotenv().config() in JS
    let var = env::var("REDIS_URL"); 
    // we can add .unwrap() after calling the env var and that will not check for the errors but will directly put the
    // env-var into our var and it doesn't found then it will crash.

    match var {
        Ok(content) => println!("{}", content),
        Err(e) => println!("Error while fetching the env variable: {}", e)
    }

}