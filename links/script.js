const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    const encod = "aHR0cHM6Ly9ncm93d3NvY2lhbC5naXRodWIuaW8vUXVpY2ttb3ZpZXMvbGlua3MvbGlua3MuanNvbg==";
const apiUrl = atob(encod);
    
    const countdownEl = document.querySelector(".countdown");
    const progressBar = document.getElementById("progress");
    let countdown = 10;

    function startCountdown() {
        const interval = setInterval(() => {
            countdown--;
            countdownEl.textContent = countdown;
            progressBar.style.width = `${(10 - countdown) * 10}%`;

            if (countdown === 0) {
                clearInterval(interval);
                fetch(apiUrl)
                    .then(response => response.json())
                    .then(data => {
                        if (data[code]) {
                            window.location.href = data[code];
                        } else {
                            document.body.innerHTML = `<p class="error">⚠️ Link has expired and has been removed by administration.</p>`;
                        }
                    })
                    .catch(error => {
                        document.body.innerHTML = `<p class="error">⚠️ Link has expired and has been removed by administration.</p>`;
                    });
            }
        }, 1000);
    }

    if (!code) {
        document.body.innerHTML = `<p class="error">⚠️ Link has expired and has been removed by administration.</p>`;
    } else {
        startCountdown();
    }
