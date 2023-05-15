const express = require("express");
const app = express();
const hbs = require("hbs");
const path = require("path");
const mongoose = require("mongoose");

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
        required:true
    }
});

const CustomerData = new mongoose.model("CustomerDetail",mySchema);

//all paths
const staticPath = path.join(__dirname+"/public");
const viewsPath = path.join(__dirname+"/templates/views");
const partialPath = path.join(__dirname+"/templates/partials");
app.use(express.urlencoded({extended:true}));
app.use(express.static(staticPath));
app.set("view engine","hbs");
app.set("views",viewsPath);
hbs.registerPartials(partialPath,() => {})

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
        CustomerData:req.body
    });
})

app.post("/transfer", async(req, res) => { 
    const payer = await CustomerData.find({name:req.body.payer_name});
    const payee = await CustomerData.find({name:req.body.payee_name});

    const amount = req.body.amount;
    await transfer_money(payer, payee, amount);

    const customerdata = await CustomerData.find(); 
    res.render("Customer",{
        Customer_Data : customerdata
    });
});
const transfer_money = async (payer, payee, amount) => {
    
    var payer_newCurrentBalance = payer[0].currentBalance - parseInt(amount);
    var payee_newCurrentBalance = payee[0].currentBalance + parseInt(amount);

    const payer_result = await CustomerData.updateOne({name:payer[0].name},{$set:{currentBalance:payer_newCurrentBalance}});
    const payee_result = await CustomerData.updateOne({name:payee[0].name},{$set:{currentBalance:payee_newCurrentBalance}});
    console.log(payer_result);
    console.log(payee_result);

}

app.listen("8000","127.0.0.1",() => console.log("listening at port no. 8000"));