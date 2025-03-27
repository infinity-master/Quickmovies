 // Function to update the "Add Money" link dynamically
    function updateAddMoneyLink() {
        const urlParams = new URLSearchParams(window.location.search);
        const activationCode = urlParams.get("User");

        if (activationCode) {
            document.getElementById("addMoneyLink").href = `https://quickmovies.sytes.net/payment/?User=${activationCode}`;
        } else {
            document.getElementById("addMoneyLink").href = "#"; // Default (if no activation code)
        }
    }

    updateAddMoneyLink(); // Call the function on page load
