# Volume Sets Search Tool

A web-based application that allows users to search for volume set information using ISBN-13 numbers. The tool provides detailed information about book sets including their titles, volume count, associated ISBNs, and individual volume titles.

## Features

- **Single Search**: ISBN-13 validation with real-time feedback and individual set lookup
- **Batch Search**: Upload Excel files (.xlsx/.xls) with multiple ISBNs for bulk processing
- **Automatic Processing**: Batch search starts immediately upon file upload
- **CSV Export**: Download batch search results as a CSV file
- **Detailed Display**: Comprehensive information about book sets including titles, volume count, associated ISBNs, and individual volume titles
- **Responsive Design**: Mobile-friendly interface using Bootstrap
- **Accordion Results**: Expandable results view for batch searches
- **Clear and User-Friendly Interface**: Intuitive navigation with tabbed interface

## Prerequisites

- A modern web browser
- A local web server (required for JSON file loading)

## Installation

1. Clone or download this repository to your local machine
2. Place all files in your web server directory
3. Ensure the following files are present:
   - `index.html`
   - `script.js`
   - `vol_sets.json`

## File Structure

```
volume-sets-search/
│
├── index.html          # Main HTML file with the user interface and tabs
├── script.js           # JavaScript file containing application logic
├── vol_sets.json      # JSON data file containing volume set information
└── README.md          # This documentation file
```

## External Dependencies

The application loads the following libraries via CDN:
- **SheetJS (xlsx)**: For Excel file parsing in batch search
- **Bootstrap 5.3.2**: For responsive UI components and styling
- **Font Awesome 6.4.0**: For icons
- **Bootstrap Bundle with Popper**: For interactive components

## Running the Application

1. Start your local web server
2. Navigate to the application directory in your web browser
3. The application will automatically load and initialize

Note: Due to browser security restrictions, you must serve the files through a web server. Opening the HTML file directly in a browser won't work due to CORS policies when loading the JSON file.

## Quick Start Guide

### Single Search
1. Open the application in your web browser
2. Ensure you're on the "Single Search" tab (default)
3. Enter a valid ISBN-13 in the search box
4. The input will be validated in real-time
5. Click the "Search" button to find volume set information
6. Results will display in the card below the search box
7. Use the "Clear" button to reset the form

### Batch Search
1. Click on the "Batch Search" tab
2. Click "Choose File" and select an Excel file (.xlsx or .xls)
3. The file should have a column named "ISBN" containing 13-digit ISBN numbers
4. Search starts automatically upon file upload
5. Results will display in an expandable accordion format
6. Use "Download Results" to export findings as a CSV file
7. Use "Clear" to reset and upload a different file

## Example Data Format

The `vol_sets.json` file should contain an array of objects with the following structure:

```json
{
  "set_isbn": "9780367346898",
  "set_isbn_title": "Cyber - 2 VOL SET",
  "volume_count": 2,
  "associated_volumes": "9780367346935, 9780367346942",
  "volume_titles": "Cyber - V1 | Cyber - V2"
}
```

## CSV Export Format

When using batch search, results can be downloaded as a CSV file with the following columns:
- **Set ISBN**: The ISBN-13 of the volume set
- **Set Title**: The title of the volume set
- **Volume Count**: Number of volumes in the set
- **Volume ISBN**: Individual ISBN for each volume
- **Volume Title**: Title of each individual volume

Each volume in a set gets its own row, with set information repeated for easy analysis.

## Sample ISBN for Testing

Use these ISBNs for testing the application:
- 9780367346898 (Cyber - 2 VOL SET)
- 9780415130547 (Bertrand Russell - 4 VOL SET)
- 9780415149181 (Ludwig Wittgenstein - 4 VOL SET)

## Dependencies

The application uses the following external libraries (loaded via CDN):
- **SheetJS (xlsx)**: For parsing Excel files in batch search functionality
- **Bootstrap 5.3.2**: For responsive UI components and styling
- **Font Awesome 6.4.0**: For icons and visual enhancements
- **Bootstrap Bundle with Popper**: For interactive components like tabs and accordions

## Browser Support

The application is compatible with:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Error Handling

The application includes error handling for:
- Invalid ISBN numbers
- Failed data loading
- Missing or incorrect data format
- Network issues

## Development Notes

- **ISBN Validation**: Follows the ISBN-13 standard with checksum verification
- **File Processing**: Uses SheetJS library for robust Excel file parsing
- **Automatic Search**: Batch processing starts immediately upon file upload for better UX
- **CSV Export**: Generates properly formatted CSV files with quoted fields
- **Responsive Design**: Bootstrap framework ensures mobile compatibility
- **Async Operations**: Uses async/await for data fetching and file processing
- **Error Handling**: Comprehensive error messages for various failure scenarios
- **Tabbed Interface**: Bootstrap tabs separate single and batch search functionality

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
