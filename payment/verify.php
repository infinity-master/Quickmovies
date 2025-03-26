<?php
header("Content-Type: application/json");

// Paytm Merchant Credentials
$merchantId = "pFrxao17701984490551";
$merchantKey = "YOUR_MERCHANT_KEY"; // Replace with your Merchant Key
$apiUrl = "https://securegw.paytm.in/merchant-status/getTxnStatus";

// Get JSON input from frontend
$data = json_decode(file_get_contents("php://input"), true);
$orderId = $data["txnId"];

if (!$orderId) {
    echo json_encode(["status" => "TXN_FAILURE", "message" => "Invalid Transaction ID"]);
    exit;
}

// Generate Checksum
$paytmParams = array("mid" => $merchantId, "orderId" => $orderId);
$checksum = hash_hmac("sha256", json_encode($paytmParams), $merchantKey);

// API Request Payload
$payload = json_encode([
    "body" => $paytmParams,
    "head" => ["signature" => $checksum]
]);

// Send request to Paytm API
$ch = curl_init($apiUrl);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Content-Type: application/json"]);
$response = curl_exec($ch);
curl_close($ch);

// Process API Response
$result = json_decode($response, true);
if (isset($result["body"]["status"]) && $result["body"]["status"] === "TXN_SUCCESS") {
    echo json_encode([
        "status" => "TXN_SUCCESS",
        "amount" => $result["body"]["txnAmount"]
    ]);
} else {
    echo json_encode(["status" => "TXN_FAILURE"]);
}
?>
