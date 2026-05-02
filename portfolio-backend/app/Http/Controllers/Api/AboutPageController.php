<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AboutPage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class AboutPageController extends Controller
{
    public function index()
    {
        $aboutData = \App\Models\AboutPage::first() ?: [
            'bio' => '',
            'photo_url' => '',
            'technologies' => []
        ];

        return response()->json($aboutData);
    }

    public function update(Request $request)
    {
        $request->validate([
            'photo_url' => 'sometimes|file|image|max:5120',
            'bio' => 'sometimes|string',
            'technologies' => 'sometimes|array',
        ]);

        $aboutData = AboutPage::first() ?: new AboutPage();

        if ($request->has('bio')) {
            $aboutData->bio = $request->bio;
        } elseif (!$aboutData->exists) {
            $aboutData->bio = "";
        }

        if ($request->hasFile('photo_url')) {
            $path = $request->file('photo_url')->store('about', 'public');
            $aboutData->photo_url = asset('storage/' . $path);
        } elseif ($request->has('photo_url')) {
            $aboutData->photo_url = $request->photo_url;
        } elseif (!$aboutData->exists) {
            $aboutData->photo_url = "";
        }

        if ($request->has('technologies')) {
            $aboutData->technologies = $request->technologies; // ← adicionado
        } elseif (!$aboutData->exists) {
            $aboutData->technologies = [];
        }

        $aboutData->save();

        return response()->json($aboutData);
    }
}