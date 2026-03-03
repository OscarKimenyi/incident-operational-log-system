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
        $this->call(RoleSeeder::class);
        
        // Create test users
        $adminRole = Role::where('name', 'admin')->first();
        $operatorRole = Role::where('name', 'operator')->first();
        $reporterRole = Role::where('name', 'reporter')->first();
        
        User::create([
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'password' => Hash::make('password'),
            'role_id' => $adminRole->id,
        ]);
        
        User::create([
            'name' => 'Operator User',
            'email' => 'operator@example.com',
            'password' => Hash::make('password'),
            'role_id' => $operatorRole->id,
        ]);
        
        User::create([
            'name' => 'Reporter User',
            'email' => 'reporter@example.com',
            'password' => Hash::make('password'),
            'role_id' => $reporterRole->id,
        ]);
    }
}