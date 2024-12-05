if ($('#pggrpid').val() === 'Master') {
    $('#loadingGear').hide();

    var pgid = $('#pgid').val();
    var detailJsonData;
    var obj;
    var displaycnt = "10";
    var dataID = 0;
    var action = 'INSERT';
    dropDown();
    getMasterData();

    function clearform() {
        $('#myForm')[0].reset();
        $('#myForm :input').prop('disabled', false);
        dataID = 0;
    }

    function fnvalidate() {
        var form = $('#myForm')[0];
        if (form && form.checkValidity()) {
            fnsave();
            $(form).find('.form-group').removeClass('has-error');
        } else {
            $(form).find(':input[required]').each(function () {
                if (!$(this).val()) {
                    $(this).closest('.form-group').addClass('has-error');
                } else {
                    $(this).closest('.form-group').removeClass('has-error');
                }
            });
            toastr.error('Fields cannot be empty or Invalid value selected', 'Error');
        }
    }

    function fnsave() {
        switch (pgid) {
            case "GeneralMaster":
                detailJsonData = {
                    Value_Code: $('#Value_Code').val(),
                    Value_Description: $('#Value_Description').val(),
                    Value_Type: $('#Value_Type').val()
                };
                break;
            case "ProductMaster":
                detailJsonData = {
                    Product_Code: $('#Product_Code').val(),
                    Product_Description: $('#Product_Description').val(),
                    Product_Category: $('#Product_Category').val(),
                    Product_Type: $('#Product_Type').val(),
                    Bench_Mark: $('#Bench_Mark').val(),
                    PO_Base_Qty: $('#PO_Base_Qty').val(),
                    PO_Base_UOM: $('#PO_Base_UOM').val()
                };
                break;
            case "ProductCompositionMaster":
                detailJsonData = {
                    Product_Code: $('#Product_Code').val(),
                    Commodity: $('#Commodity').val(),
                    Metal_Exchange: $('#Metal_Exchange').val(),
                    Percentage_to_Material: $('#Percentage_to_Material').val()
                };
                break;
            case "ProductWeightMaster":
                detailJsonData = {
                    Product_Code: $('#Product_Code').val(),
                    Product_Weight: $('#Product_Weight').val(),
                    Product_Weight_UOM: $('#Product_Weight_UOM').val(),
                    Weight_for_Qty: $('#Weight_for_Qty').val()
                };
                break;
            case "VendorMaster":
                detailJsonData = {
                    Vendor_Code: $('#Vendor_Code').val(),
                    Vendor_Name: $('#Vendor_Name').val(),
                    Vendor_Type: $('#Vendor_Type').val(),
                    Vendor_Country: $('#Vendor_Country').val()
                };
                break;
            case "CustomerMaster":
                detailJsonData = {
                    Customer_Code: $('#Customer_Code').val(),
                    Customer_Description: $('#Customer_Description').val(),
                    Customer_Short_Name: $('#Customer_Short_Name').val(),
                    Customer_Type: $('#Customer_Type').val()
                };
                break;
            case "CommodityMaster":
                detailJsonData = {
                    Commodity_Code: $('#Commodity_Code').val(),
                    Commodity_Description: $('#Commodity_Description').val()
                };
                break;

            case "CommodityExchangeCombination":
                detailJsonData = {
                    Commodity_Code: $('#Commodity_Code').val(),
                    Exchange: $('#Exchange').val(),
                    Currency: $('#Currency').val(),
                    Rate_Per: $('#Rate_Per').val()
                };
                break;
            default:
                console.error("Invalid pgid value: " + pgid);
        }

        if (dataID > 0) {
            action = 'UPDATE';
        } else {
            action = 'INSERT';
        }

        var detailjson = JSON.stringify(detailJsonData);
        var obj = { action, pgid, detailjson };
        $('#loadingGear').show();
        $.ajax({
            url: "/Home/InsertData",
            type: "POST",
            dataType: "json",
            contentType: "application/json;charset=utf-8",
            data: JSON.stringify(obj),
            success: function (result) {
                if (result.success) {
                    $('#loadingGear').hide();
                    toastr.success(result.message, 'Message');
                    $('#myForm')[0].reset();
                    $('#myForm :input').prop('disabled', false);
                    dataID = 0;
                    getMasterData();
                } else {
                    $('#loadingGear').hide();
                    toastr.error(result.message, 'Error');
                    $('#myForm')[0].reset();
                }
            },
            error: function (err) {
                var errorMessage = err.responseText;
                alert("Failed to connect: " + errorMessage);
                console.log(errorMessage);
            }
        });
    }

    function getMasterData() {
        var pageid = $('#pgid').val();
        var code;
        switch (pageid) {
            case 'GeneralMaster':
                code = $('#Value_Code').val() || "0";
                break;
            case 'ProductMaster':
            case 'ProductCompositionMaster':
            case 'ProductWeightMaster':
                code = $('#Product_Code').val() || "0";
                break;
            case 'VendorMaster':
                code = $('#Vendor_Code').val() || "0";
                break;
            case 'CustomerMaster':
                code = $('#Customer_Code').val() || "0";
                break;
            case 'CommodityMaster':
            case 'CommodityExchangeCombination':
                code = $('#Commodity_Code').val() || "0";
                break;
            default:
                code = "0";
                break;
        }

        obj = { pageid: pageid, code: code, displaycnt: displaycnt, sp_name: "GetMasterData" };
        ajaxCall(obj, pageid);
    }

    function fnview() {
        displaycnt = 'ALL';
        getMasterData();
    }

    function recentMasters(response, pageid) {
        var columnsData;

        switch (pageid) {
            case 'GeneralMaster':
                columnsData = [
                    { label: 'Code', data: 'Value_Code' },
                    { label: 'Description', data: 'Value_Description' },
                    { label: 'Type', data: 'Value_Type' }
                ];
                break;
            case 'ProductMaster':
                columnsData = [
                    { label: 'Product Code', data: 'Product_Code' },
                    { label: 'Description', data: 'Product_Description' },
                    { label: 'Category', data: 'Product_Category' },
                    { label: 'Type', data: 'Product_Type' },
                    { label: 'Bench Mark', data: 'Bench_Mark' },
                    { label: 'PO Base Qty', data: 'PO_Base_Qty' },
                    { label: 'PO Base UOM', data: 'PO_Base_UOM' }
                ];
                break;
            case 'ProductCompositionMaster':
                columnsData = [
                    { label: 'Product Code', data: 'Product_Code' },
                    { label: 'Commodity', data: 'Commodity' },
                    { label: 'Metal Exchange', data: 'Metal_Exchange' },
                    { label: 'Percentage to Material', data: 'Percentage_to_Material' }
                ];
                break;
            case 'ProductWeightMaster':
                columnsData = [
                    { label: 'Product Code', data: 'Product_Code' },
                    { label: 'Product Weight', data: 'Product_Weight' },
                    { label: 'Product Weight UOM', data: 'Product_Weight_UOM' },
                    { label: 'Weight for Qty', data: 'Weight_for_Qty' }
                ];
                break;
            case 'VendorMaster':
                columnsData = [
                    { label: 'Vendor Code', data: 'Vendor_Code' },
                    { label: 'Vendor Name', data: 'Vendor_Name' },
                    { label: 'Vendor Type', data: 'Vendor_Type' },
                    { label: 'Country', data: 'Vendor_Country' }
                ];
                break;
            case 'CustomerMaster':
                columnsData = [
                    { label: 'Customer Code', data: 'Customer_Code' },
                    { label: 'Customer Description', data: 'Customer_Description' },
                    { label: 'Customer Short Name', data: 'Customer_Short_Name' },
                    { label: 'Customer Type', data: 'Customer_Type' }
                ];
                break;
            case 'CommodityMaster':
                columnsData = [
                    { label: 'Commodity Code', data: 'Commodity_Code' },
                    { label: 'Commodity Description', data: 'Commodity_Description' }
                ];
                break;
            case 'CommodityExchangeCombination':
                columnsData = [
                    { label: 'Commodity Code', data: 'Commodity_Code' },
                    { label: 'Exchange', data: 'Exchange' },
                    { label: 'Currency', data: 'Currency' },
                    { label: 'Rate Per', data: 'Rate_Per' }
                ];
                break;
            default:
                console.error("Invalid pgid value: " + pgid);
                break;
        }

        var tableHtml = '<table id="masTable" class="cell-border" style="width:100%"><thead><tr>';

        columnsData.forEach(function (column) {
            tableHtml += '<th>' + column.label + '</th>';
        });

        tableHtml += '</tr></thead><tbody></tbody></table>';

        $('#masTableContainer').html(tableHtml);

        $('#masTable').DataTable({
            lengthChange: false,
            data: response,
            language: {
                'paginate': {
                    'previous': '<span class="prev-icon"></span>',
                    'next': '<span class="next-icon"></span>'
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
            columns: columnsData.map(function (column) {
                return { data: column.data };
            }),

            autoWidth: true,
            ordering: false,
            responsive: true,
            language: {
                paginate: {
                    next: '&#8594;', // or '→'
                    previous: '&#8592;' // or '←' 
                }
            }
        });

        $('#masTable tbody').on('dblclick', 'tr', function () {
            $('#masTable tbody tr.selected').removeClass('selected');
            $(this).addClass('selected');

            var rowData = [];
            $(this).find('td').each(function () {
                rowData.push($(this).text());
            });

            fetchtoTextBox(rowData, pgid);
            var rData = $('#masTable').DataTable().row($(this)).data();
            dataID = rData.id;
        });
    }

    function fetchtoTextBox(rowData, pageid) {
        var fieldMapping = {
            'GeneralMaster': {
                'Value_Code': 0,
                'Value_Description': 1,
                'Value_Type': 2
            },
            'ProductMaster': {
                'Product_Code': 0,
                'Product_Description': 1,
                'Product_Category': 2,
                'Product_Type': 3,
                'Bench_Mark': 4,
                'PO_Base_Qty': 5,
                'PO_Base_UOM': 6
            },
            'ProductCompositionMaster': {
                'Product_Code': 0,
                'Commodity': 1,
                'Metal_Exchange': 2,
                'Percentage_to_Material': 3
            },
            'ProductWeightMaster': {
                'Product_Code': 0,
                'Product_Weight': 1,
                'Product_Weight_UOM': 2,
                'Weight_for_Qty': 3
            },
            'VendorMaster': {
                'Vendor_Code': 0,
                'Vendor_Name': 1,
                'Vendor_Type': 2,
                'Vendor_Country': 3
            },
            'CustomerMaster': {
                'Customer_Code': 0,
                'Customer_Description': 1,
                'Customer_Short_Name': 2,
                'Customer_Type': 3
            },
            'CommodityMaster': {
                'Commodity_Code': 0,
                'Commodity_Description': 1
            },
            'CommodityExchangeCombination': {
                'Commodity_Code': 0,
                'Exchange': 1,
                'Currency': 2,
                'Rate_Per': 3
            }
        };

        var firstCodeFieldDisabled = false;

        if (pageid && fieldMapping.hasOwnProperty(pageid) && rowData.length >= Object.keys(fieldMapping[pageid]).length) {
            var fields = fieldMapping[pageid];
            for (var fieldName in fields) {
                var fieldValue = rowData[fields[fieldName]];
                $('#' + fieldName).val(fieldValue).trigger('change');
                if (fieldName.includes('Code')) {
                    if (!firstCodeFieldDisabled) {
                        $('#' + fieldName).prop('disabled', true);
                        firstCodeFieldDisabled = true;
                    }
                }
            }
        }
    }

    function ajaxCall(obj, pageid) {
        $('#loadingGear').show();
        $.ajax({
            url: "/Home/GetMasterData",
            type: "GET",
            dataType: "json",
            contentType: "application/json;charset=utf-8",
            data: obj,
            success: function (response) {
                recentMasters(response, pageid);
                $('#loadingGear').hide();
            },
            error: function (xhr, status, error) {
                console.error("AJAX Error:", xhr, status, error);
                $('#loadingGear').hide();
            }
        });
    }
}
