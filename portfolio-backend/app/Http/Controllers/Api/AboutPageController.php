<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AboutPage; 
use Illuminate\Http\Request;

class AboutPageController extends Controller
{
    /**
     * Retorna os dados da página "Sobre Mim".
     * Rota pública.
     */
    public function index()
    {
        // Pega a primeira linha da tabela 'about_page'
        $aboutData = AboutPage::first();
        
        // Retorna os dados como JSON
        return response()->json($aboutData);
    }

    /**
     * Atualiza os dados da página "Sobre Mim".
     * Rota privada (admin).
     */
    public function update(Request $request)
    {
        // 1. Validação 
        $validatedData = $request->validate([
            'photo_url' => 'required|url',
            'bio' => 'required|string',
            'technologies' => 'required|array', //
        ]);

        // 2. Atualização
        $aboutData = AboutPage::updateOrCreate(
            ['id' => 1], // Encontra a linha com id 1
            $validatedData // E atualiza com os dados validados
        );

        // 3. Resposta
        return response()->json($aboutData);
    }
}