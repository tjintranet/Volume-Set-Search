// Initialize empty array for volume sets data
let volumeSetsData = [];

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

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
    await fetchData();
    console.log('Volume Sets Search Tool initialized');
});