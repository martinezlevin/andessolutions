<?php
declare(strict_types=1);

header('Content-Type: text/plain; charset=UTF-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    exit('Método no permitido.');
}

function clean_text(string $value): string
{
    return trim(str_replace(["\r", "\n"], ' ', $value));
}

$name = clean_text((string) ($_POST['name'] ?? ''));
$email = clean_text((string) ($_POST['email'] ?? ''));
$subject = clean_text((string) ($_POST['subject'] ?? ''));
$message = trim((string) ($_POST['message'] ?? ''));
$honeypot = trim((string) ($_POST['website'] ?? ''));

if ($honeypot !== '') {
    exit('OK');
}

if ($name === '' || $subject === '' || $message === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(422);
    exit('Completá los campos obligatorios con un email válido.');
}

$recipient = 'gdmlevin@andessolutions.com.ar';
$mailSubject = '=?UTF-8?B?' . base64_encode('Nueva consulta web: ' . $subject) . '?=';
$body = "Nueva consulta desde andessolutions.com.ar\n\n"
    . "Nombre: {$name}\n"
    . "Email: {$email}\n"
    . "Tema: {$subject}\n\n"
    . "Mensaje:\n{$message}\n";

$headers = [
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'From: Andes Solutions <contacto@andessolutions.com.ar>',
    "Reply-To: {$email}",
    'X-Mailer: Andes Solutions Website',
];

if (!mail($recipient, $mailSubject, $body, implode("\r\n", $headers))) {
    http_response_code(500);
    exit('No se pudo enviar tu consulta. Probá nuevamente o escribinos por email.');
}

exit('OK');
