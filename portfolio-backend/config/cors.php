<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    |
    | Aqui você configura quais origens (URLs) podem acessar sua API.
    |
    */

    // Caminhos que o CORS deve monitorar
    'paths' => ['api/*', 'sanctum/csrf-cookie', 'login', 'logout'],

    'allowed_methods' => ['*'],

    // Origens permitidas (seu Frontend)
    'allowed_origins' => [
        env('FRONTEND_URL', 'http://localhost:5173'), 
        'http://localhost:3000',
        'http://claradbessa-dev.test',
    ],

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    // ESSENCIAL: Permite o envio de cookies de sessão (Sanctum)
    'supports_credentials' => true,

];