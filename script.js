// Initialize empty array for volume sets data
let volumeSetsData = [];
let batchResults = [];

// Event Listeners
document.getElementById('search-button').addEventListener('click', function(e) {
    e.preventDefault();
    const isbn = document.getElementById('isbn').value;
    if (isValidISBN13(isbn)) {
        searchISBN(isbn);
    } else {
        showInvalidISBNFeedback();
    }
});

document.getElementById('isbn').addEventListener('input', handleISBNInput);
document.getElementById('isbn').addEventListener('click', function(e) {
    e.target.select();
});
document.getElementById('clear-button').addEventListener('click', clearSearch);

document.getElementById('excel-file').addEventListener('change', handleFileInput);
document.getElementById('batch-clear-button').addEventListener('click', clearBatchSearch);
document.getElementById('download-results-button').addEventListener('click', downloadBatchResults);

// Data Fetching
async function fetchData() {
    try {
        const response = await fetch('vol_sets.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        volumeSetsData = await response.json();
        console.log('Loaded volume sets data:', volumeSetsData);
    } catch (error) {
        console.error('Error fetching data:', error);
        showAlert('Error loading data. Please try again later.', 'danger');
    }
}

// Input Handlers
function handleISBNInput(e) {
    const isbn = e.target.value.replace(/[-\s]/g, '');
    const isValid = isValidISBN13(isbn);
    e.target.classList.toggle('is-valid', isValid);
    e.target.classList.toggle('is-invalid', !isValid);
    document.getElementById('isbn-feedback').style.display = isValid ? 'none' : 'block';
    document.getElementById('search-button').disabled = !isValid;
}

// Search Function
function searchISBN(isbn) {
    if (!volumeSetsData || volumeSetsData.length === 0) {
        showAlert('Error: Volume sets data not loaded. Please refresh the page and try again.', 'danger');
        return;
    }

    const result = volumeSetsData.find(set => set.set_isbn === isbn);
    
    let resultHTML = '';
    if (result) {
        // Split volume titles
        const volumeTitles = result.volume_titles.split(' | ');
        
        // Split associated ISBNs - remove spaces and split by commas
        const isbns = result.associated_volumes.split(',').map(isbn => isbn.trim());
        
        // Create table rows, one for each ISBN-title pair
        const volumeRows = isbns.map((isbn, index) => {
            // Get the corresponding title (if available)
            const title = index < volumeTitles.length ? volumeTitles[index] : 'Unknown Title';
            
            return `
                <tr>
                    <td class="fw-bold" style="width: 175px;">${isbn}</td>
                    <td>${title}</td>
                </tr>
            `;
        }).join('');

        resultHTML = `
            <div class="alert alert-success mb-0">
                <p class="mb-2"><strong>Set Title:</strong> ${result.set_isbn_title}</p>
                <p class="mb-2"><strong>Volume Count:</strong> ${result.volume_count}</p>
                <div class="mt-3">
                    <strong>Volume Titles:</strong>
                    <table class="table table-striped table-bordered mt-2">
                        <tbody>
                            ${volumeRows}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    } else {
        resultHTML = '<div class="alert alert-warning mb-0">No volume set found for this ISBN</div>';
    }
    
    document.getElementById('result').innerHTML = resultHTML;
}

// Utility Functions
function isValidISBN13(isbn) {
    isbn = isbn.replace(/[-\s]/g, '');
    if (isbn.length !== 13 || !/^\d{13}$/.test(isbn)) return false;
    let sum = 0;
    for (let i = 0; i < 12; i++) {
        sum += (i % 2 === 0) ? parseInt(isbn[i]) : parseInt(isbn[i]) * 3;
    }
    let checksum = (10 - (sum % 10)) % 10;
    return isbn[12] === checksum.toString();
}

function showInvalidISBNFeedback() {
    const isbnInput = document.getElementById('isbn');
    isbnInput.classList.add('is-invalid');
    document.getElementById('isbn-feedback').style.display = 'block';
}

function showAlert(message, type) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
    const cardBody = document.querySelector('.card-body');
    cardBody.insertBefore(alertDiv, cardBody.firstChild);
}

function clearSearch() {
    const isbnInput = document.getElementById('isbn');
    isbnInput.value = '';
    isbnInput.classList.remove('is-valid', 'is-invalid');
    document.getElementById('isbn-feedback').style.display = 'none';
    document.getElementById('search-button').disabled = true;
    document.getElementById('result').innerHTML = '';
}

// Batch Search Functions
function handleFileInput(e) {
    const file = e.target.files[0];
    if (file) {
        handleBatchSearch();
    }
}

function handleBatchSearch() {
    const fileInput = document.getElementById('excel-file');
    const file = fileInput.files[0];
    if (!file) {
        showAlert('Please select an Excel file.', 'warning');
        return;
    }

    // Disable input and show processing
    fileInput.disabled = true;
    document.getElementById('batch-result').innerHTML = '<div class="alert alert-info">Processing file...</div>';

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, {type: 'array'});
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet);

            const isbns = jsonData.map(row => row.ISBN ? row.ISBN.toString().replace(/[-\s]/g, '') : null)
                .filter(isbn => isbn && isValidISBN13(isbn));
            if (isbns.length === 0) {
                document.getElementById('batch-result').innerHTML = '<div class="alert alert-warning mb-0">No valid ISBNs found in the file. Ensure there is a column named "ISBN" with 13-digit numbers.</div>';
                fileInput.disabled = false;
                return;
            }

            performBatchSearch(isbns);
        } catch (error) {
            console.error('Error parsing Excel file:', error);
            document.getElementById('batch-result').innerHTML = '<div class="alert alert-danger mb-0">Error parsing the Excel file. Please ensure it is a valid .xlsx or .xls file.</div>';
        } finally {
            fileInput.disabled = false;
        }
    };
    reader.readAsArrayBuffer(file);
}

function performBatchSearch(isbns) {
    if (!volumeSetsData || volumeSetsData.length === 0) {
        document.getElementById('batch-result').innerHTML = '<div class="alert alert-danger mb-0">Error: Volume sets data not loaded. Please refresh the page and try again.</div>';
        return;
    }

    batchResults = []; // Reset
    let resultsHTML = '<div class="accordion" id="batchResultsAccordion">';
    let foundCount = 0;

    isbns.forEach((isbn, index) => {
        const result = volumeSetsData.find(set => set.set_isbn === isbn);
        if (result) {
            foundCount++;
            const volumeTitles = result.volume_titles.split(' | ');
            const associatedIsbns = result.associated_volumes.split(',').map(isbn => isbn.trim());
            const volumeRows = associatedIsbns.map((volIsbn, idx) => {
                const title = idx < volumeTitles.length ? volumeTitles[idx] : 'Unknown Title';
                return `<tr><td class="fw-bold" style="width: 175px;">${volIsbn}</td><td>${title}</td></tr>`;
            }).join('');

            // Collect data for CSV
            associatedIsbns.forEach((volIsbn, idx) => {
                const title = idx < volumeTitles.length ? volumeTitles[idx] : 'Unknown Title';
                batchResults.push({
                    'Set ISBN': result.set_isbn,
                    'Set Title': result.set_isbn_title,
                    'Volume Count': result.volume_count,
                    'Volume ISBN': volIsbn,
                    'Volume Title': title
                });
            });

            resultsHTML += `
                <div class="accordion-item">
                    <h2 class="accordion-header" id="heading${index}">
                        <button class="accordion-button ${index > 0 ? 'collapsed' : ''}" type="button" data-bs-toggle="collapse" data-bs-target="#collapse${index}" aria-expanded="${index === 0 ? 'true' : 'false'}" aria-controls="collapse${index}">
                            ${isbn} - ${result.set_isbn_title}
                        </button>
                    </h2>
                    <div id="collapse${index}" class="accordion-collapse collapse ${index === 0 ? 'show' : ''}" aria-labelledby="heading${index}" data-bs-parent="#batchResultsAccordion">
                        <div class="accordion-body">
                            <p><strong>Volume Count:</strong> ${result.volume_count}</p>
                            <strong>Volume Titles:</strong>
                            <table class="table table-striped table-bordered mt-2">
                                <tbody>${volumeRows}</tbody>
                            </table>
                        </div>
                    </div>
                </div>
            `;
        }
    });

    resultsHTML += '</div>';

    if (foundCount === 0) {
        resultsHTML = '<div class="alert alert-warning mb-0">No volume sets found for the ISBNs in the file.</div>';
        document.getElementById('download-results-button').style.display = 'none';
    } else {
        resultsHTML = `<p class="mb-3">Found ${foundCount} out of ${isbns.length} ISBNs.</p>` + resultsHTML;
        document.getElementById('download-results-button').style.display = 'inline-block';
    }

    document.getElementById('batch-result').innerHTML = resultsHTML;
}

function clearBatchSearch() {
    document.getElementById('excel-file').value = '';
    document.getElementById('excel-file').disabled = false;
    document.getElementById('batch-result').innerHTML = '';
    document.getElementById('download-results-button').style.display = 'none';
    batchResults = [];
}

function downloadBatchResults() {
    if (batchResults.length === 0) {
        showAlert('No results to download.', 'warning');
        return;
    }

    // Create CSV content
    const headers = Object.keys(batchResults[0]);
    const csvContent = [
        headers.join(','),
        ...batchResults.map(row => headers.map(header => `"${row[header]}"`).join(','))
    ].join('\n');

    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'batch_search_results.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
    await fetchData();
    console.log('Volume Sets Search Tool initialized');
});