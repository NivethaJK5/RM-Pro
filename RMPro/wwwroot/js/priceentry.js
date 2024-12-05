//debugger
var userRoll = localStorage.getItem('userRoll');

if ($('#pgid').val() === "PriceEntry") {

    pageid = $('#pgid').val();
    const enqNumber = (new URLSearchParams(window.location.search)).get('enqNumber');
    var enqVersion = (new URLSearchParams(window.location.search)).get('enqVersion');
    var fromDate = (new URLSearchParams(window.location.search)).get('fromDate');
    var toDate = (new URLSearchParams(window.location.search)).get('toDate');
    var Effective_Date = (new URLSearchParams(window.location.search)).get('Effective_Date');
    var vendorCode = (new URLSearchParams(window.location.search)).get('vendorCode');   
   
    $('#enqNumber').text('Enquiry Number : ' + enqNumber );
    $('#dates').text('Vendor Code: ' + vendorCode + ' / Version - ' + enqVersion + ' / From Date: ' + datesplit(fromDate) + ' / To Date : ' + datesplit(toDate) + ' / Effective Date : ' + datesplit(Effective_Date));


    function datesplit(data) {

        // Assuming data is in the format 'yyyy-mm-dd'
        var dateParts = data.split('T')[0].split('-');
        return dateParts[2] + '-' + dateParts[1] + '-' + dateParts[0]; // dd-mm-yyyy format

    }
    var approval_status; 
    $(document).ready(function () {

        if (userRoll === 'Manager' || userRoll === 'Business Head') {
            $('#version').hide();
        }


        versiondropDown();
        $('#loadingGear').hide();
        

        var rowData = {
            enqNumber: enqNumber,
            enqVersion: enqVersion,
            effDate: Effective_Date,
            Upload_By: userRoll,
            fnview: '0',
        };

        var jsonData = JSON.stringify(rowData);
        //pageid = $('#pgid').val();
        var obj = { pageid: pageid, prc: 'Prc_GetEnqData', jsonData: jsonData };
      //  console.log(obj);
        ajaxcall(obj, '0');

        $('#loadingGear').show();

    });
    function clearform() {

        $('#myForm')[0].reset();
    }

    function fnview() {
        if (userRoll === 'Executive') {
            enqVersion = $('#version').val();
        } else {
            enqVersion = (new URLSearchParams(window.location.search)).get('enqVersion');
        }
        
        var rowData = {
            enqNumber: enqNumber,
            enqVersion: enqVersion,
            effDate: Effective_Date,
            Upload_By: userRoll,
            fnview: '1',
            
        };
        var jsonData = JSON.stringify(rowData);
        var obj = { pageid: pageid, prc: 'Prc_GetEnqData', jsonData: jsonData };

     //   console.log(obj);

        ajaxcall(obj,'1');
        $('#loadingGear').show();
    }

    function fnvalidate() {
        var allValid = true; 
        approval_status = $('#approval_status').val();

        $('#priceTableContainer table tbody tr').each(function () {         
            var vendorPrice = $(this).find('.vendor-price').val();
            var vendorOhCost = $(this).find('.vendor-oh-cost').val();
            var proposedQty = $(this).find('.proposed-qty').val();
            if (userRoll === 'Executive') {
                if (vendorPrice.trim() === '' || vendorOhCost.trim() === '' || proposedQty.trim() === '') {
                    allValid = false;
                    return false;
                }
            } else {
                if (vendorPrice.trim() === '' || vendorOhCost.trim() === '') {
                    allValid = false;
                    return false;
                }
            }
        });

        if (userRoll === 'Executive') {
            enqVersion = $('#version').val();
        } else {
            enqVersion = (new URLSearchParams(window.location.search)).get('enqVersion');
        }
        Remarks = $('#Remarks').val();

        var checked = false;

        if (userRoll === 'Executive') {
            checked = allValid && enqVersion !== null && Remarks !== '' && approval_status !== null;
        } else {
            if (approval_status === 'Rejected') {
                checked = Remarks !== '' && approval_status !== null;
            } else {
                checked = allValid && Remarks !== '' && approval_status !== null;
            }
        }

        

        if (checked) {
            var rowData = [];

            $('#priceTableContainer table tbody tr').each(function () {
                // Get the PO_Number from the current row
                var PO_Number = $(this).find('td:eq(0)').text(); 
                var Material = $(this).find('td:eq(1)').text(); 

                // Get the input values within the current row
                var Rm_Price = $(this).find('.vendor-price').val();
                var Oh_Price = $(this).find('.vendor-oh-cost').val();
                var proposedQty = $(this).find('.proposed-qty').val();
              
                var rowObject = {
                    PO_Number: PO_Number,
                    Material: Material,
                    Rm_Price: Rm_Price,
                    Oh_Price: Oh_Price,  
                    enqNumber: enqNumber,
                    enqVersion: enqVersion,
                    Upload_By: userRoll,
                    Remarks: Remarks,
                    approval_status: approval_status,
                    proposedQty: proposedQty
                };

                rowData.push(rowObject);
            });

            
            var detailjson = JSON.stringify(rowData);
            pgid = $('#pgid').val();

            var action = 'Insert';
            var prc = 'Prc_GetEnqData';
            var obj = { action, pgid, prc, detailjson };

         
            $('#loadingGear').show();
            $.ajax({
                url: "/Home/InsertPriceData",
                type: "POST",
                dataType: "json",
                contentType: "application/json;charset=utf-8",
                data: JSON.stringify(obj),
                success: function (response) {
                    $('#loadingGear').hide();                   
                    toastr.success('Sucessfully Saved', 'Message');
                    window.location.href = response.redirectToUrl;
                },
                error: function (xhr, status, error) {
                    // Handle AJAX error
                    console.error("AJAX Error:", xhr, status, error);
                    $('#loadingGear').hide();
                }
            });
        } else {
            toastr.error('Fields / Version / Approval / Remarks Type cannot be empty', 'Error');
        }
    }

}

function ajaxcall(obj, frm) {
    $.ajax({
        url: "/Home/GetPriceData",
        type: "GET",
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        data: obj,
        success: function (response) {
           
            priceEntryfn(response , frm);
            $('#loadingGear').hide();
            $('#priceTable').DataTable().draw();
        },
        error: function (xhr, status, error) {
            // Handle AJAX error
            console.error("AJAX Error:", xhr, status, error);
            $('#loadingGear').hide();
        }
    });
}

function versiondropDown() {
    var pageid = $('#pgid').val();
    const param = (new URLSearchParams(window.location.search)).get('enqNumber');
    var obj = { pageid: pageid, param: param }; // Specify your action value
    $('#loadingGear').show();
    $.ajax({
        url: "/Home/DropdownData",
        type: "GET",
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        data: obj,
        success: function (response) {
          
            if (response.success) {
                $('#loadingGear').hide();
                var dataArray = JSON.parse(response._data);

                dataArray.forEach(function (item) {
                    var option = document.createElement("option");
                    option.value = item.dropval;
                    option.text = item.dropvaldescrip;
                    document.getElementById("version").appendChild(option);
                });

            }



        },
        error: function (err) {
            // Access the error message from the responseText property
            var errorMessage = err.responseText;
            alert("Failed to connect: " + errorMessage);
            
            $('#loadingGear').hide();
        }
    });
}


function priceEntryfn(response, frm) {

    if (userRoll === 'Executive') {

        var tableHtml = '<table id="priceTable" class="cell-border"><thead><tr>' +
            '<th rowspan="2" style="text-align: center;">PO Number</th>' +
            '<th rowspan="2" style="text-align: center;">Material</th>' +
            '<th rowspan="2" style="text-align: center;">Bench Mark</th>' +
            '<th colspan="3" style="text-align: center;">Existing</th>' +
            '<th colspan="3" style="text-align: center;">Bench Mark</th>' +
            '<th colspan="3" style="text-align: center;">Vendor</th>' +
            '<th rowspan="2" style="text-align: center;">Proposed Qty</th>' +
            '</tr><tr>' +
            '<th style="text-align: center;">RM</th>' +
            '<th style="text-align: center;">OH</th>' +
            '<th style="text-align: center;">TOTAL</th>' +
            '<th style="text-align: center;">RM</th>' +
            '<th style="text-align: center;">OH</th>' +
            '<th style="text-align: center;">Total</th>' +
            '<th style="text-align: center;">RM</th>' +
            '<th style="text-align: center;">OH</th>' +
            '<th style="text-align: center;">Total</th>' +
            '</tr></thead><tbody></tbody></table>';




        // Set the HTML content of the container with the table HTML
        $('#priceTableContainer').html(tableHtml);

        // Define columns based on the user type
        var columns = [
            { data: 'PO_Number' },
            { data: 'Mat' },
            { data: 'Bench_Mark' },
            { data: 'Curr_PO_RM_Cost' },
            { data: 'Curr_PO_OH_Cost' },
            { data: 'Rm_Total' },
            { data: 'Sys_Rm_Cost' },
            { data: 'Sys_Oh_Cost' },
            { data: 'Sys_Total' },
            {
                data: null, render: function () {
                    return '<input type="text" class="vendor-price" style="text-align:right; outline: none;  width:100%; border: none; ">';
                }
            },
            {
                data: null, render: function () {
                    return '<input type="text" class="vendor-oh-cost" style="text-align:right; outline: none;  width:100%; border: none; ">';
                }
            },
            {
                data: null, render: function () {
                    return '<input type="text" class="vendor-total-cost" style="text-align:right; outline: none;  border: none; width:100%;" readonly>';
                }
            },
           
            {
                data: null, render: function () {
                    return '<input type="text" class="proposed-qty" style="text-align:right; outline: none;  border: none; width:100%; ">';
                }
            },
           
           
        ];




        // Initialize DataTable with the defined columns
        $('#priceTable').DataTable({
           
            lengthChange: false,
            fixedColumns: {
                start: 3                
            }, 
            data: response,
            columns: columns,
            autoWidth: false,
            scrollCollapse: true,
            responsive: true,
            scrollX: true,
            language: {
                paginate: {
                    next: '&#8594;', // or '→'
                    previous: '&#8592;' // or '←' 
                }
            },
            
            ordering: false,
            select: {
                style: 'multi'
            }, // Enable multi-select
            createdRow: function (row, data, dataIndex) {
                // Bind change event listener to vendor price inputs within this row
                $(row).find('.vendor-oh-cost').on('change', function () {

                    var vendorOhCost = parseFloat($(this).val());
                    var vendorPrice = parseFloat($(row).find('.vendor-price').val());
                    var vendortotalCost = vendorOhCost + vendorPrice;
                    $(row).find('.vendor-total-cost').val(vendortotalCost);

                });
            }
            
        });

        if (frm === '1') {

            $('#Remarks').val(response[0].Remarks)
            $('#priceTableContainer table tbody tr').each(function (index) {
                // Get the current item from the response array
                var item = response[index];

                if (item) {
                    // Find the input fields in the current row
                    var $vendor_price = $(this).find('.vendor-price');
                    var $vendor_oh_cost = $(this).find('.vendor-oh-cost');
                    var $vendor_total_cost = $(this).find('.vendor-total-cost');
                     var $proposed_qty = $(this).find('.proposed-qty');

                    // Set the values from the response data to the input fields
                    $vendor_price.val(item.vendorPrice);
                    $vendor_oh_cost.val(item.vendorOhCost);
                    $vendor_total_cost.val(item.vendorTotalCost);
                    $proposed_qty.val(item.Pro_IN_Qty);
                }
            });
        }

    } else if (userRoll === 'Manager' || userRoll === 'Business Head') {

        if (userRoll === 'Business Head') {
            frm = '1';
        }


        var tableHtml = '<table id="priceTable" class="cell-border"><thead><tr>' +
            '<th rowspan="2" style="text-align: center;">PO Number</th>' +
            '<th rowspan="2" style="text-align: center;">Material</th>' +
            '<th rowspan="2" style="text-align: center;">Bench Mark</th>' +
            '<th colspan="3" style="text-align: center;">Existing</th>' +
            '<th colspan="3" style="text-align: center;">Bench Mark</th>' +
            '<th colspan="3" style="text-align: center;">Vendor</th>' +
            '<th rowspan="2" style="text-align: center;">Proposed Qty</th>' +
            '<th colspan="3" style="text-align: center;">Manager</th>' +
            '</tr><tr>' +
            '<th style="text-align: center;">RM</th>' +
            '<th style="text-align: center;">OH</th>' +
            '<th style="text-align: center;">TOTAL</th>' +
            '<th style="text-align: center;">RM</th>' +
            '<th style="text-align: center;">OH</th>' +
            '<th style="text-align: center;">Total</th>' +
            '<th style="text-align: center;">RM</th>' +
            '<th style="text-align: center;">OH</th>' +
            '<th style="text-align: center;">Total</th>' +
            '<th style="text-align: center;">RM</th>' +
            '<th style="text-align: center;">OH</th>' +
            '<th style="text-align: center;">Total</th>' +
            '</tr></thead><tbody></tbody></table>';



        // Set the HTML content of the container with the table HTML
        $('#priceTableContainer').html(tableHtml);

        // Define columns based on the user type
        var columns = [
            { data: 'PO_Number' },
            { data: 'Mat' },
            { data: 'Bench_Mark' },
            { data: 'Curr_PO_RM_Cost' },
            { data: 'Curr_PO_OH_Cost' },
            { data: 'Rm_Total' },
            { data: 'Sys_Rm_Cost' },
            { data: 'Sys_Oh_Cost' },
            { data: 'Sys_Total' },
            { data: 'M_vendorPrice' },
            { data: 'M_vendorOhCost' },
            { data: 'M_vendorTotalCost' },
            { data: 'Pro_IN_Qty', visible: false },
            {
                data: null, render: function () {
                    return '<input type="text" class="vendor-price" style="text-align:right; outline: none;  border: none; width:100%;">';
                }
            },
            {
                data: null, render: function () {
                    return '<input type="text" class="vendor-oh-cost" style="text-align:right; outline: none;  border: none;width:100%; ">';
                }
            },
            {
                data: null, render: function () {
                    return '<input type="text" class="vendor-total-cost" style="text-align:right; outline: none;  border: none; width:100%;" readonly>';
                }
            },
          
        ];




        // Initialize DataTable with the defined columns
        $('#priceTable').DataTable({
            lengthChange: false,
            data: response,
            columns: columns,
            responsive: true,
            fixedColumns: {
                start: 3
            },
            scrollX: true,
            autoWidth: false,
            language: {
                paginate: {
                    next: '&#8594;', // or '→'
                    previous: '&#8592;' // or '←' 
                }
            },
            ordering: false,
            select: {
                style: 'multi'
            }, // Enable multi-select
            createdRow: function (row, data, dataIndex) {
                // Bind change event listener to vendor price inputs within this row
                $(row).find('.vendor-oh-cost').on('change', function () {
                 
                    var vendorOhCost = parseFloat($(this).val());
                    var vendorPrice = parseFloat($(row).find('.vendor-price').val());
                    var vendortotalCost = vendorOhCost + vendorPrice;
                    $(row).find('.vendor-total-cost').val(vendortotalCost);

                });
            }
        });

        if (frm === '1') {

            $('#Remarks').val(response[0].Remarks)
            $('#priceTableContainer table tbody tr').each(function (index) {
                // Get the current item from the response array
                var item = response[index];

                if (item) {
                    // Find the input fields in the current row
                    var $vendor_price = $(this).find('.vendor-price');
                    var $vendor_oh_cost = $(this).find('.vendor-oh-cost');
                    var $vendor_total_cost = $(this).find('.vendor-total-cost');

                    // Set the values from the response data to the input fields
                    $vendor_price.val(item.vendorPrice);
                    $vendor_oh_cost.val(item.vendorOhCost);
                    $vendor_total_cost.val(item.vendorTotalCost);
                }
            });
        }

    }
    // Get all the rows in the table body
    var rows = document.querySelectorAll('#priceTable tbody tr');

    // Check if rows array is not empty
    if (rows.length > 0) {
        // Iterate through each row
        rows.forEach(function (row) {
            var td5 = row.querySelectorAll('td')[5];
            var td8 = row.querySelectorAll('td')[8];

            td5.style.backgroundColor = '#ebedeb';
            td8.style.backgroundColor = '#ebedeb';
        });
    }

}

//auto click of 1st tab
document.addEventListener("DOMContentLoaded", function () {
    // Simulate a click event on the tab link for the priceTableContainer tab
    document.getElementById("priceTab").click();
});

//function for difference calcu tab
function diffcalc() {
    var table = $('#priceTable').DataTable();

    var poNumber = table.column(0).data().toArray();
    var material = table.column(1).data().toArray();
    var benchMark = table.column(2).data().toArray();

    if (userRoll === 'Executive') {
        var proQty = [];
        $('#priceTable').find('.proposed-qty').each(function () {
            proQty.push(parseFloat($(this).val()));
        });
    } else {
        var proQty = table.column(12).data().toArray();
    }
   
    var rmTotal = table.column(5).data().toArray();
    var sysTotal = table.column(8).data().toArray();

    var venpreTotal = table.column(11).data().toArray(); // this taken for Non Executive vendor diff calculation
   


    var vendorTotalCosts = [];
    $('#priceTable').find('.vendor-total-cost').each(function () {
        vendorTotalCosts.push(parseFloat($(this).val()));
    });

    

    var sysDiff = [];
    var vendorDiff = [];
    var venPreDiff = [];

    for (var i = 0; i < rmTotal.length; i++) {
        sysDiff.push(sysTotal[i] - rmTotal[i]);
        vendorDiff.push(vendorTotalCosts[i] - rmTotal[i]);
        if (venpreTotal.length > 0) {
            venPreDiff.push(venpreTotal[i] - rmTotal[i]);
        }
    }

    if (userRoll === 'Executive') {

        var columns = [
            { title: "PO Number" },
            { title: "Material" },
            { title: "Bench Mark" },
            { title: "Proposed Qty" },
            { title: "BM Diff", render: $.fn.dataTable.render.number(',', '.', 2) },
            { title: "Vendor Diff", render: $.fn.dataTable.render.number(',', '.', 2) },
            { title: "Qty BM Diff", render: $.fn.dataTable.render.number(',', '.', 2) },
            { title: "Qty Vendor Diff", render: $.fn.dataTable.render.number(',', '.', 2) }
        ];

        var data = [];
        for (var j = 0; j < sysDiff.length; j++) {
            if (benchMark[j] == 'No') {
                sysDiff[j] = 0;
            }
            data.push([poNumber[j], material[j], benchMark[j], proQty[j], sysDiff[j], vendorDiff[j], (proQty[j] * sysDiff[j]), (proQty[j] * vendorDiff[j])]);
        }
    } else {
        var columns = [
            { title: "PO Number" },
            { title: "Material" },
            { title: "Bench Mark" },
            { title: "Proposed Qty" },
            { title: "BM Diff", render: $.fn.dataTable.render.number(',', '.', 2) },
            { title: "Vendor Diff", render: $.fn.dataTable.render.number(',', '.', 2) },
            { title: "Manager Diff", render: $.fn.dataTable.render.number(',', '.', 2) },
            { title: "Qty BM Diff", render: $.fn.dataTable.render.number(',', '.', 2) },
            { title: "Qty Vendor Diff", render: $.fn.dataTable.render.number(',', '.', 2) }
        ];
        var data = [];
        for (var j = 0; j < sysDiff.length; j++) {
            if (benchMark[j] == 'No') {
                sysDiff[j] = 0;
            }
            data.push([poNumber[j], material[j], benchMark[j], proQty[j], sysDiff[j], venPreDiff[j], vendorDiff[j], (proQty[j] * sysDiff[j]), (proQty[j] * vendorDiff[j])]);
        }
    }

   

    var tableHtml = '<table id="diffTable" class="cell-border"></table>';
    $('#diffTableContainer').html(tableHtml);

    // Initialize DataTable with the defined columns and data
    $('#diffTable').DataTable({
        data: data,
        columns: columns,
        lengthChange: false,
        autoWidth: false,
        scrollCollapse: true,
        responsive: true,
        language: {
            paginate: {
                next: '&#8594;', // or '→'
                previous: '&#8592;' // or '←'
            }
        },
        layout: {
            topStart: {
                buttons: [
                    {
                        extend: 'copyHtml5',
                        text: '<i class="fa fa-files-o"></i>',
                        titleAttr: 'Copy'
                    },
                    {
                        extend: 'excelHtml5',
                        text: '<i class="fa fa-file-excel-o"></i>',
                        titleAttr: 'Excel'
                    },
                    {
                        extend: 'csvHtml5',
                        text: '<i class="fa fa-file-text-o"></i>',
                        titleAttr: 'CSV'
                    },
                    {
                        extend: 'pdfHtml5',
                        text: '<i class="fa fa-file-pdf-o"></i>',
                        titleAttr: 'PDF'
                    }
                ]
            }
        },
    });


}



function retroImpact() {
   
    var enqNumber = (new URLSearchParams(window.location.search)).get('enqNumber')
    var vendorCode = (new URLSearchParams(window.location.search)).get('vendorCode');   
    var rowData = {
        enqNumber: enqNumber,
        enqVersion: enqVersion,
        effDate: Effective_Date,
        Upload_By: userRoll,
        vendorCode: vendorCode,
        fnview: '0',
    };

    var jsonData = JSON.stringify(rowData);

    var obj = {
        pageid: pageid,
        prc: 'Prc_RetraImpact',
        jsonData: jsonData
    };

    $.ajax({
        url: "/Home/GetPriceData",
        type: "GET",
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        data: obj,
        success: function (response) {
            // console.log(response);
            retroImpactresponse(response);
            $('#loadingGear').hide();

            $('#retrpimpactTable').DataTable().draw();
        },
        error: function (xhr, status, error) {
            // Handle AJAX error
            console.error("AJAX Error:", xhr, status, error);
            $('#loadingGear').hide();
        }
    });

}
function fgImpact() {
    var table = $('#priceTable').DataTable();

    var rmTotal = table.column(5).data().toArray();
    var sysTotal = table.column(8).data().toArray();

    if (userRoll === 'Executive') {
        var vendorTotal = [];
        $('#priceTable').find('.vendor-total-cost').each(function () {
            vendorTotal.push(parseFloat($(this).val()));
        });
        var managerTotal = null;
    } else {
        var managerTotal = [];
        $('#priceTable').find('.vendor-total-cost').each(function () {
            managerTotal.push(parseFloat($(this).val()));
        });
        var vendorTotal = table.column(11).data().toArray();
    }
    var material = table.column(1).data().toArray();
    var vendorCode = (new URLSearchParams(window.location.search)).get('vendorCode');
    // Convert array to JSON object
    var jsonData = JSON.stringify({ material: material, rmTotal: rmTotal, sysTotal: sysTotal, vendorTotal: vendorTotal, managerTotal: managerTotal });

    // Construct the object to be sent in the AJAX request
    var obj = {
        pageid: vendorCode,
        prc: 'Prc_FGImpact',
        jsonData: jsonData
    };

    $.ajax({
        url: "/Home/GetPriceData",
        type: "GET",
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        data: obj,
        success: function (response) {
           // console.log(response);
            fgImpactresponse(response);
            $('#loadingGear').hide();
            $('#impactTable').DataTable().draw();
        },
        error: function (xhr, status, error) {
            // Handle AJAX error
            console.error("AJAX Error:", xhr, status, error);
            $('#loadingGear').hide();
        }
    });

}
function fgImpactresponse(response) {
    if (userRoll === 'Executive') {
        $('#impactTableContainer').html('<table id="impactTable" class="cell-border" style="width:100%"><thead><tr><th>FG</th><th>SFG</th><th>Material</th><th>Bench Mark</th><th>Bom Qty</th><th>SOB</th><th>BM Impact</th><th>Vendor Impact</th></tr></thead><tbody></tbody></table>');

        var columns = [
            { data: 'FG' },
            { data: 'SFG' },
            { data: 'Product_Code' },
            { data: 'Bench_Mark' },
            { data: 'QTY' },
            { data: 'Sob' },
            { data: 'sysRes' },
            { data: 'vendorRes' }
        ];
    } else {
        $('#impactTableContainer').html('<table id="impactTable" class="cell-border" style="width:100%"><thead><tr><th>FG</th><th>Material</th><th>Bom Qty</th><th>SOB</th><th>BM Impact</th><th>Vendor Impact</th><th>Manager Impact</th></tr></thead><tbody></tbody></table>');

        var columns = [
            { data: 'FG' },
            { data: 'Product_Code' },
            { data: 'QTY' },
            { data: 'Sob' },
            { data: 'sysRes' },
            { data: 'vendorRes' },
            { data: 'managerRes' }
        ];
    }

    // Initialize DataTable with the defined columns and data
    var table = $('#impactTable').DataTable({
        data: response,
        columns: columns,
        lengthChange: false,
        autoWidth: false,
        scrollCollapse: true,
        responsive: true,
        ordering: false,

        layout: {
            topStart: {
                buttons: [
                    {
                        extend: 'copyHtml5',
                        text: '<i class="fa fa-files-o"></i>',
                        titleAttr: 'Copy'
                    },
                    {
                        extend: 'excelHtml5',
                        text: '<i class="fa fa-file-excel-o"></i>',
                        titleAttr: 'Excel'
                    },
                    {
                        extend: 'csvHtml5',
                        text: '<i class="fa fa-file-text-o"></i>',
                        titleAttr: 'CSV'
                    },
                    {
                        extend: 'pdfHtml5',
                        text: '<i class="fa fa-file-pdf-o"></i>',
                        titleAttr: 'PDF'
                    }
                ]
            }
        },
        paging: false,
    });

    // Add class to rows where SFG equals 'Z'
    table.rows().every(function () {
        var data = this.data();
        if (data && data['SFG'] === 'Z') {
            var row = this;
            $(row.node()).addClass('subtotal-row');
            $('td:eq(1)', row.node()).html('');
            data['SFG'] = ''; // Change 'Z' to ''
            data['FG'] = 'Subtotal';
            this.data(data).draw();
        }
    });


}


function retroImpactresponse(response) {
    var arr = ["PO Number", "Material", "Existing Price", "BM Price", "Vendor Price", "Invoice Qty", "BM Diff",
        "Retro Impact", "Vendor Diff", "Retro Impact"];
    if (userRoll !== 'Executive') {
        arr.splice(5, 0, "Manager Price");
        arr.push("Manager Diff", "Retro Impact");
    }

    var tableHead = '<table id="retrpimpactTable" class="cell-border" style="width:100%"><thead><tr>';
    for (var i = 0; i < arr.length; i++) {
        tableHead += '<th>' + arr[i] + '</th>';
    }
    tableHead += '</tr></thead><tbody></tbody></table>';

    $('#retroimpactTableContainer').html(tableHead);

    var columns = [
        { data: 'PO_Number' },
        { data: 'Mat' },
        { data: 'Rm_Total' },
        { data: 'Sys_Total' },
        { data: 'VT' }
    ];

    if (userRoll !== 'Executive') {
        columns.push({ data: 'MT' });
    }

    columns.push(
        { data: 'Total_Invoice_Qty' },
        { data: 'Sys_Diff' },
        { data: 'Sys_Diff_Impact' },
        { data: 'Vendor_Diff' },
        { data: 'Vendor_Diff_Impact' }
    );

    if (userRoll !== 'Executive') {
        columns.push(
            { data: 'Manager_Diff' },
            { data: 'Manager_Diff_Impact' }
        );
    }

    var dataTableOptions = {
        data: response,
        columns: columns,
        lengthChange: false,
        autoWidth: false,
        scrollCollapse: true,
        responsive: true,
        layout: {
            topStart: {
                buttons: [
                    {
                        extend: 'copyHtml5',
                        text: '<i class="fa fa-files-o"></i>',
                        titleAttr: 'Copy'
                    },
                    {
                        extend: 'excelHtml5',
                        text: '<i class="fa fa-file-excel-o"></i>',
                        titleAttr: 'Excel'
                    },
                    {
                        extend: 'csvHtml5',
                        text: '<i class="fa fa-file-text-o"></i>',
                        titleAttr: 'CSV'
                    },
                    {
                        extend: 'pdfHtml5',
                        text: '<i class="fa fa-file-pdf-o"></i>',
                        titleAttr: 'PDF'
                    }
                ]
            }
        },
        language: {
            paginate: {
                next: '&#8594;', // or '→'
                previous: '&#8592;' // or '←'
            }
        }
    };

    if (userRoll !== 'Executive') {
        dataTableOptions.scrollX = true;
    }

    // Initialize DataTable with the defined columns and data
    $('#retrpimpactTable').DataTable(dataTableOptions);
}
