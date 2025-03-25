fn main() {
    println!("First function");
    data_types();

    println!("Second function");
    if_else();

    println!("third function");
    loops();

    println!("fourth function");
    changable_var();
}

// fn sum(a: u32, b: u32) -> u32 {
//     return a + b;
// }

// fn is_even(n: u32) -> bool {
//     return n % 2 == 0;
// }

// In Rust I guess we cannot write in camel-case, we have to use "underscore = _ "
fn data_types() {
    let num = 23;
    let boolean = true;
    let str = String::from("Anjan");
    let arr = [1, 2, 3, 4];
    let vector = vec![1, 2, 3, 4];

    println!("{}", num);
    println!("{}", boolean);
    println!("{}", str);
    println!("{:?}", arr);
    println!("{:?}", vector);
}

fn if_else() {

    const NUM: i32 = 3;

    if NUM % 2 == 0 {
        println!("Even");
    } else {
        println!("Odd");
    }

}

fn loops() {
    for i in 0..10 {
        print!("{}", i);
    }
}

// In Rust every variable is immutable (that means we can't change it's value)
// to achieve mutability we have to write "mut" after "let"

fn changable_var() {
    let mut x = 3;
    x = 34;

    print!("{}", x);
}
