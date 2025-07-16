<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // This block ADDS a new column to the 'users' table.
        // It should NOT use ->change() here.
        Schema::table('users', function (Blueprint $table) {
            $table->text('thingsboard_token')->nullable(); // Correct: Adds a new 'text' column, nullable
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // This block removes the column if the migration is rolled back.
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('thingsboard_token');
        });
    }
};
