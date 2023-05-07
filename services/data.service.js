const jwt = require("jsonwebtoken");

//import Account model
const db = require("./db");

// ----------register----------------------

const register = (acno, username, phone, password) => {
  return db.Account.findOne({
    account_no: acno,
  }).then((acc) => {
    console.log(acc);
    if (acc) {
      return {
        status: false,
        message: "Account already exist!...... please login",
        statusCode: 404,
      };
    } else {
      let accnt = new db.Account({
        account_no: acno,
        name: username,
        phone: phone,
        balance: 0,
        password: password,
        transactions: [],
      });
      accnt.save();
      return {
        status: true,
        message: "Registration completed",
        statusCode: 201,
      };
    }
  });
};

// ---------------login--------------------

const login = (acno, pswd) => {
  return db.Account.findOne({
    account_no: acno,
    password: pswd,
  }).then((res) => {
    if (res) {
      currentUser = res.name;
      currentAcno = acno;
      token = jwt.sign({ currentAcno: acno }, "secretsuperkey1234");
      return {
        status: true,
        message: "Login successfull",
        statusCode: 200,
        currentUser,
        currentAcno,
        token,
      };
    } else {
      return {
        status: false,
        message: "invalid password or Account number",
        statusCode: 400,
      };
    }
  });
};

//----deposite------------------------------------------

const deposit = (acc, password, amount,req) => {
  return db.Account.findOne({
    account_no: acc,
    password: password,
  }).then((res) => {
    if (res) {
      if(res.account_no != req.currentAcno){
        return {
          status: false,
          message: "account number is not authenticated",
          statusCode: 422,
        };
      }
      else{
        res.balance += parseInt(amount);
      let details = { Type: "CREDIT", Amount: parseInt(amount) ,Balance:res.balance};
      res.transactions.push(details);
      res.save();
      console.log(res);
      return {
        status: true,
        message: `Amount deposited to your account balance: ${amount}`,
        statusCode: 200,
      };
      }
      
    } else {
      return {
        status: false,
        message: "invalidpassword or Account number",
        statusCode: 400,
      };
    }
  });
};

// -----------------------withdrawal-------------------

const withdrawal = (acc, password, amount,req) => {
  return db.Account.findOne({
    account_no: acc,
    password: password,
  }).then((res) => {
    if (res) {
      if (res.account_no != req.currentAcno) {
        return {
          status: false,
          message: "account number is not authenticated",
          statusCode: 422,
        };
      } else {
        if (res.balance < amount) {
          return {
            status: false,
            message: "insufficient balance",
            statusCode: 422,
          };
        } else {
          res.balance -= parseInt(amount);
          let details = {
            Type: "DEBIT",
            Amount: parseInt(amount),
            Balance: res.balance,
          };
          res.transactions.push(details);
          res.save();
          console.log(res);
          return {
            status: true,
            message: `Amount withdrawn from your account balance: ${amount}`,
            statusCode: 200,
          };
        }
      }
      
    } else {
      return {
        status: false,
        message: "invalid password or account number",
        statusCode: 422,
      };
    }
  });
};

// ----------------transactions---------------------
const getTransactions = (acc) => {
  return db.Account.findOne({
    account_no: acc,
  }).then((res) => {
    if (res) {
      return {
        status: true,
        message: "success",
        data: res.transactions,
        statusCode: 200,
      };
    } else {
      return {
        status: false,
        message: "invalid account number",
        statusCode: 400,
      };
    }
  });
};

const deleteAcc=(acno)=>{
  return db.Account.deleteOne({
    account_no:acno
  }).then(res=>{
    if(res){
      return{
        status:true,
        message:"deletion successfull",
        statusCode:200
      }
    }
    else{
      return{
        status:false,
        message:"deletion failed",
        statusCode:400
      }
    }
  })
}

module.exports = {
  register,
  login,
  deposit,
  withdrawal,
  getTransactions,
  deleteAcc
};
