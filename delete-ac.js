async function deleteAccount() {
    if (!userData.mobile) {
        alert("User not logged in!");
        return;
    }

    let confirmDelete = confirm("Are you sure you want to delete your account? This action is irreversible.");
    if (!confirmDelete) return;

    let users = await fetchData();
    let mobile = userData.mobile;

    if (!users[mobile]) {
        alert("User not found!");
        return;
    }

    // Remove user from database
    delete users[mobile];

    // Update database.json on GitHub
    try {
        console.log("Updating database.json on GitHub...");
        
        let fileUrl = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/database.json`;

        // Fetch the latest SHA of database.json
        let fileData = await fetch(fileUrl, {
            headers: { Authorization: `token ${apiKey}` }
        }).then(res => res.json());

        if (!fileData.sha) {
            console.error("Error fetching database.json SHA:", fileData);
            alert("Failed to delete account. Please try again later.");
            return;
        }

        let response = await fetch(fileUrl, {
            method: "PUT",
            headers: {
                "Authorization": `token ${apiKey}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                message: "Deleted user account",
                content: btoa(JSON.stringify(users, null, 2)), // Convert to Base64
                sha: fileData.sha
            })
        });

        let result = await response.json();
        if (!result.commit) {
            console.error("Error updating database.json:", result);
            alert("Failed to delete account. Please try again later.");
            return;
        }

        console.log("User data deleted successfully from database.");
    } catch (error) {
        console.error("GitHub API error:", error);
        alert("Failed to delete account. Please try again later.");
        return;
    }

    // Delete transaction history file
    let historyFile = `${mobile}.json`;
    let historyUrl = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/transaction-history/${historyFile}`;

    try {
        let historyData = await fetch(historyUrl, {
            headers: { Authorization: `token ${apiKey}` }
        }).then(res => res.json());

        if (historyData.sha) {
            await fetch(historyUrl, {
                method: "DELETE",
                headers: {
                    "Authorization": `token ${apiKey}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    message: "Deleted transaction history",
                    sha: historyData.sha
                })
            });
            console.log("Transaction history deleted successfully.");
        } else {
            console.warn("Transaction history file not found, skipping deletion.");
        }
    } catch (error) {
        console.error("Error deleting transaction history:", error);
    }

    alert("Your account has been deleted successfully.");
    logout();
}
