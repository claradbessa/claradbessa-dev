<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AboutPage extends Model
{
    use HasFactory;

    /**
     * A tabela do banco de dados associada a este model.
     *
     * @var string
     */
    protected $table = 'about_page';

    /**
     * Os atributos que são atribuíveis em massa.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'photo_url',
        'bio',
        'technologies',
    ];

    /**
     * Os atributos que devem ser convertidos para tipos nativos.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'technologies' => 'array',
    ];
}