<?php
declare(strict_types=1);

/**
 * Приём заявок с формы «Бронь» (JSON POST) для статического хостинга (SprintHost и др.).
 * Положите рядом reservation-config.php (скопируйте из reservation-config.example.php).
 */

header('Content-Type: application/json; charset=utf-8');

const COMMENT_MAX = 500;
const PHONE_RE = '/^\+7\d{10}$/';

function json_response(int $code, array $body): void
{
    http_response_code($code);
    echo json_encode($body, JSON_UNESCAPED_UNICODE);
    exit;
}

function safe_substr(string $value, int $start, int $length): string
{
    if (function_exists('mb_substr')) {
        return mb_substr($value, $start, $length);
    }
    if (function_exists('iconv_substr')) {
        $res = iconv_substr($value, $start, $length, 'UTF-8');
        if ($res !== false) {
            return $res;
        }
    }
    return substr($value, $start, $length);
}

/**
 * Кириллический домен в конфиге + punycode в заголовке Origin (расширение intl на хостинге).
 *
 * @param list<string> $list
 * @return list<string>
 */
function expand_allowed_origins(array $list): array
{
    $out = [];
    foreach ($list as $entry) {
        if (!is_string($entry)) {
            continue;
        }
        $entry = trim($entry);
        if ($entry === '') {
            continue;
        }
        $out[] = $entry;
        $parts = parse_url($entry);
        if ($parts === false || !isset($parts['scheme'], $parts['host'])) {
            continue;
        }
        if (function_exists('idn_to_ascii')) {
            $flags = defined('IDNA_DEFAULT') ? IDNA_DEFAULT : 0;
            if (defined('INTL_IDNA_VARIANT_UTS46')) {
                $ascii = @idn_to_ascii($parts['host'], $flags, INTL_IDNA_VARIANT_UTS46);
            } else {
                $ascii = @idn_to_ascii($parts['host'], $flags);
            }
            if ($ascii !== false && $ascii !== $parts['host']) {
                $out[] = $parts['scheme'] . '://' . $ascii;
            }
        }
    }

    return array_values(array_unique($out));
}

function apply_cors(array $cfg): void
{
    header('Access-Control-Allow-Methods: POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type');
    header('Access-Control-Max-Age: 86400');

    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
    if ($origin === '') {
        return;
    }

    $allowed = $cfg['allowed_origins'] ?? [];
    if ($allowed === []) {
        $host = $_SERVER['HTTP_HOST'] ?? '';
        $https = !empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off';
        $scheme = $https ? 'https' : 'http';
        $expected = $scheme . '://' . $host;
        if ($origin === $expected) {
            header('Access-Control-Allow-Origin: ' . $origin);
            header('Vary: Origin');
        }
        return;
    }

    $allowed = expand_allowed_origins($allowed);
    if (in_array($origin, $allowed, true)) {
        header('Access-Control-Allow-Origin: ' . $origin);
        header('Vary: Origin');
    }
}

function load_config(): array
{
    $path = __DIR__ . '/reservation-config.php';
    if (!is_readable($path)) {
        json_response(503, ['ok' => false, 'error' => 'Создайте reservation-config.php рядом с reservation.php']);
    }
    $cfg = require $path;
    return is_array($cfg) ? $cfg : [];
}

function validate_payload(?array $body): array
{
    if ($body === null) {
        return ['error' => 'Некорректное тело запроса'];
    }

    $name = isset($body['name']) && is_string($body['name']) ? trim($body['name']) : '';
    $phone = isset($body['phone']) && is_string($body['phone']) ? trim($body['phone']) : '';
    $date = isset($body['date']) && is_string($body['date']) ? trim($body['date']) : '';
    $time = isset($body['time']) && is_string($body['time']) ? trim($body['time']) : '';
    $bookingRaw = isset($body['bookingType']) && is_string($body['bookingType']) ? trim($body['bookingType']) : '';
    $bookingType = $bookingRaw === 'banquet' ? 'banquet' : ($bookingRaw === 'table' ? 'table' : '');
    $guestsRaw = $body['guests'] ?? null;
    if (is_int($guestsRaw)) {
        $guests = $guestsRaw;
    } elseif (is_string($guestsRaw)) {
        $guests = (int) $guestsRaw;
    } else {
        $guests = 0;
    }
    $comment = isset($body['comment']) && is_string($body['comment'])
        ? safe_substr(trim($body['comment']), 0, COMMENT_MAX)
        : '';

    $missing =
        $name === '' ||
        $phone === '' ||
        $date === '' ||
        $time === '' ||
        $guests < 1 ||
        (is_string($guestsRaw) && trim($guestsRaw) === '') ||
        (!is_string($guestsRaw) && !is_int($guestsRaw));

    if ($missing) {
        return ['error' => 'Заполните все обязательные поля'];
    }

    if (!preg_match(PHONE_RE, $phone)) {
        return ['error' => 'Неверный формат телефона'];
    }

    if ($bookingType === '') {
        return ['error' => 'Некорректный тип бронирования'];
    }

    return [
        'data' => [
            'bookingType' => $bookingType,
            'name' => $name,
            'phone' => $phone,
            'date' => $date,
            'time' => $time,
            'guests' => $guests,
            'comment' => $comment,
            'source' => isset($body['source']) && is_string($body['source']) ? trim($body['source']) : '',
        ],
    ];
}

function build_message_body(array $data): string
{
    $label = $data['bookingType'] === 'banquet' ? 'Забронировать банкет' : 'Забронировать стол';
    $lines = [
        'Новая бронь с сайта ГРЮТ',
        '',
        'Тип: ' . $label,
        'Имя: ' . $data['name'],
        'Телефон: ' . $data['phone'],
        'Дата: ' . $data['date'],
        'Время: ' . $data['time'],
        'Гостей: ' . $data['guests'],
    ];
    if ($data['comment'] !== '') {
        $lines[] = '';
        $lines[] = 'Комментарий: ' . $data['comment'];
    }
    if ($data['source'] !== '') {
        $lines[] = '';
        $lines[] = 'Источник: ' . $data['source'];
    }
    return implode("\n", $lines);
}

function encode_subject(string $subject): string
{
    return '=?UTF-8?B?' . base64_encode($subject) . '?=';
}

function send_via_mail(array $cfg, string $subject, string $textBody): bool
{
    $to = $cfg['mail_to'];
    $from = $cfg['mail_from'];
    $headers = [
        'MIME-Version: 1.0',
        'Content-Type: text/plain; charset=UTF-8',
        'Content-Transfer-Encoding: 8bit',
        'From: ' . $from,
    ];
    return @mail($to, encode_subject($subject), $textBody, implode("\r\n", $headers));
}

function smtp_read_line($fp)
{
    return fgets($fp, 4096);
}

function smtp_expect($fp, string $code): void
{
    $line = smtp_read_line($fp);
    if ($line === false || strncmp($line, $code, strlen($code)) !== 0) {
        throw new RuntimeException('SMTP unexpected: ' . ($line ?: 'EOF'));
    }
    // multiline: 250-... until 250␠
    if (strlen($line) >= 4 && $line[3] === '-') {
        while (($line = smtp_read_line($fp)) !== false) {
            if (strncmp($line, $code, 3) === 0 && isset($line[3]) && $line[3] === ' ') {
                return;
            }
        }
        throw new RuntimeException('SMTP multiline incomplete');
    }
}

function smtp_send_message(array $cfg, string $subject, string $textBody): bool
{
    $host = $cfg['smtp_host'];
    $port = (int) $cfg['smtp_port'];
    $user = $cfg['smtp_user'];
    $pass = $cfg['smtp_pass'];
    $from = $cfg['mail_from'];
    $mailTo = $cfg['mail_to'];

    $useSsl = !empty($cfg['smtp_secure']);
    $remote = ($useSsl && $port === 465) ? "ssl://{$host}:{$port}" : "tcp://{$host}:{$port}";

    $ctx = stream_context_create([
        'ssl' => [
            'verify_peer' => true,
            'verify_peer_name' => true,
        ],
    ]);

    $fp = @stream_socket_client($remote, $errno, $errstr, 30, STREAM_CLIENT_CONNECT, $ctx);
    if (!$fp) {
        error_log("[reservation] SMTP connect: $errstr ($errno)");
        return false;
    }
    stream_set_timeout($fp, 30);

    try {
        smtp_expect($fp, '220');
        fwrite($fp, "EHLO grut-booking\r\n");
        smtp_expect($fp, '250');

        if (!$useSsl && $port === 587) {
            fwrite($fp, "STARTTLS\r\n");
            smtp_expect($fp, '220');
            if (!stream_socket_enable_crypto($fp, true, STREAM_CRYPTO_METHOD_TLS_CLIENT)) {
                throw new RuntimeException('STARTTLS failed');
            }
            fwrite($fp, "EHLO grut-booking\r\n");
            smtp_expect($fp, '250');
        }

        fwrite($fp, "AUTH LOGIN\r\n");
        smtp_expect($fp, '334');
        fwrite($fp, base64_encode($user) . "\r\n");
        smtp_expect($fp, '334');
        fwrite($fp, base64_encode($pass) . "\r\n");
        smtp_expect($fp, '235');

        fwrite($fp, 'MAIL FROM:<' . $from . ">\r\n");
        smtp_expect($fp, '250');

        $recipients = array_map('trim', explode(',', $mailTo));
        foreach ($recipients as $rcpt) {
            if ($rcpt === '') {
                continue;
            }
            fwrite($fp, 'RCPT TO:<' . $rcpt . ">\r\n");
            smtp_expect($fp, '250');
        }

        fwrite($fp, "DATA\r\n");
        smtp_expect($fp, '354');

        $body = preg_replace('/^\./m', '..', $textBody);
        $headers = [
            'From: ' . $from,
            'To: ' . $mailTo,
            'Subject: ' . encode_subject($subject),
            'MIME-Version: 1.0',
            'Content-Type: text/plain; charset=UTF-8',
            'Content-Transfer-Encoding: 8bit',
        ];
        $msg = implode("\r\n", $headers) . "\r\n\r\n" . str_replace("\n", "\r\n", str_replace("\r\n", "\n", $body));
        fwrite($fp, $msg . "\r\n.\r\n");
        smtp_expect($fp, '250');
        fwrite($fp, "QUIT\r\n");
    } catch (Throwable $e) {
        error_log('[reservation] SMTP: ' . $e->getMessage());
        fclose($fp);
        return false;
    }

    fclose($fp);
    return true;
}

// --- main ---

$cfg = load_config();
apply_cors($cfg);

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_response(405, ['ok' => false, 'error' => 'Method not allowed']);
}

$raw = file_get_contents('php://input');
$json = json_decode($raw, true);
$parsed = validate_payload(is_array($json) ? $json : null);
if (isset($parsed['error'])) {
    json_response(400, ['ok' => false, 'error' => $parsed['error']]);
}

$data = $parsed['data'];
$subject = isset($cfg['mail_subject']) && is_string($cfg['mail_subject']) && $cfg['mail_subject'] !== ''
    ? $cfg['mail_subject']
    : 'Бронь с сайта ГРЮТ';
$text = build_message_body($data);

$transport = isset($cfg['transport']) && $cfg['transport'] === 'mail' ? 'mail' : 'smtp';
$ok = false;
if ($transport === 'mail') {
    $ok = send_via_mail($cfg, $subject, $text);
} else {
    $ok = smtp_send_message($cfg, $subject, $text);
}

if ($ok) {
    json_response(200, ['ok' => true]);
}

json_response(502, ['ok' => false, 'error' => 'Не удалось отправить письмо']);
