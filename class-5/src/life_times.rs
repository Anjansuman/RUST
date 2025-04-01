

pub fn life_times() {
    let str1 = String::from("Santa");
    let ans;
    {
        let str2 = String::from("BantaJi");
        // ans = bigger(&str1, &str2);
        ans = life_bigger(&str1, &str2);
        println!("{}", ans);
    }
    // println!("{}", ans);
}

// this function will throw an error as str2 ends in the scope and printing statement is outside the scope,
// so ans will get null, that is the case of null pointer dangling
// fn bigger(str1: &String, str2: &String) -> &String {
//     if str1.len() > str2.len() {
//         return str1;
//     }
//     return str2;
// }

// here 'a denotes the lifetimes of both the variables, but since both have different lifetimes and we are using
// single lifetime 'a so rust compiler will take the short lifetime variable, 
// we can also make two life time vars here 'a and 'b as per need,
// but here the variable is unknown so we will use single to not to describe which to return;
fn life_bigger<'a>(str1: &'a String, str2: &'a String) -> &'a String {
    if str1.len() > str2.len() {
        return str1;
    }

    return str2;
}