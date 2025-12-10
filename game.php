<?php
header('Content-Type: application/json');

$raw = file_get_contents('php://input');
$data = json_decode($raw, true);

if (!is_array($data) || !isset($data['player'])) {
    http_response_code(400);
    echo json_encode([
        'error' => 'Invalid request payload.'
    ]);
    exit;
}

$validChoices = ['rock', 'paper', 'scissors'];
$playerChoice = strtolower(trim((string) $data['player']));

if (!in_array($playerChoice, $validChoices, true)) {
    http_response_code(400);
    echo json_encode([
        'error' => 'Unsupported choice provided.'
    ]);
    exit;
}

$computerChoice = $validChoices[random_int(0, count($validChoices) - 1)];
$winMap = [
    'rock' => 'scissors',
    'paper' => 'rock',
    'scissors' => 'paper'
];

$messageMatrix = [
    'rock' => [
        'rock' => "Both opted for rock. It's a stalemate!",
        'paper' => 'Paper wraps rock. Guardian claims victory.',
        'scissors' => 'Rock crushes scissors. You triumph!'
    ],
    'paper' => [
        'rock' => 'Paper blankets rock. You secure the win!',
        'paper' => "Both revealed paper. It's a stalemate!",
        'scissors' => 'Scissors slice paper. Guardian prevails.'
    ],
    'scissors' => [
        'rock' => 'Rock shatters scissors. Guardian prevails.',
        'paper' => 'Scissors carve paper. You triumph!',
        'scissors' => "Twin blades clash. It's a stalemate!"
    ]
];

if ($playerChoice === $computerChoice) {
    $result = 'draw';
} elseif ($winMap[$playerChoice] === $computerChoice) {
    $result = 'win';
} else {
    $result = 'lose';
}

$message = $messageMatrix[$playerChoice][$computerChoice] ?? 'The duel concludes.';

echo json_encode([
    'playerChoice' => $playerChoice,
    'computerChoice' => $computerChoice,
    'result' => $result,
    'message' => $message
]);
