<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Resume;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CvReviewController extends Controller
{
    public function index()
    {
        $resumes = Resume::with('user')
            ->orderBy('created_at', 'desc')
            ->paginate(20);
            
        return inertia('Admin/CvReviews', [
            'resumes' => $resumes
        ]);
    }

    public function show($id)
    {
        $resume = Resume::with('user')->findOrFail($id);
        
        return inertia('Admin/CvReview', [
            'resume' => $resume
        ]);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:pending,approved,rejected',
            'feedback' => 'nullable|string|max:1000'
        ]);
        
        $resume = Resume::findOrFail($id);
        $resume->update([
            'status' => $request->status,
            'feedback' => $request->feedback,
            'reviewed_at' => now(),
            'reviewer_id' => Auth::id()
        ]);
        
        return redirect()->back()->with('success', 'CV review updated successfully!');
    }

    public function download($id)
    {
        $resume = Resume::findOrFail($id);
        
        if ($resume->file_base64) {
            $fileContent = base64_decode($resume->file_base64);
            return response($fileContent)
                ->header('Content-Type', $resume->file_mime_type)
                ->header('Content-Disposition', 'attachment; filename="' . $resume->file_name . '"');
        }
        
        return redirect()->back()->with('error', 'File not found!');
    }

    public function destroy($id)
    {
        $resume = Resume::findOrFail($id);
        $resume->delete();
        
        return redirect()->back()->with('success', 'CV deleted successfully!');
    }
}