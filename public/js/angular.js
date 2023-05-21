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
app.controller("Change_Password_Controller",function($scope){
    $scope.checkNewPassword = function(){
        var change_password_button = document.getElementById("change_password_button");
        if($scope.new_password != $scope.reenter_password){
            change_password_button.disabled = true;
            $scope.error_msg = "Password not matching"
        }
        else{
            change_password_button.disabled = false;
            $scope.error_msg = "";
        }
    }
})
