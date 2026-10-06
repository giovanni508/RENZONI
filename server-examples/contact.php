<?php
/**
 * Handler del form contatti per hosting classico (PHP 8+).
 *
 * Uso:
 *  1. Copia questo file nella cartella pubblicata del sito (accanto a index.html), es. /contact.php
 *  2. Compila CONFIG qui sotto (destinatario, mittente del tuo dominio, eventuale chiave Turnstile)
 *  3. Nel file .env del progetto imposta  VITE_FORM_ENDPOINT=/contact.php  e rifai la build
 *
 * Il form invia application/x-www-form-urlencoded con i campi:
 *   nome, email, telefono, servizio, messaggio, fonte, privacy, _elapsed_ms, _subject, _page
 *   (+ cf-turnstile-response se Turnstile e' attivo)
 * Risponde in JSON: {"ok":true} oppure {"ok":false,"error":"..."} con codice HTTP 4xx/5xx.
 */

const CONFIG = [
    'to'              => '[EMAIL DESTINATARIO DA INSERIRE]',   // dove ricevi le richieste
    'from'            => 'sito@[DOMINIO-DA-INSERIRE].it',      // mittente del TUO dominio (evita lo spam)
    'turnstile_secret'=> '',                                   // chiave segreta Turnstile (vuota = disattivato)
    'min_elapsed_ms'  => 1500,                                 // invii piu' rapidi = bot
    'rate_limit'      => 5,                                    // richieste massime per IP ogni 10 minuti
];

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');

function reply(int $code, array $body): never {
    http_response_code($code);
    echo json_encode($body, JSON_UNESCAPED_UNICODE);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') reply(405, ['ok' => false, 'error' => 'Metodo non consentito']);

// Rate limit semplice per IP (file temporanei)
$ip = $_SERVER['REMOTE_ADDR'] ?? 'x';
$bucket = sys_get_temp_dir() . '/er_form_' . md5($ip);
$hits = array_filter(json_decode(@file_get_contents($bucket) ?: '[]', true) ?: [], fn($t) => $t > time() - 600);
if (count($hits) >= CONFIG['rate_limit']) reply(429, ['ok' => false, 'error' => 'Troppe richieste, riprova piu\' tardi']);
$hits[] = time();
@file_put_contents($bucket, json_encode(array_values($hits)));

$f = fn(string $k, int $max = 500) => trim(mb_substr((string)($_POST[$k] ?? ''), 0, $max));

// Anti-spam: honeypot e tempo di compilazione
if ($f('website') !== '') reply(200, ['ok' => true]);           // il bot crede di aver inviato
if ((int)$f('_elapsed_ms') < CONFIG['min_elapsed_ms']) reply(200, ['ok' => true]);

// Turnstile (facoltativo)
if (CONFIG['turnstile_secret'] !== '') {
    $ctx = stream_context_create(['http' => [
        'method'  => 'POST',
        'header'  => 'Content-Type: application/x-www-form-urlencoded',
        'content' => http_build_query(['secret' => CONFIG['turnstile_secret'], 'response' => $f('cf-turnstile-response', 4096), 'remoteip' => $ip]),
        'timeout' => 8,
    ]]);
    $check = json_decode(@file_get_contents('https://challenges.cloudflare.com/turnstile/v0/siteverify', false, $ctx) ?: '{}', true);
    if (empty($check['success'])) reply(400, ['ok' => false, 'error' => 'Verifica anti-spam non superata']);
}

// Validazione
$nome = $f('nome', 80);
$email = $f('email', 120);
$tel = $f('telefono', 20);
if (mb_strlen($nome) < 2) reply(422, ['ok' => false, 'error' => 'Nome mancante']);
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) reply(422, ['ok' => false, 'error' => 'Email non valida']);
if ($tel !== '' && !preg_match('/^\+?[\d\s().-]{6,20}$/', $tel)) reply(422, ['ok' => false, 'error' => 'Telefono non valido']);
if ($f('privacy') === '') reply(422, ['ok' => false, 'error' => 'Consenso privacy mancante']);

$clean = fn(string $s) => str_replace(["\r", "\n"], ' ', $s); // niente header injection
$body = "Nuova richiesta dal sito\n\n"
      . "Nome: {$nome}\nEmail: {$email}\nTelefono: " . ($tel ?: '-') . "\n"
      . "Servizio: " . ($f('servizio', 60) ?: '-') . "\n"
      . "Come mi hai conosciuta: " . ($f('fonte', 60) ?: '-') . "\n\n"
      . "Messaggio:\n" . ($f('messaggio', 1500) ?: '-') . "\n\n"
      . "Privacy: accettata il " . date('d/m/Y H:i') . " (IP {$ip})\n";

$headers = [
    'From: Sito Erica Renzoni <' . CONFIG['from'] . '>',
    'Reply-To: ' . $clean($nome) . ' <' . $clean($email) . '>',
    'Content-Type: text/plain; charset=UTF-8',
];
$subject = '=?UTF-8?B?' . base64_encode('Richiesta consulenza: ' . $clean($nome)) . '?=';

if (!mail(CONFIG['to'], $subject, $body, implode("\r\n", $headers))) {
    reply(500, ['ok' => false, 'error' => 'Invio non riuscito']);
}
reply(200, ['ok' => true]);
