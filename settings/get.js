const databaseUrl = "https://raw.githubusercontent.com/infinity-master/Paid/refs/heads/main/database.json";

        async function fetchUser() {
            const urlParams = new URLSearchParams(window.location.search);
            const activationCode = urlParams.get("User");

            if (!activationCode) {
                document.getElementById("status").innerText = "Activation Code Missing!";
                return;
            }

            try {
                const response = await fetch(databaseUrl);
                const data = await response.json();

                let user = null;
                for (let key in data) {
                    if (data[key].activationCode === activationCode) {
                        user = data[key];
                        break;
                    }
                }

                if (user) {
                    document.getElementById("mobile").innerText = user.mobile;
                    document.getElementById("pin").setAttribute("data-pin", user.pin);
                    document.getElementById("activationCode").innerText = user.activationCode;
                    document.getElementById("balance").innerText = user.balance;
                } else {
                    document.getElementById("status").innerText = "User Not Found!";
                }
            } catch (error) {
                document.getElementById("status").innerText = "Error fetching data!";
            }
        }

        function togglePin() {
            const pinElement = document.getElementById("pin");
            const eyeIcon = document.querySelector(".eye-icon");
            const actualPin = pinElement.getAttribute("data-pin");

            if (pinElement.innerText === "••••") {
                pinElement.innerText = actualPin;
                eyeIcon.classList.replace("ri-eye-off-line", "ri-eye-line");

                setTimeout(() => {
                    pinElement.innerText = "••••";
                    eyeIcon.classList.replace("ri-eye-line", "ri-eye-off-line");
                }, 1000);
            }
        }

        fetchUser();
