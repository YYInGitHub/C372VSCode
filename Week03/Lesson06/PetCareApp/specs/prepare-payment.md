# Feature: Prepare payment details

## 1. User goal
User is a pet owner and wants to make payment for a pet service.

## 2. Scope
Mocked API GET endpoint that allows the pet owner to select a service in the Service Catalogue, review the price before payment. 
Pet owner cannot select a pet service that is not found in the Service Catalogue.
Pet owner cannot specify his/her own price for the pet service. All prices should follow the amount specified in the Service Catalogue.

## 3. Request
HTTP method: GET
URL format: /payments/prepare/:serviceId
where the route parameter serviceId is a positive, canonical decimal integer: digits only, no sign, decimal point, whitespace, or leading zeros. 
Any serviceId that does not meet this format returns HTTP status 400 (see AC5–AC12 for examples). 
A well-formed ID absent from the catalogue, such as `999`, returns HTTP status 404.
Example: /payments/prepare/1

## 4. Service catalogue
The Service Catalogue contains the service IDs, names and prices
1. Vaccination, price = 35
2. Pet Grooming, price = 50
3. Boarding, price = 80

JSON Collection (Array of Objects)
[
  {
    "serviceId": 1,
    "name": "Vaccination",
    "price": 35
  },
  {
    "serviceId": 2,
    "name": "Pet Grooming",
    "price": 50
  },
  {
    "serviceId": 3,
    "name": "Boarding",
    "price": 80
  }
]

## 5. Successful response
HTTP status: 200, returned with 5 JSON fields for the service requested
The 5 JSON fields are as follows:
1. serviceId, data type = number 
2. serviceName, data type = string
3. servicePrice, data type = number
4. currency, data type = string, value = "SGD"
5. status, data type = string, value = "READY_FOR_PAYMENT"

Given the HTTP GET Request /payments/prepare/1, the expected JSON Response is as follows:
{
  "serviceId": 1,
  "serviceName": "Vaccination",
  "servicePrice": 35,
  "currency": "SGD",
  "status": "READY_FOR_PAYMENT"
}

## 6. Unsuccessful response
If the requested pet service does not exist, return HTTP status: 404 with the JSON Response: {"error":"Service not found."}
If serviceId does not meet the format defined in Section 3, return HTTP status: 400 with the JSON Response: {"error":"Service ID is incorrect."}
Each error response body contains exactly one field, "error", and no other fields.

## 7. Acceptance criteria
AC1: /payments/prepare/1 ( HTTP status: 200, JSON Response: { "serviceId": 1, "serviceName": "Vaccination", "servicePrice": 35, "currency": "SGD", "status": "READY_FOR_PAYMENT" } )
AC2: /payments/prepare/2 ( HTTP status: 200, JSON Response: { "serviceId": 2, "serviceName": "Pet Grooming", "servicePrice": 50, "currency": "SGD", "status": "READY_FOR_PAYMENT" } )
AC3: /payments/prepare/3 ( HTTP status: 200, JSON Response: { "serviceId": 3, "serviceName": "Boarding", "servicePrice": 80, "currency": "SGD", "status": "READY_FOR_PAYMENT" } )
AC4: /payments/prepare/999 ( HTTP status: 404, JSON Response: {"error":"Service not found."} )
AC5: /payments/prepare/1a ( HTTP status: 400, JSON Response: {"error":"Service ID is incorrect."} )
AC6: /payments/prepare/001 ( HTTP status: 400, JSON Response: {"error":"Service ID is incorrect."} )
AC7: /payments/prepare/-1 ( HTTP status: 400, JSON Response: {"error":"Service ID is incorrect."} )
AC8: /payments/prepare/+1 ( HTTP status: 400, JSON Response: {"error":"Service ID is incorrect."} )
AC9: /payments/prepare/1.01 ( HTTP status: 400, JSON Response: {"error":"Service ID is incorrect."} )
AC10: /payments/prepare/1%201 ( HTTP status: 400, JSON Response: {"error":"Service ID is incorrect."} )
AC11: /payments/prepare/%2011 ( HTTP status: 400, JSON Response: {"error":"Service ID is incorrect."} )
AC12: /payments/prepare/0 ( HTTP status: 400, JSON Response: {"error":"Service ID is incorrect."} )
AC13: Each successful request should return exactly 5 JSON fields, correct data types, catalogue values, currency as "SGD" and status as "READY_FOR_PAYMENT".

Authentication: No login required for this Mocked API GET endpoint.

Authorization: No role-based access control required for this Mocked API GET endpoint.

Out of Scope: Charging money, gateway integration, transactions, new database tables, EJS pages or changes to existing features.

## 8. Open questions
None.
