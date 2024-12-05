if ($('#pggrpid').val() === 'MasterImports') {
    console.log('MasterImports');
    $('#loadingGear').hide();
    function clearform() {
        $('#myForm')[0].reset();
        fileList.innerHTML = '';
    }


    var filesDropped = false;
    var dropedfile;

    const dropZone = document.getElementById('dropZone');
    const fileList = document.getElementById('fileList');
    const fileInput = document.getElementById('file-input');

    // Event listener for drop zone
    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('drop-zone--over');
    });

    dropZone.addEventListener('dragleave', () => {
        dropZone.classList.remove('drop-zone--over');
    });

    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('drop-zone--over');

        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFiles(files);
            // Update dropedfile variable
            dropedfile = files;
            filesDropped = true;
        }
    });

    // Event listener for file input change
    fileInput.addEventListener('change', () => {
        dropedfile = fileInput.files;
        if (dropedfile.length > 0) {
            handleFiles(dropedfile);
            filesDropped = false;
        }
    });

    // Function to handle files
    function handleFiles(files) {
        fileList.innerHTML = '';
        for (const file of files) {
            const listItem = document.createElement('div');
            listItem.textContent = file.name;
            fileList.appendChild(listItem);
        }
    }

    function fnvalidate() {
        var category = $('#Master_Type').val();
        var file;
        if (filesDropped) {
            file = dropedfile[0];
        } else {
            file = $('#file-input')[0].files[0];
        }
        console.log(file.name);
        var formData = new FormData();
        formData.append('category', category);
        formData.append('file', file);
        $('#loadingGear').show();
        if (category && file && category !== null && file !== null) {
            $.ajax({
                url: "/Home/ImportMaster",
                type: 'POST',
                data: formData,
                contentType: false,
                processData: false,
                success: function (result) {
                    if (result.success) {
                        $('#loadingGear').hide();
                        toastr.success(result.message, 'Success');
                        $('#myForm')[0].reset();
                        fileList.innerHTML = '';
                    } else {
                        $('#loadingGear').hide();
                        toastr.error(result.message, 'Error');
                        $('#myForm')[0].reset();
                        fileList.innerHTML = '';
                    }
                },
                error: function (err) {
                    $('#loadingGear').hide();
                    // Access the error message from the responseText property
                    var errorMessage = err.responseText;
                    alert("Failed to connect: " + errorMessage);
                    console.log(errorMessage);
                    $('#myForm')[0].reset();
                    fileList.innerHTML = '';// Reset the form
                }
            });
        } else {
            $('#loadingGear').hide();
            toastr.error('Fields / Files cannot be empty', 'Error');
        }
    }
}