// Link Management System
let customLinks = JSON.parse(localStorage.getItem('careerPath_customLinks') || '[]');

// Open link management modal
function openLinkManagement() {
  const modal = new bootstrap.Modal(document.getElementById('linkManagementModal'));
  modal.show();
  displayCustomLinks();
}

// Add custom link
function addCustomLink() {
  const title = document.getElementById('linkTitle').value.trim();
  const url = document.getElementById('linkUrl').value.trim();
  const category = document.getElementById('linkCategory').value;
  
  if (!title || !url) {
    showErrorMessage('Please fill in all required fields');
    return;
  }
  
  // Validate URL
  try {
    new URL(url);
  } catch (e) {
    showErrorMessage('Please enter a valid URL');
    return;
  }
  
  const newLink = {
    id: Date.now().toString(),
    title,
    url,
    category,
    addedAt: new Date().toISOString()
  };
  
  customLinks.push(newLink);
  localStorage.setItem('careerPath_customLinks', JSON.stringify(customLinks));
  
  // Clear form
  document.getElementById('linkTitle').value = '';
  document.getElementById('linkUrl').value = '';
  document.getElementById('linkCategory').value = 'schools';
  
  displayCustomLinks();
  showSuccessMessage('Link added successfully!');
}

// Display custom links
function displayCustomLinks() {
  const linksList = document.getElementById('customLinksList');
  
  if (customLinks.length === 0) {
    linksList.innerHTML = '<p class="text-center text-muted">No custom links added yet</p>';
    return;
  }
  
  linksList.innerHTML = customLinks.map(link => `
    <div class="custom-link-item">
      <div class="custom-link-info">
        <h6>${link.title}</h6>
        <small>${link.url}</small>
        <br>
        <small class="text-muted">Category: ${link.category} | Added: ${new Date(link.addedAt).toLocaleDateString()}</small>
      </div>
      <div class="link-actions">
        <button class="btn btn-sm btn-outline-primary" onclick="openLink('${link.url}')">
          <i class="fas fa-external-link-alt"></i>
        </button>
        <button class="btn btn-sm btn-outline-warning" onclick="editCustomLink('${link.id}')">
          <i class="fas fa-edit"></i>
        </button>
        <button class="btn btn-sm btn-outline-danger" onclick="deleteCustomLink('${link.id}')">
          <i class="fas fa-trash"></i>
        </button>
      </div>
    </div>
  `).join('');
}

// Open link in new tab
function openLink(url) {
  window.open(url, '_blank');
}

// Edit custom link
function editCustomLink(linkId) {
  const link = customLinks.find(l => l.id === linkId);
  if (!link) return;
  
  document.getElementById('linkTitle').value = link.title;
  document.getElementById('linkUrl').value = link.url;
  document.getElementById('linkCategory').value = link.category;
  
  // Remove the old link
  deleteCustomLink(linkId, false);
  
  showSuccessMessage('Link loaded for editing. Make changes and click "Add Link" to save.');
}

// Delete custom link
function deleteCustomLink(linkId, showConfirm = true) {
  if (showConfirm && !confirm('Are you sure you want to delete this link?')) {
    return;
  }
  
  customLinks = customLinks.filter(link => link.id !== linkId);
  localStorage.setItem('careerPath_customLinks', JSON.stringify(customLinks));
  
  displayCustomLinks();
  
  if (showConfirm) {
    showSuccessMessage('Link deleted successfully!');
  }
}

// Export links to JSON
function exportLinks() {
  if (customLinks.length === 0) {
    showErrorMessage('No links to export');
    return;
  }
  
  const dataStr = JSON.stringify(customLinks, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = 'careerpath_custom_links.json';
  link.click();
  
  URL.revokeObjectURL(url);
  showSuccessMessage('Links exported successfully!');
}

// Import links from JSON
function importLinks(event) {
  const file = event.target.files[0];
  if (!file) return;
  
  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const importedLinks = JSON.parse(e.target.result);
      
      if (!Array.isArray(importedLinks)) {
        throw new Error('Invalid file format');
      }
      
      // Validate imported links
      const validLinks = importedLinks.filter(link => 
        link.title && link.url && link.category
      );
      
      if (validLinks.length === 0) {
        showErrorMessage('No valid links found in the file');
        return;
      }
      
      // Add unique IDs and timestamps to imported links
      validLinks.forEach(link => {
        link.id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
        link.addedAt = new Date().toISOString();
      });
      
      customLinks = [...customLinks, ...validLinks];
      localStorage.setItem('careerPath_customLinks', JSON.stringify(customLinks));
      
      displayCustomLinks();
      showSuccessMessage(`${validLinks.length} links imported successfully!`);
      
    } catch (error) {
      showErrorMessage('Error importing links: Invalid file format');
    }
  };
  
  reader.readAsText(file);
}

// Add import/export buttons to the modal
document.addEventListener('DOMContentLoaded', function() {
  const modalBody = document.querySelector('#linkManagementModal .modal-body');
  if (modalBody) {
    const importExportSection = document.createElement('div');
    importExportSection.className = 'import-export-section mt-4 pt-4 border-top';
    importExportSection.innerHTML = `
      <h6 class="mb-3">Import/Export Links</h6>
      <div class="d-flex gap-2">
        <button class="btn btn-outline-info" onclick="exportLinks()">
          <i class="fas fa-download me-2"></i>Export Links
        </button>
        <label class="btn btn-outline-success">
          <i class="fas fa-upload me-2"></i>Import Links
          <input type="file" accept=".json" onchange="importLinks(event)" style="display: none;">
        </label>
        <button class="btn btn-outline-danger" onclick="clearAllLinks()">
          <i class="fas fa-trash me-2"></i>Clear All
        </button>
      </div>
    `;
    modalBody.appendChild(importExportSection);
  }
});

// Clear all custom links
function clearAllLinks() {
  if (!confirm('Are you sure you want to delete all custom links? This action cannot be undone.')) {
    return;
  }
  
  customLinks = [];
  localStorage.setItem('careerPath_customLinks', JSON.stringify(customLinks));
  displayCustomLinks();
  showSuccessMessage('All links cleared successfully!');
}

// Initialize link management on page load
document.addEventListener('DOMContentLoaded', function() {
  // Add custom links to navigation dropdowns
  addCustomLinksToNavigation();
});

// Add custom links to navigation dropdowns
function addCustomLinksToNavigation() {
  const categories = {
    'schools': 'Schools',
    'colleges': 'Colleges', 
    'downloads': 'Downloads',
    'useful-links': 'Useful Links',
    'government-jobs': 'Government Jobs'
  };
  
  Object.keys(categories).forEach(category => {
    const categoryLinks = customLinks.filter(link => link.category === category);
    
    if (categoryLinks.length > 0) {
      const dropdown = document.querySelector(`[data-bs-toggle="dropdown"]:contains("${categories[category]}")`);
      if (dropdown) {
        const dropdownMenu = dropdown.nextElementSibling;
        if (dropdownMenu) {
          // Add separator
          const separator = document.createElement('li');
          separator.innerHTML = '<hr class="dropdown-divider">';
          dropdownMenu.appendChild(separator);
          
          // Add custom links
          categoryLinks.forEach(link => {
            const linkItem = document.createElement('li');
            linkItem.innerHTML = `<a class="dropdown-item" href="${link.url}" target="_blank">${link.title}</a>`;
            dropdownMenu.appendChild(linkItem);
          });
        }
      }
    }
  });
}

console.log('Link management system loaded successfully');