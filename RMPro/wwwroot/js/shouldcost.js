//debugger
var userRoll = localStorage.getItem('userRoll');

if ($('#pgid').val() === "ShouldCostEntry" || $('#pgid').val() === "shcenquiry" || $('#pgid').val() === "SholdCostImport") {

    pageid = $('#pgid').val();

    const enqNumber = (new URLSearchParams(window.location.search)).get('enqNumber');
    if (pageid === 'ShouldCostEntry') {
        $('#enqNumber').text('Enquiry Number : ' + enqNumber);
    }
    function datesplit(data) {

        // Assuming data is in the format 'yyyy-mm-dd'
        var dateParts = data.split('T')[0].split('-');
        return dateParts[2] + '-' + dateParts[1] + '-' + dateParts[0]; // dd-mm-yyyy format

    }
    $(document).ready(function () {

        $('#loadingGear').hide();
        if (pageid === 'shcenquiry') {

            shEnq();
        } else if (pageid === 'ShouldCostEntry') {

            vendorCost();
        }
        
       
    });

   
    function clearform() {

        $('#myForm')[0].reset();
    }

    function vendorCost() {

        var data = { enqNumber, userRoll };
        var jsonData = JSON.stringify(data);
        var obj = { pageid: pageid, prc: 'Prc_ShouldCost', jsonData: jsonData };

        ajaxcall(obj);
    }

    function shEnq() {
        var obj = { pageid: pageid, prc: 'Prc_ShouldCost', jsonData: '0' };
        ajaxcall(obj);
       
    }

    function ajaxcall(obj) {
        $.ajax({
            url: "/Home/GetPriceData",
            type: "GET",
            dataType: "json",
            contentType: "application/json;charset=utf-8",
            data: obj,
            success: function (response) {
                console.log(response);
                if (pageid === 'shcenquiry') {
                    shEnqDetails(response);
                } else if (pageid === 'ShouldCostEntry') {
                    if (userRoll === 'Executive') {
                        shEntryfnVendor(response);
                    } else {
                        shEntryfn(response);
                    }

                }
                $('#loadingGear').hide();
            },
            error: function (xhr, status, error) {
                // Handle AJAX error
                console.error("AJAX Error:", xhr, status, error);
                $('#loadingGear').hide();
            }
        });
    }

    function shEntryfnVendor(response) {
       
        $('#shVTableContainer').html('<table id="shVTable" class="cell-border" style="width:100%"><thead><tr>' +
            '<th style="text-align: center;">Vendor</th>' +
            '<th style="text-align: center;">Version</th>' +
            '<th style="text-align: center;">Purchase Material</th>' +
            '<th style="text-align: center;">RM Cost</th>' +
            '<th style="text-align: center;">Freight Inward</th>' +
            '<th style="text-align: center;">Variable OH</th>' +
            '<th style="text-align: center;">Fixed OH</th>' +
            '<th style="text-align: center;">Profit</th>' +
            '<th style="text-align: center;">Total</th>' +
            '</tr></thead><tbody></tbody></table>');

        $('#shVTable').DataTable({
            lengthChange: false,
            data: response,
            columns: [
                { data: 'Vendor' },
                { data: 'Version' },
                { data: 'Purchase_Material' },
                {
                    data: 'Purchase_Price',
                    render: function (data, type, row) {
                        if (type === 'display' || type === 'filter') {
                            // Format the data with fixed 2 decimal places
                            return parseFloat(data).toFixed(2);
                        }
                        return data; // Return the original data for other types
                    }
                },

                {
                    data: null, render: function () {
                        return '<input type="text" class="Freight-Inward" style="width:100%;  text-align:right; outline: none;  border: none;" />';
                    }
                },
                {
                    data: null, render: function () {
                        return '<input type="text" class="Variable-OH" style="width:100%;  text-align:right; outline: none;  border: none;" />';
                    }
                },
                {
                    data: null, render: function () {
                        return '<input type="text" class="Fixed-OH" style="width:100%;  text-align:right; outline: none;  border: none;" />';
                    }
                },
                {
                    data: null, render: function () {
                        return '<input type="text" class="Profit" style="width:100%;  text-align:right; outline: none;  border: none;" />';
                    }
                },
                {
                    data: null, render: function () {
                        return '<input type="text" class="Total" style="width:100%;  text-align:right; outline: none;  border: none; " readonly/>';
                    }
                }
            ],
            autoWidth: true,
            fixedColumns: {
                start: 3
            },
            scrollX: true,
            language: {
                paginate: {
                    next: '&#8594;', // or '→'
                    previous: '&#8592;' // or '←'
                }
            },
            ordering: false,
            createdRow: function (row, data, dataIndex) {
                // Bind change event listener to vendor price inputs within this row
                $(row).find('.Freight-Inward, .Variable-OH, .Fixed-OH, .Profit').on('input', function () {
                    var rmcost = data.Purchase_Price;
                    var Freight_Inward = parseFloat($(row).find('.Freight-Inward').val());
                    var Variable_OH = parseFloat($(row).find('.Variable-OH').val());
                    var Fixed_OH = parseFloat($(row).find('.Fixed-OH').val());
                    var Profit = parseFloat($(row).find('.Profit').val());

                    Freight_Inward = isNaN(Freight_Inward) ? 0 : Freight_Inward;
                    Variable_OH = isNaN(Variable_OH) ? 0 : Variable_OH;
                    Fixed_OH = isNaN(Fixed_OH) ? 0 : Fixed_OH;
                    Profit = isNaN(Profit) ? 0 : Profit;

                    var total = (rmcost + Freight_Inward + Variable_OH + Fixed_OH + Profit).toFixed(2);
                    $(row).find('.Total').val(total);
                });
            }

        });

        if (response.length > 0 && response[0].hasOwnProperty('Freight_Inward')) {
            //$('#Remarks').val(response[0].Remarks)
            $('#shVTableContainer table tbody tr').each(function (index) {
                // Get the current item from the response array
                var item = response[index];

                if (item) {
                    // Find the input fields in the current row
                    var $Freight_Inward = $(this).find('.Freight-Inward');
                    var $Variable_OH = $(this).find('.Variable-OH');
                    var $Fixed_OH = $(this).find('.Fixed-OH');
                    var $Profit = $(this).find('.Profit');
                    var $Total = $(this).find('.Total');

                    // Set the values from the response data to the input fields
                    $Freight_Inward.val(item.Freight_Inward);
                    $Variable_OH.val(item.Variable_OH);
                    $Fixed_OH.val(item.Fixed_OH);
                    $Profit.val(item.Profit);
                    $Total.val(item.Total.toFixed(2));

                }
            });
        }
    }

    function shEntryfn(response) {
        $('#shVTableContainer').html('<table id="shVTable" class="cell-border" style="width:100%"><thead><tr>' +
            '<th rowspan="2" style="text-align: center;">Vendor</th>' +
            '<th rowspan="2" style="text-align: center;">Version</th>' +
            '<th rowspan="2" style="text-align: center;">Purchase Material</th>' +
            '<th rowspan="2" style="text-align: center;">RM Cost</th>' +
            '<th colspan="5" style="text-align: center;">Vendor</th>' +
            '<th colspan="5" style="text-align: center;">Manager</th>' +
            '<th rowspan="2" style="text-align: center;">SOB</th>' +
            '</tr><tr>' +
            '<th style="text-align: center;">Freight Inward</th>' +
            '<th style="text-align: center;">Variable OH</th>' +
            '<th style="text-align: center;">Fixed OH</th>' +
            '<th style="text-align: center;">Profit</th>' +
            '<th style="text-align: center;">Total</th>' +
            '<th style="text-align: center;">Freight Inward</th>' +
            '<th style="text-align: center;">Variable OH</th>' +
            '<th style="text-align: center;">Fixed OH</th>' +
            '<th style="text-align: center;">Profit</th>' +
            '<th style="text-align: center;">Total</th>' +
            '</tr></thead><tbody></tbody></table>');

        $('#shVTable').DataTable({
            lengthChange: false,
            data: response,
            columns: [
                { data: 'Vendor' },
                { data: 'Version' },
                { data: 'Purchase_Material' },
                {
                    data: 'Purchase_Price',
                    render: function (data, type, row) {
                        if (type === 'display' || type === 'filter') {
                            // Format the data with fixed 2 decimal places
                            return parseFloat(data).toFixed(2);
                        }
                        return data; // Return the original data for other types
                    }
                },

                { data: 'Freight_Inward' },
                { data: 'Variable_OH' },
                { data: 'Fixed_OH' },
                { data: 'Profit' },
                {
                    data: 'Total1',
                    render: function (data, type, row) {
                        if (type === 'display' || type === 'filter') {
                            // Format the data with fixed 2 decimal places
                            return parseFloat(data).toFixed(2);
                        }
                        return data; // Return the original data for other types
                    }
                },

                {
                    data: null, render: function () {
                        return '<input type="text" class="Freight-Inward" style="width:100%; text-align:right; outline: none;  border: none;" />';
                    }
                },
                {
                    data: null, render: function () {
                        return '<input type="text" class="Variable-OH" style="width:100%; text-align:right; outline: none;  border: none;" />';
                    }
                },
                {
                    data: null, render: function () {
                        return '<input type="text" class="Fixed-OH" style="width:100%; text-align:right; outline: none;  border: none;" />';
                    }
                },
                {
                    data: null, render: function () {
                        return '<input type="text" class="Profit" style="width:100%; text-align:right; outline: none;  border: none;" />';
                    }
                },
                {
                    data: null, render: function () {
                        return '<input type="text" class="Total" style="width:100%; text-align:right; outline: none;  border: none;" readonly/>';
                    }
                },
                {
                    data: null, render: function () {
                        return '<input type="text" class="SOB" style="width:100%; text-align:right; outline: none;  border: none;" />';
                    }
                }
            ],
            autoWidth: true,
            language: {
                paginate: {
                    next: '&#8594;', // or '→'
                    previous: '&#8592;' // or '←'
                }
            },
            fixedColumns: {
                start: 3
            },
            scrollX: true,
            ordering: false,
            createdRow: function (row, data, dataIndex) {
                // Bind change event listener to vendor price inputs within this row
                $(row).find('.Freight-Inward, .Variable-OH, .Fixed-OH, .Profit').on('input', function () {
                    var rmcost = data.Purchase_Price;
                    var Freight_Inward = parseFloat($(row).find('.Freight-Inward').val());
                    var Variable_OH = parseFloat($(row).find('.Variable-OH').val());
                    var Fixed_OH = parseFloat($(row).find('.Fixed-OH').val());
                    var Profit = parseFloat($(row).find('.Profit').val());

                    Freight_Inward = isNaN(Freight_Inward) ? 0 : Freight_Inward;
                    Variable_OH = isNaN(Variable_OH) ? 0 : Variable_OH;
                    Fixed_OH = isNaN(Fixed_OH) ? 0 : Fixed_OH;
                    Profit = isNaN(Profit) ? 0 : Profit;



                    var total = (rmcost + Freight_Inward + Variable_OH + Fixed_OH + Profit).toFixed(2);
                    $(row).find('.Total').val(total);

                });
            }
        });

        if (response.length > 0 && response[0].hasOwnProperty('Freight_Inward1')) {
            //$('#Remarks').val(response[0].Remarks)
            $('#shVTableContainer table tbody tr').each(function (index) {
                // Get the current item from the response array
                var item = response[index];

                if (item) {
                    // Find the input fields in the current row
                    var $Freight_Inward = $(this).find('.Freight-Inward');
                    var $Variable_OH = $(this).find('.Variable-OH');
                    var $Fixed_OH = $(this).find('.Fixed-OH');
                    var $Profit = $(this).find('.Profit');
                    var $Sob = $(this).find('.SOB');
                    var $Total = $(this).find('.Total');

                    // Set the values from the response data to the input fields
                    $Freight_Inward.val(item.Freight_Inward1);
                    $Variable_OH.val(item.Variable_OH1);
                    $Fixed_OH.val(item.Fixed_OH1);
                    $Profit.val(item.Profit1);
                    $Sob.val(item.Sob);
                    $Total.val(item.Total.toFixed(2));
                }
            });
        }
    }


    function shEnqDetails(response) {
        console.log(response);
        $('#shcenqTableContainer').html('<table id="shEnqTable" class="cell-border" style="width:100%"><thead><tr>' +
            '<th style="text-align: center;">Enq Date</th>' +
            '<th style="text-align: center;">Enq Number</th>'+
            '</tr></thead><tbody></tbody></table>');

        $('#shEnqTable').DataTable({
            lengthChange: false,
            data: response,
            columns: [
                { data: 'EnqNumber' },
                {
                    data: 'EnqDate',
                    render: function (data) {
                        // Assuming data is in the format 'yyyy-mm-dd'
                        var dateParts = data.split('T')[0].split('-');
                        return dateParts[2] + '-' + dateParts[1] + '-' + dateParts[0]; // dd-mm-yyyy format
                    }
                },
                
            ],
            autoWidth: true,
            language: {
                paginate: {
                    next: '&#8594;', // or '→'
                    previous: '&#8592;' // or '←'
                }
            },
            ordering: false
        });

        $('#shEnqTable tbody').on('dblclick', 'tr', function () {
            var data = $('#shEnqTable').DataTable().row(this).data();
            // console.log(data);
            var enqNumber = data.EnqNumber;

            var url = '/Home/ShouldCostEntry?enqNumber=' + encodeURIComponent(enqNumber) ;
            window.location.href = url;

        });

    }

   
    function redirectToPage() {
        
        window.location.href = "/Home/ShouldCostImport";
    }

    function fnvalidate() {
        var allValid = true;
        $('#shVTableContainer table tbody tr').each(function () {
            var freight_Inward = $(this).find('.Freight-Inward').val();
            var variable_OH = $(this).find('.Variable-OH').val();
            var fixed_OH = $(this).find('.Fixed-OH').val();
            var profit = $(this).find('.Profit').val();
            var SOB = $(this).find('.SOB').val();
            if (userRoll === 'Executive') {
                if (freight_Inward.trim() === '' || variable_OH.trim() === '' || fixed_OH.trim() === '' || profit.trim() === '') {
                    allValid = false;
                    return false;
                }
            } else {
                if (freight_Inward.trim() === '' || variable_OH.trim() === '' || fixed_OH.trim() === '' || profit.trim() === '' || SOB.trim() === '') {
                    allValid = false;
                    return false;
                }
            }

            
        });

        Remarks = $('#Remarks').val();

       

        if (allValid) {
            var rowData = [];

            $('#shVTableContainer table tbody tr').each(function () {
              
                var freight_Inward = $(this).find('.Freight-Inward').val();
                var variable_OH = $(this).find('.Variable-OH').val();
                var fixed_OH = $(this).find('.Fixed-OH').val();
                var profit = $(this).find('.Profit').val();
                var sob = $(this).find('.SOB').val();
                var vendor = $(this).find('td:eq(0)').text(); 
                var enqVersion = $(this).find('td:eq(1)').text(); 
                var Material = $(this).find('td:eq(2)').text();

                var rowObject = {
                    vendor: vendor,
                    enqNumber: enqNumber,
                    enqVersion: enqVersion,
                    material: Material,
                    freight_Inward: freight_Inward,
                    variable_OH: variable_OH,
                    fixed_OH: fixed_OH,
                    profit: profit,
                    userRoll: userRoll,
                    sob : sob
                };

                rowData.push(rowObject);
            });

            var detailjson = JSON.stringify(rowData);
           
            var action = 'Insert';
            var prc = 'Prc_ShouldCost';
            var pgid = $('#pgid').val();
            var obj = { action, pgid,  prc, detailjson };

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
            toastr.error('Fields cannot be empty', 'Error');
        }
    }

}

