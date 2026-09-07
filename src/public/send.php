<?php

declare(strict_types=1);

const JSON_FLAGS = JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE | JSON_THROW_ON_ERROR;
const SERVICE_LABELS = [
	'support' => 'Podpora',
	'infrastructure' => 'IT infraštruktúra',
	'security' => 'Bezpečnosť',
];

function loadEnvironmentFile(string $path): void
{
	if (!is_readable($path)) {
		return;
	}

	$lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);

	if ($lines === false) {
		return;
	}

	foreach ($lines as $line) {
		$line = trim($line);

		if ($line === '' || str_starts_with($line, '#')) {
			continue;
		}

		$separator = strpos($line, '=');

		if ($separator === false) {
			continue;
		}

		$name = trim(substr($line, 0, $separator));
		$value = trim(substr($line, $separator + 1));

		if (preg_match('/^[A-Z_][A-Z0-9_]*$/', $name) !== 1) {
			continue;
		}

		if (strlen($value) >= 2 && (($value[0] === '"' && $value[-1] === '"') || ($value[0] === "'" && $value[-1] === "'"))) {
			$value = substr($value, 1, -1);
		}

		$currentValue = getenv($name);

		if ($currentValue === false || trim($currentValue) === '') {
			putenv($name . '=' . $value);
		}
	}
}

loadEnvironmentFile('/etc/itempire/.env');
loadEnvironmentFile(dirname(__DIR__) . '/.env');
loadEnvironmentFile(dirname(__DIR__, 2) . '/.env');

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');

function respond(int $status, array $data): void
{
	http_response_code($status);
	echo json_encode($data, JSON_FLAGS);
	exit;
}

function input(string $name): string
{
	$value = $_POST[$name] ?? '';

	return is_string($value) ? trim($value) : '';
}

function environmentAny(array $names, ?string $fallback = null): string
{
	foreach ($names as $name) {
		$value = getenv($name);
		$value = is_string($value) ? trim($value) : '';

		if ($value !== '') {
			return $value;
		}
	}

	if ($fallback !== null) {
		return $fallback;
	}

	throw new RuntimeException(sprintf('Missing required environment variable: %s', implode(' or ', $names)));
}

function post(string $url, string $body, array $headers): array
{
	$handle = curl_init($url);

	if ($handle === false) {
		throw new RuntimeException('Unable to initialize the HTTP client.');
	}

	curl_setopt_array($handle, [
		CURLOPT_POST => true,
		CURLOPT_POSTFIELDS => $body,
		CURLOPT_HTTPHEADER => $headers,
		CURLOPT_RETURNTRANSFER => true,
		CURLOPT_CONNECTTIMEOUT => 10,
		CURLOPT_TIMEOUT => 20,
	]);

	$responseBody = curl_exec($handle);
	$status = (int) curl_getinfo($handle, CURLINFO_RESPONSE_CODE);
	$error = curl_error($handle);

	if ($responseBody === false) {
		throw new RuntimeException(sprintf('HTTP request failed: %s', $error));
	}

	return [$status, $responseBody];
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
	header('Allow: POST');
	respond(405, ['message' => 'Táto požiadavka nie je povolená.']);
}

$contentLength = (int) ($_SERVER['CONTENT_LENGTH'] ?? 0);

if ($contentLength > 32768) {
	respond(413, ['message' => 'Odoslané údaje sú príliš veľké.']);
}

if (input('website') !== '') {
	respond(200, ['message' => 'Ďakujeme, správa bola úspešne odoslaná.']);
}

$name = input('name');
$email = input('email');
$phone = input('phone');
$service = input('service');
$message = input('message');
$consent = input('consent') !== '' ? 'Áno' : 'Nie';
$phoneDigits = preg_replace('/\D+/', '', $phone) ?? '';

$isValid = mb_strlen($name) >= 2
	&& mb_strlen($name) <= 120
	&& mb_strlen($email) <= 254
	&& filter_var($email, FILTER_VALIDATE_EMAIL) !== false
	&& mb_strlen($phone) <= 30
	&& preg_match('/^[0-9+().\/\s-]+$/u', $phone) === 1
	&& strlen($phoneDigits) >= 7
	&& array_key_exists($service, SERVICE_LABELS)
	&& mb_strlen($message) <= 5000;

if (!$isValid) {
	respond(422, ['message' => 'Skontrolujte, prosím, zadané údaje.']);
}

try {
	$tenantId = environmentAny(['MICROSOFT_TENANT_ID', 'MICROSOFT_GRAPH_TENANT_ID']);
	$clientId = environmentAny(['MICROSOFT_CLIENT_ID', 'MICROSOFT_GRAPH_CLIENT_ID']);
	$clientSecret = environmentAny(['MICROSOFT_CLIENT_SECRET', 'MICROSOFT_GRAPH_CLIENT_SECRET']);
	$senderEmail = environmentAny(['MICROSOFT_SENDER_EMAIL', 'MICROSOFT_GRAPH_SENDER_EMAIL', 'MAIL_FROM_ADDRESS', 'MAIL_USERNAME']);
	$recipientEmail = environmentAny(['CONTACT_RECIPIENT_EMAIL', 'MAIL_TO_ADDRESS', 'MAIL_USERNAME'], $senderEmail);

	if (filter_var($senderEmail, FILTER_VALIDATE_EMAIL) === false || filter_var($recipientEmail, FILTER_VALIDATE_EMAIL) === false) {
		throw new RuntimeException('The configured sender or recipient email address is invalid.');
	}

	$tokenRequest = http_build_query(
		[
			'client_id' => $clientId,
			'client_secret' => $clientSecret,
			'scope' => 'https://graph.microsoft.com/.default',
			'grant_type' => 'client_credentials',
		],
		'',
		'&',
		PHP_QUERY_RFC3986,
	);
	[$tokenStatus, $tokenBody] = post(
		sprintf('https://login.microsoftonline.com/%s/oauth2/v2.0/token', rawurlencode($tenantId)),
		$tokenRequest,
		['Content-Type: application/x-www-form-urlencoded'],
	);
	$tokenData = json_decode($tokenBody, true, 512, JSON_THROW_ON_ERROR);
	$accessToken = is_array($tokenData) && isset($tokenData['access_token']) && is_string($tokenData['access_token']) ? $tokenData['access_token'] : '';

	if ($tokenStatus !== 200 || $accessToken === '') {
		throw new RuntimeException(sprintf('Microsoft identity token request failed with status %d.', $tokenStatus));
	}

	$subject = sprintf('[ITEmpire] Kontaktný formulár – %s', SERVICE_LABELS[$service]);
	$mailBody = implode("\n", [
		sprintf('Meno: %s', $name),
		sprintf('E-mail: %s', $email),
		sprintf('Telefón: %s', $phone),
		sprintf('Typ služby: %s', SERVICE_LABELS[$service]),
		sprintf('Marketingový súhlas: %s', $consent),
		'',
		'Správa:',
		$message !== '' ? $message : '—',
	]);
	$mailRequest = json_encode(
		[
			'message' => [
				'subject' => $subject,
				'body' => [
					'contentType' => 'Text',
					'content' => $mailBody,
				],
				'toRecipients' => [
					[
						'emailAddress' => ['address' => $recipientEmail],
					],
				],
				'replyTo' => [
					[
						'emailAddress' => [
							'name' => $name,
							'address' => $email,
						],
					],
				],
			],
		],
		JSON_FLAGS,
	);
	[$mailStatus] = post(
		sprintf('https://graph.microsoft.com/v1.0/users/%s/sendMail', rawurlencode($senderEmail)),
		$mailRequest,
		[
			'Authorization: Bearer ' . $accessToken,
			'Content-Type: application/json',
		],
	);

	if ($mailStatus !== 202) {
		throw new RuntimeException(sprintf('Microsoft Graph sendMail request failed with status %d.', $mailStatus));
	}

	respond(200, ['message' => 'Ďakujeme, správa bola úspešne odoslaná.']);
} catch (Throwable $exception) {
	error_log(sprintf('[contact-form] %s', $exception->getMessage()));
	respond(502, ['message' => 'Správu sa nepodarilo odoslať. Skúste to, prosím, znova.']);
}
