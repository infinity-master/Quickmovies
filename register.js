async function register() {
    let mobile = document.getElementById("regMobile").value.trim();
    let pin = document.getElementById("regPIN").value.trim();
    let activationCode = document.getElementById("activationCode").value.trim().toUpperCase();

    if (mobile.length !== 10 || pin.length < 4 || activationCode.length !== 5) {
        return alert("Invalid details! Please check again.");
    }

    let users = await fetchData();

    // Check if activation code already exists
    let activationExists = Object.values(users).some(user => user.activationCode === activationCode);
    if (activationExists) return alert("Activation Code Already Exists!");

    if (users[mobile]) return alert("User already exists!");

    // Add new user to the database
    users[mobile] = { mobile, pin, activationCode, balance: 10 }; // Initial balance ₹10
    await updateGitHub(users);

    alert("Registration successful! Logging in...");

    // **Instant Login Without Delay**
    userData = users[mobile];  
    localStorage.setItem("loggedInUser", JSON.stringify(userData));  
    showDashboard();
}
