import { NextRequest } from 'next/server';
import { withErrorHandling, createSuccessResponse, createErrorResponse } from '@/server/rest/errors';
import { withRateLimit, getRateLimitConfigForEndpoint } from '@/server/rest/ratelimit';
import { authenticateRequest, isOfflineMode, createMockAuthContext } from '@/server/rest/auth';
import { 
  SubscriptionResponse
} from '@/server/rest/validators';
import { appRouter } from '@/server/api/root';

// GET /api/v1/billing/subscription - Get organization subscription
export const GET = withErrorHandling(
  withRateLimit(async (request: NextRequest) => {
    // Authenticate request
    const auth = isOfflineMode() 
      ? createMockAuthContext('org-1')
      : await authenticateRequest(request);

    // Create tRPC caller
    const caller = appRouter.createCaller({
      user: auth.user,
      supabase: auth.supabase,
      posthog: null,
    });

    try {
      // Call tRPC procedure
      const subscription = await caller.billing.getSubscription({
        orgId: auth.orgId,
      });

      if (!subscription) {
        return createErrorResponse('RESOURCE_NOT_FOUND', 'No subscription found for organization');
      }

      // Transform to REST response format
      const response: SubscriptionResponse = {
        org_id: subscription.org_id,
        plan: subscription.plan,
        status: subscription.status,
        current_period_start: subscription.current_period_start,
        current_period_end: subscription.current_period_end,
        trial_end: subscription.trial_end,
        stripe_sub_id: subscription.stripe_sub_id,
        updated_at: subscription.updated_at,
      };

      return createSuccessResponse(response);
    } catch (error) {
      console.error('Error getting subscription:', error);
      return createErrorResponse('INTERNAL_ERROR', 'Failed to get subscription');
    }
  }, getRateLimitConfigForEndpoint('GET', '/api/v1/billing/subscription'))
);
