# Google Sheets Integration Setup

This will automatically save all orders and user signups to Google Sheets!

## Step 1: Create Google Sheets

1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet called **"Gunda Srinivas Orders & Users"**
3. Create **TWO sheets** (tabs at the bottom):
   - **Sheet 1**: Rename to **"Orders"**
   - **Sheet 2**: Rename to **"Users"**

### Orders Sheet Headers (Row 1):
```
Order ID | Date | Customer Name | Email | Phone | Items | Total | Payment Method | Address | Status
```

### Users Sheet Headers (Row 1):
```
User ID | Name | Email | Signup Date | Last Login
```

## Step 2: Get Google Sheets API Credentials

### Option A: Using Google Apps Script (EASIEST - No API Key Needed!)

1. In your Google Sheet, click **Extensions** > **Apps Script**
2. Delete the default code and paste this:

```javascript
function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet();
  var data = JSON.parse(e.postData.contents);
  
  if (data.type === 'order') {
    var ordersSheet = sheet.getSheetByName('Orders');
    ordersSheet.appendRow([
      data.orderId,
      data.date,
      data.customerName,
      data.email,
      data.phone,
      data.items,
      data.total,
      data.paymentMethod,
      data.address,
      data.status
    ]);
  } else if (data.type === 'user') {
    var usersSheet = sheet.getSheetByName('Users');
    usersSheet.appendRow([
      data.userId,
      data.name,
      data.email,
      data.signupDate,
      data.lastLogin
    ]);
  }
  
  return ContentService.createTextOutput(JSON.stringify({success: true}));
}
```

3. Click **Deploy** > **New deployment**
4. Choose **Web app**
5. Set:
   - Execute as: **Me**
   - Who has access: **Anyone**
6. Click **Deploy**
7. **Copy the Web App URL** (looks like: `https://script.google.com/macros/s/ABC123.../exec`)

## Step 3: Update Configuration

Open `src/config/sheetsConfig.js` and paste your Web App URL.

## Step 4: Test

1. Place a test order
2. Check your Google Sheet - the order should appear!
3. Register a new user
4. Check the Users sheet - the signup should appear!

## Benefits

✅ All orders in one place
✅ Easy to track and process
✅ Can filter, sort, and analyze
✅ Share with team members
✅ Export to Excel if needed
✅ No email limits!

## Troubleshooting

If data doesn't appear:
1. Check browser console for errors
2. Make sure the Web App URL is correct
3. Verify the sheet names are exactly "Orders" and "Users"
4. Check that the Apps Script is deployed
