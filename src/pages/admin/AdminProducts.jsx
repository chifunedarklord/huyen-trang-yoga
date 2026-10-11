import { useEffect, useState } from 'react'
import { Plus, Edit2, Trash2, Search, X, Package, Star } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { formatPrice } from '../../utils/helpers'
import toast from 'react-hot-toast'
import './AdminShared.css'

export default function AdminProducts() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [showModal, setShowModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    category_id: '',
    price: 0,
    sale_price: 0,
    stock_quantity: 10,
    images: [''],
    description: '',
    is_featured: false,
    is_active: true
  })

  useEffect(() => {
    fetchCategories()
    fetchProducts()
  }, [])

  const fetchCategories = async () => {
    const { data } = await supabase.from('product_categories').select('*')
    if (data) setCategories(data)
  }

  const fetchProducts = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('products')
      .select('*, product_categories (name)')
      .order('created_at', { ascending: false })

    if (error) {
      toast.error('Lỗi khi tải danh sách sản phẩm')
    } else {
      setProducts(data || [])
    }
    setLoading(false)
  }

  const generateSlug = (str) => {
    return str
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[đĐ]/g, 'd')
      .replace(/([^0-9a-z-\s])/g, '')
      .replace(/(\s+)/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, '')
  }

  const handleOpenModal = (prod = null) => {
    if (prod) {
      setEditingProduct(prod)
      setFormData({
        name: prod.name,
        slug: prod.slug,
        category_id: prod.category_id || '',
        price: prod.price || 0,
        sale_price: prod.sale_price || 0,
        stock_quantity: prod.stock_quantity ?? 10,
        images: Array.isArray(prod.images) && prod.images.length ? prod.images : [''],
        description: prod.description || '',
        is_featured: prod.is_featured || false,
        is_active: prod.is_active ?? true
      })
    } else {
      setEditingProduct(null)
      setFormData({
        name: '',
        slug: '',
        category_id: categories[0]?.id || '',
        price: 250000,
        sale_price: 0,
        stock_quantity: 20,
        images: [''],
        description: '',
        is_featured: false,
        is_active: true
      })
    }
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingProduct(null)
  }

  const handleSave = async (e) => {
    e.preventDefault()
    if (!formData.name.trim()) return toast.error('Vui lòng nhập tên sản phẩm')

    const cleanImages = formData.images.filter(img => img && img.trim() !== '')
    const payload = {
      ...formData,
      images: cleanImages,
      slug: formData.slug || generateSlug(formData.name) + '-' + Date.now().toString().slice(-4),
      sale_price: formData.sale_price > 0 ? formData.sale_price : null
    }

    try {
      if (editingProduct) {
        const { error } = await supabase
          .from('products')
          .update(payload)
          .eq('id', editingProduct.id)

        if (error) throw error
        toast.success('Cập nhật sản phẩm thành công!')
      } else {
        const { error } = await supabase
          .from('products')
          .insert([payload])

        if (error) throw error
        toast.success('Thêm sản phẩm mới thành công!')
      }
      handleCloseModal()
      fetchProducts()
    } catch (err) {
      toast.error('Có lỗi xảy ra: ' + err.message)
    }
  }

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Bạn có chắc muốn xóa sản phẩm "${name}"?`)) return

    const { error } = await supabase.from('products').delete().eq('id', id)
    if (error) {
      toast.error('Không thể xóa sản phẩm: ' + error.message)
    } else {
      toast.success('Đã xóa sản phẩm')
      fetchProducts()
    }
  }

  const filtered = products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase())
    const matchCat = categoryFilter === 'all' || p.category_id === categoryFilter
    return matchSearch && matchCat
  })

  return (
    <div className="admin-products-page">
      <div className="admin-header">
        <div className="admin-title-area">
          <h1>Quản Lý Sản Phẩm Yoga</h1>
          <p>Thảm tập, trang phục, dụng cụ và phụ kiện yoga</p>
        </div>
        <div className="admin-actions">
          <button className="btn btn-primary" onClick={() => handleOpenModal()}>
            <Plus size={18} /> Thêm Sản Phẩm
          </button>
        </div>
      </div>

      <div className="admin-filter-bar">
        <div className="admin-search-box">
          <Search size={18} color="var(--text-muted)" />
          <input
            type="text"
            placeholder="Tìm sản phẩm..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="admin-filter-controls">
          <select
            className="admin-select"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="all">Tất cả danh mục</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
          <span style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
            <strong>{filtered.length}</strong> sản phẩm
          </span>
        </div>
      </div>

      <div className="admin-table-container">
        {loading ? (
          <p className="empty-state">Đang tải sản phẩm...</p>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <Package size={40} style={{ margin: '0 auto 12px', opacity: 0.5 }} />
            <p>Không có sản phẩm nào phù hợp.</p>
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Sản Phẩm</th>
                <th>Danh Mục</th>
                <th>Giá Bán</th>
                <th>Giá Khuyến Mãi</th>
                <th>Tồn Kho</th>
                <th>Nổi Bật</th>
                <th>Trạng Thái</th>
                <th>Thao Tác</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(prod => (
                <tr key={prod.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <img
                        src={prod.images?.[0] || 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=120&q=80'}
                        alt={prod.name}
                        style={{ width: 44, height: 44, borderRadius: 8, objectFit: 'cover' }}
                      />
                      <div>
                        <div style={{ fontWeight: 600 }}>{prod.name}</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Mã: {prod.slug}</div>
                      </div>
                    </div>
                  </td>
                  <td>{prod.product_categories?.name || 'Chưa phân loại'}</td>
                  <td style={{ fontWeight: 600 }}>{formatPrice(prod.price)}</td>
                  <td style={{ color: prod.sale_price ? '#d32f2f' : 'var(--text-muted)' }}>
                    {prod.sale_price ? formatPrice(prod.sale_price) : '-'}
                  </td>
                  <td>
                    <span className={`badge ${prod.stock_quantity > 0 ? 'badge-success' : 'badge-danger'}`}>
                      {prod.stock_quantity} cái
                    </span>
                  </td>
                  <td>
                    {prod.is_featured ? (
                      <Star size={18} fill="#f59e0b" color="#f59e0b" />
                    ) : (
                      <span style={{ color: 'var(--text-muted)' }}>-</span>
                    )}
                  </td>
                  <td>
                    {prod.is_active ? (
                      <span className="badge badge-success">Đang bán</span>
                    ) : (
                      <span className="badge badge-secondary">Ẩn</span>
                    )}
                  </td>
                  <td>
                    <div className="table-actions">
                      <button className="btn-icon" title="Sửa" onClick={() => handleOpenModal(prod)}>
                        <Edit2 size={16} />
                      </button>
                      <button className="btn-icon delete" title="Xóa" onClick={() => handleDelete(prod.id, prod.name)}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal Add / Edit Product */}
      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingProduct ? 'Chỉnh Sửa Sản Phẩm' : 'Thêm Sản Phẩm Mới'}</h2>
              <button className="btn-icon" onClick={handleCloseModal}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSave}>
              <div className="modal-body">
                <div className="form-group" style={{ marginBottom: 16 }}>
                  <label className="form-label">Tên sản phẩm *</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.name}
                    onChange={e => {
                      setFormData({
                        ...formData,
                        name: e.target.value,
                        slug: generateSlug(e.target.value)
                      })
                    }}
                    required
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                  <div className="form-group">
                    <label className="form-label">Danh mục</label>
                    <select
                      className="form-input"
                      value={formData.category_id}
                      onChange={e => setFormData({ ...formData, category_id: e.target.value })}
                    >
                      <option value="">-- Chọn danh mục --</option>
                      {categories.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Số lượng tồn kho</label>
                    <input
                      type="number"
                      className="form-input"
                      value={formData.stock_quantity}
                      onChange={e => setFormData({ ...formData, stock_quantity: Number(e.target.value) })}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                  <div className="form-group">
                    <label className="form-label">Giá niêm yết (VNĐ) *</label>
                    <input
                      type="number"
                      className="form-input"
                      value={formData.price}
                      onChange={e => setFormData({ ...formData, price: Number(e.target.value) })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Giá khuyến mãi (VNĐ)</label>
                    <input
                      type="number"
                      className="form-input"
                      value={formData.sale_price}
                      onChange={e => setFormData({ ...formData, sale_price: Number(e.target.value) })}
                      placeholder="Bỏ trống nếu không giảm"
                    />
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: 16 }}>
                  <label className="form-label">URL Hình ảnh (Cách nhau bằng dấu phẩy)</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.images.join(', ')}
                    onChange={e => setFormData({ ...formData, images: e.target.value.split(',').map(s => s.trim()) })}
                    placeholder="https://images.unsplash.com/photo-1..."
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 16 }}>
                  <label className="form-label">Mô tả chi tiết</label>
                  <textarea
                    className="form-input"
                    rows={4}
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>

                <div style={{ display: 'flex', gap: 24 }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: '0.9rem' }}>
                    <input
                      type="checkbox"
                      checked={formData.is_featured}
                      onChange={e => setFormData({ ...formData, is_featured: e.target.checked })}
                    />
                    Đặt làm sản phẩm Nổi bật
                  </label>

                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: '0.9rem' }}>
                    <input
                      type="checkbox"
                      checked={formData.is_active}
                      onChange={e => setFormData({ ...formData, is_active: e.target.checked })}
                    />
                    Hiển thị trên gian hàng
                  </label>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
                  Hủy
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingProduct ? 'Lưu thay đổi' : 'Thêm sản phẩm'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
