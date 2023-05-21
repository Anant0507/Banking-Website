const express = require("express");
const app = express();
const hbs = require("hbs");
const path = require("path");
const mongoose = require("mongoose");
const fs = require("fs");
const sendMail = require("./sendMail");
const session = require("express-session");
const cookieParser = require("cookie-parser");

mongoose.connect("mongodb://127.0.0.1:27017/Bank")
.then(() => console.log("Connection Successfull..."))
.catch((err) => console.log("Error Occured..."));

const mySchema = mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    currentBalance:{
        type:Number,
        required:true,
    },
    accountNumber:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    }
});

const CustomerData = new mongoose.model("CustomerDetail",mySchema);

//all paths
const staticPath = path.join(__dirname,"../public");
const viewsPath = path.join(__dirname,"../templates/views");
const partialPath = path.join(__dirname,"../templates/partials");
app.use(express.urlencoded({extended:true}));
app.use(express.static(staticPath));
app.set("view engine","hbs");
app.set("views",viewsPath);
hbs.registerPartials(partialPath,() => {})
app.use(cookieParser());
app.use(session({
    secret: "amar",
    saveUninitialized: true,
    resave: true
}));

//Routing of links
app.get("/", async(req, res) => {
    res.render("home");
});

app.get("/customer", async(req, res) => {
    const customerdata = await CustomerData.find();
    res.render("Customer",{
        Customer_Data:customerdata
    });
});

app.post("/customer", async (req, res) => {
    console.log(req.body.customer_account_number); 
    res.render("Single_Customer",{
        CustomerData:req.body,
        error_msg:null
    });
})

app.post("/transfer", async(req, res) => { 
    const payer = await CustomerData.find({accountNumber:req.body.payer_accountno});
    const payee = await CustomerData.find({accountNumber:req.body.payee_accountno});
    console.log(payee)
    payerdata = {
        customer_name:payer[0].name,
        customer_email:payer[0].email,
        customer_account_number:payer[0].accountNumber,
        customer_balance:payer[0].currentBalance
    };
    console.log(payerdata);
    console.log(payee.length);
    if(payee.length == 0){
        res.render("Single_Customer",{
            CustomerData:payerdata,
            error_msg: "*Account Not Found*"
        });  
    }
    else{
        const amount = req.body.amount;
        await transfer_money(payer, payee, amount);
    
        const customerdata = await CustomerData.find(); 
        res.render("Customer",{
            Customer_Data : customerdata,
            error_msg: ""
    
        });
    }
   
});
const transfer_money = async (payer, payee, amount) => {
    
    var payer_newCurrentBalance = payer[0].currentBalance - parseInt(amount);
    var payee_newCurrentBalance = payee[0].currentBalance + parseInt(amount);

    const payer_result = await CustomerData.updateOne({name:payer[0].name},{$set:{currentBalance:payer_newCurrentBalance}});
    const payee_result = await CustomerData.updateOne({name:payee[0].name},{$set:{currentBalance:payee_newCurrentBalance}});
    console.log(payer_result);
    console.log(payee_result);

}
app.get("/Login", async (req,res) => {
    res.render("Login");
});
app.post("/Login",async (req, res) => {
    console.log(req.body);
    if(req.body.User_account_number == "0000" && req.body.User_password == "admin123")
    {
        const customerdata = await CustomerData.find();
        res.render("Customer",{
            Customer_Data:customerdata
        });
    }
    else{
        const user_data = await CustomerData.find({accountNumber:req.body.User_account_number});
        if(user_data.length !=0)
        {
            if(req.body.User_password == user_data[0].password){
                const userdata = {
                    customer_name:user_data[0].name,
                    customer_email:user_data[0].email,
                    customer_account_number:user_data[0].accountNumber,
                    customer_balance:user_data[0].currentBalance
                };
                res.render("Single_Customer",{
                    CustomerData:userdata
                });
            }
            else{
                res.render("Login",{
                    error_msg:"*Invalid Login Credentials*"
                });
            }
        }
        else{
            res.render("Login",{
                error_msg:"*Invalid Login Credentials*"
            });
        }
    }
});
app.get("/home", async (req, res) => {
    res.render("home");
});
app.get("/forgotpassword", async (req, res) => {
    res.render("forgotPassword")
});
app.post("/forgotpassword", async (req, res) => {
    const user_data = await CustomerData.find({accountNumber:req.body.user_account_number});
    if(user_data.length == 0)
    {
        res.render("forgotPassword",{
            error_msg:"*Account Not Found*"
        });
    }
    else if(user_data[0].email != req.body.user_email)
    {
        res.render("forgotPassword",{
            error_msg:"*This is not Registered email*"
        });
    }
    else{
        console.log(req.body);
        let email = req.body.user_email;
        let accountNumber = req.body.user_account_number;
        let otp = generateOTP();
        let subject = "Verification Code for Password"
        let text = "Enter below One Time Password for password change"
        let body = `OTP:<b>${otp}</b>`
        await sendMail(req.body.user_email,subject,body,text);
        req.session.email = email;
        req.session.accountNumber = accountNumber;
        req.session.otp = otp;
        res.render("OTPPage");
    }
    
});
const generateOTP = () => {
    return Math.ceil(Math.random() * 1000000);
}
app.post("/otp", async (req, res) => {
    console.log(req.body);
    if(req.session.otp == req.body.user_otp)
    {
        console.log(req.session.otp);
        res.render("changePassword");
    }
    else
    {
        res.render("OTPPage",{
            error_msg:"*Invalid OTP*"
        });
    }
});
app.post("/changepassword", async (req,res) => {
    let user_account_number = req.session.accountNumber;
    console.log(user_account_number);
    // const user_data = await CustomerData.find({accountNumber:user_account_number});
    const result = await CustomerData.updateOne({accountNumber:user_account_number},{$set:{password:req.body.new_password}});
    res.render("Login",{
        
        password_change:"*Password successfully changed*"
    });
});


app.listen("8000","127.0.0.1",() => console.log("listening at port no. 8000"));