 # Fix ProfileController - Progress Tracker

Current Status: Step 1/7 - TODO created ✅

## Steps:
- [x] 1. User approved plan
- [x] 2. Edit ProfileController.php: Add Storage import, removeAvatar() method, null-safety ✅
- [x] 3. `php artisan route:clear`
- [x] 4. `npm run dev`
- [ ] 5. Test upload/remove avatar in /profile/edit
- [ ] 6. Verify no console/route errors
- [ ] 7. Update TODO complete + attempt_completion
- [ ] 6. Verify no console/route errors
- [ ] 7. Update TODO complete + attempt_completion

**Status**: ProfileController fixes complete ✅

- Added `removeAvatar()` method 
- Added `use Storage;`
- Enhanced null-safety in uploadAvatar()
- Cleared routes, running `npm run dev`

Test: Visit `/profile/edit` → upload/remove avatar → no errors.

**Next**: User test + verification.
