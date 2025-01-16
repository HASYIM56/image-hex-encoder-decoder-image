$(document).ready(function () {
    $('#imageForm').on('submit', function (e) {
        e.preventDefault();

        const fileInput = $('#fileInput')[0].files[0];
        const mode = $('#modeSelect').val();

        if (!fileInput) {
            alert("Please select a file.");
            return;
        }

        if (mode === 'encode') {
            encodeImageToHex(fileInput);
        } else if (mode === 'decode') {
            decodeHexToImage(fileInput);
        }
    });

    function encodeImageToHex(fileInput) {
        $('#loadingContainer').show();
        $('#loadingBar').css('width', '0%');
        $('#loadingText').text('0%');

        const reader = new FileReader();
        reader.onload = function(event) {
            const base64File = event.target.result.split(',')[1];

            let hexData = "";
            const imageData = new Uint8Array(atob(base64File).split("").map(c => c.charCodeAt(0)));

            imageData.forEach(byte => {
                hexData += byte.toString(16).padStart(2, "0");
            });

            const blob = new Blob([hexData], { type: "text/plain" });
            const fileUrl = URL.createObjectURL(blob);

            $('#loadingContainer').hide();
            $('#statusMessage').text("Image encoded to HEX successfully.");
            $('#downloadContainer').show();
            $('#downloadEncodedButton').show(); // Show the encoded download button
            $('#downloadButton').hide(); // Hide the decoded download button

            $('#downloadEncodedButton').click(function() {
                const link = document.createElement('a');
                link.href = fileUrl;
                link.download = "files_H56.txt";
                link.click();
            });
        };

        reader.readAsDataURL(fileInput);
    }

    function decodeHexToImage(fileInput) {
        $('#loadingContainer').show();
        $('#loadingBar').css('width', '0%');
        $('#loadingText').text('0%');

        const reader = new FileReader();
        reader.onload = function(event) {
            const hexData = event.target.result.trim();

            let binaryData = '';
            for (let i = 0; i < hexData.length; i += 2) {
                binaryData += String.fromCharCode(parseInt(hexData.substr(i, 2), 16));
            }

            const byteArray = new Uint8Array(binaryData.length);
            for (let i = 0; i < binaryData.length; i++) {
                byteArray[i] = binaryData.charCodeAt(i);
            }

            const blob = new Blob([byteArray], { type: "image/png" });
            const url = URL.createObjectURL(blob);

            $('#loadingContainer').hide();
            $('#statusMessage').text("HEX decoded to image successfully.");
            $('#imageContainer').show();
            $('#decodedImage').attr('src', url);

            $('#downloadContainer').show();
            $('#downloadButton').show(); // Show the decoded download button
            $('#downloadEncodedButton').hide(); // Hide the encoded download button

            $('#downloadButton').click(function() {
                const link = document.createElement('a');
                link.href = url;
                link.download = "Files_Decoded_H56.png";  // Change the filename here
                link.click();
            });
        };

        reader.readAsText(fileInput);
    }
});