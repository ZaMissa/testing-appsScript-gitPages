/**
 * Google Apps Script Backend API
 * Provides REST endpoints for CRUD operations on Google Sheets data
 */

// Configuration - Update these values
const SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID_HERE'; // Replace with your sheet ID
const SHEET_NAME = 'Data'; // Sheet name (default: 'Data')

/**
 * Main doGet function - handles GET requests
 */
function doGet(e) {
  try {
    // Set CORS headers
    const headers = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Content-Type': 'application/json'
    };
    
    // Get all records
    const records = getAllRecords();
    
    return ContentService
      .createTextOutput(JSON.stringify({
        success: true,
        data: records,
        message: 'Records retrieved successfully'
      }))
      .setMimeType(ContentService.MimeType.JSON)
      .setHeaders(headers);
      
  } catch (error) {
    return handleError(error);
  }
}

/**
 * Main doPost function - handles POST requests
 */
function doPost(e) {
  try {
    // Set CORS headers
    const headers = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Content-Type': 'application/json'
    };
    
    // Parse request data
    const data = JSON.parse(e.postData.contents);
    
    // Validate required fields
    if (!data.name || !data.email) {
      throw new Error('Name and email are required');
    }
    
    // Create new record
    const newRecord = createRecord(data);
    
    return ContentService
      .createTextOutput(JSON.stringify({
        success: true,
        data: newRecord,
        message: 'Record created successfully'
      }))
      .setMimeType(ContentService.MimeType.JSON)
      .setHeaders(headers);
      
  } catch (error) {
    return handleError(error);
  }
}

/**
 * Handle PUT requests (update records)
 */
function doPut(e) {
  try {
    // Set CORS headers
    const headers = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Content-Type': 'application/json'
    };
    
    // Parse request data
    const data = JSON.parse(e.postData.contents);
    const id = e.parameter.id || data.id;
    
    if (!id) {
      throw new Error('Record ID is required for update');
    }
    
    // Update record
    const updatedRecord = updateRecord(id, data);
    
    return ContentService
      .createTextOutput(JSON.stringify({
        success: true,
        data: updatedRecord,
        message: 'Record updated successfully'
      }))
      .setMimeType(ContentService.MimeType.JSON)
      .setHeaders(headers);
      
  } catch (error) {
    return handleError(error);
  }
}

/**
 * Handle DELETE requests
 */
function doDelete(e) {
  try {
    // Set CORS headers
    const headers = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Content-Type': 'application/json'
    };
    
    const id = e.parameter.id;
    
    if (!id) {
      throw new Error('Record ID is required for deletion');
    }
    
    // Delete record
    deleteRecord(id);
    
    return ContentService
      .createTextOutput(JSON.stringify({
        success: true,
        message: 'Record deleted successfully'
      }))
      .setMimeType(ContentService.MimeType.JSON)
      .setHeaders(headers);
      
  } catch (error) {
    return handleError(error);
  }
}

/**
 * Handle OPTIONS requests for CORS preflight
 */
function doOptions(e) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };
  
  return ContentService
    .createTextOutput('')
    .setHeaders(headers);
}

/**
 * Get all records from the spreadsheet
 */
function getAllRecords() {
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_NAME);
  const data = sheet.getDataRange().getValues();
  
  if (data.length <= 1) {
    return [];
  }
  
  const headers = data[0];
  const records = [];
  
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    const record = {};
    
    headers.forEach((header, index) => {
      record[header] = row[index];
    });
    
    records.push(record);
  }
  
  return records;
}

/**
 * Create a new record
 */
function createRecord(data) {
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_NAME);
  
  // Generate unique ID
  const id = Utilities.getUuid();
  const timestamp = new Date().toISOString();
  
  // Prepare row data
  const rowData = [
    id,
    data.name || '',
    data.email || '',
    data.phone || '',
    timestamp
  ];
  
  // Add to sheet
  sheet.appendRow(rowData);
  
  // Return created record
  return {
    id: id,
    name: data.name,
    email: data.email,
    phone: data.phone,
    created_at: timestamp
  };
}

/**
 * Update an existing record
 */
function updateRecord(id, data) {
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_NAME);
  const allData = sheet.getDataRange().getValues();
  
  // Find the row with the given ID
  let rowIndex = -1;
  for (let i = 1; i < allData.length; i++) {
    if (allData[i][0] === id) {
      rowIndex = i + 1; // +1 because sheet rows are 1-indexed
      break;
    }
  }
  
  if (rowIndex === -1) {
    throw new Error('Record not found');
  }
  
  // Update the row
  const rowData = [
    id,
    data.name || allData[rowIndex - 1][1],
    data.email || allData[rowIndex - 1][2],
    data.phone || allData[rowIndex - 1][3],
    allData[rowIndex - 1][4] // Keep original created_at
  ];
  
  sheet.getRange(rowIndex, 1, 1, rowData.length).setValues([rowData]);
  
  return {
    id: id,
    name: rowData[1],
    email: rowData[2],
    phone: rowData[3],
    created_at: rowData[4]
  };
}

/**
 * Delete a record
 */
function deleteRecord(id) {
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_NAME);
  const allData = sheet.getDataRange().getValues();
  
  // Find the row with the given ID
  let rowIndex = -1;
  for (let i = 1; i < allData.length; i++) {
    if (allData[i][0] === id) {
      rowIndex = i + 1; // +1 because sheet rows are 1-indexed
      break;
    }
  }
  
  if (rowIndex === -1) {
    throw new Error('Record not found');
  }
  
  // Delete the row
  sheet.deleteRow(rowIndex);
}

/**
 * Handle errors and return appropriate response
 */
function handleError(error) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };
  
  return ContentService
    .createTextOutput(JSON.stringify({
      success: false,
      error: error.message || 'An error occurred',
      timestamp: new Date().toISOString()
    }))
    .setMimeType(ContentService.MimeType.JSON)
    .setHeaders(headers);
}

/**
 * Setup function - run this once to initialize the spreadsheet
 */
function setupSpreadsheet() {
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_NAME);
  
  // Add headers if they don't exist
  const headers = ['id', 'name', 'email', 'phone', 'created_at'];
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  
  // Format headers
  sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
  sheet.getRange(1, 1, 1, headers.length).setBackground('#4285f4');
  sheet.getRange(1, 1, 1, headers.length).setFontColor('white');
  
  Logger.log('Spreadsheet setup completed!');
} 