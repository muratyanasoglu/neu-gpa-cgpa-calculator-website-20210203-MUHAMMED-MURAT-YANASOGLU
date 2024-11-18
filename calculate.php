<?php
// Notların katsayılarını belirten bir dizi oluşturun
$grade_scale = [
    'A' => 4.0,
    'A-' => 3.7,
    'B+' => 3.3,
    'B' => 3.0,
    'B-' => 2.7,
    'C+' => 2.3,
    'C' => 2.0,
    'C-' => 1.7,
    'D+' => 1.3,
    'D' => 1.0,
    'D-' => 0.7,
    'F' => 0.0,
    'AA' => 4.0,
    'BA' => 3.5,
    'BB' => 3.0,
    'CB' => 2.5,
    'CC' => 2.0,
    'DC' => 1.5,
    'DD' => 1.0,
    'FD' => 0.5,
    'FF' => 0.0
];

// POST verilerini al
$courses = $_POST['course'];
$grades = $_POST['grade'];
$credits = $_POST['credits'];

// Toplam kredi ve puanları hesaplamak için değişkenler
$total_credits = 0;
$total_points = 0;

// Her ders için hesaplama yap
for ($i = 0; $i < count($courses); $i++) {
    $course = $courses[$i];
    $grade = strtoupper($grades[$i]);
    $credit = floatval($credits[$i]);

    if (!empty($course) && !empty($grade) && isset($grade_scale[$grade])) {
        $grade_points = $grade_scale[$grade];
        $total_credits += $credit;
        $total_points += $grade_points * $credit;
    }
}

// GPA ve CGPA hesapla
$gpa = $total_points / $total_credits;
$gpa = is_nan($gpa) ? 0 : $gpa;

// Sonucu JSON olarak döndür
header('Content-Type: application/json');
echo json_encode(['gpa' => round($gpa, 2)]);
?>
