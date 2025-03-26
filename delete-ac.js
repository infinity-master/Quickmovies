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

    // Update database.json
    await updateGitHub(users);

    // Delete transaction history
    let historyFile = `${mobile}.json`;
    let fileUrl = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/transaction-history/${historyFile}`;

    try {
        let fileData = await fetch(fileUrl, { headers: { Authorization: `token ${apiKey}` } }).then(res => res.json());

        if (fileData.sha) {
            await fetch(fileUrl, {
                method: "DELETE",
                headers: {
                    "Authorization": `token ${apiKey}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    message: "Deleted transaction history",
                    sha: fileData.sha
                })
            });
            console.log("Transaction history deleted successfully.");
        }
    } catch (error) {
        console.error("Error deleting transaction history:", error);
    }

    alert("Your account has been deleted successfully.");
    logout();
}
