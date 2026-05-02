<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\HomePageController;
use App\Http\Controllers\Api\AboutPageController;
use App\Http\Controllers\Api\ProjectController;
use App\Http\Controllers\Api\SiteConfigController;
use App\Http\Controllers\Api\ExperienceController;
use App\Http\Controllers\Api\MessageController;

/*
|--------------------------------------------------------------------------
| Rotas Públicas (Vitrine)
|--------------------------------------------------------------------------
*/
Route::get('/home', [HomePageController::class, 'index']);
Route::get('/about', [AboutPageController::class, 'index']);
Route::get('/configs', [SiteConfigController::class, 'index']);
Route::get('/projects', [ProjectController::class, 'index']);
Route::get('/projects/{project}', [ProjectController::class, 'show']);
Route::get('/experiences', [ExperienceController::class, 'index']);
Route::post('/contact', [MessageController::class, 'store']);


// Rota de Teste
Route::post('/test-post', function () {
    return response()->json(['message' => 'O MÉTODO POST FUNCIONOU!', 'status' => 200]);
});

/*
|--------------------------------------------------------------------------
| Rotas do painel Administrativo
|--------------------------------------------------------------------------
*/
Route::middleware(['auth:sanctum'])->group(function () {

    // Retorna os dados do usuário logado
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    // Todas as rotas abaixo terão o prefixo /api/panel/
    Route::prefix('panel')->group(function () {

        // Configurações Gerais
        Route::put('/configs', [SiteConfigController::class, 'update']);
        
        // Home e About
        Route::post('/home', [HomePageController::class, 'update']);
        Route::post('/about', [AboutPageController::class, 'update']);

        // Experiências
        Route::post('/experiences', [ExperienceController::class, 'store']);
        Route::put('/experiences/{id}', [ExperienceController::class, 'update']);
        Route::delete('/experiences/{id}', [ExperienceController::class, 'destroy']);

        // CRUD de Projetos
        Route::post('/projects', [ProjectController::class, 'store']);
        Route::post('/projects/{project}', [ProjectController::class, 'update']);
        Route::delete('/projects/{project}', [ProjectController::class, 'destroy']);
    });
});

// Importa as rotas de autenticação (Breeze/Sanctum)
require __DIR__ . '/auth.php';