<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class HomePage extends Model
{
    use HasFactory;

    /**
     * A tabela do banco de dados associada a este model.
     *
     * @var string
     */
    protected $table = 'home_page';

    /**
     * Os atributos que são atribuíveis em massa (mass-assignable).
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'main_title',
        'short_description',
        'cv_url',
    ];
}