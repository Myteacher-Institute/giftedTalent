# Dashboard Backend Implementation TODO
Status: [ ] 0% Complete

## Step 1: Create Models & Migrations [ ]
- [x] `php artisan make:model Job -m`

- [x] `php artisan make:model Application -m`

- [ ] Define Job fields: title, company, description, tags, salary, location, status (open/closed)
- [ ] Define Application fields: user_id, job_id, status (applied/review/interview/rejected/offered), applied_at
- [ ] Run `php artisan migrate`

## Step 2: Update User Model Relations [ ]
- [ ] Add `hasMany Applications`, `skills` summary

## Step 3: Create DashboardController [ ]
- [ ] `php artisan make:controller DashboardController`
- [ ] `index()`: Load user + profile + stats + rec jobs
- [ ] Profile completion logic
- [ ] App stats aggregation
- [ ] Job recs: Match user skills to job tags

## Step 4: Update Routes [ ]
- [ ] `/dashboard` → `DashboardController@index`

## Step 5: Seed Sample Data [ ]
- [ ] Create JobSeeder, ApplicationSeeder
- [ ] `php artisan db:seed`

## Step 6: Test & Verify [ ]
- [ ] Visit /dashboard → Check props in Network tab
- [ ] Mark complete: [x]

*Next: User runs migrations → I implement controller → etc.*

