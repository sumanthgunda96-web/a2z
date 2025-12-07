# Google Sheets Troubleshooting Guide

Your Web App URL is configured: 
`https://script.google.com/macros/s/AKfycbyN8nZmlnbVSI2uktQxcOuyvxX6EzsifmbMyl_SyNGZuPI0TG-sBMwWO6UrXRoVZiWzXA/exec`

## Why Sheets Might Not Be Updating:

### 1. **Check Apps Script Deployment**

Go to your Google Apps Script:
https://script.google.com/

**Verify:**
- ✅ Script is deployed as Web App
- ✅ Execute as: **Me** (your account)
- ✅ Who has access: **Anyone**

### 2. **Test the Script Manually**

In your Google Sheet's Apps Script editor, click **Run** button and select `doPost`.

You'll get an error (expected) but it confirms the script is working.

### 3. **Check Browser Console**

When you place an order:
1. Open browser DevTools (F12)
2. Go to **Console** tab
3. Look for messages like:
   - `📊 Logging order to Google Sheets:` (should show order data)
   - `✅ Order logged to Google Sheets successfully!`
   - OR `⚠️ Google Sheets not configured, skipping...`

### 4. **Verify Sheet Names**

In your Google Sheet, make sure you have TWO sheets with EXACT names:
- **Orders** (not "orders" or "Order")
- **Users** (not "users" or "User")

### 5. **Check Apps Script Code**

Your Apps Script should look EXACTLY like this:

```javascript
function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet();
    var data = JSON.parse(e.postData.contents);
    
    if (data.type === 'order') {
      var ordersSheet = sheet.getSheetByName('Orders');
      if (!ordersSheet) {
        return ContentService.createTextOutput(JSON.stringify({
          success: false,
          error: 'Orders sheet not found'
        }));
      }
      
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
      
      return ContentService.createTextOutput(JSON.stringify({
        success: true,
        message: 'Order logged'
      }));
    } else if (data.type === 'user') {
      var usersSheet = sheet.getSheetByName('Users');
      if (!usersSheet) {
        return ContentService.createTextOutput(JSON.stringify({
          success: false,
          error: 'Users sheet not found'
        }));
      }
      
      usersSheet.appendRow([
        data.userId,
        data.name,
        data.email,
        data.signupDate,
        data.lastLogin
      ]);
      
      return ContentService.createTextOutput(JSON.stringify({
        success: true,
        message: 'User logged'
      }));
    }
    
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: 'Unknown type'
    }));
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.toString()
    }));
  }
}
```

### 6. **Re-deploy if Needed**

If you made changes to the Apps Script:
1. Click **Deploy** → **Manage deployments**
2. Click the **pencil icon** (edit)
3. Change **Version** to "New version"
4. Click **Deploy**
5. **Copy the NEW Web App URL**
6. Update `src/config/sheetsConfig.js` with the new URL

### 7. **Common Issues:**

❌ **Sheet names don't match exactly** → Fix: Rename to "Orders" and "Users"
❌ **Script not deployed** → Fix: Deploy as Web App
❌ **Wrong permissions** → Fix: Execute as "Me", Access "Anyone"
❌ **Old deployment** → Fix: Create new version
❌ **CORS issues** → This is normal with `mode: 'no-cors'`, data still goes through

### 8. **Quick Test:**

Open browser console and run this:

```javascript
fetch('https://script.google.com/macros/s/AKfycbyN8nZmlnbVSI2uktQxcOuyvxX6EzsifmbMyl_SyNGZuPI0TG-sBMwWO6UrXRoVZiWzXA/exec', {
  method: 'POST',
  mode: 'no-cors',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    type: 'order',
    orderId: 'TEST-123',
    date: new Date().toLocaleString(),
    customerName: 'Test Customer',
    email: 'test@example.com',
    phone: '1234567890',
    items: 'Test Item x1',
    total: '1000',
    paymentMethod: 'COD',
    address: 'Test Address',
    status: 'Pending'
  })
});
```

Then check your Google Sheet - a test row should appear!

---

## Most Likely Issue:

The sheet names are probably not exactly "Orders" and "Users". Check and rename them if needed!

---

## Alternative: Skip Google Sheets

Google Sheets is **optional**. Your orders are already saved in:
- Browser localStorage
- Visible in "My Orders" page
- Visible in Admin panel

You can manage orders without Google Sheets! It's just a nice-to-have feature.
