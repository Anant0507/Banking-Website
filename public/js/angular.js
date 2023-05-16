var app = angular.module("myApp",[]);
app.controller("Single_Customer_Controller",function($scope){
    $scope.payee_account_number = "";
    $scope.checkAccountNumber = function(){
        var payer_account_number = document.getElementById("payer_account_number").innerHTML;
        var submit_button = document.getElementById("submit_button");
        if($scope.payee_account_number == payer_account_number)
        {
            submit_button.disabled = true;
            alert("Cant do transaction in same account");
        }
    }
});