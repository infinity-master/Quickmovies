function copyCode() {
    let codeText = document.getElementById("activationCodeText").innerText;
    let copyIcon = document.getElementById("copyIcon");
    let message = document.getElementById("copyMessage");

    navigator.clipboard.writeText(codeText).then(() => {
        
        copyIcon.classList.remove("ri-file-copy-line");
        copyIcon.classList.add("ri-check-line"); // Change to check icon

        setTimeout(() => {
            message.innerText = "";
            copyIcon.classList.remove("ri-check-line");
            copyIcon.classList.add("ri-file-copy-line"); // Revert back to copy icon
        }, 5000);
    });
}
