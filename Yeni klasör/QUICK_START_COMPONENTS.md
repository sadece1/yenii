# ⚡ Component Hızlı Başlangıç

## 🚀 5 Dakikada Component Kullanımı

### 1️⃣ Toast (3 satır)

```tsx
import { useToast } from '@/hooks/useToast';
const { toast } = useToast();
toast.success('İşlem başarılı!');
```

### 2️⃣ Modal (5 satır)

```tsx
import { Modal } from '@/components/Modal';
const [open, setOpen] = useState(false);

<button onClick={() => setOpen(true)}>Aç</button>
<Modal isOpen={open} onClose={() => setOpen(false)} title="Başlık">
  İçerik
</Modal>
```

### 3️⃣ Loading (1 satır)

```tsx
import { SkeletonCard } from '@/components/Skeleton';
{loading && <SkeletonCard />}
```

### 4️⃣ Empty State (1 satır)

```tsx
import { NoDataAvailable } from '@/components/EmptyState';
{data.length === 0 && <NoDataAvailable />}
```

### 5️⃣ Badge (1 satır)

```tsx
import { Badge } from '@/components/Badge';
<Badge variant="success" pill>Yeni</Badge>
```

---

## 💡 Yaygın Kullanım Senaryoları

### Form Submit Feedback

```tsx
const handleSubmit = async () => {
  try {
    await api.save();
    toast.success('Kaydedildi!');
  } catch {
    toast.error('Hata!');
  }
};
```

### Delete Confirmation

```tsx
const [confirmOpen, setConfirmOpen] = useState(false);

<button onClick={() => setConfirmOpen(true)}>Sil</button>

<Modal isOpen={confirmOpen} onClose={() => setConfirmOpen(false)}>
  <h3>Emin misiniz?</h3>
  <Button onClick={handleDelete}>Sil</Button>
</Modal>
```

### Data Loading

```tsx
{loading ? (
  <SkeletonList count={5} />
) : data.length === 0 ? (
  <NoDataAvailable />
) : (
  data.map(item => <ItemCard {...item} />)
)}
```

### Product Grid

```tsx
<div className="grid grid-cols-3 gap-6">
  {products.map(product => (
    <ProductCard
      key={product.id}
      image={product.image}
      title={product.name}
      price={`${product.price} TL`}
      rating={product.rating}
      onAddToCart={() => addToCart(product)}
    />
  ))}
</div>
```

### Stats Dashboard

```tsx
<div className="grid grid-cols-4 gap-4">
  <StatCard icon="👥" label="Users" value={1234} trend={{ value: 12, isPositive: true }} />
  <StatCard icon="💰" label="Revenue" value="$5,678" color="bg-green-500" />
  <StatCard icon="📦" label="Orders" value={890} />
  <StatCard icon="⭐" label="Rating" value={4.8} />
</div>
```

---

## 🎯 En Çok Kullanılanlar

### Top 10 Component:

1. **Toast** - Her form submit'de
2. **Modal** - Confirmations, details
3. **Skeleton** - Loading states
4. **EmptyState** - No data scenarios
5. **Card** - Content containers
6. **Badge** - Status indicators
7. **Avatar** - User displays
8. **Tabs** - Content organization
9. **Pagination** - List navigation
10. **BackToTop** - Long pages

---

## 🔥 Copy-Paste Ready

### Complete Form with Toast

```tsx
function MyForm() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await api.submit(data);
      toast.success('Form başarıyla gönderildi!');
    } catch (error) {
      toast.error('Bir hata oluştu!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* form fields */}
      <Button type="submit" disabled={loading}>
        {loading ? 'Gönderiliyor...' : 'Gönder'}
      </Button>
    </form>
  );
}
```

### Complete List Page

```tsx
function ListPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    loadData();
  }, [page]);

  if (loading) return <SkeletonList count={10} />;
  if (data.length === 0) return <NoDataAvailable />;

  return (
    <>
      <div className="grid grid-cols-3 gap-6">
        {data.map(item => (
          <Card key={item.id} hover>
            {/* item content */}
          </Card>
        ))}
      </div>
      
      <Pagination
        currentPage={page}
        totalPages={10}
        onPageChange={setPage}
      />
    </>
  );
}
```

### Complete Settings Page with Tabs

```tsx
function SettingsPage() {
  return (
    <Tabs
      tabs={[
        {
          id: 'profile',
          label: 'Profil',
          icon: '👤',
          content: <ProfileSettings />
        },
        {
          id: 'security',
          label: 'Güvenlik',
          icon: '🔒',
          content: <SecuritySettings />
        },
        {
          id: 'notifications',
          label: 'Bildirimler',
          icon: '🔔',
          content: <NotificationSettings />
        },
      ]}
    />
  );
}
```

---

## ✨ Pro Tips

### 1. Global Toast Container

Add once in App.tsx:

```tsx
import { useToast } from '@/hooks/useToast';
import { ToastContainer } from '@/components/Toast';

function App() {
  const { toasts, removeToast } = useToast();
  
  return (
    <>
      {/* Your app */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </>
  );
}
```

### 2. Global BackToTop

```tsx
import { BackToTop } from '@/components/BackToTop';

function App() {
  return (
    <>
      {/* Your app */}
      <BackToTop />
    </>
  );
}
```

### 3. Consistent Card Spacing

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  <Card variant="elevated" padding="md" hover>
    {/* content */}
  </Card>
</div>
```

---

## 🎨 Cheat Sheet

| Component | Import | Usage |
|-----------|--------|-------|
| Toast | `useToast` | `toast.success('OK')` |
| Modal | `<Modal>` | `isOpen={true}` |
| Skeleton | `<SkeletonCard>` | While loading |
| Empty | `<NoDataAvailable>` | No data |
| Badge | `<Badge>` | `variant="success"` |
| Card | `<Card>` | `hover variant="elevated"` |
| Tabs | `<Tabs>` | `tabs={[...]}` |
| Pagination | `<Pagination>` | `currentPage total` |

---

**🚀 Hazırsınız! Component'leri kullanmaya başlayın!**


