//debugger
if ($('#pggrpid').val() === "Enquiry") {
    $('#loadingGear').hide();
   
    var i = 1; // Counter variable for steps
    
    var selectedData = []; // Array to store selected data
    var materialJson = {};


    function clearform() {
        $('#enqForm')[0].reset();
    }

    $(document).ready(function () {

        var userRoll = localStorage.getItem('userRoll');
        if (userRoll === 'Manager' || userRoll === 'Business Head') {
            $('#EnqEntry').hide();
        }

        dropDown();
        // Function to fetch data
        getData();
        function getData() {
            //console.log(usertype);
            var pageid = $('#pgid').val();
            var code = i;
           // console.log(i);
            var vendorcode = $('#vendorCode').val() || "1"; // Get vendor code or set default to "1"
            var fromDate = $('#fromDate').val();
            var toDate = $('#toDate').val();
            var efDate = $('#efDate').val();

            // Prepare material JSON object
            materialJson = {
                fromDate: fromDate,
                toDate: toDate,
                efDate: efDate,
                selectedData: selectedData
            };

            // Prepare data object for AJAX request
            var obj = { pageid: pageid, code: code, vendorcode: vendorcode, materialJson: JSON.stringify(materialJson) };
            $('#loadingGear').show();
            // AJAX request to fetch data
            $.ajax({
                url: "/Home/GetData",
                type: "GET",
                dataType: "json",
                contentType: "application/json;charset=utf-8",
                data: obj,
                success: function (response) {
                    $('#loadingGear').hide();
                    //console.log(response);
                    // Handle successful response
                    if (pageid === 'enquiry') {
                        if (i === 4) {
                            // Clear the form
                            $('#enqForm')[0].reset();
                            // Move back to the first step
                            $('.step').removeClass('active');
                            $('.step:first').addClass('active');
                            i = 1; // Reset step counter
                            getData();
                        } else {

                            if (response && response.length > 0) {
                                // Based on current step, call respective function
                                if (i === 1) {
                                    recentEnquires(response);

                                } else if (i === 2) {
                                    poMatDtls(response);
                                } else if (i === 3) {
                                    selectedPOMat(response);
                                } else {
                                    console.log("No data available in table");
                                }
                            } else {
                                console.log("No data available in table");
                            }
                        }
                    }
                },
                error: function (xhr, status, error) {
                    // Handle AJAX error
                    console.error("AJAX Error:", xhr, status, error);
                }
            });

        }
        // Event listener for "Next" button click
        $('.next').click(function () {
            var err = 1;
            //console.log(vendorcode);
            if (i === 1) {
                var vendorCode = $('#vendorCode').val();
                var fromDate = $('#fromDate').val();
                var toDate = $('#toDate').val();
                var efDate = $('#efDate').val();

                if (
                    vendorCode !== '' &&
                    fromDate !== '' &&
                    toDate !== '' &&
                    efDate !== '' &&
                    new Date(fromDate) > new Date('2018-01-01') &&
                    new Date(toDate) > new Date('2018-01-01') &&
                    new Date(efDate) > new Date('2018-01-01') &&
                    new Date(fromDate) < new Date(toDate)
                ) {
                    err = 0;
                } else {
                    if (new Date(efDate) < new Date('2018-01-01')) {
                        toastr.error('Effective Date should be greater than 2018-01-01', 'Error');
                    } else if (
                        vendorCode === '' ||
                        fromDate === '' ||
                        toDate === '' ||
                        efDate === ''
                    ) {
                        toastr.error('Fields cannot be empty or Invalid value selected', 'Error');
                    } else if (
                        new Date(fromDate) < new Date('2018-01-01') ||
                        new Date(toDate) < new Date('2018-01-01')
                    ) {
                        toastr.error('From Date and To Date should be greater than 2018-01-01', 'Error');
                    } else if (new Date(fromDate) > new Date(toDate)) {
                        toastr.error('From Date should be less than To Date', 'Error');
                    } else {
                        err = 0;
                    }
                }

                if (err === 0) {
                    var currentStep = $(this).closest('.step');
                    var nextStep = currentStep.next('.step');
                    currentStep.removeClass('active');
                    nextStep.addClass('active');
                    i++;
                }
            } else if (i === 2 && selectedData.length !== 0) {
                var currentStep = $(this).closest('.step');
                var nextStep = currentStep.next('.step');
                currentStep.removeClass('active');
                nextStep.addClass('active');
                i++;
            } else {
                toastr.error('Fields cannot be empty or Invalid value selected', 'Error');
            }


            if (i === 2 || i === 3) {
                getData();

            }

            return false;
        });
        // Event listener for "Previous" button click
        $('.prev').click(function () {
            var currentStep = $(this).closest('.step');
            var prevStep = currentStep.prev('.step');
            currentStep.removeClass('active');
            prevStep.addClass('active');
            i--;
            return false;
        });

        // Prevent form submission on submit button click
        $('#enqForm').submit(function (e) {
            e.preventDefault();

            selectedData = [];
            $('#poSelectedTable').DataTable().rows().every(function (index, element) {
                var rowData = this.data();
               /* var vendorPrice = parseFloat($(this.node()).find('.vendor-price').val());
                var vendorOHPrice = parseFloat($(this.node()).find('.vendor-oh-cost').val());

                var managerPrice = parseFloat($(this.node()).find('.manager-price').val());
                rowData.vendor_price = vendorPrice;
                rowData.Vendor_oh = vendorOHPrice;
                rowData.Vendor_Total = vendorPrice + vendorOHPrice;
                rowData.manager_price = managerPrice; */               
                selectedData.push(rowData);

            });

            /*
            // Check if vendorPrice is not empty
            var vendorPriceNotEmpty = selectedData.some(function (rowData) {
                return rowData.vendor_price !== undefined && !isNaN(rowData.vendor_price);
            });

            if (vendorPriceNotEmpty) {
                i = 4;
                getData();
                return false;
            } else {
                toastr.error('Vendor Price cannot be empty', 'Error');
                return false;
            }
            */
            i = 4;
            getData();

        });


    });

    // vendorCodes, poMatDtls, and selectedPOMat functions here


    function poMatDtls(response) {
        $('#POTableContainer').html('<table id="poTable" class="cell-border" style="width:100%"><thead><tr><th>PO Date</th><th>PO Number</th><th>Material</th><th>Description</th><th>Category</th><th>Type</th><th>Bench Mark</th><th>UOM</th></tr></thead><tbody></tbody></table>');

        $('#poTable').DataTable({
            lengthChange: false,
            data: response,
            columns: [
                {
                    data: 'PO_Date',
                    render: function (data) {
                        // Assuming data is in the format 'yyyy-mm-dd'
                        var dateParts = data.split('T')[0].split('-');
                        return dateParts[2] + '-' + dateParts[1] + '-' + dateParts[0]; // dd-mm-yyyy format
                    }
                },
                { data: 'PO_Number' },
                { data: 'Material_Code' },
                { data: 'Product_Description' },
                { data: 'Product_Category' },
                { data: 'Product_Type' },
                { data: 'Bench_Mark' },
                { data: 'PO_Base_UOM' },
            ],
            autoWidth: true,
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
            ordering: false,
            select: {
                style: 'multi'
            } // Enable multi-select
        });
        // Initialize selectedData array
        selectedData = [];

        // Event listener for row selection and deselection in PO table
        $('#poTable tbody').on('click', 'tr', function () {
            $(this).toggleClass('selected');

            // Get the data for the selected row
            var rowData = $('#poTable').DataTable().row($(this)).data();

            if ($(this).hasClass('selected')) {
                // If row is selected, add it to selectedData
                selectedData.push(rowData);
            } else {
                // If row is deselected, remove it from selectedData
                var index = selectedData.findIndex(function (item) {
                    return item.PO_Number === rowData.PO_Number; // Assuming PO_Number is unique identifier
                });
                if (index !== -1) {
                    selectedData.splice(index, 1);
                }
            }
            // console.log("Selected Data:", selectedData);
        });
    }


    function selectedPOMat(response) {
        var tableHtml = '<table id="poSelectedTable" class="cell-border" style="width:100%"><thead><tr><th>PO Number</th>'+
            '<th> Material</th><th>RM Cost</th><th>OH Cost</th><th>RM TOTAL</th><th>BM. Calc Price</th><th>OH Cost</th>'
            + '<th> Bench Mark Total</th><th>Bench Mark Diff</th></tr></thead><tbody></tbody></table>';


        // Set the HTML content of the container with the table HTML
        $('#SelectedPOContainer').html(tableHtml);

        // Define columns based on the user type
        var columns;
       
            columns = [
            
                { data: 'PO_Number' },
                { data: 'Mat' },
               // { data: 'Mat_Descrp' },
                { data: 'Curr_PO_RM_Cost' },
                { data: 'Curr_PO_OH_Cost' },
                { data: 'Rm_Total' },
                { data: 'Sys_Rm_Cost' }, //SYS CALC AMOUT
                { data: 'Curr_PO_OH_Cost' },
                { data: 'Sys_total_W_OH' },
                { data: 'Difference' },

            ];
        

        // Initialize DataTable with the defined columns
        $('#poSelectedTable').DataTable({
            lengthChange: false,
            data: response,
            columns: columns,
            autoWidth: false,
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
            },
            ordering: false,
            select: {
                style: 'multi'
            }, // Enable multi-select
           
        });
    }


    function recentEnquires(response) {
       

        $('#enqTableContainer').html('<table id="enqTable" class="cell-border" style="width:100%"><thead><tr><th>Enq. Date</th><th>Enquiry No.</th><th>Version</th><th>Vendor Code</th><th>Vendor Name</th><th>Status</th></tr></thead><tbody></tbody></table>');

        $('#enqTable').DataTable({
            lengthChange: false,
            data: response,
            language: {
                paginate: {
                    next: '&#8594;', // or '→'
                    previous: '&#8592;' // or '←' 
                }
            },
            columns: [
                {
                    data: 'Date',
                    render: function (data) {
                        // Assuming data is in the format 'yyyy-mm-dd'
                        var dateParts = data.split('T')[0].split('-');
                        return dateParts[2] + '-' + dateParts[1] + '-' + dateParts[0]; // dd-mm-yyyy format
                    }
                },
                { data: 'EnqNumber' },
                { data: 'Upload_Version' },
                { data: 'vendorcode' },
                { data: 'Vendor_Name' },
                { data: 'Approval_Status' },


            ],
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
            responsive: true,
            autoWidth: false,
            ordering: false
        });

        $('#enqTable tbody').on('dblclick', 'tr', function () {
            var data = $('#enqTable').DataTable().row(this).data();
           // console.log(data);
            var enqNumber = data.EnqNumber;
            var enqVersion = data.Upload_Version;
            var fromDate = data.fromDate;
            var toDate = data.toDate;
            var vendorCode = data.vendorcode;
            var Effective_Date = data.Effective_Date;
            //console.log(enqVersion);
            if (enqVersion === '' || enqVersion == null) {
                enqVersion = 0;
            }

            var url = '/Home/PriceEntry?enqNumber=' + encodeURIComponent(enqNumber)  + '&enqVersion=' + encodeURIComponent(enqVersion)
                + '&vendorCode=' + encodeURIComponent(vendorCode) + '&fromDate=' + encodeURIComponent(fromDate) + '&toDate=' + encodeURIComponent(toDate) + '&Effective_Date=' + encodeURIComponent(Effective_Date);
            window.location.href = url;

        });
    }
    function dropDown() {
        var pageid = $('#pgid').val();
        var param = '1';
        $('#loadingGear').show();
        var obj = { pageid: pageid, param:param }; // Specify your action value
        $('#loadingGear').show();
        $.ajax({
            url: "/Home/DropdownData",
            type: "GET",
            dataType: "json",
            contentType: "application/json;charset=utf-8",
            data: obj,
            success: function (response) {
             //   console.log(response);
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
             //   console.log(errorMessage);
                $('#loadingGear').hide();
            }
        });
    }

   
}