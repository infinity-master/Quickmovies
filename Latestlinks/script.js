function convertLink() {
      const input = document.getElementById("oldLink").value;
      try {
        const url = new URL(input);
        const code = url.searchParams.get("code");

        if (code) {
          const newUrl = `https://quickmovies.sytes.net/movies/?code=${code}`;
          const list = document.getElementById("linkList");

          const listItem = document.createElement("li");

          const link = document.createElement("a");
          link.href = newUrl;
          link.target = "_blank";
          link.textContent = newUrl;

          const copyBtn = document.createElement("button");
          copyBtn.textContent = "Copy";
          copyBtn.className = "copy-btn";
          copyBtn.onclick = () => {
            navigator.clipboard.writeText(newUrl);
            alert("Link copied to clipboard!");
          };
          const openBtn = document.createElement("button");
          openBtn.textContent = "Open";
          openBtn.className = "copy-btn";
          openBtn.style.backgroundColor = "#007aff";
          openBtn.style.marginLeft = "10px";
          openBtn.onclick = () => {
            window.open(newUrl, "_blank");
          };

          listItem.appendChild(link);
          listItem.appendChild(copyBtn);
          listItem.appendChild(openBtn);
          list.appendChild(listItem);
        } else {
          alert("Invalid link format. Please include ?code= in the URL.");
        }
      } catch {
        alert("Please enter a valid URL.");
      }
    }
