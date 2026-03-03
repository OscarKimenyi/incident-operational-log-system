<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Role;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run()
    {
        // Call RoleSeeder first
        $this->call(RoleSeeder::class);
        
        // Get roles
        $adminRole = Role::where('name', 'admin')->first();
        $operatorRole = Role::where('name', 'operator')->first();
        $reporterRole = Role::where('name', 'reporter')->first();

        // Create admin user
        User::create([
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'password' => Hash::make('password'),
            'role_id' => $adminRole->id,
        ]);

        // Create operator user
        User::create([
            'name' => 'Operator User',
            'email' => 'operator@example.com',
            'password' => Hash::make('password'),
            'role_id' => $operatorRole->id,
        ]);

        // Create reporter user
        User::create([
            'name' => 'Reporter User',
            'email' => 'reporter@example.com',
            'password' => Hash::make('password'),
            'role_id' => $reporterRole->id,
        ]);

        // Create a second operator for testing
        User::create([
            'name' => 'John Operator',
            'email' => 'john.operator@example.com',
            'password' => Hash::make('password'),
            'role_id' => $operatorRole->id,
        ]);

        // Create a second reporter for testing
        User::create([
            'name' => 'Jane Reporter',
            'email' => 'jane.reporter@example.com',
            'password' => Hash::make('password'),
            'role_id' => $reporterRole->id,
        ]);

        $this->command->info('Database seeded successfully!');
    }
}