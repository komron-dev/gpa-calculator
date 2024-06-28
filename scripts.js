document.addEventListener("DOMContentLoaded", function () {
  document.getElementById('add-semester-btn').addEventListener('click', addSemester);
  document.getElementById('calculate-btn').addEventListener('click', calculate);
  loadFromCookies();
});

const subjects = {
  1: {
    "IP-18fTMKG": { name: "Learning methodology", credits: 1 },
    "IP-18fMATAG": { name: "Basic mathematics", credits: 4 },
    "IP-18fSZGREG": { name: "Computer systems", credits: 5 },
    "IP-18fPROGEG": { name: "Programming", credits: 6 },
    "IP-18fIMPROGEG": { name: "Imperative programming", credits: 5 },
    "IP-18fFUNPEG": { name: "Functional programming", credits: 5 },
    "IP-18fIVMEG": { name: "Business fundamentals", credits: 3 }
  },
  2: {
    "IP-18fAN1G": { name: "Analysis I. P", credits: 3 },
    "IP-18fAN1E": { name: "Analysis I. L", credits: 2 },
    "IP-18fDM1G": { name: "Discrete mathematics I. P", credits: 3 },
    "IP-18fDM1E": { name: "Discrete mathematics I. L", credits: 2 },
    "IP-18fAA1G": { name: "Algorithms and data structures I. P", credits: 3 },
    "IP-18fAA1E": { name: "Algorithms and data structures I. L", credits: 2 },
    "IP-18fWF1EG": { name: "Web development", credits: 3 },
    "IP-18fOEPROGEG": { name: "Object-oriented programming", credits: 6 },
    "IP-18fPNYEG": { name: "Programming languages", credits: 6 }
  },
  3: {
    "IP-18fAN2G": { name: "Analysis II. P", credits: 3 },
    "IP-18fAN2E": { name: "Analysis II. L", credits: 2 },
    "IP-18fWPEG": { name: "Web programming", credits: 4 },
    "IP-18fPROGTEG": { name: "Programming technology", credits: 5 },
    "IP-18fAA2G": { name: "Algorithms and data structures II. P", credits: 3 },
    "IP-18fAA2E": { name: "Algorithms and data structures II. L", credits: 2 },
    "IP-18fDMAG": { name: "Application of discrete models", credits: 3 }
  },
  4: {
    "IP-18fOPREG": { name: "Operating systems", credits: 3 },
    "IP-18fAB1G": { name: "Databases I. P", credits: 2 },
    "IP-18fAB1E": { name: "Databases I. L", credits: 2 },
    "IP-18fSZTEG": { name: "Software technology", credits: 5 },
    "IP-18fSZEA1G": { name: "Fundamentals of theory of computation I. P", credits: 3 },
    "IP-18fSZEA1E": { name: "Fundamentals of theory of computation I. L", credits: 2 },
    "IP-18fNM1G": { name: "Numerical methods P", credits: 3 },
    "IP-18fNM1E": { name: "Numerical methods L", credits: 2 }
  },
  5: {
    "IP-18fKPROGEG": { name: "Concurrent programming", credits: 3 },
    "IP-18fTKHG": { name: "Telecommunication networks P", credits: 3 },
    "IP-18fTKHE": { name: "Telecommunication networks L", credits: 2 },
    "IP-18fSZEA2G": { name: "Fundamentals of theory of computation II. P", credits: 3 },
    "IP-18fSZEA2E": { name: "Fundamentals of theory of computation II. L", credits: 2 },
    "IP-18fMIAE": { name: "Artificial intelligence L", credits: 3 },
    "IP-18fVSZG": { name: "Probability and statistics P", credits: 3 },
    "IP-18fAB2G": { name: "Databases II. P", credits: 3 },
    "IP-18fAB2E": { name: "Databases II. L", credits: 2 }
  },
  6: {
    "IP-18fSZD": { name: "Diploma work consultations", credits: 20 }
  }
};

const electiveSubjects = {
    "IP-18fKVKRBG": { name: "Cryptography and security P", credits: 3 },
    "IP-18fKVKRBE": { name: "Cryptography and security L", credits: 2 },
    "IP-18fKVBGTE": { name: "Introduction to machine learning L", credits: 3 },
    "IP-18fKVPRREG": { name: "Programming theory P", credits: 3 },
    "IP-18fKVREE": { name: "Programming theory L", credits: 2 },
    "IP-18fKVPRJG": { name: "Tools of software projects P", credits: 3 },
    "IP-18fKVFPG": { name: "Compilers P", credits: 2 },
    "IP-18fKVFPE": { name: "Compilers L", credits: 3 },
    "IP-18fKVADA": { name: "ADA L+P", credits: 5 },
    "IP-18fKVPYEG": { name: "Python L+P", credits: 5 }
};

let semesterCount = 0;

function addSemester() {
  const semesterSelect = document.getElementById("semester-select");
  const selectedSemester = semesterSelect.value;
  if (!selectedSemester) {
    alert("Please select a semester.");
    return;
  }

  const existingSemester = document.getElementById(`semester-${selectedSemester}`);
  if (existingSemester) {
    alert("This semester is already added.");
    return;
  }

  const semesterDiv = document.createElement("div");
  semesterDiv.className = "semester";
  semesterDiv.id = `semester-${selectedSemester}`;
  semesterDiv.innerHTML = `
    <h2>Semester ${selectedSemester}</h2>
    <div class="subjects" id="subjects-${selectedSemester}"></div>
    <button onclick="addSubject(${selectedSemester})">Add Subject</button>
    <button class="remove-btn" onclick="removeSemester(${selectedSemester})">Remove Semester</button>
  `;

  document.getElementById("semesters").appendChild(semesterDiv);
  semesterCount++;
}

function addSubject(semesterId) {
  const subjectId = `subject-${semesterId}-${Date.now()}`;
  const subjectDiv = document.createElement("div");
  subjectDiv.id = subjectId;

  subjectDiv.innerHTML = `
    <select onchange="updateCredits('${subjectId}', ${semesterId})">
      <option value="">Select a subject</option>
      ${Object.keys(subjects[semesterId]).map(code => `<option value="${code}">${subjects[semesterId][code].name}</option>`).join('')}
      <option value="elective">Compulsory Elective</option>
      <option value="full-list">Full List</option>
      <option value="other">Other Subject</option>
    </select>
    <select id="elective-${subjectId}" style="display:none;" onchange="setElectiveCredits('${subjectId}')">
      <option value="">Select an elective subject</option>
      ${Object.keys(electiveSubjects).map(code => `<option value="${code}">${electiveSubjects[code].name}</option>`).join('')}
    </select>
    <select id="full-list-${subjectId}" style="display:none;" onchange="setFullListCredits('${subjectId}')">
      <option value="">Select a subject from full list</option>
      ${Object.keys(subjects).flatMap(sem => Object.keys(subjects[sem]).map(code => `<option value="${code}">${subjects[sem][code].name}</option>`)).join('')}
    </select>
    <input type="text" placeholder="Subject Name" id="name-${subjectId}" style="display:none;">
    <input type="number" placeholder="Credits" id="credits-${subjectId}" style="display:none;" readonly>
    <input type="number" placeholder="Grade" min="1" max="5" oninput="validateGrade(this)">
    <button class="remove-btn" onclick="removeSubject('${subjectId}')">Remove Subject</button>
  `;
  document.getElementById(`subjects-${semesterId}`).appendChild(subjectDiv);
}

function validateGrade(input) {
  if (input.value < 1) {
    input.value = 1;
  }
  if (input.value > 5) {
    input.value = 5;
  }
}

function updateCredits(subjectId, semesterId) {
  const select = document.querySelector(`#${subjectId} select`);
  const creditsInput = document.querySelector(`#${subjectId} input[placeholder="Credits"]`);
  const nameInput = document.querySelector(`#${subjectId} input[placeholder="Subject Name"]`);
  const selectedValue = select.value;

  document.getElementById(`elective-${subjectId}`).style.display = 'none';
  document.getElementById(`full-list-${subjectId}`).style.display = 'none';
  creditsInput.style.display = 'none';
  nameInput.style.display = 'none';

  if (selectedValue === "elective") {
    document.getElementById(`elective-${subjectId}`).style.display = 'block';
  } else if (selectedValue === "full-list") {
    document.getElementById(`full-list-${subjectId}`).style.display = 'block';
  } else if (selectedValue === "other") {
    nameInput.style.display = 'block';
    creditsInput.style.display = 'block';
    creditsInput.removeAttribute("readonly");
  } else if (selectedValue) {
    creditsInput.value = subjects[semesterId][selectedValue].credits;
    creditsInput.style.display = 'block';
    creditsInput.setAttribute("readonly", true);
  } else {
    creditsInput.value = '';
  }
}

function setElectiveCredits(subjectId) {
  const select = document.querySelector(`#elective-${subjectId}`);
  const creditsInput = document.querySelector(`#${subjectId} input[placeholder="Credits"]`);
  const selectedValue = select.value;
  if (selectedValue) {
    creditsInput.value = electiveSubjects[selectedValue].credits;
    creditsInput.style.display = 'block';
    creditsInput.setAttribute("readonly", true);
  } else {
    creditsInput.value = '';
  }
}

function setFullListCredits(subjectId) {
  const select = document.querySelector(`#full-list-${subjectId}`);
  const creditsInput = document.querySelector(`#${subjectId} input[placeholder="Credits"]`);
  const selectedValue = select.value;
  if (selectedValue) {
    const semester = Object.keys(subjects).find(sem => subjects[sem][selectedValue]);
    creditsInput.value = subjects[semester][selectedValue].credits;
    creditsInput.style.display = 'block';
    creditsInput.setAttribute("readonly", true);
  } else {
    creditsInput.value = '';
  }
}

function removeSemester(semesterId) {
  const semesterDiv = document.getElementById(`semester-${semesterId}`);
  semesterDiv.parentNode.removeChild(semesterDiv);
}

function removeSubject(subjectId) {
  const subjectDiv = document.getElementById(subjectId);
  subjectDiv.parentNode.removeChild(subjectDiv);
}

function calculate() {
  let totalCreditsRegistered = 0;
  let totalCreditsObtained = 0;
  let totalGradePoints = 0;

  let resultHTML = '';

  document.querySelectorAll(".semester").forEach(semester => {
    let semesterCreditsRegistered = 0;
    let semesterCreditsObtained = 0;
    let semesterGradePoints = 0;

    semester.querySelectorAll("div[id^='subject-']").forEach(subject => {
      const credits = parseFloat(subject.querySelector("input[placeholder='Credits']").value);
      const grade = parseFloat(subject.querySelector("input[placeholder='Grade']").value);

      if (!isNaN(credits) && !isNaN(grade)) {
        semesterCreditsRegistered += credits;
        totalCreditsRegistered += credits;

        if (grade >= 2) {
          semesterCreditsObtained += credits;
          totalCreditsObtained += credits;
          semesterGradePoints += credits * grade;
          totalGradePoints += credits * grade;
        }
      }
    });

    const semesterGPA = semesterGradePoints / semesterCreditsObtained;
    const semesterCCI = (semesterGradePoints / 30) * (semesterCreditsObtained / semesterCreditsRegistered);

    resultHTML += `
      <h3>Semester ${semester.id.split('-')[1]}</h3>
      <p>GPA: ${isNaN(semesterGPA) ? 'N/A' : semesterGPA.toFixed(2)}</p>
      <p>CCI: ${isNaN(semesterCCI) ? 'N/A' : semesterCCI.toFixed(2)}</p>
    `;
  });

  const totalGPA = totalGradePoints / totalCreditsObtained;
  const totalCCI = (totalGradePoints / 30) * (totalCreditsObtained / totalCreditsRegistered);

  resultHTML += `
    <h2>Total</h2>
    <p>GPA: ${isNaN(totalGPA) ? 'N/A' : totalGPA.toFixed(2)}</p>
    <p>CCI: ${isNaN(totalCCI) ? 'N/A' : totalCCI.toFixed(2)}</p>
  `;

  document.getElementById("result").innerHTML = resultHTML;

  saveToCookies();
}


function saveToCookies() {
  const data = [];
  document.querySelectorAll(".semester").forEach(semester => {
    const semesterData = [];
    semester.querySelectorAll("div[id^='subject-']").forEach(subject => {
      const subjectCode = subject.querySelector("select").value;
      const subjectName = subject.querySelector("input[placeholder='Subject Name']").value;
      const credits = subject.querySelector("input[placeholder='Credits']").value;
      const grade = subject.querySelector("input[placeholder='Grade']").value;
      semesterData.push({ subjectCode, subjectName, credits, grade });
    });
    data.push(semesterData);
  });
  document.cookie = `data=${JSON.stringify(data)};path=/`;
}

function loadFromCookies() {
  const data = JSON.parse(document.cookie.split('; ').find(row => row.startsWith('data='))?.split('=')[1] || '[]');
  data.forEach((semesterData, index) => {
    const semesterIndex = index + 1;
    addSemester(semesterIndex);
    semesterData.forEach(subjectData => {
      addSubject(semesterIndex);
      const lastSubject = document.getElementById(`subjects-${semesterIndex}`).lastElementChild;
      lastSubject.querySelector("select").value = subjectData.subjectCode;
      lastSubject.querySelector("input[placeholder='Subject Name']").value = subjectData.subjectName;
      lastSubject.querySelector("input[placeholder='Credits']").value = subjectData.credits;
      lastSubject.querySelector("input[placeholder='Grade']").value = subjectData.grade;
    });
  });
}

