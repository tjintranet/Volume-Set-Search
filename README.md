# Volume Sets Search Tool

A web-based application that allows users to search for volume set information using ISBN-13 numbers. The tool provides detailed information about book sets including their titles, volume count, associated ISBNs, and individual volume titles.

## Features

- ISBN-13 validation with real-time feedback
- Search functionality for volume sets
- Detailed display of set information
- Responsive design using Bootstrap
- Clear and user-friendly interface

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
├── index.html          # Main HTML file with the user interface
├── script.js           # JavaScript file containing application logic
├── vol_sets.json      # JSON data file containing volume set information
└── README.md          # This documentation file
```

## Running the Application

1. Start your local web server
2. Navigate to the application directory in your web browser
3. The application will automatically load and initialize

Note: Due to browser security restrictions, you must serve the files through a web server. Opening the HTML file directly in a browser won't work due to CORS policies when loading the JSON file.

## Quick Start Guide

1. Open the application in your web browser
2. Enter a valid ISBN-13 in the search box
3. The input will be validated in real-time
4. Click the "Search" button to find volume set information
5. Results will display in the card below the search box
6. Use the "Clear" button to reset the form

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

## Sample ISBN for Testing

Use these ISBNs for testing the application:
- 9780367346898 (Cyber - 2 VOL SET)
- 9780415130547 (Bertrand Russell - 4 VOL SET)
- 9780415149181 (Ludwig Wittgenstein - 4 VOL SET)

## Dependencies

The application uses the following external libraries (loaded via CDN):
- Bootstrap 5.3.2
- Font Awesome 6.4.0
- Bootstrap Bundle with Popper

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

- ISBN validation follows the ISBN-13 standard
- The application uses async/await for data fetching
- Bootstrap is used for responsive design
- Font Awesome icons enhance the user interface

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
