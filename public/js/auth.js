// Authentication Functions
let currentUser = null;

// Login functionality
function showLogin() {
  const modal = new bootstrap.Modal(document.getElementById('loginModal'));
  modal.show();
}

// Signup functionality
function showSignup() {
  const modal = new bootstrap.Modal(document.getElementById('signupModal'));
  modal.show();
}

// Handle login form submission
document.getElementById('loginForm').addEventListener('submit', async function(e) {
  e.preventDefault();
  
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;
  const userType = document.querySelector('input[name="userType"]:checked').value;
  
  try {
    const result = await auth.signInWithEmailAndPassword(email, password);
    currentUser = result.user;
    
    // Check if user type matches
    if (userType === 'admin' && email !== 'admin@careerpath.com') {
      throw new Error('Admin access denied');
    }
    
    // Hide login modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('loginModal'));
    modal.hide();
    
    // Show appropriate dashboard
    if (userType === 'admin') {
      showAdminDashboard();
    } else {
      showStudentDashboard();
    }
    
    showSuccessMessage('Login successful!');
    
  } catch (error) {
    showErrorMessage('Login failed: ' + error.message);
  }
});

// Handle signup form submission
document.getElementById('signupForm').addEventListener('submit', async function(e) {
  e.preventDefault();
  
  const formData = new FormData(e.target);
  const studentData = {};
  
  // Convert form data to object
  for (let [key, value] of formData.entries()) {
    studentData[key] = value;
  }
  
  try {
    // Create user account
    const result = await auth.createUserWithEmailAndPassword(studentData.email, studentData.password);
    currentUser = result.user;
    
    // Save student data to database
    const studentRecord = {
      ...studentData,
      uid: result.user.uid,
      registrationDate: new Date().toISOString(),
      testsTaken: 0,
      status: 'active'
    };
    
    delete studentRecord.password; // Don't store password in database
    
    await database.ref('students').push(studentRecord);
    
    // Hide signup modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('signupModal'));
    modal.hide();
    
    showSuccessMessage('Registration successful! Welcome to CareerPath!');
    
    // Reset form
    e.target.reset();
    
  } catch (error) {
    showErrorMessage('Registration failed: ' + error.message);
  }
});

// Show student dashboard
function showStudentDashboard() {
  // Hide main content and show student specific content
  document.querySelector('main').style.display = 'block';
  document.getElementById('adminDashboard').style.display = 'none';
  
  // Update navigation for logged in student
  updateNavForLoggedInUser('student');
}

// Show admin dashboard
function showAdminDashboard() {
  document.querySelector('main').style.display = 'none';
  document.getElementById('adminDashboard').style.display = 'block';
  
  // Load admin dashboard data
  loadAdminDashboard();
  
  // Update navigation for logged in admin
  updateNavForLoggedInUser('admin');
}

// Update navigation for logged in users
function updateNavForLoggedInUser(userType) {
  const navButtons = document.querySelector('.navbar-nav + .d-flex');
  navButtons.innerHTML = `
    <span class="text-light me-3">Welcome, ${currentUser.email}</span>
    <button class="btn btn-outline-danger" onclick="logout()">Logout</button>
  `;
}

// Logout functionality
function logout() {
  auth.signOut().then(() => {
    currentUser = null;
    
    // Show main content and hide dashboards
    document.querySelector('main').style.display = 'block';
    document.getElementById('adminDashboard').style.display = 'none';
    
    // Reset navigation
    const navButtons = document.querySelector('.navbar-nav + .d-flex');
    navButtons.innerHTML = `
      <button class="btn btn-outline-primary me-2" onclick="showLogin()">Login</button>
      <button class="btn btn-primary" onclick="showSignup()">Sign Up</button>
    `;
    
    showSuccessMessage('Logged out successfully!');
  });
}

// Utility functions for showing messages
function showSuccessMessage(message) {
  showToast(message, 'success');
}

function showErrorMessage(message) {
  showToast(message, 'error');
}

function showToast(message, type) {
  // Create toast element
  const toast = document.createElement('div');
  toast.className = `toast align-items-center text-white bg-${type === 'success' ? 'success' : 'danger'} border-0`;
  toast.setAttribute('role', 'alert');
  toast.innerHTML = `
    <div class="d-flex">
      <div class="toast-body">${message}</div>
      <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
    </div>
  `;
  
  // Create toast container if it doesn't exist
  let toastContainer = document.getElementById('toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'toast-container';
    toastContainer.className = 'toast-container position-fixed top-0 end-0 p-3';
    toastContainer.style.zIndex = '9999';
    document.body.appendChild(toastContainer);
  }
  
  toastContainer.appendChild(toast);
  
  // Show toast
  const bsToast = new bootstrap.Toast(toast);
  bsToast.show();
  
  // Remove toast after it's hidden
  toast.addEventListener('hidden.bs.toast', () => {
    toast.remove();
  });
}

// Check authentication state on page load
auth.onAuthStateChanged((user) => {
  if (user) {
    currentUser = user;
    if (user.email === 'admin@careerpath.com') {
      updateNavForLoggedInUser('admin');
    } else {
      updateNavForLoggedInUser('student');
    }
  }
});