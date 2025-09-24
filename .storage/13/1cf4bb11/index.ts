import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface OrderData {
  orderId: string;
  customerName: string;
  email: string;
  phone: string;
  address?: string;
  total: number;
  items: OrderItem[];
  paymentMethod: string;
  notes?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { orderData }: { orderData: OrderData } = await req.json();
    
    console.log('📧 Starting email send process for order:', orderData.orderId);
    console.log('📊 Order details:', JSON.stringify(orderData, null, 2));

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get Resend API key from Supabase secrets
    const { data: secretData, error: secretError } = await supabase
      .from('secrets')
      .select('value')
      .eq('name', 'RESEND_API_KEY')
      .single();

    if (secretError) {
      console.error('❌ Error fetching Resend API key:', secretError);
      throw new Error('Failed to fetch email API key');
    }

    const resendApiKey = secretData.value;
    console.log('✅ Successfully retrieved Resend API key');

    // Create email content
    const itemsHtml = orderData.items.map((item: OrderItem) => `
      <tr style="border-bottom: 1px solid #e5e7eb;">
        <td style="padding: 12px; text-align: left;">${item.name}</td>
        <td style="padding: 12px; text-align: center;">${item.quantity}</td>
        <td style="padding: 12px; text-align: right;">${item.price.toLocaleString('vi-VN')}đ</td>
        <td style="padding: 12px; text-align: right; font-weight: 600;">${(item.price * item.quantity).toLocaleString('vi-VN')}đ</td>
      </tr>
    `).join('');

    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Xác nhận đơn hàng - Worksheet</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #10b981, #059669); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Worksheet</h1>
          <p style="color: white; margin: 10px 0 0 0; font-size: 16px;">Cảm ơn bạn đã đặt hàng!</p>
        </div>
        
        <div style="background: white; padding: 30px; border: 1px solid #e5e7eb; border-top: none;">
          <h2 style="color: #10b981; margin-top: 0;">Xác nhận đơn hàng #${orderData.orderId}</h2>
          
          <p>Xin chào <strong>${orderData.customerName}</strong>,</p>
          <p>Chúng tôi đã nhận được đơn hàng của bạn và đang xử lý. Dưới đây là thông tin chi tiết:</p>
          
          <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #374151;">Thông tin khách hàng</h3>
            <p><strong>Họ tên:</strong> ${orderData.customerName}</p>
            <p><strong>Email:</strong> ${orderData.email}</p>
            <p><strong>Số điện thoại:</strong> ${orderData.phone}</p>
            ${orderData.address ? `<p><strong>Địa chỉ:</strong> ${orderData.address}</p>` : ''}
          </div>
          
          <h3 style="color: #374151;">Chi tiết đơn hàng</h3>
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <thead>
              <tr style="background: #f3f4f6;">
                <th style="padding: 12px; text-align: left; border-bottom: 2px solid #e5e7eb;">Sản phẩm</th>
                <th style="padding: 12px; text-align: center; border-bottom: 2px solid #e5e7eb;">Số lượng</th>
                <th style="padding: 12px; text-align: right; border-bottom: 2px solid #e5e7eb;">Đơn giá</th>
                <th style="padding: 12px; text-align: right; border-bottom: 2px solid #e5e7eb;">Thành tiền</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
            <tfoot>
              <tr style="background: #f9fafb;">
                <td colspan="3" style="padding: 15px; text-align: right; font-weight: 600; font-size: 18px;">Tổng cộng:</td>
                <td style="padding: 15px; text-align: right; font-weight: 700; font-size: 18px; color: #10b981;">${orderData.total.toLocaleString('vi-VN')}đ</td>
              </tr>
            </tfoot>
          </table>
          
          <div style="background: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px; padding: 15px; margin: 20px 0;">
            <p style="margin: 0; color: #92400e;"><strong>Phương thức thanh toán:</strong> ${orderData.paymentMethod}</p>
          </div>
          
          ${orderData.notes ? `
          <div style="background: #f0f9ff; border: 1px solid #0ea5e9; border-radius: 8px; padding: 15px; margin: 20px 0;">
            <p style="margin: 0; color: #0c4a6e;"><strong>Ghi chú:</strong> ${orderData.notes}</p>
          </div>
          ` : ''}
          
          <div style="background: #ecfdf5; border: 1px solid #10b981; border-radius: 8px; padding: 20px; margin: 20px 0;">
            <h4 style="margin-top: 0; color: #065f46;">Các bước tiếp theo:</h4>
            <ol style="color: #065f46; margin: 0;">
              <li>Chúng tôi sẽ liên hệ xác nhận đơn hàng trong vòng 24h</li>
              <li>Đội ngũ kỹ thuật bắt đầu thiết kế website theo yêu cầu</li>
              <li>Website hoàn thiện sẽ được bàn giao trong 3-7 ngày làm việc</li>
            </ol>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <p>Cần hỗ trợ? Liên hệ với chúng tôi:</p>
            <p>
              <strong>📞 Hotline:</strong> 0123 456 789<br>
              <strong>✉️ Email:</strong> support@worksheet.vn
            </p>
          </div>
        </div>
        
        <div style="background: #f9fafb; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; border: 1px solid #e5e7eb; border-top: none;">
          <p style="margin: 0; color: #6b7280; font-size: 14px;">
            © 2024 Worksheet. Tất cả quyền được bảo lưu.<br>
            Email này được gửi tự động, vui lòng không trả lời.
          </p>
        </div>
      </body>
      </html>
    `;

    console.log('📝 Email HTML content prepared');

    // Send email using Resend
    const emailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Worksheet <noreply@worksheet.vn>',
        to: [orderData.email],
        subject: `Xác nhận đơn hàng #${orderData.orderId} - Worksheet`,
        html: emailHtml,
      }),
    });

    const emailResult = await emailResponse.json();
    console.log('📧 Email API response:', JSON.stringify(emailResult, null, 2));

    if (!emailResponse.ok) {
      console.error('❌ Email sending failed:', emailResult);
      throw new Error(`Email sending failed: ${JSON.stringify(emailResult)}`);
    }

    console.log('✅ Email sent successfully to:', orderData.email);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Email sent successfully',
        emailId: emailResult.id 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('❌ Error in send-order-email function:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'Unknown error occurred',
        details: error.toString()
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});