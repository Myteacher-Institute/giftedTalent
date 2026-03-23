# Professional User Profile Redesign TODO

## Steps to Complete:

### 1. Backend Preparations [x]
- [x] read_file app/Models/User.php - add profile() relation if missing (already exists)
- [x] edit_file app/Http/Controllers/ProfileController.php - add uploadAvatar method
- [x] edit_file routes/web.php - add POST route for avatar upload
- [x] execute_command 'php artisan storage:link'
- [x] execute_command mkdir -p public/storage/avatars

### 2. Frontend Redesign [x]
- [x] Overhaul resources/css/userProfile.css - professional hero, glassmorphism, responsive
- [x] edit_file resources/js/Pages/userProfile.jsx - dual view/edit, file upload preview, css classes

### 3. Consistency Updates [x]
- [x] edit_file resources/js/Pages/Dashboard.jsx - use profile.avatar_url

### 4. Testing [ ]
- [ ] Test upload/display
- [ ] attempt_completion

Updated as steps complete.

