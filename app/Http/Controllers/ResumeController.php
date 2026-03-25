<?php

namespace App\Http\Controllers;

use App\Models\Resume;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class ResumeController extends Controller
{
    /**
     * Display the user's CVs
     */
    public function index()
    {
        $resumes = Resume::where('user_id', Auth::id())
            ->orderBy('created_at', 'desc')
            ->get();
            
        // Add debug info
        foreach ($resumes as $resume) {
            Log::info('Resume data:', [
                'id' => $resume->id,
                'file_name' => $resume->file_name,
                'mime_type' => $resume->file_mime_type,
                'has_base64' => !empty($resume->file_base64),
                'base64_length' => strlen($resume->file_base64 ?? ''),
                'data_url_preview' => substr($resume->file_base64 ?? '', 0, 100) . '...',
                'status' => $resume->status
            ]);
        }
            
        return inertia('Cv', [
            'resumes' => $resumes,
            'user' => Auth::user()
        ]);
    }

    /**
     * Store a newly uploaded CV
     */
    public function store(Request $request)
    {
        $request->validate([
            'cv' => 'required|file|mimes:pdf,doc,docx|max:2048',
            'title' => 'nullable|string|max:255'
        ]);

        $file = $request->file('cv');
        
        // Log file information before processing
        Log::info('Processing CV upload:', [
            'original_name' => $file->getClientOriginalName(),
            'mime_type' => $file->getMimeType(),
            'size' => $file->getSize(),
            'extension' => $file->getClientOriginalExtension(),
            'real_path' => $file->getRealPath()
        ]);
        
        // Read file and convert to base64
        $fileContent = file_get_contents($file->getRealPath());
        
        // Validate file content was read successfully
        if ($fileContent === false) {
            Log::error('Failed to read file content: ' . $file->getRealPath());
            return redirect()->back()->with('error', 'Failed to read file content.');
        }
        
        $base64Content = base64_encode($fileContent);
        $mimeType = $file->getMimeType();
        $originalName = $file->getClientOriginalName();
        $fileSize = $file->getSize();
        $extension = $file->getClientOriginalExtension();
        
        // Create the complete data URL format
        // Format: data:filetype/extension;base64,{base64_content}
        $dataUrl = 'data:' . $mimeType . ';base64,' . $base64Content;
        
        // Log data URL information
        Log::info('Data URL created:', [
            'original_size' => $fileSize,
            'base64_content_length' => strlen($base64Content),
            'data_url_length' => strlen($dataUrl),
            'data_url_preview' => substr($dataUrl, 0, 100) . '...',
            'mime_type' => $mimeType,
            'extension' => $extension,
            'file_name' => $originalName
        ]);
        
        // Verify base64 encoding is valid
        $decodedCheck = base64_decode($base64Content, true);
        if ($decodedCheck === false) {
            Log::error('Base64 encoding validation failed');
            return redirect()->back()->with('error', 'File encoding failed. Please try again.');
        }
        
        // Verify decoded content matches original
        if (strlen($decodedCheck) !== $fileSize) {
            Log::warning('Size mismatch after decoding:', [
                'original' => $fileSize,
                'decoded' => strlen($decodedCheck)
            ]);
        }
        
        // Validate data URL format
        if (!preg_match('/^data:([a-zA-Z0-9\/\-.]+);base64,([a-zA-Z0-9\/\+=]+)$/', $dataUrl, $matches)) {
            Log::error('Invalid data URL format generated');
            return redirect()->back()->with('error', 'Failed to generate proper file format.');
        }
        
        Log::info('Data URL validation passed:', [
            'mime_type_from_url' => $matches[1],
            'base64_length_from_url' => strlen($matches[2])
        ]);
        
        // Check if user already has a resume
        $existingResumesCount = Resume::where('user_id', Auth::id())->count();
        
        // Generate a unique filename for storage
        $timestamp = now()->format('Ymd_His');
        $uniqueId = Str::random(8);
        $storedFileName = "cv_{$timestamp}_{$uniqueId}.{$extension}";
        
        // Store the physical file in storage (optional - you can skip this if only using base64)
        $filePath = null;
        try {
            // Store the file in storage disk if you want both physical and base64
            $filePath = $file->store('resumes', 'public');
            Log::info('Physical file stored at:', ['path' => $filePath]);
        } catch (\Exception $e) {
            Log::warning('Could not store physical file:', ['error' => $e->getMessage()]);
            // Continue with base64 only
        }
        
        // Create resume record with complete data URL in file_base64
        try {
            $resume = Resume::create([
                'user_id' => Auth::id(),
                'title' => $request->title ?? pathinfo($originalName, PATHINFO_FILENAME),
                'file_path' => $filePath, // Store physical file path if saved
                'file_base64' => $dataUrl, // Store complete data URL format: data:mime;base64,content
                'file_name' => $originalName, // Store original filename
                'file_size' => $fileSize,
                'file_mime_type' => $mimeType,
                'is_primary' => $existingResumesCount === 0,
                'status' => 'pending',
                'feedback' => null,
                'reviewed_at' => null,
                'reviewer_id' => null
            ]);
            
            Log::info('Resume saved successfully with data URL:', [
                'resume_id' => $resume->id,
                'user_id' => Auth::id(),
                'file_name' => $originalName,
                'stored_name' => $storedFileName,
                'has_base64' => !empty($resume->file_base64),
                'data_url_length' => strlen($resume->file_base64),
                'data_url_format' => substr($resume->file_base64, 0, 50) . '...',
                'status' => $resume->status
            ]);
            
            return redirect()->back()->with('success', 'CV uploaded successfully and sent for review!');
            
        } catch (\Exception $e) {
            Log::error('Failed to save resume:', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return redirect()->back()->with('error', 'Failed to save CV: ' . $e->getMessage());
        }
    }

    /**
     * Delete a CV
     */
    public function destroy($id)
    {
        $resume = Resume::where('user_id', Auth::id())->findOrFail($id);
        
        Log::info('Deleting resume:', [
            'resume_id' => $resume->id,
            'file_name' => $resume->file_name,
            'has_base64' => !empty($resume->file_base64),
            'has_file_path' => !empty($resume->file_path),
            'data_url_preview' => substr($resume->file_base64 ?? '', 0, 100) . '...'
        ]);
        
        // Delete physical file if exists
        if ($resume->file_path && Storage::disk('public')->exists($resume->file_path)) {
            Storage::disk('public')->delete($resume->file_path);
            Log::info('Deleted physical file:', ['path' => $resume->file_path]);
        }
        
        $resume->delete();
        
        return redirect()->back()->with('success', 'CV deleted successfully!');
    }

    /**
     * Download a CV
     */
    public function download($id)
    {
        $resume = Resume::where('user_id', Auth::id())->findOrFail($id);
        
        Log::info('Downloading resume:', [
            'resume_id' => $resume->id,
            'file_name' => $resume->file_name,
            'mime_type' => $resume->file_mime_type,
            'has_base64' => !empty($resume->file_base64),
            'data_url_length' => strlen($resume->file_base64 ?? '')
        ]);
        
        if ($resume->file_base64) {
            // Extract base64 content from data URL
            // Format: data:mime/type;base64,ACTUAL_BASE64_CONTENT
            if (preg_match('/^data:([a-zA-Z0-9\/\-.]+);base64,(.+)$/', $resume->file_base64, $matches)) {
                $base64Content = $matches[2];
                $fileContent = base64_decode($base64Content, true);
                
                if ($fileContent === false) {
                    Log::error('Failed to decode base64 from data URL:', ['resume_id' => $resume->id]);
                    return redirect()->back()->with('error', 'File corrupted. Please upload again.');
                }
                
                // Verify content length matches stored size
                if (strlen($fileContent) !== (int)$resume->file_size) {
                    Log::warning('Size mismatch during download:', [
                        'expected' => $resume->file_size,
                        'actual' => strlen($fileContent)
                    ]);
                }
                
                // Use original filename for download
                $downloadFileName = $resume->file_name;
                
                return response($fileContent)
                    ->header('Content-Type', $resume->file_mime_type)
                    ->header('Content-Disposition', 'attachment; filename="' . $downloadFileName . '"')
                    ->header('Content-Length', strlen($fileContent));
                    
            } else {
                Log::error('Invalid data URL format for download:', [
                    'resume_id' => $resume->id,
                    'data_url_preview' => substr($resume->file_base64, 0, 100)
                ]);
                return redirect()->back()->with('error', 'Invalid file format!');
            }
                
        } elseif ($resume->file_path && Storage::disk('public')->exists($resume->file_path)) {
            return Storage::disk('public')->download($resume->file_path, $resume->file_name);
        }
        
        Log::error('File not found for download:', ['resume_id' => $resume->id]);
        return redirect()->back()->with('error', 'File not found!');
    }

    /**
     * View a CV (returns JSON for preview)
     */
    public function view($id)
    {
        $resume = Resume::where('user_id', Auth::id())->findOrFail($id);
        
        Log::info('Viewing resume:', [
            'resume_id' => $resume->id,
            'file_name' => $resume->file_name,
            'mime_type' => $resume->file_mime_type,
            'has_base64' => !empty($resume->file_base64),
            'data_url_preview' => substr($resume->file_base64 ?? '', 0, 100) . '...'
        ]);
        
        if ($resume->file_base64) {
            // Validate data URL format
            if (!preg_match('/^data:([a-zA-Z0-9\/\-.]+);base64,[a-zA-Z0-9\/\+=]+$/', $resume->file_base64)) {
                Log::error('Invalid data URL format for preview:', ['resume_id' => $resume->id]);
                return response()->json(['error' => 'Invalid file format'], 400);
            }
            
            // Extract and validate base64 content
            preg_match('/^data:([a-zA-Z0-9\/\-.]+);base64,(.+)$/', $resume->file_base64, $matches);
            $base64Content = $matches[2];
            $decoded = base64_decode($base64Content, true);
            
            if ($decoded === false) {
                Log::error('Invalid base64 data for preview:', ['resume_id' => $resume->id]);
                return response()->json(['error' => 'File data is corrupted'], 400);
            }
            
            Log::info('Generated preview data:', [
                'data_url_length' => strlen($resume->file_base64),
                'base64_content_length' => strlen($base64Content),
                'decoded_size' => strlen($decoded)
            ]);
            
            return response()->json([
                'data_url' => $resume->file_base64, // Return the complete data URL
                'mime_type' => $resume->file_mime_type,
                'file_name' => $resume->file_name,
                'file_size' => $resume->file_size,
                'base64_length' => strlen($resume->file_base64)
            ]);
        }
        
        return response()->json(['error' => 'File not found'], 404);
    }

    /**
     * Get data URL from resume (already stored in file_base64)
     */
    private function getDataUrl($resume)
    {
        // The data URL is already stored in file_base64 field
        if ($resume->file_base64 && str_starts_with($resume->file_base64, 'data:')) {
            return $resume->file_base64;
        }
        
        Log::warning('Invalid or missing data URL', [
            'resume_id' => $resume->id ?? null,
            'has_base64' => !empty($resume->file_base64 ?? null),
            'data_url_preview' => substr($resume->file_base64 ?? '', 0, 50)
        ]);
        
        return null;
    }
}