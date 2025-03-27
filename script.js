const repoOwner = "infinity-master";
        const repoName = "Paid";
        const filePath = "database.json";
        let userData = {};

        async function fetchData() {
            const url = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${filePath}`;
            try {
                let response = await fetch(url, { headers: { Authorization: `token ${apiKey}` } });
                let data = await response.json();
                if (data.content) {
                    return JSON.parse(atob(data.content)); // Decode and parse data
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
                return {};
            }
        }

async function updateGitHub(data) {
            const apiUrl = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${filePath}`;
            let existingFile = await fetch(apiUrl, { headers: { Authorization: `token ${apiKey}` } }).then(res => res.json());

            let updatedContent = btoa(JSON.stringify(data, null, 2));
            let payload = {
                message: "Updated user data",
                content: updatedContent,
                sha: existingFile.sha
            };

            try {
                await fetch(apiUrl, {
                    method: "PUT",
                    headers: {
                        "Authorization": `token ${apiKey}`,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(payload)
                });
                console.log("GitHub data updated successfully!");
            } catch (error) {
                console.error("Error updating GitHub:", error);
            }
        }

        async function login() {
            let mobile = document.getElementById("userMobile").value.trim();
            let pin = document.getElementById("userPIN").value.trim();
            let users = await fetchData();

            if (!users[mobile]) {
                showError("User not found!");
                return;
            }

            if (users[mobile].pin !== pin) {
                showError("Incorrect PIN!");
                return;
            }

            userData = users[mobile];
            localStorage.setItem("loggedInUser", JSON.stringify(userData));
            showDashboard();
        }

        function showError(message) {
            let errorMsg = document.getElementById("errorMessage");
            errorMsg.innerText = message;
            errorMsg.style.display = "block";
        }

        function showDashboard() {
            document.getElementById("activationCodeText").innerText = userData.activationCode;

            function updateBalance() {
                fetchData().then(users => {
                    if (users[userData.mobile]) {
                        userData.balance = users[userData.mobile].balance;
                        document.getElementById("walletBalance").innerText = userData.balance;
                    }
                });
            }

            updateBalance();
            setInterval(updateBalance, 2000);

            document.getElementById("dashboard").classList.remove("hidden");
            document.getElementById("loginBox").classList.add("hidden");
            document.getElementById("registerBox").classList.add("hidden");
            document.getElementById("errorMessage").style.display = "none";
        }

        function toggleForms() {
            document.getElementById("registerBox").classList.toggle("hidden");
            document.getElementById("loginBox").classList.toggle("hidden");
        }

        function logout() {
            localStorage.removeItem("loggedInUser");
            document.getElementById("dashboard").classList.add("hidden");
            document.getElementById("loginBox").classList.remove("hidden");
        }

        function AddMoney() {
            let activationCode = document.getElementById("activationCodeText").innerText;
            window.location.href = `payment/?User=${activationCode}`;
        }

function settings() {
            let activationCode = document.getElementById("activationCodeText").innerText;
            window.location.href = `settings/?User=${activationCode}`;
        }

        window.onload = function () {
            let savedUser = localStorage.getItem("loggedInUser");
            if (savedUser) {
                userData = JSON.parse(savedUser);
                showDashboard();
            }
        };
