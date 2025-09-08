use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug)]
pub struct Expence {
    pub record_type: String,
    pub date: u32,
    pub category: String,
    pub amount: u32,
    pub description: String,
    pub account: String,
    pub member: String,
    pub uuid: String,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct Income {
    pub record_type: String,
    pub date: u32,
    pub category: String,
    pub amount: u32,
    pub description: String,
    pub account: String,
    pub member: String,
    pub uuid: String,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct Transfer {
    pub record_type: String,
    pub date: u32,
    pub from_account: String,
    pub to_account: String,
    pub amount: u32,
    pub commission: u32,
    pub description: String,
    pub uuid: String,
}
