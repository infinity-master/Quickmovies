const githubHistoryRepo = "https://api.github.com/repos/infinity-master/Paid/contents/transaction-history/";

async function showTransactionHistory() {
    if (!userData || !userData.mobile) {
        alert("User not logged in!");
        return;
    }

    let historyFile = `${userData.mobile}.json`;
    let fileUrl = `${githubHistoryRepo}${historyFile}`;
    let transactionList = document.getElementById("transactionList");
    
    // Show loading text while fetching
    transactionList.innerHTML = "<p>Loading transactions...</p>";

    try {
        let response = await fetch(fileUrl, { headers: { Authorization: `token ${apiKey}` } });

        if (!response.ok) {
            throw new Error("Transaction history not found!");
        }

        let data = await response.json();

        if (data.content) {
            let decodedContent = atob(data.content);
            let transactions = JSON.parse(decodedContent).transactions;

            if (!transactions || transactions.length === 0) {
                transactionList.innerHTML = "<p>No transactions found.</p>";
                return;
            }

            let historyHTML = transactions.map(txn => {
                let amountText = `₹${txn.amount}`;
                if (txn.amount == 1) {
                    amountText = `<span style="color: red;">₹1</span>`;
                }
                return `
    <div class="transaction-item">
        <p><strong>Amount:</strong> ${amountText}</p>
        <p><strong>Date:</strong> ${txn.date} - ${txn.time}</p>
        <p><strong>Link:</strong> <a href="${txn.url}" target="_blank" class="transaction-link">Open Link</a></p>
    </div>
`;
            }).join("");

            transactionList.innerHTML = historyHTML;
        } else {
            transactionList.innerHTML = "<p>No transactions available.</p>";
        }

    } catch (error) {
        console.error("Transaction history not found!", error);
        transactionList.innerHTML = "<p>Transaction history not found!</p>";
    }

    // Show the popup smoothly
    const popup = document.getElementById("transactionPopup");
    popup.classList.add("show");
    popup.classList.remove("hidden");
}

function closeTransactionPopup() {
    const popup = document.getElementById("transactionPopup");
    popup.classList.remove("show");

    // Hide the popup smoothly after transition
    setTimeout(() => {
        popup.classList.add("hidden");
    }, 300);
}
