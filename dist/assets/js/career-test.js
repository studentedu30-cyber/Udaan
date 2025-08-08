// Career Test Questions and Logic
const careerTestQuestions = [
  {
    id: 1,
    question: "What type of activities do you enjoy most?",
    options: [
      { text: "Working with numbers and data", category: "analytical" },
      { text: "Creating and designing things", category: "creative" },
      { text: "Helping and teaching others", category: "social" },
      { text: "Leading teams and projects", category: "leadership" }
    ]
  },
  {
    id: 2,
    question: "In which environment do you work best?",
    options: [
      { text: "Quiet office with minimal distractions", category: "analytical" },
      { text: "Dynamic studio or creative space", category: "creative" },
      { text: "Collaborative team environment", category: "social" },
      { text: "Fast-paced corporate setting", category: "leadership" }
    ]
  },
  {
    id: 3,
    question: "What motivates you the most?",
    options: [
      { text: "Solving complex problems", category: "analytical" },
      { text: "Expressing my creativity", category: "creative" },
      { text: "Making a positive impact on people", category: "social" },
      { text: "Achieving targets and goals", category: "leadership" }
    ]
  },
  {
    id: 4,
    question: "Which subject did you enjoy most in school?",
    options: [
      { text: "Mathematics and Science", category: "analytical" },
      { text: "Art and Literature", category: "creative" },
      { text: "Psychology and Social Studies", category: "social" },
      { text: "Business Studies and Economics", category: "leadership" }
    ]
  },
  {
    id: 5,
    question: "How do you prefer to work?",
    options: [
      { text: "Independently with detailed analysis", category: "analytical" },
      { text: "With creative freedom and flexibility", category: "creative" },
      { text: "In teams helping others succeed", category: "social" },
      { text: "Leading and organizing projects", category: "leadership" }
    ]
  },
  {
    id: 6,
    question: "What type of challenges excite you?",
    options: [
      { text: "Technical and logical puzzles", category: "analytical" },
      { text: "Artistic and design challenges", category: "creative" },
      { text: "Interpersonal and communication challenges", category: "social" },
      { text: "Strategic and business challenges", category: "leadership" }
    ]
  },
  {
    id: 7,
    question: "Which career aspect is most important to you?",
    options: [
      { text: "Job security and steady income", category: "analytical" },
      { text: "Creative satisfaction and recognition", category: "creative" },
      { text: "Helping others and community impact", category: "social" },
      { text: "Growth opportunities and high earnings", category: "leadership" }
    ]
  },
  {
    id: 8,
    question: "What type of tasks energize you?",
    options: [
      { text: "Research and data analysis", category: "analytical" },
      { text: "Brainstorming and ideation", category: "creative" },
      { text: "Counseling and mentoring", category: "social" },
      { text: "Planning and decision making", category: "leadership" }
    ]
  },
  {
    id: 9,
    question: "How do you handle stress?",
    options: [
      { text: "Break problems into smaller parts", category: "analytical" },
      { text: "Find creative outlets for expression", category: "creative" },
      { text: "Talk to friends and seek support", category: "social" },
      { text: "Take charge and find solutions", category: "leadership" }
    ]
  },
  {
    id: 10,
    question: "What would you like to be known for?",
    options: [
      { text: "Your expertise and knowledge", category: "analytical" },
      { text: "Your creativity and innovation", category: "creative" },
      { text: "Your compassion and helpfulness", category: "social" },
      { text: "Your achievements and leadership", category: "leadership" }
    ]
  }
];

// Career recommendations based on test results
const careerRecommendations = {
  analytical: {
    title: "Analytical Thinker",
    description: "You excel at problem-solving, working with data, and logical reasoning.",
    careers: [
      "Data Scientist",
      "Software Engineer",
      "Financial Analyst",
      "Research Scientist",
      "Statistician",
      "Cybersecurity Analyst"
    ],
    courses: [
      "Computer Science Engineering",
      "Mathematics",
      "Statistics",
      "Actuarial Science",
      "Data Analytics",
      "Information Technology"
    ],
    governmentJobs: ["IES (Indian Engineering Services)", "ISRO Scientist", "RBI Grade B", "Statistics Officer"]
  },
  creative: {
    title: "Creative Innovator",
    description: "You thrive on creativity, design, and artistic expression.",
    careers: [
      "Graphic Designer",
      "Content Creator",
      "Architect",
      "Fashion Designer",
      "Filmmaker",
      "UI/UX Designer"
    ],
    courses: [
      "Fine Arts",
      "Design",
      "Architecture",
      "Mass Communication",
      "Film Studies",
      "Fashion Design"
    ],
    governmentJobs: ["Archaeological Survey of India", "All India Radio", "Doordarshan", "Cultural Officer"]
  },
  social: {
    title: "People-Oriented Helper",
    description: "You enjoy helping others and making a positive social impact.",
    careers: [
      "Teacher",
      "Counselor",
      "Social Worker",
      "Psychologist",
      "Healthcare Professional",
      "HR Manager"
    ],
    courses: [
      "Education",
      "Psychology",
      "Social Work",
      "Medicine",
      "Nursing",
      "Human Resources"
    ],
    governmentJobs: ["IAS (Indian Administrative Service)", "Teaching (KVS/NVS)", "Social Welfare Officer", "Probation Officer"]
  },
  leadership: {
    title: "Strategic Leader",
    description: "You have natural leadership abilities and business acumen.",
    careers: [
      "Business Manager",
      "Entrepreneur",
      "Sales Director",
      "Project Manager",
      "Management Consultant",
      "Investment Banker"
    ],
    courses: [
      "Business Administration (MBA)",
      "Commerce",
      "Management Studies",
      "Economics",
      "Finance",
      "Marketing"
    ],
    governmentJobs: ["IAS (Indian Administrative Service)", "IFS (Indian Foreign Service)", "Bank PO", "Management Trainee"]
  }
};

// Test state
let currentQuestion = 0;
let testAnswers = [];
let testInProgress = false;

// Start career test
function startCareerTest() {
  currentQuestion = 0;
  testAnswers = [];
  testInProgress = true;
  
  document.getElementById('startTestBtn').style.display = 'none';
  document.getElementById('testContainer').style.display = 'block';
  document.getElementById('resultContainer').style.display = 'none';
  
  displayQuestion();
}

// Display current question
function displayQuestion() {
  const question = careerTestQuestions[currentQuestion];
  
  document.getElementById('questionText').textContent = question.question;
  document.getElementById('questionCounter').textContent = `Question ${currentQuestion + 1} of ${careerTestQuestions.length}`;
  
  // Update progress bar
  const progress = ((currentQuestion + 1) / careerTestQuestions.length) * 100;
  document.getElementById('progressBar').style.width = progress + '%';
  
  // Display options
  const optionsContainer = document.getElementById('questionOptions');
  optionsContainer.innerHTML = '';
  
  question.options.forEach((option, index) => {
    const optionElement = document.createElement('div');
    optionElement.className = 'option-btn';
    optionElement.textContent = option.text;
    optionElement.onclick = () => selectOption(index);
    optionsContainer.appendChild(optionElement);
  });
  
  // Update navigation buttons
  document.getElementById('prevBtn').style.display = currentQuestion > 0 ? 'inline-block' : 'none';
  document.getElementById('nextBtn').textContent = currentQuestion === careerTestQuestions.length - 1 ? 'Finish Test' : 'Next';
  document.getElementById('nextBtn').disabled = true;
}

// Select option
function selectOption(index) {
  // Remove previous selection
  document.querySelectorAll('.option-btn').forEach(btn => btn.classList.remove('selected'));
  
  // Mark selected option
  document.querySelectorAll('.option-btn')[index].classList.add('selected');
  
  // Store answer
  testAnswers[currentQuestion] = {
    questionId: careerTestQuestions[currentQuestion].id,
    selectedOption: index,
    category: careerTestQuestions[currentQuestion].options[index].category
  };
  
  // Enable next button
  document.getElementById('nextBtn').disabled = false;
}

// Navigate to next question
function nextQuestion() {
  if (!testAnswers[currentQuestion]) {
    showErrorMessage('Please select an option before proceeding.');
    return;
  }
  
  if (currentQuestion < careerTestQuestions.length - 1) {
    currentQuestion++;
    displayQuestion();
  } else {
    finishTest();
  }
}

// Navigate to previous question
function previousQuestion() {
  if (currentQuestion > 0) {
    currentQuestion--;
    displayQuestion();
    
    // Restore previous selection if exists
    if (testAnswers[currentQuestion]) {
      const selectedIndex = testAnswers[currentQuestion].selectedOption;
      document.querySelectorAll('.option-btn')[selectedIndex].classList.add('selected');
      document.getElementById('nextBtn').disabled = false;
    }
  }
}

// Finish test and show results
function finishTest() {
  testInProgress = false;
  
  // Calculate results
  const categoryScores = {
    analytical: 0,
    creative: 0,
    social: 0,
    leadership: 0
  };
  
  testAnswers.forEach(answer => {
    categoryScores[answer.category]++;
  });
  
  // Find dominant category
  const dominantCategory = Object.keys(categoryScores).reduce((a, b) => 
    categoryScores[a] > categoryScores[b] ? a : b
  );
  
  const recommendation = careerRecommendations[dominantCategory];
  
  // Display results
  displayTestResults(recommendation, categoryScores);
  
  // Save test result to database if user is logged in
  if (currentUser) {
    saveTestResult(dominantCategory, categoryScores, recommendation);
  }
  
  // Hide test container and show results
  document.getElementById('testContainer').style.display = 'none';
  document.getElementById('resultContainer').style.display = 'block';
}

// Display test results
function displayTestResults(recommendation, scores) {
  const resultContent = document.getElementById('resultContent');
  
  resultContent.innerHTML = `
    <div class="result-card">
      <div class="result-header">
        <h4 class="text-primary">${recommendation.title}</h4>
        <p class="lead">${recommendation.description}</p>
      </div>
      
      <div class="row g-4 mt-4">
        <div class="col-md-6">
          <h5>Recommended Careers</h5>
          <ul class="career-list">
            ${recommendation.careers.map(career => `<li>${career}</li>`).join('')}
          </ul>
        </div>
        <div class="col-md-6">
          <h5>Suggested Courses</h5>
          <ul class="career-list">
            ${recommendation.courses.map(course => `<li>${course}</li>`).join('')}
          </ul>
        </div>
      </div>
      
      <div class="mt-4">
        <h5>Government Job Opportunities</h5>
        <ul class="career-list">
          ${recommendation.governmentJobs.map(job => `<li>${job}</li>`).join('')}
        </ul>
      </div>
      
      <div class="score-breakdown mt-4">
        <h5>Your Personality Profile</h5>
        <div class="scores">
          ${Object.entries(scores).map(([category, score]) => `
            <div class="score-item">
              <span class="score-label">${category.charAt(0).toUpperCase() + category.slice(1)}</span>
              <div class="score-bar">
                <div class="score-fill" style="width: ${(score / 10) * 100}%"></div>
              </div>
              <span class="score-value">${score}/10</span>
            </div>
          `).join('')}
        </div>
      </div>
      
      <div class="result-actions mt-4">
        <button class="btn btn-primary me-2" onclick="retakeTest()">Retake Test</button>
        
      </div>
    </div>
  `;
}

// Save test result to database
async function saveTestResult(category, scores, recommendation) {
  try {
    const testResult = {
      userId: currentUser.uid,
      userEmail: currentUser.email,
      dominantCategory: category,
      scores: scores,
      recommendation: recommendation.title,
      completedAt: new Date().toISOString(),
      answers: testAnswers
    };
    
    await database.ref('testResults').push(testResult);
    console.log('Test result saved successfully');
  } catch (error) {
    console.error('Error saving test result:', error);
  }
}

// Retake test
function retakeTest() {
  document.getElementById('resultContainer').style.display = 'none';
  document.getElementById('startTestBtn').style.display = 'block';
}

// Download results (mock implementation)
function downloadResults() {
  showSuccessMessage('Results download feature will be available soon!');
}

// Scroll to section
function scrollToSection(sectionId) {
  document.getElementById(sectionId).scrollIntoView({ 
    behavior: 'smooth' 
  });
}