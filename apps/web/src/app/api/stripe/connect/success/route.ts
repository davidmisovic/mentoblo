import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const supabase = createClient()
  
  // Get the authenticated user
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    // Redirect to login if not authenticated
    return redirect('/login')
  }

  try {
    // Update the user's profile to mark Stripe onboarding as complete
    const { error } = await supabase
      .from('profiles')
      .update({ stripe_onboarding_complete: true })
      .eq('id', user.id)

    if (error) {
      console.error('Error updating Stripe onboarding status:', error)
      // Still redirect to payments page, but with an error state
      return redirect('/dashboard/settings/payments?error=onboarding_update_failed')
    }

    // Redirect back to the payments settings page with success message
    return redirect('/dashboard/settings/payments?success=stripe_connected')
    
  } catch (error) {
    console.error('Error in Stripe Connect success handler:', error)
    return redirect('/dashboard/settings/payments?error=onboarding_failed')
  }
}
