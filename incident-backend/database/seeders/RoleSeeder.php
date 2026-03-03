<?php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Role;

class RoleSeeder extends Seeder
{
    public function run()
    {
        $roles = [
            ['name' => 'admin', 'description' => 'Full system access'],
            ['name' => 'operator', 'description' => 'Can update incidents and add comments'],
            ['name' => 'reporter', 'description' => 'Can create and view own incidents'],
        ];

        foreach ($roles as $role) {
            Role::create($role);
        }
    }
}