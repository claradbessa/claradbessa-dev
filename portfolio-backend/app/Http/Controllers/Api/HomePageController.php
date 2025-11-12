<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\HomePage;
use Illuminate\Http\Request; // <-- Importante que o 'Request' esteja aqui

class HomePageController extends Controller
{
    /**
     * Retorna os dados da página principal.
     */
    public function index()
    {
        $homeData = HomePage::first();
        return response()->json($homeData);
    }

    /**
     * Atualiza os dados da página principal.
     * Esta rota é protegida e só pode ser acessada por admin.
     */
    public function update(Request $request)
    {
        // 1. Validação
        $validatedData = $request->validate([
            'main_title' => 'required|string|max:255',
            'short_description' => 'required|string',
            'cv_url' => 'required|url',
        ]);

        // 2. Atualização
        $homeData = HomePage::updateOrCreate(
            ['id' => 1],
            $validatedData
        );

        // 3. Resposta
        return response()->json($homeData);
    }
}