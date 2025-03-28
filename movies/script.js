const githubDatabaseURL = "https://raw.githubusercontent.com/infinity-master/Paid/refs/heads/main/database.json";
    const githubHistoryRepo = "https://api.github.com/repos/infinity-master/Paid/contents/transaction-history/";
    const githubDatabaseRepo = "https://api.github.com/repos/infinity-master/Paid/contents/database.json";
    const userCodeJsonURL = "https://growwsocial.github.io/Quickmovies/links/links.json";

    const urlParams = new URLSearchParams(window.location.search);
    const userCode = urlParams.get("code");

    function showPopup() {
        document.getElementById("popup").style.display = "block";
    }

    function closePopup() {
        document.getElementById("popup").style.display = "none";
    }

    function checkUserCodeExists(callback) {
        fetch(userCodeJsonURL)
            .then(response => response.json())
            .then(data => {
                if (data[userCode]) {
                    callback(true, data[userCode]);
                } else {
                    alert("Error: Invalid or expired link!");
                    callback(false, null);
                }
            })
            .catch(error => {
                alert("Error checking the user code. Try again later.");
                console.error(error);
                callback(false, null);
            });
    }

    function redirectToAds() {
        if (!userCode) {
            alert("Error: Invalid link format!");
            return;
        }

        checkUserCodeExists((exists) => {
            if (exists) {
                window.location.href = `https://quickmovies.sytes.net/ads/?code=${userCode}`;
            }
        });
    }

    function verifyCode() {
    let verifyBtn = document.getElementById("verifyBtn");
    verifyBtn.innerText = "Verifying...";
    verifyBtn.disabled = true;

    let code = document.getElementById("activationCode").value.trim();
    if (code === "") {
        alert("Please enter an activation code.");
        verifyBtn.innerText = "Verify & Purchase";
        verifyBtn.disabled = false;
        return;
    }

    checkUserCodeExists((exists) => {
        if (!exists) {
            verifyBtn.innerText = "Verify & Purchase";
            verifyBtn.disabled = false;
            return;
        }

        fetch(githubDatabaseURL)
            .then(response => response.json())
            .then(data => {
                let user = Object.values(data).find(user => user.activationCode === code);
                if (user) {
                    checkTransactionHistory(user.mobile, (alreadyPurchased) => {
                        if (alreadyPurchased) {
                            window.location.href = `https://quickmovies.sytes.net/fast/?code=${userCode}`;
                        } else if (user.balance >= 1) {
                            deductBalance(user.mobile, user.balance);
                        } else {
                            alert("Insufficient balance! You need at least ₹1.");
                            verifyBtn.innerText = "Verify & Purchase";
                            verifyBtn.disabled = false;
                        }
                    });
                } else {
                    alert("Invalid activation code!");
                    verifyBtn.innerText = "Verify & Purchase";
                    verifyBtn.disabled = false;
                }
            })
            .catch(error => {
                alert("Error verifying code. Try again later.");
                console.error(error);
                verifyBtn.innerText = "Verify & Purchase";
                verifyBtn.disabled = false;
            });
    });
}

    function deductBalance(mobile, balance) {
        let newBalance = balance - 1;

        fetch(githubDatabaseRepo, {
            method: "GET",
            headers: { Authorization: `token ${apiKey}` }
        })
        .then(response => response.json())
        .then(fileData => {
            let content = atob(fileData.content);
            let data = JSON.parse(content);

            if (!data[mobile]) {
                alert("User data not found!");
                return;
            }

            data[mobile].balance = newBalance;

            let updatedContent = btoa(unescape(encodeURIComponent(JSON.stringify(data, null, 2))));

            return fetch(githubDatabaseRepo, {
                method: "PUT",
                headers: {
                    "Authorization": `token ${apiKey}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    message: `Deducted ₹1 from ${mobile}'s balance`,
                    content: updatedContent,
                    sha: fileData.sha
                })
            });
        })
        .then(response => {
            if (response.ok) {
                saveTransactionHistory(mobile);
            } else {
                alert("Failed to update balance!");
            }
        })
        .catch(error => {
            alert("Error updating balance.");
            console.error(error);
        });
    }

    function saveTransactionHistory(mobile) {
        let transaction = {
            url: window.location.href,
            date: new Date().toISOString().split("T")[0],
            time: new Date().toLocaleTimeString(),
            amount: 1
        };

        let historyFile = `${mobile}.json`;
        let fileUrl = `${githubHistoryRepo}${historyFile}`;

        fetch(fileUrl, {
            method: "GET",
            headers: { Authorization: `token ${apiKey}` }
        })
        .then(response => {
            if (response.status === 404) return { transactions: [] };
            return response.json().then(fileData => ({
                transactions: JSON.parse(atob(fileData.content)).transactions,
                sha: fileData.sha
            }));
        })
        .then(existingData => {
            existingData.transactions.push(transaction);
            return fetch(fileUrl, {
                method: "PUT",
                headers: { "Authorization": `token ${apiKey}` },
                body: JSON.stringify({
                    message: "Updated transaction history",
                    content: btoa(JSON.stringify({ transactions: existingData.transactions }, null, 2)),
                    sha: existingData.sha
                })
            });
        })
        .then(() => {
            document.getElementById("verifyBtn").innerText = "Redirecting...";
            window.location.href = `https://quickmovies.hopto.org/fast/?code=${userCode}`;
        })
        .catch(error => {
            alert("Error saving transaction history.");
            console.error(error);
        });
    }
    
    function checkTransactionHistory(mobile, callback) {
    let historyFile = `${mobile}.json`;
    let fileUrl = `${githubHistoryRepo}${historyFile}`;

    fetch(fileUrl, {
        method: "GET",
        headers: { Authorization: `token ${apiKey}` }
    })
    .then(response => {
        if (response.status === 404) return callback(false); // No previous transactions
        return response.json().then(fileData => {
            let transactions = JSON.parse(atob(fileData.content)).transactions;
            let alreadyPurchased = transactions.some(tx => tx.url === window.location.href);
            callback(alreadyPurchased);
        });
    })
    .catch(error => {
        console.error("Error checking transaction history:", error);
        callback(false);
    });
}
