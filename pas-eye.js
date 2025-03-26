function togglePassword(id, icon) {
        let input = document.getElementById(id);
        if (input.type === "password") {
            input.type = "text";
            icon.classList.replace("ri-eye-off-line", "ri-eye-line");
        } else {
            input.type = "password";
            icon.classList.replace("ri-eye-line", "ri-eye-off-line");
        }
    }
