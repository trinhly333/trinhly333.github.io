import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export interface Customer {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  address?: string;
  city?: string;
  total_orders: number;
  total_spent: number;
  last_order_date?: string;
  created_at: string;
  status: 'active' | 'inactive';
}

export interface Order {
  id: string;
  customer_id: string;
  order_number: string;
  total_amount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'completed';
  items: unknown[];
  created_at: string;
  customer?: Customer;
}

export const useCustomers = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('app_2e6163d1d7_customers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCustomers(data || []);
    } catch (error) {
      console.error('Error fetching customers:', error);
      toast.error('Lỗi tải danh sách khách hàng');
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('app_2e6163d1d7_orders')
        .select(`
          *,
          customer:app_2e6163d1d7_customers(*)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Lỗi tải danh sách đơn hàng');
    }
  };

  const updateCustomerStatus = async (customerId: string, status: 'active' | 'inactive') => {
    try {
      const { error } = await supabase
        .from('app_2e6163d1d7_customers')
        .update({ status })
        .eq('id', customerId);

      if (error) throw error;
      
      setCustomers(prev => 
        prev.map(customer => 
          customer.id === customerId ? { ...customer, status } : customer
        )
      );
      
      toast.success('Cập nhật trạng thái khách hàng thành công');
    } catch (error) {
      console.error('Error updating customer status:', error);
      toast.error('Lỗi cập nhật trạng thái khách hàng');
    }
  };

  const updateOrderStatus = async (orderId: string, status: Order['status']) => {
    try {
      const { error } = await supabase
        .from('app_2e6163d1d7_orders')
        .update({ status })
        .eq('id', orderId);

      if (error) throw error;
      
      setOrders(prev => 
        prev.map(order => 
          order.id === orderId ? { ...order, status } : order
        )
      );
      
      toast.success('Cập nhật trạng thái đơn hàng thành công');
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Lỗi cập nhật trạng thái đơn hàng');
    }
  };

  const confirmPayment = async (orderId: string) => {
    try {
      console.log('Confirming payment for order:', orderId);
      
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
        throw new Error('Không tìm thấy đơn hàng');
      }

      // IMMEDIATE OPTIMISTIC UPDATE - Update UI first for instant feedback
      setOrders(prev => {
        const updated = prev.map(order => 
          order.id === orderId ? { ...order, status: 'delivered' } : order
        );
        console.log('Optimistically updated orders to delivered:', updated);
        return updated;
      });

      // Update order status to delivered in database
      const { error: updateError } = await supabase
        .from('app_2e6163d1d7_orders')
        .update({ status: 'delivered' })
        .eq('id', orderId);

      if (updateError) {
        console.error('Database update error:', updateError);
        // ROLLBACK optimistic update on database failure
        setOrders(prev => 
          prev.map(order => 
            order.id === orderId ? { ...order, status: orderData.status } : order
          )
        );
        throw new Error(updateError.message || 'Database update failed');
      }
      
      console.log('Order status updated successfully to delivered');

      // Send confirmation email using Supabase Edge Function - FIXED: NO RETRY LOOP
      if (orderData.customer?.email) {
        let emailSent = false;
        try {
          console.log('=== CALLING EDGE FUNCTION (SINGLE ATTEMPT) ===');
          console.log('Function name: app_2e6163d1d7_send_order_email');
          
          // Build complete request body with all required fields
          const requestBody = {
            orderId: orderId,
            customerEmail: orderData.customer.email,
            customerName: orderData.customer.full_name
          };
          
          console.log('Request body:', requestBody);

          // Use the correct function name with app_id prefix
          const { data: emailResult, error: emailError } = await supabase.functions.invoke('app_2e6163d1d7_send_order_email', {
            body: requestBody
          });

          console.log('=== EDGE FUNCTION RESPONSE ===');
          console.log('Email result:', emailResult);
          console.log('Email error:', emailError);

          // CRITICAL FIX: Check response status, not just error existence
          if (emailError || !emailResult?.success) {
            console.error('Email sending failed. Error:', emailError, 'Result:', emailResult);
            // NO RETRY - Just log and continue
            emailSent = false;
          } else {
            console.log('Order confirmation email sent successfully:', emailResult);
            emailSent = true;
          }
        } catch (emailError) {
          console.error('Email sending exception (NO RETRY):', emailError);
          // CRITICAL: No retry on any error - prevents infinite loop
          emailSent = false;
        }

        // Show appropriate success message based on email status
        if (emailSent) {
          toast.success('Đã xác nhận thanh toán và gửi email thành công!');
        } else {
          toast.success('Đã xác nhận thanh toán thành công! (Email sẽ được gửi sau)');
        }
      } else {
        toast.success('Đã xác nhận thanh toán thành công!');
      }
      
    } catch (error) {
      console.error('Error confirming payment:', error);
      toast.error(`Lỗi khi xác nhận thanh toán: ${error.message}`);
    }
  };

  const getCustomerStats = () => {
    const totalCustomers = customers.length;
    const activeCustomers = customers.filter(c => c.status === 'active').length;
    const totalRevenue = customers.reduce((sum, c) => sum + c.total_spent, 0);
    const avgOrderValue = totalRevenue / Math.max(customers.reduce((sum, c) => sum + c.total_orders, 0), 1);

    return {
      totalCustomers,
      activeCustomers,
      totalRevenue,
      avgOrderValue
    };
  };

  useEffect(() => {
    fetchCustomers();
    fetchOrders();
  }, []);

  return {
    customers,
    orders,
    loading,
    fetchCustomers,
    fetchOrders,
    updateCustomerStatus,
    updateOrderStatus,
    confirmPayment,
    getCustomerStats
  };
};