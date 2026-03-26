<?php

namespace Database\Seeders;

use App\Models\Job;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class JobSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get admin users for admin jobs, fallback to regular users
        $adminUsers = User::where('is_admin', true)->get();
        $regularUsers = User::where('is_admin', false)->limit(5)->get();
        $allUsers = $adminUsers->merge($regularUsers);
        if ($allUsers->isEmpty()) {
            $allUsers = User::limit(10)->get();
        }

        $jobs = [
            [
                'title' => 'Software Engineer',
                'company' => 'BoyAlone Studio',
                'description' => 'Full stack developer role.',
                'tags' => ['React', 'Laravel', 'JavaScript'],
                'salary_range' => '$80k - $120k',
                'location' => 'Remote',
                'status' => 'open',
            ],
            [
                'title' => 'Frontend Developer',
                'company' => 'Tech Innovators',
                'description' => 'React specialist.',
                'tags' => ['React', 'TypeScript'],
                'salary_range' => '$70k - $100k',
                'location' => 'New York',
                'status' => 'open',
            ],
            [
                'title' => 'Full Stack Developer',
                'company' => 'Digital Solutions',
                'description' => 'Node.js and MongoDB.',
                'tags' => ['Node.js', 'MongoDB'],
                'salary_range' => '$90k - $130k',
                'location' => 'San Francisco',
                'status' => 'open',
            ],
            [
                'title' => 'Backend Engineer',
                'company' => 'Cloud Corp',
                'description' => 'PHP Laravel developer.',
                'tags' => ['PHP', 'Laravel'],
                'salary_range' => '$75k - $110k',
                'location' => 'Remote',
                'status' => 'closed',
            ],
            [
                'title' => 'DevOps Engineer',
                'company' => 'InfraTech',
                'description' => 'AWS and Docker.',
                'tags' => ['AWS', 'Docker', 'DevOps'],
                'salary_range' => '$100k - $150k',
                'location' => 'London',
                'status' => 'open',
            ],
        ];

        foreach ($jobs as $jobData) {
            $userId = $allUsers->random()->id;
            // Map fields to model fillable
            Job::create([
                'user_id' => $userId,
                'company_name' => $jobData['company'],
                'company_location' => $jobData['location'],
                'job_title' => $jobData['title'],
                'job_type' => 'Full-time', // Default
                'salary_range' => $jobData['salary_range'],
                'description' => $jobData['description'],
                'status' => $jobData['status'],
                'available_at' => now(),
            ]);

        }

        // Additional admin jobs with varied types
        $adminJobs = [
            [
                'company_name' => 'TechCorp Inc',
                'company_location' => 'Remote',
                'job_title' => 'Senior Software Engineer',
                'job_type' => 'Full-time',
                'salary_range' => '$120k - $160k',
                'description' => 'Lead development team, React & Laravel.',
                'status' => 'open',
            ],
            [
                'company_name' => 'DesignHub',
                'company_location' => 'New York',
                'job_title' => 'UI/UX Designer',
                'job_type' => 'Part-time',
                'salary_range' => '$60k - $90k',
                'description' => 'Design modern interfaces.',
                'status' => 'open',
            ],
            [
                'company_name' => 'CloudScale',
                'company_location' => 'San Francisco',
                'job_title' => 'DevOps Engineer',
                'job_type' => 'Contract',
                'salary_range' => '$100k - $140k',
                'description' => 'CI/CD pipelines, AWS.',
                'status' => 'open',
            ],
            [
                'company_name' => 'FinTech Solutions',
                'company_location' => 'Remote',
                'job_title' => 'Backend Developer',
                'job_type' => 'Remote',
                'salary_range' => '$90k - $130k',
                'description' => 'PHP/Laravel API development.',
                'status' => 'open',
            ],
            [
                'company_name' => 'StartupX',
                'company_location' => 'London',
                'job_title' => 'Full Stack Developer',
                'job_type' => 'Internship',
                'salary_range' => 'Paid Internship',
                'description' => 'Work on real projects.',
                'status' => 'open',
            ],
        ];

        foreach ($adminJobs as $jobData) {
            if ($adminUsers->isNotEmpty()) {
            Job::create(array_merge($jobData, [
                'user_id' => $adminUsers->random()->id,
                'available_at' => now(),
            ]));
            } else {
                Job::create(array_merge($jobData, [
                    'user_id' => $allUsers->random()->id,
                    'available_at' => now(),
                ]));
            }
        }

    }
}

