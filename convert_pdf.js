function saveAsPDF() {
    if (typeof window.jspdf !== 'undefined' && typeof window.jspdf.jsPDF !== 'undefined') {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF('p', 'pt', 'a4');
        const selectedLanguage = localStorage.getItem('selectedLanguage') || 'en';
        const isGPA = document.getElementById('option1').checked;
        const resultDiv = document.getElementById('result');
        const semesterDivs = document.getElementsByClassName('semesterDiv');

        // Dil ayarları
        const texts = {
            en: {
                transcriptTitle: 'Transcript of Academic Record',
                courseCode: 'Course Code',
                courseName: 'Course Name',
                credits: 'Credits',
                grade: 'Grade',
                term: 'Term',
                semesterGPA: 'Semester GPA',
                cgpa: 'Cumulative GPA (CGPA)',
                endTranscript: 'END OF TRANSCRIPT',
                fall: 'Fall',
                spring: 'Spring'
            },
            tr: {
                transcriptTitle: 'Akademik Kayıt Transkripti',
                courseCode: 'Ders Kodu',
                courseName: 'Ders Adı',
                credits: 'Kredi',
                grade: 'Not',
                term: 'Dönem',
                semesterGPA: 'Dönem Ortalaması',
                cgpa: 'Genel Not Ortalaması (CGPA)',
                endTranscript: 'TRANSKRİPT SONU',
                fall: 'Güz',
                spring: 'Bahar'
            }
        };

        const labels = texts[selectedLanguage];

        let yOffset = 40;

        // Türkçe karakterleri İngilizce karşılıklarına dönüştürme fonksiyonu
        function replaceTurkishCharacters(text) {
            if (!text) return '';
            const turkishMap = {
                'ı': 'i', 'İ': 'I', 'ğ': 'g', 'Ğ': 'G', 'ü': 'u', 'Ü': 'U',
                'ş': 's', 'Ş': 'S', 'ç': 'c', 'Ç': 'C', 'ö': 'o', 'Ö': 'O'
            };
            return text.split('').map(char => turkishMap[char] || char).join('');
        }

        // Başlık
        doc.setFontSize(14);
        doc.text(replaceTurkishCharacters(labels.transcriptTitle), 40, yOffset);
        yOffset += 30;

        if (isGPA) {
            // İlk seçenek: Sadece dönem GPA
            const courses = document.getElementsByName('course_code[]');
            const grades = document.getElementsByName('grade[]');
            const credits = document.getElementsByName('credits[]');

            // Tablo başlıkları
            doc.setFontSize(12);
            doc.text(replaceTurkishCharacters(labels.courseCode), 40, yOffset);
            doc.text(replaceTurkishCharacters(labels.courseName), 150, yOffset);
            doc.text(replaceTurkishCharacters(labels.credits), 320, yOffset);
            doc.text(replaceTurkishCharacters(labels.grade), 400, yOffset);
            yOffset += 20;

            // Ders detayları
            for (let i = 0; i < courses.length; i++) {
                const courseCode = courses[i]?.value || '';
                const courseName = document.getElementsByName('course_name[]')[i]?.value || '';
                const grade = grades[i]?.value.toUpperCase() || '';
                const credit = credits[i]?.value || '';

                if (courseCode && courseName && grade && credit) {
                    doc.text(replaceTurkishCharacters(courseCode), 40, yOffset);
                    doc.text(replaceTurkishCharacters(courseName), 150, yOffset);
                    doc.text(credit, 320, yOffset);
                    doc.text(grade, 400, yOffset);
                    yOffset += 15;

                    // Sayfa taşması kontrolü
                    if (yOffset > 750) {
                        doc.addPage();
                        yOffset = 40;
                    }
                }
            }

            // GPA sonucu
            const gpaText = resultDiv.innerText.trim();
            if (gpaText) {
                yOffset += 20;
                doc.setFontSize(12);
                doc.text(replaceTurkishCharacters(gpaText), 40, yOffset);
            }
        } else {
            // İkinci seçenek: Hem dönem hem genel GPA
            let totalGpa = 0;
            let totalSemesters = 0;

            Array.from(semesterDivs).forEach((semesterDiv, index) => {
                const year = semesterDiv.querySelector(`input[name="semester_${index}_year"]`).value || '';
                const term = semesterDiv.querySelector(`select[name="semester_${index}_term"]`).value || '';
                const translatedTerm = labels[term.toLowerCase()] || term; // Dönem adını çevir
                const courseDetailsDiv = semesterDiv.querySelector(`#courseDetails_semester_${index}`);
                const courses = courseDetailsDiv.getElementsByClassName('courseDetail');
                let semesterCredits = 0;
                let semesterPoints = 0;

                // Dönem Başlığı
                doc.setFontSize(12);
                doc.setFont('Helvetica', 'bold');
                doc.text(replaceTurkishCharacters(`${year} - ${labels.term}: ${translatedTerm}`), 40, yOffset);
                yOffset += 20;

                // Ders Detayları Tablosu
                doc.setFont('Helvetica', 'normal');
                doc.text(replaceTurkishCharacters(labels.courseCode), 40, yOffset);
                doc.text(replaceTurkishCharacters(labels.courseName), 150, yOffset);
                doc.text(replaceTurkishCharacters(labels.credits), 320, yOffset);
                doc.text(replaceTurkishCharacters(labels.grade), 400, yOffset);
                yOffset += 15;

                Array.from(courses).forEach(course => {
                    const courseInputs = course.getElementsByTagName('input');
                    const courseCode = courseInputs[0]?.value || '';
                    const courseName = courseInputs[1]?.value || '';
                    const grade = courseInputs[2]?.value.toUpperCase() || '';
                    const credit = parseFloat(courseInputs[3]?.value || '0');

                    if (!courseCode || !courseName || !grade || isNaN(credit)) return;

                    const gradePoints = getGradePoints(grade);
                    if (gradePoints === null) return;

                    semesterCredits += credit;
                    semesterPoints += gradePoints * credit;

                    doc.text(replaceTurkishCharacters(courseCode), 40, yOffset);
                    doc.text(replaceTurkishCharacters(courseName), 150, yOffset);
                    doc.text(credit.toString(), 320, yOffset);
                    doc.text(grade, 400, yOffset);
                    yOffset += 15;

                    // Sayfa sonu kontrolü
                    if (yOffset > 750) {
                        doc.addPage();
                        yOffset = 40;
                    }
                });

                // Dönem GPA'sını Hesapla ve Ekle
                const semesterGpa = semesterPoints / semesterCredits;
                if (!isNaN(semesterGpa)) {
                    totalGpa += semesterGpa;
                    totalSemesters++;
                    doc.setFont('Helvetica', 'bold');
                    doc.text(replaceTurkishCharacters(`${labels.semesterGPA}: ${semesterGpa.toFixed(2)}`), 40, yOffset);
                    yOffset += 20;
                }

                // Sayfa sonu kontrolü
                if (yOffset > 750) {
                    doc.addPage();
                    yOffset = 40;
                }
            });

            // CGPA Hesapla ve Ekle
            const cgpa = totalGpa / totalSemesters;
            if (!isNaN(cgpa)) {
                yOffset += 10;
                doc.setFont('Helvetica', 'bold');
                doc.text(replaceTurkishCharacters(`${labels.cgpa}: ${cgpa.toFixed(2)}`), 40, yOffset);
                yOffset += 20;
            }
        }

        // END OF TRANSCRIPT
        doc.setFont('Helvetica', 'italic');
        doc.text(replaceTurkishCharacters(labels.endTranscript), 40, yOffset + 30);

        // PDF İndir
        doc.save('Transcript.pdf');
    } else {
        console.error('jsPDF is not loaded.');
    }
}

function getGradePoints(grade) {
    const gradeScale = {
        'A': 4.0, 'A-': 3.7, 'B+': 3.3, 'B': 3.0,
        'B-': 2.7, 'C+': 2.3, 'C': 2.0, 'C-': 1.7,
        'D+': 1.3, 'D': 1.0, 'D-': 0.7, 'F': 0.0,
        'AA': 4.0, 'BA': 3.5, 'BB': 3.0, 'CB': 2.5,
        'CC': 2.0, 'DC': 1.5, 'DD': 1.0, 'FD': 0.5, 'FF': 0.0
    };

    return gradeScale[grade] || null;
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('saveAsPDFButton').addEventListener('click', saveAsPDF);
});
