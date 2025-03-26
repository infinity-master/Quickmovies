async function generateActivationCode() {
    const refreshIcon = document.querySelector(".refresh-icon");
    
    // Add rotation class
    refreshIcon.classList.add("rotate");

    // Fetch existing codes
    const existingCodes = await fetchExistingActivationCodes();
    let newCode;
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

    do {
        newCode = '';
        for (let i = 0; i < 5; i++) {
            newCode += characters.charAt(Math.floor(Math.random() * characters.length));
        }
    } while (existingCodes.includes(newCode));

    document.getElementById("activationCode").value = newCode;

    // Remove rotation class after animation completes
    setTimeout(() => {
        refreshIcon.classList.remove("rotate");
    }, 300); // Matches transition duration
}

async function fetchExistingActivationCodes() {
    const url = 'https://raw.githubusercontent.com/infinity-master/Paid/refs/heads/main/database.json';
    try {
        const response = await fetch(url);
        const data = await response.json();
        return Object.values(data).map(user => user.activationCode);
    } catch (error) {
        console.error("", error);
        return [];
    }
}
