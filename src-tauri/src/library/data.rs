use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug)]
pub struct Expence {
    pub date: String,
    pub category: String,
    pub amount: u32,
    pub description: String,
    pub account: String,
    pub member: String,
    pub uuid: String,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct Income {
    pub date: String,
    pub category: String,
    pub amount: u32,
    pub description: String,
    pub account: String,
    pub member: String,
    pub uuid: String,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct Transfer {
    pub date: String,
    pub from_account: String,
    pub to_account: String,
    pub from_amount: u32,
    pub to_amount: u32,
    pub description: String,
    pub uuid: String,
}
