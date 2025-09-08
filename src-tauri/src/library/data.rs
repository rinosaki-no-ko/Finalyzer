use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug, Clone)]
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

#[derive(Serialize, Deserialize, Debug, Clone)]
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

#[derive(Serialize, Deserialize, Debug, Clone)]
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

pub trait HasCommonField {
    fn get_record_type(&self) -> &String;
    fn get_date(&self) -> u32;
    fn get_amount(&self) -> u32;
    fn get_description(&self) -> &String;
    fn get_uuid(&self) -> &String;
}
impl HasCommonField for Expence {
    fn get_record_type(&self) -> &String {
        &self.record_type
    }
    fn get_date(&self) -> u32 {
        self.date
    }
    fn get_amount(&self) -> u32 {
        self.amount
    }
    fn get_description(&self) -> &String {
        &self.description
    }
    fn get_uuid(&self) -> &String {
        &self.uuid
    }
}
impl HasCommonField for Income {
    fn get_record_type(&self) -> &String {
        &self.record_type
    }
    fn get_date(&self) -> u32 {
        self.date
    }
    fn get_amount(&self) -> u32 {
        self.amount
    }
    fn get_description(&self) -> &String {
        &self.description
    }
    fn get_uuid(&self) -> &String {
        &self.uuid
    }
}
impl HasCommonField for Transfer {
    fn get_record_type(&self) -> &String {
        &self.record_type
    }
    fn get_date(&self) -> u32 {
        self.date
    }
    fn get_amount(&self) -> u32 {
        self.amount
    }
    fn get_description(&self) -> &String {
        &self.description
    }
    fn get_uuid(&self) -> &String {
        &self.uuid
    }
}

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub enum Record {
    Expence(Expence),
    Income(Income),
    Transfer(Transfer),
}

impl Record {
    pub fn get_record_type(&self) -> &String {
        match self {
            Record::Expence(e) => &e.get_record_type(),
            Record::Income(i) => &i.get_record_type(),
            Record::Transfer(t) => &t.get_record_type(),
        }
    }
    pub fn get_uuid(&self) -> &String {
        match self {
            Record::Expence(e) => &e.get_uuid(),
            Record::Income(i) => &i.get_uuid(),
            Record::Transfer(t) => &t.get_uuid(),
        }
    }
}
