function compareBalance(){
    var current_balance = document.getElementById("curr_balance").innerHTML;
    var amount = document.getElementById("amt").value;
    var submit_button = document.getElementById("submit_button")
    // console.log(current_balance);
    // console.log(amount);
    if(current_balance <= parseInt(amount)){
        alert("Insufficient Balance!");
        submit_button.disabled = true;
    }
    else
    {
        submit_button.disabled = false;
    }
}
function giveColor(x){
    console.log(x);
    if(x%2 != 0){
        document.getElementById(x).style="background-color:grey";
    }
}


