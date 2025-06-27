// Load subjects from localStorage or initialize empty array
let subjects = JSON.parse(localStorage.getItem('subjects')) || [];

// Update subject dropdown and progress display
function updateUI() {
    const subjectSelect = document.getElementById('subjectSelect');
    subjectSelect.innerHTML = '<option value="">Select Subject</option>';
    subjects.forEach(subject => {
        subjectSelect.innerHTML += `<option value="${subject.name}">${subject.name}</option>`;
    });
    displayProgress();
}

// Add a new subject
function addSubject() {
    const name = document.getElementById('subjectName').value.trim();
    const hours = parseFloat(document.getElementById('subjectHours').value);
    
    if (name && hours > 0) {
        subjects.push({
            name: name,
            allottedHours: hours,
            studiedHours: 0,
            sessions: []
        });
        localStorage.setItem('subjects', JSON.stringify(subjects));
        document.getElementById('subjectName').value = '';
        document.getElementById('subjectHours').value = '';
        updateUI();
    } else {
        alert('Please enter a valid subject name and hours.');
    }
}

// Start a study session
function startSession() {
    const subjectName = document.getElementById('subjectSelect').value;
    if (!subjectName) {
        alert('Please select a subject.');
        return;
    }
    
    const subject = subjects.find(s => s.name === subjectName);
    if (subject) {
        subject.sessions.push({ start: new Date(), end: null });
        localStorage.setItem('subjects', JSON.stringify(subjects));
        alert(`Started studying ${subjectName}`);
    }
}

// Stop a study session
function stopSession() {
    const subjectName = document.getElementById('subjectSelect').value;
    if (!subjectName) {
        alert('Please select a subject.');
        return;
    }
    
    const subject = subjects.find(s => s.name === subjectName);
    if (subject && subject.sessions.length > 0 && !subject.sessions[subject.sessions.length - 1].end) {
        subject.sessions[subject.sessions.length - 1].end = new Date();
        const session = subject.sessions[subject.sessions.length - 1];
        const hoursStudied = (session.end - session.start) / (1000 * 60 * 60); // Convert ms to hours
        subject.studiedHours += hoursStudied;
        localStorage.setItem('subjects', JSON.stringify(subjects));
        updateUI();
        alert(`Stopped studying ${subjectName}. Studied for ${hoursStudied.toFixed(2)} hours.`);
    } else {
        alert('No active session for this subject.');
    }
}

// Reset a subject's progress
function resetSubject(subjectName) {
    const subject = subjects.find(s => s.name === subjectName);
    if (subject && confirm(`Are you sure you want to reset progress for ${subjectName}?`)) {
        subject.studiedHours = 0;
        subject.sessions = [];
        localStorage.setItem('subjects', JSON.stringify(subjects));
        updateUI();
    }
}

// Remove a subject
function removeSubject(subjectName) {
    if (confirm(`Are you sure you want to remove ${subjectName}?`)) {
        subjects = subjects.filter(s => s.name !== subjectName);
        localStorage.setItem('subjects', JSON.stringify(subjects));
        updateUI();
    }
}

// Display progress with circular meters
function displayProgress() {
    const progressList = document.getElementById('progressList');
    progressList.innerHTML = '';
    subjects.forEach(subject => {
        const percentage = Math.min((subject.studiedHours / subject.allottedHours) * 100, 100);
        const remainingHours = (subject.allottedHours - subject.studiedHours).toFixed(2);
        const circumference = 2 * Math.PI * 50; // Radius = 50
        const offset = circumference - (percentage / 100) * circumference;
        
        progressList.innerHTML += `
            <div class="progress-item">
                <h3>${subject.name}</h3>
                <div class="progress-meter">
                    <svg width="120" height="120">
                        <circle class="progress-circle" cx="60" cy="60" r="50"></circle>
                        <circle class="progress-fill" cx="60" cy="60" r="50" 
                            stroke-dasharray="${circumference}" 
                            stroke-dashoffset="${offset}">
                        </circle>
                    </svg>
                    <div class="progress-text">${Math.round(percentage)}%</div>
                </div>
                <p>Allotted: ${subject.allottedHours} hours<br>
                   Studied: ${subject.studiedHours.toFixed(2)} hours<br>
                   Remaining: ${remainingHours > 0 ? remainingHours : 0} hours</p>
                <button class="reset" onclick="resetSubject('${subject.name}')">Reset</button>
                <button class="remove" onclick="removeSubject('${subject.name}')">Remove</button>
            </div>
        `;
    });
}

// Initialize UI on page load
updateUI();