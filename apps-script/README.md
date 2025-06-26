# Google Apps Script Backend Setup

This guide will help you set up the Google Apps Script backend that provides REST API endpoints for your application.

## Prerequisites

- Google account
- Access to Google Apps Script
- A Google Sheets document

## Step 1: Create Google Sheets Database

1. **Create a new Google Sheet**:
   - Go to [Google Sheets](https://sheets.google.com)
   - Create a new spreadsheet
   - Rename the first sheet to "Data"

2. **Add Headers**:
   - In row 1, add these headers: `id`, `name`, `email`, `phone`, `created_at`
   - Format the header row (make it bold, add background color)

3. **Get Spreadsheet ID**:
   - Copy the URL of your spreadsheet
   - The ID is the long string between `/d/` and `/edit`
   - Example: `https://docs.google.com/spreadsheets/d/1ABC123...XYZ/edit` → ID is `1ABC123...XYZ`

## Step 2: Create Google Apps Script Project

1. **Go to Google Apps Script**:
   - Visit [script.google.com](https://script.google.com)
   - Click "New Project"

2. **Copy the Code**:
   - Replace the default `Code.gs` content with the code from this repository
   - Update the `SPREADSHEET_ID` constant with your actual spreadsheet ID

3. **Save the Project**:
   - Click "Save" (Ctrl+S)
   - Give your project a name (e.g., "CRUD API")

## Step 3: Deploy as Web App

1. **Deploy the Script**:
   - Click "Deploy" → "New deployment"
   - Choose "Web app" as the type
   - Set "Execute as" to "Me"
   - Set "Who has access" to "Anyone"
   - Click "Deploy"

2. **Authorize the App**:
   - Click "Authorize access"
   - Choose your Google account
   - Grant necessary permissions
   - Click "Advanced" → "Go to [Project Name] (unsafe)"
   - Click "Allow"

3. **Get the Web App URL**:
   - Copy the Web App URL (you'll need this for the frontend)

## Step 4: Test the API

You can test your API using tools like Postman or curl:

### Test GET (Get all records):
```bash
curl -X GET "YOUR_WEB_APP_URL"
```

### Test POST (Create record):
```bash
curl -X POST "YOUR_WEB_APP_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "123-456-7890"
  }'
```

### Test PUT (Update record):
```bash
curl -X PUT "YOUR_WEB_APP_URL?id=RECORD_ID" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Doe",
    "email": "jane@example.com"
  }'
```

### Test DELETE (Delete record):
```bash
curl -X DELETE "YOUR_WEB_APP_URL?id=RECORD_ID"
```

## Step 5: Initialize Spreadsheet (Optional)

If you want to format your spreadsheet automatically:

1. In the Apps Script editor, run the `setupSpreadsheet()` function
2. This will format the headers and set up the sheet structure

## Configuration Options

You can customize the following in `Code.gs`:

- `SPREADSHEET_ID`: Your Google Sheets document ID
- `SHEET_NAME`: The name of the sheet (default: "Data")

## Troubleshooting

### Common Issues:

1. **"Spreadsheet not found"**:
   - Check that the `SPREADSHEET_ID` is correct
   - Ensure the spreadsheet is shared with your Google account

2. **"Permission denied"**:
   - Make sure the web app is deployed with "Anyone" access
   - Check that you've authorized the necessary permissions

3. **CORS errors**:
   - The script includes CORS headers, but some browsers may still block requests
   - Test with a CORS-enabled tool like Postman first

4. **"Function not found"**:
   - Make sure all functions are saved in the Apps Script project
   - Check that the deployment is using the latest version

### Debugging:

1. **View Logs**:
   - In Apps Script editor, go to "Executions" to see function logs
   - Use `Logger.log()` statements to debug

2. **Test Functions**:
   - You can run individual functions from the Apps Script editor
   - Use the "Run" button next to function names

## Security Considerations

- The current setup allows public access to your API
- For production use, consider implementing authentication
- Be careful with sensitive data in Google Sheets
- Consider rate limiting for public APIs

## Next Steps

Once your Apps Script backend is working:

1. Update the frontend `script.js` with your Web App URL
2. Deploy the frontend to GitHub Pages
3. Test the complete integration

## Support

If you encounter issues:
1. Check the Apps Script execution logs
2. Verify all configuration values
3. Test individual functions in the Apps Script editor
4. Ensure proper permissions are set

## Automate Apps Script Project Setup with clasp

You can use the [clasp](https://github.com/google/clasp) tool to automate Apps Script project creation and code deployment.

### 1. Install clasp

```sh
npm install -g @google/clasp
clasp login
```

### 2. Initialize and Push Code

```sh
cd apps-script
clasp create --title "Apps Script CRUD API" --type sheets
clasp push
```

### 3. Manual Steps
- Open the Apps Script project in your browser (clasp will show the URL).
- Set your `SPREADSHEET_ID` in `Code.gs`.
- Deploy as web app (see above for instructions). 