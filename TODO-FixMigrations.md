# TODO: Fix Migrations & Dashboard Error Progress

## Steps:
- [ ] 1. Create TODO and update status
✅ 2. Edit jobs migration: rename table to job_postings (up/down)
✅ 3. Edit applications migration: update job_id FK to job_postings
✅ 4. Edit Job.php model: add $table = 'job_postings';
✅ 5. Edit User.php: update jobs() relationship foreign key = 'job_postings'
- [ ] 6. Run php artisan migrate:refresh
- [ ] 7. Test dashboard loads without error
- [ ] 8. Complete

Current step: 1/8

