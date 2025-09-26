import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import nodemailer from 'npm:nodemailer';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface OrderEmailData {
  to: string;
  customerName: string;
  orderId: string;
  orderItems: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  totalAmount: number;
  orderDate: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    let orderData: OrderEmailData;
    
    try {
      orderData = await req.json();
    } catch {
      return new Response(
        JSON.stringify({ error: 'Invalid JSON body' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const { to, customerName, orderId, orderItems, totalAmount, orderDate } = orderData;

    // Validate required fields
    if (!to || !customerName || !orderId || !orderItems || !totalAmount) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Create transporter
    const transporter = nodemailer.createTransporter({
      host: Deno.env.get('SMTP_HOST'),
      port: parseInt(Deno.env.get('SMTP_PORT') || '587'),
      secure: Deno.env.get('SMTP_SECURE') === 'true',
      auth: {
        user: Deno.env.get('SMTP_USER'),
        pass: Deno.env.get('SMTP_PASSWORD'),
      },
    });

    // Format order items for email
    const itemsHtml = orderItems.map((item: { name: string; quantity: number; price: number }) => `
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #eee;">${item.name}</td>
        <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
        <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">${item.price.toLocaleString('vi-VN')}đ</td>
        <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">${(item.price * item.quantity).toLocaleString('vi-VN')}đ</td>
      </tr>
    `).join('');

    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2d5a27;">Xác nhận đơn hàng #${orderId.slice(-8).toUpperCase()}</h2>
        
        <p>Xin chào ${customerName},</p>
        
        <p>Cảm ơn bạn đã đặt hàng tại Worksheet. Chúng tôi đã nhận được đơn hàng của bạn và sẽ xử lý trong thời gian sớm nhất.</p>
        
        <h3 style="color: #2d5a27;">Chi tiết đơn hàng:</h3>
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <thead>
            <tr style="background-color: #f5f5f5;">
              <th style="padding: 12px; text-align: left; border-bottom: 2px solid #ddd;">Sản phẩm</th>
              <th style="padding: 12px; text-align: center; border-bottom: 2px solid #ddd;">Số lượng</th>
              <th style="padding: 12px; text-align: right; border-bottom: 2px solid #ddd;">Đơn giá</th>
              <th style="padding: 12px; text-align: right; border-bottom: 2px solid #ddd;">Thành tiền</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
          <tfoot>
            <tr style="background-color: #f9f9f9;">
              <td colspan="3" style="padding: 12px; font-weight: bold; text-align: right;">Tổng cộng:</td>
              <td style="padding: 12px; font-weight: bold; text-align: right; color: #2d5a27;">${totalAmount.toLocaleString('vi-VN')}đ</td>
            </tr>
          </tfoot>
        </table>
        
        <p><strong>Ngày đặt hàng:</strong> ${new Date(orderDate).toLocaleDateString('vi-VN')}</p>
        
        <h3 style="color: #2d5a27;">Các bước tiếp theo:</h3>
        <ol>
          <li>Chúng tôi sẽ xử lý đơn hàng trong vòng 24 giờ</li>
          <li>Webapp sẽ được triển khai và cấu hình theo yêu cầu</li>
          <li>Bạn sẽ nhận được thông tin truy cập qua email</li>
        </ol>
        
        <p>Nếu bạn có bất kỳ câu hỏi nào, vui lòng liên hệ với chúng tôi qua email này hoặc hotline hỗ trợ.</p>
        
        <p>Trân trọng,<br>Đội ngũ Worksheet</p>
        
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
        <p style="font-size: 12px; color: #666;">
          Email này được gửi tự động, vui lòng không trả lời trực tiếp.
        </p>
      </div>
    `;

    // Send email
    const info = await transporter.sendMail({
      from: Deno.env.get('SMTP_FROM'),
      to: to,
      subject: `Xác nhận đơn hàng #${orderId.slice(-8).toUpperCase()} - Worksheet`,
      html: emailHtml,
    });

    return new Response(
      JSON.stringify({ 
        success: true, 
        messageId: info.messageId,
        message: 'Email sent successfully' 
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error sending email:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to send email',
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
})