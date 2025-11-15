# 📚 Component Documentation

Tüm yeni component'lerin kullanım kılavuzu

---

## 🎯 UI Components

### Toast (Bildirimler)

```tsx
import { useToast } from '@/hooks/useToast';
import { ToastContainer } from '@/components/Toast';

function MyComponent() {
  const { toasts, removeToast, toast } = useToast();

  return (
    <>
      <button onClick={() => toast.success('İşlem başarılı!')}>
        Başarılı
      </button>
      <button onClick={() => toast.error('Hata oluştu!')}>
        Hata
      </button>
      
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </>
  );
}
```

**Tipler:** `success`, `error`, `warning`, `info`

---

### Modal (Dialog)

```tsx
import { Modal } from '@/components/Modal';

<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Modal Başlık"
  size="md" // sm, md, lg, xl, full
>
  <p>Modal içeriği buraya gelir</p>
</Modal>
```

**Özellikler:**
- ESC tuşu ile kapatma
- Backdrop tıklama ile kapatma
- Portal ile render (body'ye)
- Smooth animasyonlar

---

### Skeleton (Loading)

```tsx
import { Skeleton, SkeletonCard, SkeletonList } from '@/components/Skeleton';

// Tek skeleton
<Skeleton variant="text" width="60%" height={24} />
<Skeleton variant="circular" width={48} height={48} />
<Skeleton variant="rectangular" height={200} />

// Hazır kartlar
<SkeletonCard />
<SkeletonList count={5} />
```

---

### Empty State

```tsx
import { EmptyState, NoResultsFound, NoDataAvailable } from '@/components/EmptyState';

// Custom
<EmptyState
  icon="📭"
  title="Veri Yok"
  description="Henüz veri eklenmemiş"
  actionLabel="Ekle"
  onAction={() => console.log('Clicked')}
/>

// Hazır variants
<NoResultsFound onReset={() => clearSearch()} />
<NoDataAvailable />
```

---

### Dropdown

```tsx
import { Dropdown } from '@/components/Dropdown';

<Dropdown
  trigger={<button>Menü</button>}
  position="right" // left, right
  items={[
    { label: 'Profil', icon: '👤', onClick: () => {} },
    { label: 'Ayarlar', icon: '⚙️', onClick: () => {} },
    { divider: true },
    { label: 'Çıkış', icon: '🚪', onClick: () => {} },
  ]}
/>
```

---

### Tabs

```tsx
import { Tabs } from '@/components/Tabs';

<Tabs
  variant="default" // default, pills, underline
  tabs={[
    { id: 'tab1', label: 'Tab 1', content: <div>Content 1</div> },
    { id: 'tab2', label: 'Tab 2', icon: '⚡', content: <div>Content 2</div> },
  ]}
  onChange={(tabId) => console.log(tabId)}
/>
```

---

### Accordion

```tsx
import { Accordion } from '@/components/Accordion';

<Accordion
  allowMultiple={false}
  items={[
    {
      id: '1',
      title: 'Başlık 1',
      icon: '📝',
      content: <p>İçerik</p>
    },
  ]}
/>
```

---

### Tooltip

```tsx
import { Tooltip } from '@/components/Tooltip';

<Tooltip content="Bu bir tooltip" position="top">
  <button>Hover me</button>
</Tooltip>
```

**Pozisyonlar:** `top`, `bottom`, `left`, `right`

---

### Badge

```tsx
import { Badge } from '@/components/Badge';

<Badge variant="success" size="md" pill>
  Aktif
</Badge>

<Badge variant="danger" dot outline>
  99+
</Badge>
```

**Variants:** `default`, `primary`, `success`, `warning`, `danger`, `info`  
**Sizes:** `sm`, `md`, `lg`

---

### Avatar

```tsx
import { Avatar, AvatarGroup } from '@/components/Avatar';

// Tek avatar
<Avatar
  src="/image.jpg"
  alt="User"
  size="md"
  status="online"
  shape="circle"
/>

// İsimden initial
<Avatar name="John Doe" size="lg" />

// Avatar group
<AvatarGroup
  max={3}
  avatars={[
    { name: 'John' },
    { name: 'Jane' },
    { name: 'Bob' },
    { name: 'Alice' },
  ]}
/>
```

**Status:** `online`, `offline`, `away`, `busy`  
**Sizes:** `xs`, `sm`, `md`, `lg`, `xl`, `2xl`

---

### Card

```tsx
import { Card, CardHeader, CardContent, CardFooter } from '@/components/Card';

<Card variant="elevated" padding="md" hover>
  <CardHeader
    title="Başlık"
    subtitle="Alt başlık"
    icon="📦"
    action={<button>Action</button>}
  />
  <CardContent>
    İçerik buraya
  </CardContent>
  <CardFooter>
    Footer
  </CardFooter>
</Card>

// Hazır kartlar
<ProductCard
  image="/product.jpg"
  title="Ürün Adı"
  price="99 TL"
  rating={4.5}
  badge="İndirim"
  onAddToCart={() => {}}
/>

<StatCard
  icon="👥"
  label="Toplam Kullanıcı"
  value={1234}
  trend={{ value: 12, isPositive: true }}
  color="bg-blue-500"
/>
```

**Variants:** `default`, `elevated`, `bordered`, `glass`  
**Padding:** `none`, `sm`, `md`, `lg`

---

### Pagination

```tsx
import { Pagination } from '@/components/Pagination';

<Pagination
  currentPage={page}
  totalPages={10}
  onPageChange={(newPage) => setPage(newPage)}
  showFirstLast
  maxVisible={7}
/>
```

---

### Progress

```tsx
import { Progress, CircularProgress } from '@/components/Progress';

// Bar progress
<Progress
  value={75}
  max={100}
  variant="success"
  size="md"
  showLabel
  label="Yükleniyor"
  striped
  animated
/>

// Circular progress
<CircularProgress
  value={75}
  size={120}
  strokeWidth={8}
  variant="primary"
/>
```

---

### BackToTop

```tsx
import { BackToTop } from '@/components/BackToTop';

// App.tsx'de kullan
<BackToTop threshold={300} />
```

---

### Breadcrumbs

```tsx
import { Breadcrumbs } from '@/components/Breadcrumbs';

<Breadcrumbs
  separator="/"
  items={[
    { label: 'Ana Sayfa', path: '/', icon: '🏠' },
    { label: 'Ürünler', path: '/products' },
    { label: 'Detay' },
  ]}
/>
```

---

## 🎨 Kullanım Örnekleri

### Toast ile Form Submit

```tsx
function MyForm() {
  const { toast } = useToast();

  const handleSubmit = async () => {
    try {
      await api.save();
      toast.success('Başarıyla kaydedildi!');
    } catch (error) {
      toast.error('Hata oluştu!');
    }
  };
}
```

### Modal ile Confirmation

```tsx
function DeleteButton() {
  const [showModal, setShowModal] = useState(false);

  const handleDelete = () => {
    // Delete logic
    setShowModal(false);
    toast.success('Silindi');
  };

  return (
    <>
      <button onClick={() => setShowModal(true)}>Sil</button>
      
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Emin misiniz?">
        <p>Bu işlem geri alınamaz!</p>
        <div className="flex gap-2 mt-4">
          <Button variant="danger" onClick={handleDelete}>Sil</Button>
          <Button variant="outline" onClick={() => setShowModal(false)}>İptal</Button>
        </div>
      </Modal>
    </>
  );
}
```

### Loading States

```tsx
function DataList() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  if (loading) {
    return <SkeletonList count={5} />;
  }

  if (data.length === 0) {
    return <NoDataAvailable />;
  }

  return <div>{/* render data */}</div>;
}
```

---

## 🚀 Best Practices

### 1. Tutarlı Kullanım
- Aynı tür işlemler için aynı component'i kullan
- Variant ve size'ları tutarlı seç

### 2. Accessibility
- Button'larda `aria-label` kullan
- Form input'larında `label` ekle
- Keyboard navigation'ı test et

### 3. Performance
- Skeleton kullan (loading spinner yerine)
- Modal'ları lazy load et
- Large listeler için pagination/infinite scroll

### 4. User Experience
- Toast için uygun süreler (3-5 saniye)
- Modal'larda ESC ile kapatma
- Hover feedback ekle

---

## 📦 Import Listesi

```tsx
// UI Components
import { Toast, ToastContainer } from '@/components/Toast';
import { useToast } from '@/hooks/useToast';
import { Modal } from '@/components/Modal';
import { Skeleton, SkeletonCard, SkeletonList } from '@/components/Skeleton';
import { EmptyState, NoResultsFound, NoDataAvailable } from '@/components/EmptyState';
import { Dropdown } from '@/components/Dropdown';
import { Tabs } from '@/components/Tabs';
import { Accordion } from '@/components/Accordion';
import { Tooltip } from '@/components/Tooltip';
import { Badge } from '@/components/Badge';
import { Avatar, AvatarGroup } from '@/components/Avatar';
import { Card, CardHeader, CardContent, CardFooter, ProductCard, StatCard } from '@/components/Card';
import { Pagination } from '@/components/Pagination';
import { Progress, CircularProgress } from '@/components/Progress';
import { BackToTop } from '@/components/BackToTop';
import { Breadcrumbs } from '@/components/Breadcrumbs';

// Existing
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { SEO } from '@/components/SEO';
```

---

## 🎯 Sonraki Adımlar

1. **Component Library Expand**
   - Select/Combobox
   - DatePicker
   - TimePicker
   - FileUpload (advanced)

2. **Form Components**
   - FormField wrapper
   - Form validation
   - Multi-step forms

3. **Data Display**
   - Table component
   - DataGrid
   - Charts integration

4. **Feedback**
   - Alert/Banner
   - Notification center
   - Snackbar

5. **Navigation**
   - Stepper
   - Wizard
   - Timeline

---

Tüm component'ler **responsive**, **accessible** ve **dark mode destekli**! 🎨✨


