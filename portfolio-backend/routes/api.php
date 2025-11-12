<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\HomePageController;
use App\Http\Controllers\Api\AboutPageController;

/*
|--------------------------------------------------------------------------
| Rotas Públicas 
|--------------------------------------------------------------------------
*/
Route::get('/home', [HomePageController::class, 'index']); 
Route::get('/about', [AboutPageController::class, 'index']);

// Teste de rota
Route::post('/test-post', function () { 
    return response()->json(['message' => 'O MÉTODO POST FUNCIONOU!', 'status' => 200]);
});

/*
|--------------------------------------------------------------------------
| Rotas de Autenticação (do Breeze)
|--------------------------------------------------------------------------
*/
Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
    return $request->user();
});

/*
|--------------------------------------------------------------------------
| Rotas Privadas (com o prefixo "panel")
|--------------------------------------------------------------------------
*/
Route::middleware(['auth:sanctum'])->prefix('panel')->group(function () {

    Route::post('/home', [HomePageController::class, 'update']);
    Route::post('/about', [AboutPageController::class, 'update']);

});

// Importa todas as rotas de autenticação do Breeze
require __DIR__.'/auth.php';