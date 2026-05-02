<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Experience;
use Illuminate\Http\Request;

class ExperienceController extends Controller
{
    public function index()
    {
        try {
            $experiences = \App\Models\Experience::orderBy('id', 'desc')->get();

            return response()->json($experiences);
        } catch (\Exception $e) {
            \Log::error("Erro na rota de experiências: " . $e->getMessage());
            return response()->json(['error' => 'Erro interno no servidor'], 500);
        }
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'company_name' => 'required|string',
            'role' => 'required|string',
            'period' => 'required|string',
            'description' => 'required|string',
            'tags' => 'nullable|array',
        ]);

        if (!isset($validated['tags'])) {
            $validated['tags'] = [];
        }

        $experience = \App\Models\Experience::create($validated);

        return response()->json($experience);
    }

    public function update(Request $request, $id)
    {
        $experience = Experience::findOrFail($id);
        $validated = $request->validate([
            'company_name' => 'sometimes|string',
            'role' => 'sometimes|string',
            'description' => 'sometimes|string',
            'period' => 'sometimes|string',
            'tags' => 'sometimes|array',
        ]);
        $experience->update($validated);
        return response()->json($experience);
    }

    public function destroy($id)
    {
        Experience::destroy($id);
        return response()->json(['message' => 'Removido']);
    }
}