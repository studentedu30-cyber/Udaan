// Admin Dashboard Functions
let studentsData = [];
let resourcesData = [];

// Load admin dashboard data
async function loadAdminDashboard() {
  try {
    await Promise.all([
      loadStudentsData(),
      loadResourcesData(),
      updateDashboardStats()
    ]);
  } catch (error) {
    console.error('Error loading admin dashboard:', error);
    showErrorMessage('Error loading dashboard data');
  }
}

// Load students data
async function loadStudentsData() {
  try {
    const snapshot = await database.ref('students').once('value');
    const data = snapshot.val();
    
    studentsData = [];
    if (data) {
      Object.keys(data).forEach(key => {
        studentsData.push({
          ...data[key],
          firebaseKey: key
        });
      });
    }
    
    displayStudentsTable();
  } catch (error) {
    console.error('Error loading students data:', error);
  }
}

// Display students in table
function displayStudentsTable() {
  const tableBody = document.getElementById('studentsTableBody');
  
  if (studentsData.length === 0) {
    tableBody.innerHTML = '<tr><td colspan="6" class="text-center">No students registered yet</td></tr>';
    return;
  }
  
  tableBody.innerHTML = studentsData.map(student => `
    <tr>
      <td>${student.firstName} ${student.lastName}</td>
      <td>${student.email}</td>
      <td>${student.phone}</td>
      <td><span class="badge bg-primary">${student.currentLevel || 'Not specified'}</span></td>
      <td>${new Date(student.registrationDate).toLocaleDateString()}</td>
      <td>
        <button class="btn btn-sm btn-info me-1" onclick="viewStudentDetails('${student.firebaseKey}')">View</button>
        <button class="btn btn-sm btn-warning me-1" onclick="editStudent('${student.firebaseKey}')">Edit</button>
        <button class="btn btn-sm btn-danger" onclick="deleteStudent('${student.firebaseKey}')">Delete</button>
      </td>
    </tr>
  `).join('');
}

// Update dashboard statistics
async function updateDashboardStats() {
  try {
    // Total students
    document.getElementById('totalStudents').textContent = studentsData.length;
    
    // Get test results count
    const testSnapshot = await database.ref('testResults').once('value');
    const testData = testSnapshot.val();
    const totalTests = testData ? Object.keys(testData).length : 0;
    document.getElementById('totalTests').textContent = totalTests;
    
    // Today's registrations
    const today = new Date().toDateString();
    const todayRegistrations = studentsData.filter(student => 
      new Date(student.registrationDate).toDateString() === today
    ).length;
    document.getElementById('todayRegistrations').textContent = todayRegistrations;
    
  } catch (error) {
    console.error('Error updating dashboard stats:', error);
  }
}

// View student details
function viewStudentDetails(firebaseKey) {
  const student = studentsData.find(s => s.firebaseKey === firebaseKey);
  if (!student) return;
  
  const detailsModal = document.createElement('div');
  detailsModal.className = 'modal fade';
  detailsModal.innerHTML = `
    <div class="modal-dialog modal-lg">
      <div class="modal-content bg-dark-secondary">
        <div class="modal-header">
          <h5 class="modal-title">Student Details</h5>
          <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body">
          <div class="row g-3">
            <div class="col-md-6">
              <strong>Name:</strong> ${student.firstName} ${student.lastName}
            </div>
            <div class="col-md-6">
              <strong>Email:</strong> ${student.email}
            </div>
            <div class="col-md-6">
              <strong>Phone:</strong> ${student.phone}
            </div>
            <div class="col-md-6">
              <strong>Date of Birth:</strong> ${student.dob || 'Not provided'}
            </div>
            <div class="col-md-6">
              <strong>Gender:</strong> ${student.gender || 'Not specified'}
            </div>
            <div class="col-md-6">
              <strong>Education Level:</strong> ${student.currentLevel || 'Not specified'}
            </div>
            <div class="col-12">
              <strong>Address:</strong> ${student.address || 'Not provided'}
            </div>
            <div class="col-md-6">
              <strong>Father's Name:</strong> ${student.fatherName || 'Not provided'}
            </div>
            <div class="col-md-6">
              <strong>Mother's Name:</strong> ${student.motherName || 'Not provided'}
            </div>
            <div class="col-md-6">
              <strong>Father's Occupation:</strong> ${student.fatherOccupation || 'Not provided'}
            </div>
            <div class="col-md-6">
              <strong>Parent Phone:</strong> ${student.parentPhone || 'Not provided'}
            </div>
            <div class="col-md-6">
              <strong>Institution:</strong> ${student.instituteName || 'Not provided'}
            </div>
            <div class="col-md-6">
              <strong>Board/University:</strong> ${student.board || 'Not provided'}
            </div>
            <div class="col-md-6">
              <strong>Percentage/CGPA:</strong> ${student.percentage || 'Not provided'}
            </div>
            <div class="col-md-6">
              <strong>Registration Date:</strong> ${new Date(student.registrationDate).toLocaleString()}
            </div>
            <div class="col-12">
              <strong>Career Interests:</strong> ${student.interests || 'Not provided'}
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
  
  document.body.appendChild(detailsModal);
  const modal = new bootstrap.Modal(detailsModal);
  modal.show();
  
  // Remove modal from DOM when hidden
  detailsModal.addEventListener('hidden.bs.modal', () => {
    detailsModal.remove();
  });
}

// Edit student (placeholder function)
function editStudent(firebaseKey) {
  showSuccessMessage('Edit functionality will be implemented soon!');
}

// Delete student
function deleteStudent(firebaseKey) {
  if (confirm('Are you sure you want to delete this student? This action cannot be undone.')) {
    database.ref(`students/${firebaseKey}`).remove()
      .then(() => {
        showSuccessMessage('Student deleted successfully');
        loadStudentsData(); // Refresh the table
        updateDashboardStats(); // Update stats
      })
      .catch(error => {
        showErrorMessage('Error deleting student: ' + error.message);
      });
  }
}

// Load resources data
async function loadResourcesData() {
  try {
    const snapshot = await database.ref('resources').once('value');
    const data = snapshot.val();
    
    resourcesData = [];
    if (data) {
      Object.keys(data).forEach(key => {
        resourcesData.push({
          ...data[key],
          firebaseKey: key
        });
      });
    }
    
    displayResourcesList();
  } catch (error) {
    console.error('Error loading resources data:', error);
  }
}

// Display resources list
function displayResourcesList() {
  const resourcesList = document.getElementById('resourcesList');
  
  if (resourcesData.length === 0) {
    resourcesList.innerHTML = '<p class="text-center text-muted">No resources added yet</p>';
    return;
  }
  
  resourcesList.innerHTML = resourcesData.map(resource => `
    <div class="resource-item">
      <div>
        <strong>${resource.title}</strong>
        <br>
        <small class="text-muted">${resource.category} - ${resource.url}</small>
      </div>
      <div>
        <button class="btn btn-sm btn-outline-warning me-1" onclick="editResource('${resource.firebaseKey}')">Edit</button>
        <button class="btn btn-sm btn-outline-danger" onclick="deleteResource('${resource.firebaseKey}')">Delete</button>
      </div>
    </div>
  `).join('');
}

// Add new resource
function addResource() {
  const title = document.getElementById('resourceTitle').value.trim();
  const url = document.getElementById('resourceUrl').value.trim();
  const category = document.getElementById('resourceCategory').value;
  
  if (!title || !url) {
    showErrorMessage('Please fill in all required fields');
    return;
  }
  
  const resourceData = {
    title,
    url,
    category,
    addedAt: new Date().toISOString(),
    addedBy: currentUser.email
  };
  
  database.ref('resources').push(resourceData)
    .then(() => {
      showSuccessMessage('Resource added successfully');
      document.getElementById('resourceTitle').value = '';
      document.getElementById('resourceUrl').value = '';
      document.getElementById('resourceCategory').value = 'career-guidance';
      loadResourcesData(); // Refresh the list
    })
    .catch(error => {
      showErrorMessage('Error adding resource: ' + error.message);
    });
}

// Edit resource (placeholder)
function editResource(firebaseKey) {
  showSuccessMessage('Edit resource functionality will be implemented soon!');
}

// Delete resource
function deleteResource(firebaseKey) {
  if (confirm('Are you sure you want to delete this resource?')) {
    database.ref(`resources/${firebaseKey}`).remove()
      .then(() => {
        showSuccessMessage('Resource deleted successfully');
        loadResourcesData(); // Refresh the list
      })
      .catch(error => {
        showErrorMessage('Error deleting resource: ' + error.message);
      });
  }
}

// Refresh student data
function refreshStudentData() {
  loadStudentsData();
  updateDashboardStats();
  showSuccessMessage('Student data refreshed');
}

// Export students data to CSV (mock implementation)
function exportStudentsData() {
  if (studentsData.length === 0) {
    showErrorMessage('No student data to export');
    return;
  }
  
  showSuccessMessage('Export functionality will be available soon!');
}