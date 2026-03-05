<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Project; 
use Illuminate\Http\Request;

class ProjectController extends Controller
{
    /**
     * Lista todos os projetos (Público)
     */
    public function index()
    {
        // Retorna todos os projetos do Supabase em ordem do mais recente para o mais antigo
        return response()->json(Project::latest()->get());
    }

    /**
     * Salva um novo projeto (Privado - /panel/projects)
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'cover_image_url' => 'nullable|url',
            'stack' => 'nullable|array',
            'links' => 'nullable|array', 
        ]);

        $project = Project::create($validated);

        return response()->json([
            'message' => 'Projeto criado com sucesso!',
            'project' => $project
        ], 201);
    }

    /**
     * Mostra um projeto específico
     */
    public function show(Project $project)
    {
        return response()->json($project);
    }

    /**
     * Atualiza um projeto existente (Privado)
     */
    public function update(Request $request, Project $project)
    {
        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'description' => 'sometimes|required|string',
            'cover_image_url' => 'nullable|url',
            'stack' => 'nullable|array',
            'links' => 'nullable|array',
        ]);

        $project->update($validated);

        return response()->json([
            'message' => 'Projeto atualizado!',
            'project' => $project
        ]);
    }

    /**
     * Remove um projeto (Privado)
     */
    public function destroy(Project $project)
    {
        $project->delete();

        return response()->json(['message' => 'Projeto excluído com sucesso!']);
    }
}