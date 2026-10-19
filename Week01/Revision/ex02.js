const paymentStatus = "APPROVED";
// const paymentStatus = "PENDING";
// const paymentStatus = "FAILED";

// Method 1: If-Else Statement
// Check the payment status and display the appropriate message
if (paymentStatus === "APPROVED") {
   console.log("Pet-care service confirmed");
 } else if (paymentStatus === "PENDING") {
   console.log("Payment is being processed");
 } else {
   console.log("Payment unsuccessful");
 }

// Method 2: Switch Statement
// Check the payment status and display the appropriate message
switch (paymentStatus) {
  case "APPROVED":
    // Code runs if paymentStatus === "APPROVED"
    console.log("Pet-care service confirmed");
    break;
  case "PENDING":
    // Code runs if paymentStatus === "PENDING"
    console.log("Payment is being processed");
    break;
  case "FAILED":
    // Code runs if paymentStatus === "FAILED"
    console.log("Payment unsuccessful");
    break;
  default:
    // Code runs if no cases match
    console.log("Unknown payment status");
}
