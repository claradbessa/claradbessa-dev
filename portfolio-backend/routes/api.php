<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\HomePageController;

/*
|--------------------------------------------------------------------------
| Rotas Públicas 
|--------------------------------------------------------------------------
*/
Route::get('/home', [HomePageController::class, 'index']); 

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

});

// Importa todas as rotas de autenticação do Breeze (login, logout, etc.) para dentro do prefixo /api
require __DIR__.'/auth.php';