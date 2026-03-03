<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Role;

class RoleSeeder extends Seeder
{
    public function run()
    {
        $roles = [
            [
                'name' => 'admin',
                'description' => 'Full system access - can manage users, assign incidents, and view all data'
            ],
            [
                'name' => 'operator',
                'description' => 'Can update incident status and add comments'
            ],
            [
                'name' => 'reporter',
                'description' => 'Can create incidents and view incidents they reported'
            ],
        ];

        foreach ($roles as $role) {
            Role::updateOrCreate(
                ['name' => $role['name']],
                ['description' => $role['description']]
            );
        }

        $this->command->info('Roles seeded successfully!');
    }
}