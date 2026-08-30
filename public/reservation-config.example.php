<?php
/**
 * Прямой заход в браузере к этому файлу запрещён (пароли не светятся).
 */
if (PHP_SAPI !== 'cli' && isset($_SERVER['SCRIPT_FILENAME']) && realpath($_SERVER['SCRIPT_FILENAME']) === realpath(__FILE__)) {
    header('HTTP/1.0 403 Forbidden');
    exit;
}

/**
 * Скопируйте этот файл как reservation-config.php рядом с reservation.php на хостинге
 * (в корень сайта вместе с index.html из dist). Пароль не коммитьте.
 *
 * @return array<string, mixed>
 */
return [
    // Пустой [] = CORS только если Origin совпадает с текущим сайтом (scheme + HTTP_HOST).
    // Иначе список URL; достаточно https://грют.москва — reservation.php добавит punycode, если есть intl.
    'allowed_origins' => [
        'https://грют.москва',
    ],

    'mail_to' => 'osavchuk.maks@bk.ru',
    'mail_from' => 'osavchuk.maks@bk.ru',
    'mail_subject' => 'Бронь с сайта ГРЮТ',

    /** smtp — Mail.ru, Яндекс и т.д.; mail — функция mail() на SprintHost (если работает без SMTP). */
    'transport' => 'smtp',

    'smtp_host' => 'smtp.mail.ru',
    'smtp_port' => 465,
    'smtp_secure' => true,
    'smtp_user' => 'osavchuk.maks@bk.ru',
    'smtp_pass' => '2CFArLdzoEAozoXXFa6m',
];
