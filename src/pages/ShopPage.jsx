import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, Filter, SlidersHorizontal } from 'lucide-react'
import { supabase } from '../lib/supabase'
import ProductCard from '../components/ui/ProductCard'
import './ShopPage.css'

export default function ShopPage() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedCat, setSelectedCat] = useState('all')
  const [sortBy, setSortBy] = useState('newest')

  useEffect(() => {
    fetchData()
  }, [selectedCat, sortBy])

  const fetchData = async () => {
    setLoading(true)
    const [catRes] = await Promise.all([
      supabase.from('product_categories').select('*').order('name'),
    ])
    setCategories(catRes.data || [])

    let query = supabase
      .from('products')
      .select('*, product_categories(name)')
      .eq('is_active', true)

    if (selectedCat !== 'all') query = query.eq('category_id', selectedCat)

    switch (sortBy) {
      case 'price_asc':  query = query.order('price', { ascending: true });  break
      case 'price_desc': query = query.order('price', { ascending: false }); break
      default:           query = query.order('created_at', { ascending: false })
    }

    const { data } = await query
    setProducts(data || [])
    setLoading(false)
  }

  const filtered = products.filter(p =>
    search === '' || p.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="shop-page">
      {/* Hero */}
      <div className="shop-hero">
        <div className="container">
          <span className="section-tag" style={{color:'var(--sage-300)'}}>Cửa Hàng</span>
          <h1>Phụ Kiện Yoga</h1>
          <p>Thảm yoga, dây kéo, khối foam và nhiều phụ kiện chất lượng cao khác</p>
        </div>
      </div>

      <div className="container">
        <div className="shop-layout">
          {/* Sidebar */}
          <aside className="shop-sidebar" id="shop-sidebar">
            <div className="sidebar-section">
              <h4>Danh Mục</h4>
              <ul className="category-list">
                <li>
                  <button
                    className={`cat-btn ${selectedCat === 'all' ? 'active' : ''}`}
                    onClick={() => setSelectedCat('all')}
                    id="cat-all"
                  >
                    Tất cả
                    <span className="cat-count">{products.length}</span>
                  </button>
                </li>
                {categories.map(cat => (
                  <li key={cat.id}>
                    <button
                      className={`cat-btn ${selectedCat === cat.id ? 'active' : ''}`}
                      onClick={() => setSelectedCat(cat.id)}
                      id={`cat-${cat.id}`}
                    >
                      {cat.name}
                      <span className="cat-count">
                        {products.filter(p => p.category_id === cat.id).length}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          {/* Main */}
          <div className="shop-main">
            {/* Toolbar */}
            <div className="shop-toolbar">
              <div className="search-wrap">
                <Search size={16} className="search-icon" />
                <input
                  type="text"
                  className="form-input search-input"
                  placeholder="Tìm kiếm sản phẩm..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  id="product-search"
                />
              </div>
              <div className="sort-wrap">
                <SlidersHorizontal size={15} />
                <select
                  className="form-input form-select sort-select"
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value)}
                  id="sort-select"
                >
                  <option value="newest">Mới nhất</option>
                  <option value="price_asc">Giá tăng dần</option>
                  <option value="price_desc">Giá giảm dần</option>
                </select>
              </div>
            </div>

            <p className="result-count">
              {loading ? 'Đang tải...' : `${filtered.length} sản phẩm`}
            </p>

            {loading ? (
              <div className="flex-center" style={{height:300}}>
                <div className="spinner" />
              </div>
            ) : filtered.length > 0 ? (
              <div className="shop-grid">
                {filtered.map(p => <ProductCard key={p.id} product={p} />)}
              </div>
            ) : (
              <div className="empty-state">
                <div style={{fontSize:'3rem', marginBottom:16}}>🔍</div>
                <h3>Không tìm thấy sản phẩm</h3>
                <p>Thử tìm với từ khóa khác hoặc chọn danh mục khác</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
