<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\HomePage;
use Illuminate\Http\Request;

class HomePageController extends Controller
{
    /**
     * Retorna os dados da página principal.
     */
    public function index()
    {
        // Pega a primeira linha da tabela 'home_page'
        $homeData = HomePage::first();

        // Retorna os dados como JSON
        return response()->json($homeData);
    }
}
