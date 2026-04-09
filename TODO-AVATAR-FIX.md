# Fix Profile Avatar 403 Error & Dashboard Updates

## Status: In Progress

### Steps:
- [x] Analyze files & confirm root cause (avatar path mismatch)
- [x] Run php artisan storage:link (link exists)
- [x] Clear caches (optimize:clear done)
- [x] **Step 1:** Edit `app/Http/Controllers/ProfileController.php` - store full path 'avatars/' + filename in DB
- [ ] **Step 2:** Update existing DB avatars: `UPDATE profiles SET avatar = CONCAT('avatars/', avatar) WHERE avatar IS NOT NULL AND NOT avatar LIKE 'avatars/%';`
- [ ] **Step 3:** Test: Upload new avatar, check /storage/avatars/... loads
- [ ] **Step 4:** Verify dashboard shows profile updates (position, bio, avatar)
- [ ] **Step 5:** Update TODO progress

**Notes:** 
- Image exists: storage/app/public/avatars/1_1774271657.jpg
- Current DB: just '1_1774271657.jpg' → wrong URL /storage/1_...
- After fix: 'avatars/1_...' → correct /storage/avatars/1_...
