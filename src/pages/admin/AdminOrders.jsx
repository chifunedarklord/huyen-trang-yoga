import { useEffect, useState } from 'react'
import { Search, Eye, Filter, CheckCircle, Clock, Truck, XCircle, ShoppingBag, X } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { formatPrice } from '../../utils/helpers'
import toast from 'react-hot-toast'
import './AdminShared.css'

export default function AdminOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [orderItems, setOrderItems] = useState([])
  const [loadingItems, setLoadingItems] = useState(false)

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      toast.error('Lỗi khi tải đơn hàng')
    } else {
      setOrders(data || [])
    }
    setLoading(false)
  }

  const handleViewDetails = async (order) => {
    setSelectedOrder(order)
    setLoadingItems(true)
    const { data, error } = await supabase
      .from('order_items')
      .select('*, products(name, images)')
      .eq('order_id', order.id)

    if (!error) {
      setOrderItems(data || [])
    }
    setLoadingItems(false)
  }

  const handleUpdateStatus = async (orderId, newStatus, newPaymentStatus) => {
    try {
      const updateData = {}
      if (newStatus) updateData.status = newStatus
      if (newPaymentStatus) updateData.payment_status = newPaymentStatus

      const { error } = await supabase
        .from('orders')
        .update(updateData)
        .eq('id', orderId)

      if (error) throw error
      toast.success('Cập nhật trạng thái đơn hàng thành công!')
      
      // Update local state
      setOrders(orders.map(o => o.id === orderId ? { ...o, ...updateData } : o))
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder({ ...selectedOrder, ...updateData })
      }
    } catch (err) {
      toast.error('Lỗi cập nhật: ' + err.message)
    }
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'delivered': return <span className="badge badge-success">Đã giao</span>
      case 'shipping': return <span className="badge badge-info">Đang vận chuyển</span>
      case 'confirmed': return <span className="badge badge-info">Đã xác nhận</span>
      case 'processing': return <span className="badge badge-warning">Đang xử lý</span>
      case 'cancelled': return <span className="badge badge-danger">Đã hủy</span>
      default: return <span className="badge badge-warning">Chờ xử lý</span>
    }
  }

  const getPaymentBadge = (status) => {
    switch (status) {
      case 'paid': return <span className="badge badge-success">Đã thanh toán</span>
      case 'refunded': return <span className="badge badge-danger">Đã hoàn tiền</span>
      default: return <span className="badge badge-warning">Chưa thanh toán</span>
    }
  }

  const filtered = orders.filter(o => {
    const matchSearch =
      (o.order_number || '').toLowerCase().includes(search.toLowerCase()) ||
      (o.shipping_name || '').toLowerCase().includes(search.toLowerCase()) ||
      (o.shipping_phone || '').includes(search)
    const matchStatus = statusFilter === 'all' || o.status === statusFilter
    return matchSearch && matchStatus
  })

  return (
    <div className="admin-orders-page">
      <div className="admin-header">
        <div className="admin-title-area">
          <h1>Quản Lý Đơn Hàng</h1>
          <p>Xem danh sách đặt hàng và theo dõi vận chuyển sản phẩm yoga</p>
        </div>
      </div>

      <div className="admin-filter-bar">
        <div className="admin-search-box">
          <Search size={18} color="var(--text-muted)" />
          <input
            type="text"
            placeholder="Tìm theo mã đơn, người nhận, số ĐT..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="admin-filter-controls">
          <select
            className="admin-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="pending">Chờ xử lý</option>
            <option value="confirmed">Đã xác nhận</option>
            <option value="processing">Đang chuẩn bị hàng</option>
            <option value="shipping">Đang giao</option>
            <option value="delivered">Đã giao thành công</option>
            <option value="cancelled">Đã hủy</option>
          </select>
          <span style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
            <strong>{filtered.length}</strong> đơn hàng
          </span>
        </div>
      </div>

      <div className="admin-table-container">
        {loading ? (
          <p className="empty-state">Đang tải danh sách đơn hàng...</p>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <ShoppingBag size={40} style={{ margin: '0 auto 12px', opacity: 0.5 }} />
            <p>Không tìm thấy đơn hàng nào.</p>
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Mã Đơn</th>
                <th>Khách Hàng</th>
                <th>Ngày Đặt</th>
                <th>Phương Thức</th>
                <th>Tổng Tiền</th>
                <th>Thanh Toán</th>
                <th>Trạng Thái</th>
                <th>Thao Tác</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(order => (
                <tr key={order.id}>
                  <td style={{ fontWeight: 600 }}>#{order.order_number || order.id.slice(0, 8)}</td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{order.shipping_name || 'Khách lẻ'}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{order.shipping_phone}</div>
                  </td>
                  <td style={{ fontSize: '0.85rem' }}>
                    {new Date(order.created_at).toLocaleDateString('vi-VN')}
                  </td>
                  <td>
                    <span className="badge badge-secondary">
                      {order.payment_method === 'cod' ? 'COD' : 'Chuyển khoản'}
                    </span>
                  </td>
                  <td style={{ fontWeight: 600, color: 'var(--primary)' }}>
                    {formatPrice(order.total_amount)}
                  </td>
                  <td>{getPaymentBadge(order.payment_status)}</td>
                  <td>{getStatusBadge(order.status)}</td>
                  <td>
                    <button
                      className="btn-icon"
                      title="Xem chi tiết"
                      onClick={() => handleViewDetails(order)}
                    >
                      <Eye size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Detail Modal */}
      {selectedOrder && (
        <div className="modal-overlay" onClick={() => setSelectedOrder(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: 700 }}>
            <div className="modal-header">
              <h2>Chi Tiết Đơn Hàng #{selectedOrder.order_number || selectedOrder.id.slice(0, 8)}</h2>
              <button className="btn-icon" onClick={() => setSelectedOrder(null)}>
                <X size={18} />
              </button>
            </div>
            <div className="modal-body">
              {/* Receiver Info */}
              <div style={{ background: 'var(--bg-secondary)', padding: '16px', borderRadius: '12px', marginBottom: '20px' }}>
                <h4 style={{ marginBottom: 8, fontSize: '0.95rem' }}>Thông tin người nhận</h4>
                <p style={{ margin: '4px 0', fontSize: '0.88rem' }}><strong>Họ tên:</strong> {selectedOrder.shipping_name}</p>
                <p style={{ margin: '4px 0', fontSize: '0.88rem' }}><strong>Số điện thoại:</strong> {selectedOrder.shipping_phone}</p>
                <p style={{ margin: '4px 0', fontSize: '0.88rem' }}><strong>Địa chỉ:</strong> {selectedOrder.shipping_address}, {selectedOrder.shipping_ward}, {selectedOrder.shipping_district}, {selectedOrder.shipping_province}</p>
                {selectedOrder.notes && (
                  <p style={{ margin: '4px 0', fontSize: '0.88rem', color: 'var(--text-muted)' }}><strong>Ghi chú:</strong> {selectedOrder.notes}</p>
                )}
              </div>

              {/* Status Update Control */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
                <div className="form-group">
                  <label className="form-label">Trạng thái vận chuyển</label>
                  <select
                    className="form-input"
                    value={selectedOrder.status}
                    onChange={(e) => handleUpdateStatus(selectedOrder.id, e.target.value, null)}
                  >
                    <option value="pending">Chờ xử lý</option>
                    <option value="confirmed">Đã xác nhận</option>
                    <option value="processing">Đang chuẩn bị hàng</option>
                    <option value="shipping">Đang giao hàng</option>
                    <option value="delivered">Đã giao thành công</option>
                    <option value="cancelled">Đã hủy</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Trạng thái thanh toán</label>
                  <select
                    className="form-input"
                    value={selectedOrder.payment_status}
                    onChange={(e) => handleUpdateStatus(selectedOrder.id, null, e.target.value)}
                  >
                    <option value="pending">Chưa thanh toán</option>
                    <option value="paid">Đã thanh toán</option>
                    <option value="refunded">Đã hoàn tiền</option>
                  </select>
                </div>
              </div>

              {/* Order Items */}
              <h4 style={{ marginBottom: 12, fontSize: '0.95rem' }}>Danh sách sản phẩm</h4>
              {loadingItems ? (
                <p>Đang tải chi tiết...</p>
              ) : (
                <div style={{ border: '1px solid var(--border-color)', borderRadius: 8, overflow: 'hidden' }}>
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Sản phẩm</th>
                        <th>Đơn giá</th>
                        <th>Số lượng</th>
                        <th>Thành tiền</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orderItems.map(item => (
                        <tr key={item.id}>
                          <td>{item.products?.name || item.product_name || 'Sản phẩm'}</td>
                          <td>{formatPrice(item.unit_price)}</td>
                          <td>x{item.quantity}</td>
                          <td style={{ fontWeight: 600 }}>{formatPrice(item.unit_price * item.quantity)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              <div style={{ marginTop: 20, textAlign: 'right' }}>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Phí vận chuyển: {formatPrice(selectedOrder.shipping_fee || 0)}</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--primary)', marginTop: 4 }}>
                  Tổng cộng: {formatPrice(selectedOrder.total_amount)}
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setSelectedOrder(null)}>
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
