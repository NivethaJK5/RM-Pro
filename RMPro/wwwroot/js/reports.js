$('#loadingGear').hide();

$('#save, #clear').hide();

var pgid = $('#pgid').val();

$(document).ready(function () {
    dropDown();
    if (pgid == 'BOM') {
        fnview(); 
    }
});

function formatDate(date) {
    var dateParts = date.split('T')[0].split('-');
    return dateParts[2] + '-' + dateParts[1] + '-' + dateParts[0]; // dd-mm-yyyy format
}
function fnview() {
    var EnqNumber;
    var obj;

    if (pgid == 'ShouldCostReport' || pgid == 'PriceCalcReport') {
        EnqNumber = $('#EnqNumber').val();
        obj = {
            pageid: pgid,
            prc: 'Prc_ReportSysMatCalc',
            jsonData: JSON.stringify({
                EnqNumber: EnqNumber
            })
        };
    } else if (pgid == 'BOM') {
        EnqNumber = "1";
        obj = {
            pageid: pgid,
            prc: 'Prc_ReportSysMatCalc',
            jsonData: JSON.stringify({
                EnqNumber: EnqNumber
            })
         
        };
    } else if (pgid == 'PurchaseDetailsReport') {
        var VendorCode = $('#VendorCode').val();
        var Select_Type = $('#Select_Type').val();
        var fromDate = $('#fromDate').val();
        var toDate = $('#toDate').val();

        obj = {
            pageid: pgid,
            prc: 'Prc_ReportSysMatCalc',
            jsonData: JSON.stringify({
                VendorCode: VendorCode,
                Select_Type: Select_Type,
                fromDate: fromDate,
                toDate: toDate
            })
        };
    } else if (pgid == 'CommodityPriceMovementReport') {
        var Commodity_Code = $('#Commodity_Code').val();
        var fromDate = $('#fromDate').val();
        var toDate = $('#toDate').val();

        obj = {
            pageid: pgid,
            prc: 'Prc_ReportSysMatCalc',
            jsonData: JSON.stringify({
                Commodity_Code: Commodity_Code,
                fromDate: fromDate,
                toDate: toDate
            })
        };
    } else if (pgid == 'ExchangeRateReport') {
        var Currency = $('#Currency').val();
        var fromDate = $('#fromDate').val();
        var toDate = $('#toDate').val();

        obj = {
            pageid: pgid,
            prc: 'Prc_ReportSysMatCalc',
            jsonData: JSON.stringify({
                Currency: Currency,
                fromDate: fromDate,
                toDate: toDate
            })
        };
    } 

    if (EnqNumber != '' || pgid == 'BOM') {
        ajaxCall(obj);
    } else {
        toastr.error('Please Select Enquiry Number', 'Error');
    }
}


function ajaxCall(obj) {
    $('#loadingGear').show();
    $('#priceCalcReportContainer, #shReportContainer').hide();
    $.ajax({
        url: "/Home/GetPriceData",
        type: "GET",
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        data: obj,
        success: function (response) {
            $('#loadingGear').hide();
            if (pgid === 'PriceCalcReport') {
                calcReport(response)
                $('#priceCalcReportContainer').show();
                $('#calcReportTable').DataTable().draw();
            } else if (pgid === 'ShouldCostReport') {
                shReport(response);
                $('#shReportContainer').show();
                $('#shReportTable').DataTable().draw();
            } else if (pgid === 'BOM') {
                bomReport(response);
                $('#BOMReportContainer').show();
                $('#BOMReportTable').DataTable().draw();
            } else if (pgid === 'PurchaseDetailsReport') {
                PDReport(response);
                $('#PDReportContainer').show();
                $('#PDReportTable').DataTable().draw();
            } else if (pgid === 'CommodityPriceMovementReport') {               
                CPMReport(response);
                $('#CPMReportContainer').show();
                $('#CPMReportTable').DataTable().draw();
            } else if (pgid === 'ExchangeRateReport') {
                ERReport(response);
                $('#ERReportContainer').show();
                $('#ERReportTable').DataTable().draw();
            }
        },
        error: function (xhr, status, error) {
            console.error("AJAX Error:", xhr, status, error);
            $('#loadingGear').hide();
        }
    });
}
function calcReport(response) {
    $('#priceCalcReportContainer').html('<table id="calcReportTable" class="cell-border" style="width:100%"><thead>' +
        '<tr><th>PO Date</th><th>PO Number</th><th>Material</th><th>Material Descrption</th><th>Category</th><th>Type</th>' +
        '<th>Bench Mark</th><th>PO Base UOM</th><th>Commodity</th><th>Metal Exchange</th>' +
        '<th>Rate Per</th><th>Product Weight</th><th>UOM</th><th>Weight for Qty</th>' +
        '<th>Adjusted Weight</th><th>Adjusted Rate</th><th>Rs Per Currency</th>' +
        '<th>Percentage to Material</th><th>FromDate</th><th>ToDate</th><th>System Rm Cost</th></tr></thead>' +
        '<tbody></tbody></table>');

    var calcReportTable = initializeDataTable('calcReportTable', response, [
        { data: 'PO_Date', render: function (data) { return formatDate(data); } },
        { data: 'PO_Number' },
        { data: 'Mat' },
        { data: 'Mat_Descrp' },
        { data: 'Category' },
        { data: 'type' },
        { data: 'Bench_Mark' },
        { data: 'PO_Base_UOM' },
        { data: 'Commodity' },
        { data: 'Metal_Exchange' },
        { data: 'Rate_Per' },
        { data: 'Product_Weight' },
        { data: 'UOM' },
        { data: 'Weight_for_Qty' },
        { data: 'Adjusted_Weight' },
        { data: 'Adjusted_Rate' },
        { data: 'Rs_Per_Currency' },
        { data: 'Percentage_to_Material' },
        { data: 'FromDate', render: function (data) { return formatDate(data); } },
        { data: 'ToDate', render: function (data) { return formatDate(data); } },
        { data: 'Sys_Rm_Cost' }
    ]);
    calcReportTable.draw();
}

function shReport(response) {
    $('#shReportContainer').html('<table id="shReportTable" class="cell-border" style="width:100%"><thead>' +
        '<tr><th>Vendor</th><th>Version</th><th>Purchase Material</th><th>Component</th><th>Obj Desc</th>' +
        '<th>Comp Qty</th><th>Unit</th><th>Base Qty</th><th>Purchase Price</th></tr></thead>' +
        '<tbody></tbody></table>');

    var shReportTable = initializeDataTable('shReportTable', response, [
        { data: 'Vendor' },
        { data: 'Version' },
        { data: 'Purchase_Material' },
        { data: 'Component' },
        { data: 'ObjDesc' },
        { data: 'CompQty' },
        { data: 'Unit' },
        { data: 'BaseQty' },
        { data: 'Purchase_Price' }
    ]);
    shReportTable.draw();
}


function bomReport(response) {
    $('#BOMReportContainer').html('<table id="BOMReportTable" class="cell-border" style="width:100%"><thead>' +
        '<tr><th>FG</th><th>SFG</th><th>Product Code</th><th>ASSEMBLY INDT</th><th>QTY</th>' +
        '<th>UOM</th></tr></thead>' +
        '<tbody></tbody></table>');

    var BOMReportTable = initializeDataTable('BOMReportTable', response, [
        { data: 'FG' },
        { data: 'SFG' },
        { data: 'Product_Code' },
        { data: 'ASSEMBLY_INDT' },
        { data: 'QTY' },
        { data: 'UOM' }
    ]);
    BOMReportTable.draw();
}


function PDReport(response) {
    $('#PDReportContainer').html('<table id="PDReportTable" class="cell-border" style="width:100%"><thead>' +
        '<tr><th>Material Code</th><th>Invoice No</th><th>Invoice Date</th><th>Po Number</th><th>PO Date</th>' +
        '<th>Invoice Qty</th></tr></thead>' +
        '<tbody></tbody></table>');

    var PDReportTable = initializeDataTable('PDReportTable', response, [
        { data: 'Mat_Code' },
        { data: 'Invoice_No' },
        { data: 'Invoice_Date', render: function (data) { return formatDate(data); } },
        { data: 'Po_Number' },
        { data: 'PO_Date', render: function (data) { return formatDate(data); } },
        { data: 'Invoice_Qty' }
    ]);
    PDReportTable.draw();
}



function CPMReport(response) {
    $('#CPMReportContainer').html('<table id="CPMReportTable" class="cell-border" style="width:100%"><thead>' +
        '<tr><th>Date</th><th>Commodity Code</th><th>Exchange</th><th>Currency</th><th>Rate</th></tr></thead>' +
        '<tbody></tbody></table>');

    var CPMReportTable = initializeDataTable('CPMReportTable', response, [
        { data: 'Date', render: function (data) { return formatDate(data); } },
        { data: 'Commodity_Code' },
        { data: 'Exchange' },
        { data: 'Currency' },
        { data: 'Rate' }
    ]);
    CPMReportTable.draw();
}



function ERReport(response) {
    $('#ERReportContainer').html('<table id="ERReportTable" class="cell-border" style="width:100%"><thead>' +
        '<tr><th>Date</th><th>Currency</th><th>Rs Per Currency</th></tr></thead>' +
        '<tbody></tbody></table>');

    var ERReportTable = initializeDataTable('ERReportTable', response, [
        { data: 'Date', render: function (data) { return formatDate(data); } },
        { data: 'Currency' },
        { data: 'Rs_Per_Currency' }
    ]);
    ERReportTable.draw();
}

function initializeDataTable(tableId, response, columns) {
    return $('#' + tableId).DataTable({
        lengthChange: false,
        data: response,
        language: {
            paginate: {
                next: '&#8594;', // or '→'
                previous: '&#8592;' // or '←' 
            }
        },
        columns: columns,
        layout: {
            topStart: {
                buttons: [
                    { extend: 'copyHtml5', text: '<i class="fa fa-files-o"></i>', titleAttr: 'Copy' },
                    { extend: 'excelHtml5', text: '<i class="fa fa-file-excel-o"></i>', titleAttr: 'Excel' },
                    { extend: 'csvHtml5', text: '<i class="fa fa-file-text-o"></i>', titleAttr: 'CSV' },
                    { extend: 'pdfHtml5', text: '<i class="fa fa-file-pdf-o"></i>', titleAttr: 'PDF' }
                ]
            }
        },
        scrollX: true,
        responsive: true,
        ordering: false
    });
}
