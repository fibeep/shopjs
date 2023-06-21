var SHEET_ID = "xxx";
var SHEET_NAME = "xxx";
function doPost(e) {
  var data;
  try {
    data = JSON.parse(e.postData.contents);
  } catch (err) {
    var response = ContentService.createTextOutput(
      JSON.stringify({ result: "ok" })
    ).setMimeType(ContentService.MimeType.JSON);
    return response;
  }

  var id = data.id;

  if (isOrderExists(id)) {
    var response = ContentService.createTextOutput(
      JSON.stringify({ result: "ok" })
    ).setMimeType(ContentService.MimeType.JSON);
    return response;
  }

  var createdAt = data.created_at || "N/A";

  if (!isCreatedToday(createdAt)) {
    return ContentService.createTextOutput(
      JSON.stringify({ result: "ok" })
    ).setMimeType(ContentService.MimeType.JSON);
  }

  var customerFirstName =
    (data.customer &&
      data.customer.first_name &&
      data.customer.first_name.trim()) ||
    "N/A";
  var customerLastName = (data.customer && data.customer.last_name) || "N/A";
  var customerEmail = (data.customer && data.customer.email) || "N/A";
  var orderNumber = data.order_number || "N/A";
  var totalPrice = data.current_total_price || "N/A";
  var shippingAddress =
    (data.shipping_address && data.shipping_address.address1) || "N/A";
  var shippingCity =
    (data.shipping_address && data.shipping_address.city) || "N/A";
  var shippingCountry =
    (data.shipping_address && data.shipping_address.country) || "N/A";
  var shippingProvince =
    (data.shipping_address && data.shipping_address.province) || "N/A";
  var lineItems = data.line_items || "N/A";
  var shippingCost =
    (data.shipping_lines &&
      data.shipping_lines.length > 0 &&
      data.shipping_lines[0].price) ||
    "N/A";
  var orderNote = data.note || "N/A";
  var financialStatus = data.financial_status || "N/A";
  var shippingMethod =
    (data.shipping_lines &&
      data.shipping_lines.length > 0 &&
      data.shipping_lines[0].title) ||
    "N/A";
  var billingPhoneNumber =
    (data.billing_address &&
      data.billing_address.phone &&
      data.billing_address.phone.replace(/\D/g, "")) ||
    "N/A";
  var orderStatus = "Por Asignar";

  var orderStatusUrl = data.order_status_url || "N/A";
  var shopDomain = extractShopDomain(orderStatusUrl);

  // Redefine the shopDomain variable based on conditions
  if (shopDomain === "xxx") {
    shopDomain = "xxx";
  } else if (shopDomain === "xxx") {
    shopDomain = "xxx";
  }

  var ss = SpreadsheetApp.openById(SHEET_ID);
  var sheet = ss.getSheetByName(SHEET_NAME);

  sheet.appendRow([
    id,
    createdAt,
    customerFirstName,
    customerLastName,
    customerEmail,
    orderNumber,
    totalPrice,
    shippingAddress,
    shippingCity,
    shippingCountry,
    shippingProvince,
    lineItems,
    shippingCost,
    orderNote,
    financialStatus,
    shippingMethod,
    billingPhoneNumber,
    orderStatus,
    "",
    "",
    "",
    "",
    shopDomain,
  ]);

  var response = ContentService.createTextOutput(
    JSON.stringify({ result: "ok" })
  ).setMimeType(ContentService.MimeType.JSON);
  return response;
}

function isOrderExists(orderId) {
  var ss = SpreadsheetApp.openById(SHEET_ID);
  var sheet = ss.getSheetByName(SHEET_NAME);
  var data = sheet.getDataRange().getValues();

  for (var i = 1; i < data.length; i++) {
    // Start from row 1 to skip header row
    var existingOrderId = data[i][0]; // Assuming order ID is in the first column

    if (existingOrderId === orderId) {
      return true; // Order with the same ID already exists
    }
  }

  return false; // Order does not exist
}

function extractShopDomain(url) {
  var domainPattern = /https?:\/\/([\w.-]+)\/[\w\/]+/i;
  var match = url.match(domainPattern);
  if (match && match[1]) {
    return match[1];
  } else {
    return "N/A";
  }
}

function isCreatedToday(timestampStr) {
  var timezoneOffset = -5; // Set your timezone offset here
  var now = new Date();
  var createdAt = new Date(timestampStr);

  // Convert to the specific timezone
  now.setHours(now.getUTCHours() + timezoneOffset);
  createdAt.setHours(createdAt.getUTCHours() + timezoneOffset);

  // Compare date parts
  return (
    createdAt.getUTCFullYear() === now.getUTCFullYear() &&
    createdAt.getUTCMonth() === now.getUTCMonth() &&
    createdAt.getUTCDate() === now.getUTCDate()
  );
}
