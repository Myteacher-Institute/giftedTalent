
<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class SkillSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $skills = [
            // Programming Languages
            ['name' => 'JavaScript', 'category' => 'Programming'],
            ['name' => 'Python', 'category' => 'Programming'],
            ['name' => 'PHP', 'category' => 'Programming'],
            ['name' => 'Java', 'category' => 'Programming'],
            ['name' => 'C++', 'category' => 'Programming'],
            ['name' => 'C#', 'category' => 'Programming'],
            ['name' => 'Ruby', 'category' => 'Programming'],
            ['name' => 'Go', 'category' => 'Programming'],
            ['name' => 'Rust', 'category' => 'Programming'],
            ['name' => 'TypeScript', 'category' => 'Programming'],
            
            // Frontend
            ['name' => 'React', 'category' => 'Frontend'],
            ['name' => 'Vue.js', 'category' => 'Frontend'],
            ['name' => 'Angular', 'category' => 'Frontend'],
            ['name' => 'HTML', 'category' => 'Frontend'],
            ['name' => 'CSS', 'category' => 'Frontend'],
            ['name' => 'Tailwind CSS', 'category' => 'Frontend'],
            ['name' => 'Bootstrap', 'category' => 'Frontend'],
            ['name' => 'Figma', 'category' => 'Design'],
            ['name' => 'Adobe XD', 'category' => 'Design'],
            ['name' => 'Sketch', 'category' => 'Design'],
            
            // Backend
            ['name' => 'Laravel', 'category' => 'Backend'],
            ['name' => 'Node.js', 'category' => 'Backend'],
            ['name' => 'Express.js', 'category' => 'Backend'],
            ['name' => 'Django', 'category' => 'Backend'],
            ['name' => 'Ruby on Rails', 'category' => 'Backend'],
            ['name' => 'Spring Boot', 'category' => 'Backend'],
            
            // Database
            ['name' => 'MySQL', 'category' => 'Database'],
            ['name' => 'PostgreSQL', 'category' => 'Database'],
            ['name' => 'MongoDB', 'category' => 'Database'],
            ['name' => 'Redis', 'category' => 'Database'],
            ['name' => 'SQLite', 'category' => 'Database'],
            ['name' => 'SQL', 'category' => 'Database'],
            
            // DevOps
            ['name' => 'Docker', 'category' => 'DevOps'],
            ['name' => 'Kubernetes', 'category' => 'DevOps'],
            ['name' => 'AWS', 'category' => 'DevOps'],
            ['name' => 'Azure', 'category' => 'DevOps'],
            ['name' => 'GCP', 'category' => 'DevOps'],
            ['name' => 'Git', 'category' => 'DevOps'],
            ['name' => 'CI/CD', 'category' => 'DevOps'],
            
            // Mobile
            ['name' => 'React Native', 'category' => 'Mobile'],
            ['name' => 'Flutter', 'category' => 'Mobile'],
            ['name' => 'Swift', 'category' => 'Mobile'],
            ['name' => 'Kotlin', 'category' => 'Mobile'],
            
            // Other
            ['name' => 'Machine Learning', 'category' => 'Data Science'],
            ['name' => 'Data Analysis', 'category' => 'Data Science'],
            ['name' => 'UI/UX Design', 'category' => 'Design'],
            ['name' => 'Project Management', 'category' => 'Management'],
            ['name' => 'Agile', 'category' => 'Management'],
            ['name' => 'Scrum', 'category' => 'Management'],
        ];

        DB::table('skills')->insert($skills);
    }
}

