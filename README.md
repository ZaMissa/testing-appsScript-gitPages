# Apps Script + GitHub Pages + Google Sheets Integration Test

This project demonstrates a complete integration between:
- **Google Apps Script** (Backend API)
- **GitHub Pages** (Frontend)
- **Google Sheets** (Database)

## Project Structure

```
testing-appsScript-gitPages/
├── README.md                 # This file
├── apps-script/             # Google Apps Script backend
│   ├── Code.gs              # Main Apps Script code
│   └── README.md            # Apps Script setup instructions
├── frontend/                # GitHub Pages frontend
│   ├── index.html           # Main page
│   ├── styles.css           # Styling
│   ├── script.js            # Frontend JavaScript
│   └── README.md            # Frontend setup instructions
└── docs/                    # Documentation
    ├── setup-guide.md       # Complete setup guide
    └── api-reference.md     # API documentation
```

## Features

- ✅ **CRUD Operations**: Create, Read, Update, Delete records
- ✅ **Real-time Data**: Live updates from Google Sheets
- ✅ **Modern UI**: Responsive design with modern styling
- ✅ **Error Handling**: Comprehensive error management
- ✅ **CORS Support**: Cross-origin requests handled
- ✅ **Data Validation**: Input validation and sanitization

## Quick Start

1. **Setup Google Apps Script**:
   - Copy the code from `apps-script/Code.gs`
   - Create a new Apps Script project
   - Deploy as web app
   - Note the deployment URL

2. **Setup Google Sheets**:
   - Create a new Google Sheet
   - Add headers: `id`, `name`, `email`, `phone`, `created_at`
   - Share with your Apps Script project

3. **Deploy Frontend**:
   - Update the API URL in `frontend/script.js`
   - Push to GitHub
   - Enable GitHub Pages

## Detailed Setup

See the individual README files in each directory for detailed setup instructions.

## API Endpoints

- `GET /` - Get all records
- `POST /` - Create new record
- `PUT /{id}` - Update record
- `DELETE /{id}` - Delete record

## Technologies Used

- **Backend**: Google Apps Script (JavaScript)
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Database**: Google Sheets
- **Deployment**: GitHub Pages
- **API**: RESTful endpoints

## License

MIT License - feel free to use this as a template for your own projects! 