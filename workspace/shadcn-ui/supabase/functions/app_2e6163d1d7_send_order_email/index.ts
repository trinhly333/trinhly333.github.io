import { createClient } from 'npm:@supabase/supabase-js@2';

interface OrderItem {
  product_id?: string;
  id?: string;
  quantity?: number;
}

Deno.serve(async (req) => {
  const corsHeaders = { 
    'Access-Control-Allow-Origin': '*', 
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type', 
    'Access-Control-Allow-Methods': 'POST, OPTIONS' 
  };
  
  if (req.method === 'OPTIONS') { 
    return new Response('ok', { headers: corsHeaders }); 
  }

  const requestId = crypto.randomUUID();
  console.log(`[${requestId}] === ORDER CONFIRMATION EMAIL START ===`);

  try {
    // Parse request body
    const body = await req.json();
    const { orderId } = body;
    
    if (!orderId) {
      throw new Error('Missing orderId in request body');
    }

    console.log(`[${requestId}] Processing order: ${orderId}`);

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    const resendApiKey = Deno.env.get('RESEND_API_KEY');

    if (!supabaseUrl || !supabaseServiceKey || !resendApiKey) {
      throw new Error('Missing required environment variables');
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get order details with customer info
    const { data: orderData, error: orderError } = await supabase
      .from('app_2e6163d1d7_orders')
      .select(`
        *,
        customer:app_2e6163d1d7_customers(*)
      `)
      .eq('id', orderId)
      .single();

    if (orderError || !orderData) {
      throw new Error(`Order not found: ${orderError?.message || 'Unknown error'}`);
    }

    console.log(`[${requestId}] Found order: ${orderData.order_number}`);

    // Validate customer email
    if (!orderData.customer?.email) {
      throw new Error('Customer email not found');
    }

    // Get product details from database (NOT from order.items)
    const orderItems: OrderItem[] = orderData.items || [];
    const productIds = orderItems.map((item: OrderItem) => item.product_id || item.id).filter(Boolean);

    if (productIds.length === 0) {
      throw new Error('No products found in order');
    }

    console.log(`[${requestId}] Fetching ${productIds.length} products from database`);

    // Get fresh product data from database
    const { data: productsData, error: productsError } = await supabase
      .from('app_2e6163d1d7_products')
      .select('*')
      .in('id', productIds);

    if (productsError) {
      throw new Error(`Failed to fetch products: ${productsError.message}`);
    }

    if (!productsData || productsData.length === 0) {
      throw new Error('No products found in database');
    }

    console.log(`[${requestId}] Found ${productsData.length} products`);

    // Validate all products have required links
    const invalidProducts = productsData.filter(product => 
      !product.google_sheet_link || !product.tutorial_video_link
    );

    if (invalidProducts.length > 0) {
      const invalidNames = invalidProducts.map(p => p.name).join(', ');
      throw new Error(`Missing required links for products: ${invalidNames}`);
    }

    // Build product list HTML
    const productListHtml = productsData.map(product => `
      <div style="margin-bottom: 20px; padding: 15px; border: 1px solid #e5e7eb; border-radius: 8px;">
        <h3 style="margin: 0 0 10px 0; color: #1f2937;">${product.name}</h3>
        <p style="margin: 5px 0; color: #6b7280;">${product.description || ''}</p>
        <div style="margin-top: 10px;">
          <a href="${product.google_sheet_link}" 
             style="display: inline-block; margin-right: 15px; padding: 8px 16px; background: #3b82f6; color: white; text-decoration: none; border-radius: 4px;">
            📄 Google Sheet
          </a>
          <a href="${product.tutorial_video_link}" 
             style="display: inline-block; padding: 8px 16px; background: #ef4444; color: white; text-decoration: none; border-radius: 4px;">
            🎥 Video Tutorial
          </a>
        </div>
      </div>
    `).join('');

    // Build email content
    const emailContent = {
      from: 'Worksheet <onboarding@resend.dev>',
      to: orderData.customer.email,
      subject: `Xác nhận đơn hàng #${orderData.order_number}`,
      html: `
        <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
          <div style="background: linear-gradient(135deg, #22c55e 0%, #3b82f6 100%); padding: 30px; color: white; text-align: center;">
            <h1 style="margin: 0; font-size: 28px;">Cảm ơn bạn đã đặt hàng!</h1>
            <p style="margin: 10px 0 0 0; font-size: 16px;">Đơn hàng #${orderData.order_number} của bạn đã được xác nhận</p>
          </div>
          
          <div style="padding: 30px; background: #f9fafb;">
            <h2 style="color: #1f2937; margin-bottom: 20px;">Thông tin đơn hàng</h2>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <p><strong>Mã đơn hàng:</strong> #${orderData.order_number}</p>
              <p><strong>Ngày đặt:</strong> ${new Date(orderData.created_at).toLocaleDateString('vi-VN')}</p>
              <p><strong>Tổng tiền:</strong> ${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(orderData.total_amount)}</p>
            </div>
            
            <h2 style="color: #1f2937; margin-bottom: 20px;">Sản phẩm đã mua</h2>
            ${productListHtml}
            
            <div style="margin-top: 30px; padding: 20px; background: #f0fdf4; border-radius: 8px; border-left: 4px solid #22c55e;">
              <h3 style="color: #15803d; margin-bottom: 15px;">Hỗ trợ khách hàng</h3>
              <p style="color: #166534;">Nếu bạn có bất kỳ câu hỏi nào về đơn hàng hoặc sản phẩm, vui lòng liên hệ:</p>
              <p style="color: #166534;">📧 Email: contact.worksheet.vn@gmail.com</p>
              <p style="color: #166534;">📞 Zalo: 0365905154</p>
            </div>
          </div>
          
          <div style="background: #f3f4f6; padding: 20px; text-align: center; color: #6b7280;">
            <p style="margin: 0;">© 2024 Worksheet. All rights reserved.</p>
          </div>
        </div>
      `
    };

    console.log(`[${requestId}] Sending email to: ${orderData.customer.email}`);

    // Send email via Resend
    const emailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${resendApiKey}`, 
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify(emailContent)
    });

    if (!emailResponse.ok) {
      const errorBody = await emailResponse.json();
      throw new Error(`Resend API Error. Status: ${emailResponse.status}. Details: ${JSON.stringify(errorBody)}`);
    }

    const emailResult = await emailResponse.json();
    console.log(`[${requestId}] Email sent successfully: ${emailResult.id}`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Order confirmation email sent successfully",
        emailId: emailResult.id 
      }), 
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );

  } catch (error) {
    console.error(`[${requestId}] === EMAIL FUNCTION FAILED ===`);
    console.error(`[${requestId}] Error: ${error.message}`);
    console.error(`[${requestId}] Stack: ${error.stack}`);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }), 
      { 
        status: 500, 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );
  }
});