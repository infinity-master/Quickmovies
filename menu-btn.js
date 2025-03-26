function noAuthMenuToggle() {
    const menu = document.getElementById("navMenu");
    const menuIcon = document.getElementById("menuIcon");

    menu.classList.toggle("show");

    // Change menu icon based on visibility
    if (menu.classList.contains("show")) {
        menuIcon.classList.replace("ri-menu-line", "ri-close-line"); // Change to close icon
    } else {
        menuIcon.classList.replace("ri-close-line", "ri-menu-line"); // Change back to menu icon
    }
}

// Close menu when clicking a menu item (for iOS UX)
document.querySelectorAll(".hdMnLi").forEach(link => {
    link.addEventListener("click", () => {
        const menu = document.getElementById("navMenu");
        const menuIcon = document.getElementById("menuIcon");

        menu.classList.remove("show");
        menuIcon.classList.replace("ri-close-line", "ri-menu-line"); // Reset to menu icon
    });
});

// Close menu if user taps outside (iOS behavior)
document.addEventListener("click", function (event) {
    const menu = document.getElementById("navMenu");
    const button = document.querySelector(".menubtn");

    if (!menu.contains(event.target) && !button.contains(event.target)) {
        menu.classList.remove("show");

        // Ensure icon resets to menu when closing
        document.getElementById("menuIcon").classList.replace("ri-close-line", "ri-menu-line");
    }
});

// Active Tab Indicator
document.querySelectorAll(".hdMnLi").forEach(item => {
    item.addEventListener("click", function() {
        document.querySelectorAll(".hdMnLi").forEach(i => i.classList.remove("active"));
        this.classList.add("active");
    });
});
