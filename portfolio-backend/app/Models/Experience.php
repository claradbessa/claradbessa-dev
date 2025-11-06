<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Experience extends Model
{
    use HasFactory;

    /**
     * Os atributos que são atribuíveis em massa.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'company_name',
        'role',
        'period',
        'description',
        'tags',
    ];

    /**
     * Os atributos que devem ser "convertidos para tipos nativos.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'tags' => 'array',
    ];
}