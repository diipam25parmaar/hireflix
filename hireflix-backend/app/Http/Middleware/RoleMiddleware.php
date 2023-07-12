<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class RoleMiddleware
{
    /**
     * Accepts comma separated roles: role:admin,reviewer
     */
    public function handle(Request $request, Closure $next, ...$roles)
    {
        $user = $request->user();

        if (! $user) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        // roles come as one string if used like role:admin,reviewer - explode if needed
        if (count($roles) === 1 && strpos($roles[0], ',') !== false) {
            $roles = explode(',', $roles[0]);
        }

        if (! in_array($user->role, $roles)) {
            return response()->json(['message' => 'Forbidden. Insufficient role.'], 403);
        }

        return $next($request);
    }
}
