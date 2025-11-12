<?php

namespace Database\Seeders;

use App\Models\HomePage; 
use Illuminate\Database\Seeder;

class HomePageSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Procura por um registro com id = 1.
        // Se não encontrar, cria um novo com esses dados.
        // Se encontrar, atualiza com esses dados.
        HomePage::updateOrCreate(
            ['id' => 1], // Como encontrar
            [
                'main_title' => 'Olá, mundo! Eu sou a Clara Bessa',
                'short_description' => 'Sou uma desenvolvedora apaixonada por tecnologia.',
                'cv_url' => 'https://cv-claradbessa.com/cv.pdf'
            ] // O que atualizar
        );
    }
}