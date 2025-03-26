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

    // Register user with default balance
    users[mobile] = { mobile, pin, activationCode, balance: 10 };
    await updateGitHub(users);

    // Store user data in localStorage for auto-login
    userData = users[mobile];
    localStorage.setItem("loggedInUser", JSON.stringify(userData));

    alert("Registration successful!");
    showDashboard();
}
