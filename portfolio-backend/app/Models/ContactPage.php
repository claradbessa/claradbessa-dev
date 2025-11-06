<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ContactPage extends Model
{
    use HasFactory;

    /**
     * A tabela do banco de dados associada a este model.
     *
     * @var string
     */
    protected $table = 'contact_page';

    /**
     * Os atributos que são atribuíveis em massa.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'main_text',
        'contact_links',
        'social_icons',
    ];

    /**
     * Os atributos que devem ser convertidos para tipos nativos.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'contact_links' => 'array',
        'social_icons' => 'array',
    ];
}