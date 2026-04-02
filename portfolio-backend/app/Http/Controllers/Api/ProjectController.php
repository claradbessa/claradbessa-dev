<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Project;
use Illuminate\Http\Request;
use Cloudinary\Configuration\Configuration;
use Cloudinary\Api\Upload\UploadApi;

class ProjectController extends Controller
{
    private UploadApi $uploadApi;

    public function __construct()
    {
        $config = Configuration::instance(config('cloudinary.cloud_url'));
        $this->uploadApi = new UploadApi($config);
    }

    private function uploadToCloudinary($file): string
    {
        $base64 = 'data:' . $file->getMimeType() . ';base64,' . base64_encode(file_get_contents($file));

        $result = $this->uploadApi->upload($base64, [
            'folder' => 'portfolio/projects'
        ]);

        return $result['secure_url'];
    }

    public function index()
    {
        return response()->json(Project::latest()->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'            => 'required|string|max:255',
            'description'     => 'required|string',
            'cover_image_url' => 'required|image|max:5120',
            'stack'           => 'nullable|array',
            'stack.*'         => 'string',
            'links'           => 'nullable|array',
        ]);

        try {
            $validated['cover_image_url'] = $this->uploadToCloudinary($request->file('cover_image_url'));

            $project = Project::create($validated);

            return response()->json([
                'message' => 'Projeto criado com sucesso!',
                'project' => $project
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'error'   => 'Erro ao fazer upload para o Cloudinary.',
                'details' => $e->getMessage()
            ], 500);
        }
    }

    public function show(Project $project)
    {
        return response()->json($project);
    }

    public function update(Request $request, Project $project)
    {
        $validated = $request->validate([
            'name'            => 'sometimes|required|string|max:255',
            'description'     => 'sometimes|required|string',
            'cover_image_url' => 'sometimes|image|max:2048',
            'stack'           => 'nullable|array',
            'stack.*'         => 'string',
            'links'           => 'nullable|array',
        ]);

        try {
            if ($request->hasFile('cover_image_url')) {
                $validated['cover_image_url'] = $this->uploadToCloudinary($request->file('cover_image_url'));
            }

            $project->update($validated);

            return response()->json([
                'message' => 'Projeto atualizado com sucesso!',
                'project' => $project
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'error'   => 'Erro ao atualizar projeto.',
                'details' => $e->getMessage()
            ], 500);
        }
    }

    public function destroy(Project $project)
    {
        try {
            $project->delete();

            return response()->json(['message' => 'Projeto excluído com sucesso!']);

        } catch (\Exception $e) {
            return response()->json([
                'error'   => 'Erro ao excluir projeto.',
                'details' => $e->getMessage()
            ], 500);
        }
    }
}