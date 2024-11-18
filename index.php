<?php
// Dil dosyasını yükle
$lang = isset($_GET['lang']) && $_GET['lang'] == 'tr' ? 'tr' : 'en';
$translations = include("lang/{$lang}.php");
?>
<!DOCTYPE html>
<html lang="<?php echo $lang; ?>">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title><?php echo $translations['title']; ?></title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <div class="container">
    
    <!-- Üniversite logosu başlığın üstünde olacak -->
    <img src="neu-logo.png" id="neu-logo" alt="University Logo">
    
    <h1 id="pageTitle"><?php echo $translations['title']; ?></h1>

    <div id="languageSelection">
      <label for="languageSelect" id="languageLabel"><?php echo $translations['language']; ?>:</label>
      <select id="languageSelect" onchange="changeLanguage()">
        <option value="tr" <?php echo $lang == 'tr' ? 'selected' : ''; ?>>Türkçe</option>
        <option value="en" <?php echo $lang == 'en' ? 'selected' : ''; ?>>English</option>
      </select>
    </div>
    
    <div id="options">
      <input type="radio" id="option1" name="option" value="option1" checked onchange="toggleMode()">
      <label for="option1" id="labelOption1"><?php echo $translations['option1']; ?></label><br>
      <input type="radio" id="option2" name="option" value="option2" onchange="toggleMode()">
      <label for="option2" id="labelOption2"><?php echo $translations['option2']; ?></label>
    </div>
    
    <div id="gradeSystem">
      <label for="gradeSelect" id="gradeSelectLabel"><?php echo $translations['grade_system']; ?>:</label>
      <select id="gradeSelect" class="styled-input">
        <option value="option1">AA, BA, BB, CB, CC, DC, DD, FD, FF</option>
        <option value="option2">AA, AB, BA, BB, BC, CB, CC, CD, DC, DD, FF</option>
        <option value="option3">A, A-, B+, B, B-, C+, C, C-, D+, D, D-, F</option>
        <option value="option4">A1, A2, A3, B1, B2, B3, C1, C2, C3, D, F</option>
      </select>
    </div>
    
    <div id="courseNumber">
      <label for="courseCount" id="courseCountLabel"><?php echo $translations['course_count']; ?>:</label>
      <input type="number" id="courseCount" class="styled-input" min="1" max="80">
      <button onclick="addCourseFields()" id="addButton"><?php echo $translations['add']; ?></button>
    </div>
    
    <div id="semesterNumber" style="display: none;">
      <label for="semesterCount" id="semesterCountLabel"><?php echo $translations['semester_count']; ?>:</label>
      <input type="number" id="semesterCount" class="styled-input" min="1" max="10">
      <button onclick="addSemesterFields()" id="addSemesterButton" class="green-button"><?php echo $translations['add']; ?></button>
    </div>
    
    <div id="courseDetails">
      <!-- Ders bilgileri dinamik olarak eklenecek -->
    </div>
    
    <div id="buttons">
      <button onclick="calculate()" id="calculateButton"><?php echo $translations['calculate']; ?></button>
      <button onclick="clearFields()" id="clearButton"><?php echo $translations['clear']; ?></button>
      <button id="saveAsPDFButton"><?php echo $translations['save_as_pdf']; ?></button>
    </div>
    
    <div id="result">
      <!-- Hesaplama sonucu burada gösterilecek -->
    </div>
  </div>
  
  <script src="script.js"></script>
  <script src="convert_pdf.js"></script>
  <script src="node_modules/jspdf/dist/jspdf.umd.min.js"></script>
  <script>
    function changeLanguage() {
      const selectedLanguage = document.getElementById('languageSelect').value;
      window.location.href = '?lang=' + selectedLanguage;
    }

    document.addEventListener('DOMContentLoaded', () => {
      const selectedLanguage = '<?php echo $lang; ?>';
      localStorage.setItem('selectedLanguage', selectedLanguage);
    });
  </script>
</body>
</html>