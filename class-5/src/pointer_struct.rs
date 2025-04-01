

struct User<'a> {
    name: &'a String
}

impl<'a> User<'a> {
    fn new(&self) -> &'a String {
        return self.name;
    }
}

pub fn pointer_struct() {
    let name = String::from("Mera naam");
    let u = User {
        name: &name
    };

    println!("{}", u.name);
    let ans = u.new();
    println!("{}", ans);
}