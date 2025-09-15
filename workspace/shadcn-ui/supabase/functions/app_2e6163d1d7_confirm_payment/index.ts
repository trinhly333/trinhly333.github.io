import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

Deno.serve(async (req) => {
  const requestId = crypto.randomUUID();
  console.log(`[${requestId}] === PAYMENT CONFIRMATION STARTED ===`);
  console.log(`[${requestId}] Method: ${req.method}`);

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    console.log(`[${requestId}] Handling CORS preflight`);
    return new Response(null, {
      status: 204,
      headers: corsHeaders
    });
  }

  try {
    // Parse request body
    let body;
    try {
      body = await req.json();
      console.log(`[${requestId}] Request body parsed:`, JSON.stringify(body));
    } catch (parseError) {
      console.error(`[${requestId}] JSON parse error:`, parseError);
      return new Response(
        JSON.stringify({ error: 'Invalid JSON body', details: parseError.message }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    const { order_id } = body;
    console.log(`[${requestId}] Order ID to process: ${order_id}`);

    if (!order_id) {
      console.error(`[${requestId}] Missing order_id`);
      return new Response(
        JSON.stringify({ error: 'order_id is required' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Check environment variables
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    console.log(`[${requestId}] Environment check:`, {
      hasSupabaseUrl: !!supabaseUrl,
      hasServiceKey: !!supabaseServiceKey,
      supabaseUrl: supabaseUrl?.substring(0, 30) + '...'
    });

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error(`[${requestId}] Missing environment variables`);
      return new Response(
        JSON.stringify({ error: 'Server configuration error' }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Initialize Supabase client
    console.log(`[${requestId}] Initializing Supabase client...`);
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Step 1: Update order status first
    console.log(`[${requestId}] STEP 1: Updating order status to completed`);
    const { data: updateData, error: updateError } = await supabase
      .from('app_2e6163d1d7_orders')
      .update({ status: 'completed' })
      .eq('id', order_id)
      .select();

    console.log(`[${requestId}] Update result:`, { 
      updateData: updateData ? `${updateData.length} rows` : 'null',
      updateError: updateError ? updateError.message : 'none'
    });

    if (updateError) {
      console.error(`[${requestId}] Database update failed:`, updateError);
      return new Response(
        JSON.stringify({ 
          error: 'Failed to update order status', 
          details: updateError.message,
          code: updateError.code 
        }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    if (!updateData || updateData.length === 0) {
      console.error(`[${requestId}] No order found with ID: ${order_id}`);
      return new Response(
        JSON.stringify({ error: 'Order not found or already processed' }),
        { 
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    console.log(`[${requestId}] Order status updated successfully`);

    // Step 2: Fetch order details for email (optional step)
    console.log(`[${requestId}] STEP 2: Fetching order details for email...`);
    const { data: order, error: fetchError } = await supabase
      .from('app_2e6163d1d7_orders')
      .select(`
        *,
        customer:app_2e6163d1d7_customers(*)
      `)
      .eq('id', order_id)
      .single();

    if (fetchError || !order) {
      console.warn(`[${requestId}] Could not fetch order details for email:`, fetchError);
      // Don't fail the whole operation, just skip email
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Payment confirmed (email skipped due to fetch error)',
          order_id: order_id
        }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    console.log(`[${requestId}] Order details:`, {
      order_number: order.order_number,
      customer_email: order.customer?.email,
      total_amount: order.total_amount
    });

    // For now, skip email to ensure the core functionality works
    console.log(`[${requestId}] SUCCESS: Payment confirmation completed (email temporarily disabled)`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Payment confirmed successfully',
        order_number: order.order_number,
        order_id: order_id,
        status: 'completed'
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error(`[${requestId}] FATAL ERROR:`, {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        details: error.message,
        requestId: requestId
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});