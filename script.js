document.addEventListener('DOMContentLoaded', () => {
    // Dil değiştirme olayını kontrol et
    changePlaceholdersByLanguage();

    // Dil seçimi değiştiğinde placeholder güncellemesi yap
    document.getElementById('languageSelect').addEventListener('change', () => {
        const selectedLanguage = document.getElementById('languageSelect').value;
        localStorage.setItem('selectedLanguage', selectedLanguage);
        changePlaceholdersByLanguage();
    });
});

function toggleMode() {
    const isGPA = document.getElementById('option1').checked;
    const courseNumber = document.getElementById('courseNumber');
    const semesterNumber = document.getElementById('semesterNumber');
    const courseDetails = document.getElementById('courseDetails');

    if (isGPA) {
        courseNumber.style.display = 'block';
        semesterNumber.style.display = 'none';
        courseDetails.innerHTML = '';
        addCourseFields(); // Sadece dönemlik GPA için de course fields ekleyin
    } else {
        courseNumber.style.display = 'none';
        semesterNumber.style.display = 'block';
        courseDetails.innerHTML = '';
    }
}

function addCourseFields() {
    const courseCount = document.getElementById('courseCount').value || 1;
    const courseDetails = document.getElementById('courseDetails');

    // Clear previous course fields
    courseDetails.innerHTML = '';

    const selectedLanguage = localStorage.getItem('selectedLanguage') || 'en';
    const placeholders = getPlaceholders(selectedLanguage);

    for (let i = 0; i < courseCount; i++) {
        const courseDetail = document.createElement('div');
        courseDetail.className = 'courseDetail';

        const courseCodeInput = document.createElement('input');
        courseCodeInput.type = 'text';
        courseCodeInput.placeholder = placeholders.courseCode;
        courseCodeInput.name = 'course_code[]';
        courseCodeInput.className = 'styled-input';

        const courseNameInput = document.createElement('input');
        courseNameInput.type = 'text';
        courseNameInput.placeholder = placeholders.courseName;
        courseNameInput.name = 'course_name[]';
        courseNameInput.className = 'styled-input';

        const gradeInput = document.createElement('input');
        gradeInput.type = 'text';
        gradeInput.placeholder = placeholders.grade;
        gradeInput.name = 'grade[]';
        gradeInput.className = 'styled-input';

        const creditsInput = document.createElement('input');
        creditsInput.type = 'number';
        creditsInput.placeholder = placeholders.credits;
        creditsInput.name = 'credits[]';
        creditsInput.min = '0';
        creditsInput.step = '1';
        creditsInput.className = 'styled-input';

        courseDetail.appendChild(courseCodeInput);
        courseDetail.appendChild(courseNameInput);
        courseDetail.appendChild(gradeInput);
        courseDetail.appendChild(creditsInput);

        courseDetails.appendChild(courseDetail);
    }
}

function addSemesterFields() {
    const semesterCount = document.getElementById('semesterCount').value;
    const courseDetails = document.getElementById('courseDetails');

    // Clear previous course fields
    courseDetails.innerHTML = '';

    const selectedLanguage = localStorage.getItem('selectedLanguage') || 'en';
    const placeholders = getPlaceholders(selectedLanguage);

    for (let i = 0; i < semesterCount; i++) {
        const semesterDiv = document.createElement('div');
        semesterDiv.className = 'semesterDiv';
        semesterDiv.innerHTML = `
            <h3>${placeholders.semester} ${i + 1}</h3>
            <label>${placeholders.academicYear}: <input type="text" name="semester_${i}_year" class="styled-input"></label>
            <label>${placeholders.term}: 
                <select name="semester_${i}_term" class="styled-input">
                    <option value="Fall">${placeholders.fall}</option>
                    <option value="Spring">${placeholders.spring}</option>
                </select>
            </label>
            <label>${placeholders.numberOfCourses}: <input type="number" name="semester_${i}_course_count" class="styled-input" min="1" max="80">
            <button type="button" class="green-button" onclick="addCoursesToSemester(this, ${i})">${placeholders.add}</button></label>
            <div class="courseDetails" id="courseDetails_semester_${i}"></div>
        `;

        courseDetails.appendChild(semesterDiv);
    }
}

function addCoursesToSemester(button, semesterIndex) {
    const inputElement = button.previousElementSibling;
    const courseCount = inputElement.value;
    const courseDetailsDiv = document.getElementById(`courseDetails_semester_${semesterIndex}`);

    // Clear previous courses
    courseDetailsDiv.innerHTML = '';

    const selectedLanguage = localStorage.getItem('selectedLanguage') || 'en';
    const placeholders = getPlaceholders(selectedLanguage);

    for (let i = 0; i < courseCount; i++) {
        const courseDetail = document.createElement('div');
        courseDetail.className = 'courseDetail';

        const courseCodeInput = document.createElement('input');
        courseCodeInput.type = 'text';
        courseCodeInput.placeholder = placeholders.courseCode;
        courseCodeInput.name = `semester_${semesterIndex}_course_code[]`;
        courseCodeInput.className = 'styled-input';

        const courseNameInput = document.createElement('input');
        courseNameInput.type = 'text';
        courseNameInput.placeholder = placeholders.courseName;
        courseNameInput.name = `semester_${semesterIndex}_course_name[]`;
        courseNameInput.className = 'styled-input';

        const gradeInput = document.createElement('input');
        gradeInput.type = 'text';
        gradeInput.placeholder = placeholders.grade;
        gradeInput.name = `semester_${semesterIndex}_grade[]`;
        gradeInput.className = 'styled-input';

        const creditsInput = document.createElement('input');
        creditsInput.type = 'number';
        creditsInput.placeholder = placeholders.credits;
        creditsInput.name = `semester_${semesterIndex}_credits[]`;
        creditsInput.min = '0';
        creditsInput.step = '1';
        creditsInput.className = 'styled-input';

        courseDetail.appendChild(courseCodeInput);
        courseDetail.appendChild(courseNameInput);
        courseDetail.appendChild(gradeInput);
        courseDetail.appendChild(creditsInput);

        courseDetailsDiv.appendChild(courseDetail);
    }
}

function changePlaceholdersByLanguage() {
    const selectedLanguage = localStorage.getItem('selectedLanguage') || 'en';
    const placeholders = getPlaceholders(selectedLanguage);

    // Güncel placeholder metinlerini ayarla
    document.querySelectorAll('input[name="course_code[]"]').forEach(input => input.placeholder = placeholders.courseCode);
    document.querySelectorAll('input[name="course_name[]"]').forEach(input => input.placeholder = placeholders.courseName);
    document.querySelectorAll('input[name="grade[]"]').forEach(input => input.placeholder = placeholders.grade);
    document.querySelectorAll('input[name="credits[]"]').forEach(input => input.placeholder = placeholders.credits);
}

function getPlaceholders(language) {
    if (language === 'tr') {
        return {
            courseCode: 'Ders Kodu',
            courseName: 'Ders Adı',
            grade: 'Not',
            credits: 'Kredi',
            semester: 'Dönem',
            academicYear: 'Akademik Yıl',
            term: 'Dönem',
            numberOfCourses: 'Ders Sayısı',
            add: 'Ekle',
            fall: 'Güz',
            spring: 'Bahar'
        };
    } else {
        return {
            courseCode: 'Course Code',
            courseName: 'Course Name',
            grade: 'Grade',
            credits: 'Credits',
            semester: 'Semester',
            academicYear: 'Academic Year',
            term: 'Term',
            numberOfCourses: 'Number of Courses',
            add: 'Add',
            fall: 'Fall',
            spring: 'Spring'
        };
    }
}

function calculate() {
    const option1Checked = document.getElementById('option1').checked;
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = ''; // Sonuçları sıfırla

    let totalCredits = 0;
    let totalPoints = 0;

    const selectedLanguage = localStorage.getItem('selectedLanguage') || 'en';
    const labels = {
        tr: { gpa: 'Dönem Ortalaması', cgpa: 'Genel Ortalama' },
        en: { gpa: 'Semester GPA', cgpa: 'Cumulative GPA' }
    };

    const texts = labels[selectedLanguage];

    if (option1Checked) {
        // GPA Hesaplama
        const courses = document.getElementsByName('course_code[]');
        const grades = document.getElementsByName('grade[]');
        const credits = document.getElementsByName('credits[]');

        for (let i = 0; i < courses.length; i++) {
            const grade = grades[i].value.toUpperCase();
            const credit = parseFloat(credits[i].value);

            if (!grade || isNaN(credit)) continue;

            const gradePoints = getGradePoints(grade);
            if (gradePoints === null) continue;

            totalCredits += credit;
            totalPoints += gradePoints * credit;
        }

        const gpa = totalPoints / totalCredits;
        resultDiv.innerHTML = `<strong>${texts.gpa}:</strong> ${isNaN(gpa) ? 'N/A' : gpa.toFixed(2)}`;
    } else {
        // CGPA Hesaplama
        const semesterDivs = document.getElementsByClassName('semesterDiv');
        let totalGpa = 0;
        let semesterCount = 0;

        Array.from(semesterDivs).forEach((semesterDiv, index) => {
            const courses = semesterDiv.querySelectorAll('.courseDetail');
            let semesterPoints = 0;
            let semesterCredits = 0;

            Array.from(courses).forEach(course => {
                const grade = course.querySelector('input[name*="grade"]').value.toUpperCase();
                const credit = parseFloat(course.querySelector('input[name*="credits"]').value);

                if (!grade || isNaN(credit)) return;

                const gradePoints = getGradePoints(grade);
                if (gradePoints === null) return;

                semesterCredits += credit;
                semesterPoints += gradePoints * credit;
            });

            const semesterGpa = semesterPoints / semesterCredits;
            if (!isNaN(semesterGpa)) {
                totalGpa += semesterGpa;
                semesterCount++;
                resultDiv.innerHTML += `<strong>${texts.gpa} (${index + 1}):</strong> ${semesterGpa.toFixed(2)}<br>`;
            }
        });

        const cgpa = totalGpa / semesterCount;
        resultDiv.innerHTML += `<strong>${texts.cgpa}:</strong> ${isNaN(cgpa) ? 'N/A' : cgpa.toFixed(2)}`;
    }
}

function getGradePoints(grade) {
    const gradeScale = {
        'A': 4.0, 'A-': 3.7, 'B+': 3.3, 'B': 3.0,
        'B-': 2.7, 'C+': 2.3, 'C': 2.0, 'C-': 1.7,
        'D+': 1.3, 'D': 1.0, 'D-': 0.7, 'F': 0.0,
        'AA': 4.0, 'BA': 3.5, 'BB': 3.0, 'CB': 2.5,
        'CC': 2.0, 'DC': 1.5, 'DD': 1.0, 'FD': 0.5,
        'FF': 0.0
    };

    return gradeScale[grade] || null;
}

function clearFields() {
    document.getElementById('courseDetails').innerHTML = '';
    document.getElementById('result').innerHTML = '';
}
