<?php

namespace Database\Seeders;

use App\Models\Application;
use App\Models\Job;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ApplicationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = User::limit(3)->get();
        $jobs = Job::open()->limit(5)->get();

        foreach ($users as $user) {
            foreach ($jobs->random(3) as $job) {
                Application::create([
                    'user_id' => $user->id,
                    'job_id' => $job->id,
    'status' => ['applied', 'review', 'interview', 'rejected'][rand(0,3)],
                ]);
            }
        }
    }
}

