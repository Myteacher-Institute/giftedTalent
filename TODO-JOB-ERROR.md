# Job Creation Error Fix

**Issue:** Insert into `jobs` fails on 'user_id' column not found (AdminController::storeJob).

**Possible causes:**
- Migration 0001_01_01_000002_create_jobs_table ran but table missing user_id.
- Conflicting migrations.

**Plan:**
- [x] Step 1: Add user_id column to jobs table via new migration (2026_03_23_100319_add_user_id_to_jobs_table.php, idempotent).
- [x] Step 2: Update AdminController::storeJob to match table fields (removed 'requirements', 'posted_by').
- [x] Step 3: Created 2026_03_23_add_missing_job_fields.php (idempotent add company_location etc.), ran php artisan migrate.
Job creation should now work.

Waiting for DB schema from tinker DESCRIBE jobs.

