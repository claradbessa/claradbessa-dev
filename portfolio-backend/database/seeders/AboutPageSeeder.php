<?php

namespace Database\Seeders;

use App\Models\AboutPage;
use Illuminate\Database\Seeder;

class AboutPageSeeder extends Seeder
{
    public function run(): void
    {
        AboutPage::updateOrCreate(
            ['id' => 1],
            [
                'photo_url' => 'https://url-da-sua-foto.com/foto.jpg',
                'bio' => 'Este é um parágrafo sobre mim. Eu sou uma dev...',
                'technologies' => [ 
                    ['name' => 'React', 'level' => 4],
                    ['name' => 'Laravel', 'level' => 5],
                    ['name' => 'PHP', 'level' => 5]
                ]
            ]
        );
    }
}