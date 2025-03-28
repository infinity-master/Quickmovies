 let userData = {};
    let userMobile = "";

    async function verifyNumber() {
        userMobile = document.getElementById('mobile').value;
        if (userMobile.length !== 10) {
            alert("Enter a valid 10-digit mobile number!");
            return;
        }

        let response = await fetch("https://raw.githubusercontent.com/infinity-master/Paid/main/database.json");
        let data = await response.json();

        if (data[userMobile]) {
            userData = data[userMobile]; // Store only the user's data
            showPage("page2"); // Move to activation code page
        } else {
            alert("Mobile number not found!");
        }
    }


function formatActivationCode(input) {
    input.value = input.value.toUpperCase().replace(/[^A-Z]/g, '').slice(0, 5);
}

function validatePin(input) {
    input.value = input.value.replace(/\D/g, '').slice(0, 4);
}
function toggleNewPin() {
    let pinInput = document.getElementById("newPin");
    let eyeIcon = document.querySelector(".eye-icon");

    if (pinInput.type === "password") {
        pinInput.type = "text";  // Show PIN
        eyeIcon.classList.replace("ri-eye-off-line", "ri-eye-line");
    } else {
        pinInput.type = "password";  // Hide PIN
        eyeIcon.classList.replace("ri-eye-line", "ri-eye-off-line");
    }
}
function closePopup() {
    document.getElementById("popup").style.display = "none";
}

    async function verifyActivationCode() {
    let enteredCode = document.getElementById('activationCode').value;
    if (enteredCode !== userData.activationCode) {
        alert("Incorrect activation code!");
        return;
    }

    try {
        let githubApiUrl = "https://raw.githubusercontent.com/infinity-master/Paid/main/database.json";
        let response = await fetch(githubApiUrl);
        let updatedData = await response.json();

        if (updatedData[userMobile]) {
            userData.pin = updatedData[userMobile].pin; // Always fetch latest PIN
            document.getElementById('currentPin').textContent = userData.pin;
            showPage("page3");
        } else {
            alert("Error fetching updated PIN!");
        }
    } catch (error) {
        alert("Failed to fetch updated PIN!");
    }
}
    function openPopup() {
        document.getElementById('popup').style.display = "block";
    }

    async function updatePin() {
    let newPin = document.getElementById('newPin').value;
    if (newPin.length < 4) {
        alert("PIN must be at least 4 digits!");
        return;
    }

    userData.pin = newPin; // Update only the PIN

    try {
        let githubApiUrl = "https://api.github.com/repos/infinity-master/Paid/contents/database.json";
        

        let fileResponse = await fetch(githubApiUrl, {
            headers: { "Authorization": `token ${apiKey}` }
        });
        let fileData = await fileResponse.json();
        let fileSha = fileData.sha;
        let currentData = JSON.parse(atob(fileData.content)); // Decode base64 content

        // Update only the PIN for the specific mobile number
        currentData[userMobile].pin = newPin;

        let updateData = {
            message: "Update PIN",
            content: btoa(JSON.stringify(currentData, null, 2)),
            sha: fileSha
        };

        let updateResponse = await fetch(githubApiUrl, {
            method: "PUT",
            headers: {
                "Authorization": `token ${apiKey}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(updateData)
        });

        if (updateResponse.ok) {
            alert("PIN Updated Successfully!");
            document.getElementById('currentPin').textContent = newPin;
            document.getElementById('popup').style.display = "none";

            // Redirect to home.html after 2 seconds
            setTimeout(() => {
                window.location.href = 'https://quickmovies.sytes.net';
            }, 2000);
        } else {
            alert("Error updating PIN!");
        }
    } catch (error) {
        alert("Failed to update PIN!");
    }
}

    async function showPage(pageId) {
    document.getElementById('page1').classList.add("hidden");
    document.getElementById('page2').classList.add("hidden");
    document.getElementById('page3').classList.add("hidden");

    if (pageId === "page3") {
        try {
            let githubApiUrl = "https://raw.githubusercontent.com/infinity-master/Paid/main/database.json";
            let response = await fetch(githubApiUrl);
            let updatedData = await response.json();

            if (updatedData[userMobile]) {
                userData.pin = updatedData[userMobile].pin; // Update PIN before showing Page 3
                document.getElementById('currentPin').textContent = userData.pin;
            } else {
                alert("Error fetching updated PIN!");
            }
        } catch (error) {
            alert("Failed to fetch updated PIN!");
        }
    }

    document.getElementById(pageId).classList.remove("hidden");
}
