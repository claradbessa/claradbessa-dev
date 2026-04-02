<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SiteConfig; 
use Illuminate\Http\Request;

class SiteConfigController extends Controller
{
    public function index()
    {
        // Retorna as configurações como um objeto: { "hero_title": "Valor", "bio": "..." }
        return response()->json(SiteConfig::pluck('value', 'key'));
    }

    public function update(Request $request)
    {
        // Valida que 'configs' é um array enviado pelo React
        $request->validate([
            'configs' => 'required|array',
        ]);

        // Percorre o array e atualiza ou cria cada chave no banco
        foreach ($request->input('configs') as $key => $value) {
            SiteConfig::updateOrCreate(
                ['key' => $key],
                ['value' => $value]
            );
        }

        return response()->json(['message' => 'Configurações atualizadas com sucesso!']);
    }
}