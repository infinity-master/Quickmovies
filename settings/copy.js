 function copyActivationCode() {
        const activationCodeElement = document.getElementById("activationCode");
        const copyIcon = document.querySelector(".copy-icon");

        // Get the activation code text
        const activationCode = activationCodeElement.innerText;

        // Create a temporary textarea to copy the text
        const tempInput = document.createElement("textarea");
        tempInput.value = activationCode;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand("copy");
        document.body.removeChild(tempInput);

        // Change icon to checkmark
        copyIcon.classList.replace("ri-file-copy-line", "ri-check-line");

        // Revert back to copy icon after 2 seconds
        setTimeout(() => {
            copyIcon.classList.replace("ri-check-line", "ri-file-copy-line");
        }, 2000);
    }
