$(document).ready(function () {


    var username = localStorage.getItem('username');
    var userRoll = localStorage.getItem('userRoll');

    // Set the username wherever you need it
    $('#username').text(username);
    $('#userRoll').text(userRoll);
;

    var id = $('#pgid').val();
    //console.log(id);
    switch (id) {
        case "enquiry":
            $('.dashboard-title').text('Enquiry');
            $('#save').hide();
            break;
        case "GeneralMaster":
            $('.dashboard-title').text('General Master');
            break;
        case "ProductMaster":
            $('.dashboard-title').text('Product Master');
            break;
        case "ProductCompositionMaster":
            $('.dashboard-title').text('Product Composition Master');
            break;
        case "ProductWeightMaster":
            $('.dashboard-title').text('Product Weight Master');
            break;
        case "VendorMaster":
            $('.dashboard-title').text('Vendor Master');
            break;
        case "CustomerMaster":
            $('.dashboard-title').text('Customer Master');
            break;
        case "CommodityMaster":
            $('.dashboard-title').text('Commodity Master');
            break;
        case "CommodityExchangeCombination":
            $('.dashboard-title').text('Commodity Exchange Combination');
            break;
        case "MasterImport":
            $('.dashboard-title').text('Master Import');
            break;
        case "PriceEntry":
            $('.dashboard-title').text('Price Entry');
            break;
        case "Dashboard":
            $('.dashboard-title').text('Dashboard');
            break;
        case "PriceCalcReport":
            $('.dashboard-title').text('Price Calc Report');
            break;
        case "ShouldCostEntry":
            $('.dashboard-title').text('Should Costing');
            break;
        case "shcenquiry":
            $('.dashboard-title').text('Should Costing Enquiry');
            break;
        case "SholdCostImport":
            $('.dashboard-title').text('Should Costing Import');
            break;
        case "ShouldCostReport":
            $('.dashboard-title').text('Should Cost Report');
            break;
        case "BOM":
            $('.dashboard-title').text('BOM Report');
            break;
        case "PurchaseDetailsReport":
            $('.dashboard-title').text('Purchase Details Report');
            break;
        case "CommodityPriceMovementReport":
            $('.dashboard-title').text('Commodity Price Movement Report');
            break;
        case "ExchangeRateReport":
            $('.dashboard-title').text('Exchange Rate Report');
            break;
            
        default:
            // Handle the default case if needed
            break;
    }


    document.addEventListener('keydown', function (event) {
       
        if (event.altKey && event.key === 's') {
            fnvalidate();
        } else if (event.altKey && event.key === 'c') {
            clearform();
        } else if (event.altKey && event.key === 'v') {
            fnview();
        }
    });


    

/** 
    $('input[type="text"]').click(function () {
        // Get the ID of the clicked text box
        var textboxId = $(this).attr('id');
        console.log('Clicked textbox ID:', textboxId);
    });

    */

  



});




function dropDown() {
    var pageid = $('#pgid').val();
    var param = '1';
    var obj = { pageid: pageid, param: param }; // Specify your action value
    $('#loadingGear').show();
    $.ajax({
        url: "/Home/DropdownData",
        type: "GET",
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        data: obj,
        success: function (response) {
            $('#loadingGear').hide();
            if (response.success) {
              
                var dataArray = JSON.parse(response._data);
                var groupedData = {};

                dataArray.forEach(function (item) {
                    if (!groupedData[item.dropid]) {
                        groupedData[item.dropid] = [];
                    }
                    groupedData[item.dropid].push({ text: item.dropval, description: item.dropvaldescrip });
                });

                for (var dropid in groupedData) {
                    $("#" + dropid).inputpicker({
                        //editable: true,
                        filterOpen: true,
                        data: groupedData[dropid],
                        fields: [
                            { name: 'text', text: 'Code' },
                            { name: 'description', text: 'Description' }
                        ],
                        headShow: true,
                        fieldValue: 'text'
                    }).on('blur', function () {
                        // Get the selected item
                        var selectedItem = $(this).inputpicker('element', 'selected');
                        // Check if a valid item is selected
                        if (!selectedItem || selectedItem.text === '') {
                            // Clear the input field if no item is selected or if it's empty
                            $(this).val('');
                        }
                    });
                }
            }



        },
        error: function (err) {
            // Access the error message from the responseText property
            var errorMessage = err.responseText;
            alert("Failed to connect: " + errorMessage);
            console.log(errorMessage);
            $('#loadingGear').hide();
        }
    });
}

function loginCall(event) {
    event.preventDefault();
    var username = $('#username').val();
    var password = $('#password').val();
    
    var obj = { username: username, password: password };

    if (username != '' && password != '') {
        $.ajax({
            url: "/Home/LoginData",
            type: "POST",
            dataType: "json",
            contentType: "application/json;charset=utf-8",
            data: JSON.stringify(obj),
            success: function (response) {
                console.log(response);
                if (response.success) {

                    window.history.pushState({}, document.title, response.redirectToUrl);


                    localStorage.setItem('username', response.uname);
                    localStorage.setItem('userRoll', response.userRoll);
                 
                    // Redirect to the new page
                    window.location.href = response.redirectToUrl;


                } else {
                    //alert(response.message);
                    $('#err').text(response.message);

                }
            },
            error: function (xhr, status, error) {
                // Handle AJAX error
                console.error(xhr.responseText);
                alert("An error occurred while processing your request.");
            }
        });
    }
}

function logout() {
    localStorage.removeItem('username');
    localStorage.removeItem('userRoll');
    // Redirect to the login page of HomeController
    window.history.pushState({}, document.title, "/Home/Login");
    window.location.href = "/Home/Login";
}