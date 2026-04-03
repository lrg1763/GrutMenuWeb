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
    // Пустой массив = разрешить Origin только если он совпадает с https:// + HTTP_HOST.
    // Для кириллического домена браузер иногда шлёт punycode в Origin — тогда перечислите оба варианта
    // (точное значение смотрите в DevTools → Network → заголовок Origin у запроса к reservation.php).
    'allowed_origins' => [
        'https://грют.москва',
        // 'https://xn--80aab5a.xn--80asehdb',
    ],

    'mail_to' => 'куда@приходят-заявки.ru',
    'mail_from' => 'отправитель@ваш-домен.ru',
    'mail_subject' => 'Бронь с сайта ГРЮТ',

    /** smtp — Mail.ru, Яндекс и т.д.; mail — функция mail() на SprintHost (если работает без SMTP). */
    'transport' => 'smtp',

    'smtp_host' => 'smtp.mail.ru',
    'smtp_port' => 465,
    'smtp_secure' => true,
    'smtp_user' => 'логин@mail.ru',
    'smtp_pass' => 'пароль-приложения',
];
