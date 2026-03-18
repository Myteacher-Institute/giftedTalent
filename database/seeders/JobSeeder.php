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
        $users = User::limit(5)->get();

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
            Job::create(array_merge($jobData, ['user_id' => $users->random()->id]));
        }
    }
}

