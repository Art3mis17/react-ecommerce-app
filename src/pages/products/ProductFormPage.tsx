import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { getProductById, createProduct, updateProduct, getAllCategories } from '../../services/productService';
import type { Product } from '../../models/types';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import CustomSelect from '../../components/shared/CustomSelect';
import type { SelectOption } from '../../components/shared/CustomSelect';
import { slugToLabel } from '../../utils/formatters';

type FormValues = {
  title: string;
  price: number;
  category: string;
  description: string;
  thumbnail: string;  // DummyJSON uses 'thumbnail' as the primary image field
};

const ProductFormPage = () => {
  const { id }   = useParams<{ id: string }>();
  const isEdit   = Boolean(id);
  const navigate = useNavigate();

  const [isLoadingProduct, setIsLoadingProduct] = useState(isEdit);
  const [isSaving,       setSaving]       = useState(false);
  const [apiError,     setApiError]     = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [imageError,   setImageError]   = useState(false);
  const [saved,        setSaved]        = useState(false);
  const [formErrNotif, setFormErrNotif] = useState(false);
  // Categories loaded dynamically from DummyJSON /products/category-list
  const [categoryOptions, setCategoryOptions] = useState<SelectOption[]>([]);

  const { register, handleSubmit, reset, watch, setValue, formState: { errors } } =
    useForm<FormValues>();
  const watchThumbnail = watch('thumbnail', '');
  const watchCategory  = watch('category', '');

  // Set tab title based on create vs edit mode
  useEffect(() => {
    document.title = isEdit ? 'Edit Product | CartCrazy' : 'Add Product | CartCrazy';
  }, [isEdit]);

  // Fetch category list on mount
  useEffect(() => {
    getAllCategories()
      .then((slugs) => setCategoryOptions(slugs.map((s) => ({ value: s, label: slugToLabel(s) }))))
      .catch(() => {/* silently ignore — form still works without the dropdown populated */});
  }, []);

  // Load existing product data when editing
  useEffect(() => {
    if (!isEdit) return;
    getProductById(Number(id))
      .then((p: Product) => {
        reset({ title: p.title, price: p.price, category: p.category, description: p.description, thumbnail: p.thumbnail });
        setImagePreview(p.thumbnail);
      })
      .catch(() => setApiError('Failed to load product.'))
      .finally(() => setIsLoadingProduct(false));
  }, [id, isEdit, reset]);

  // Live image preview: update whenever the thumbnail URL field changes
  useEffect(() => {
    setImageError(false);
    if (watchThumbnail) setImagePreview(watchThumbnail);
  }, [watchThumbnail]);

  const onSubmit = async (data: FormValues) => {
    setSaving(true);
    setApiError('');
    try {
      // Send thumbnail field matching DummyJSON's product shape
      const payload = { ...data, price: Number(data.price) };
      if (isEdit) {
        await updateProduct(Number(id), payload);
        setSaved(true);
        setTimeout(() => navigate(`/products/${id}?saved=1`), 1500);
      } else {
        await createProduct(payload);
        setSaved(true);
        setTimeout(() => navigate('/products'), 2000);
      }
    } catch {
      setApiError('Failed to save product. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (isLoadingProduct) return (
    <div className="ent-page" style={{ display: 'flex', justifyContent: 'center', padding: '80px 0' }}>
      <LoadingSpinner />
    </div>
  );

  return (
    <div className="ent-page">
      {/* Success notification */}
      {saved && (
        <div style={{
          position: 'fixed', top: 80, left: '50%', transform: 'translateX(-50%)',
          zIndex: 9999, background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
          color: '#fff', borderRadius: 12, padding: '13px 22px',
          animation: 'notif-drop 0.42s cubic-bezier(0.34,1.56,0.64,1) both',
          display: 'flex', alignItems: 'center', gap: 10,
          boxShadow: '0 8px 32px rgba(21,128,61,0.40)',
          fontSize: 14, fontWeight: 600, whiteSpace: 'nowrap',
        }}>
          <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
          {isEdit ? 'Changes saved!' : 'Product created!'} Redirecting…
        </div>
      )}
      {/* Validation error notification */}
      {formErrNotif && (
        <div style={{
          position: 'fixed', top: 80, left: '50%', transform: 'translateX(-50%)',
          zIndex: 9999, background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
          color: '#fff', borderRadius: 12, padding: '13px 22px',
          animation: 'notif-drop 0.42s cubic-bezier(0.34,1.56,0.64,1) both',
          display: 'flex', alignItems: 'center', gap: 10,
          boxShadow: '0 8px 32px rgba(185,28,28,0.40)',
          fontSize: 14, fontWeight: 600, whiteSpace: 'nowrap',
        }}>
          <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          Please fill in all required fields
        </div>
      )}
      <div className="ent-container-sm">
        {apiError && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20,
            background: 'var(--error-dim)', border: '1px solid rgba(239,68,68,0.2)',
            borderRadius: 'var(--r-md)', padding: '12px 16px',
            color: 'var(--error)', fontSize: 14, fontWeight: 500,
          }}>
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            {apiError}
          </div>
        )}

        {/* Page header */}
        <div style={{ marginBottom: 32 }}>
          <button
            onClick={() => navigate(-1)}
            className="btn-ghost"
            style={{ padding: '6px 0', marginBottom: 24, display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13 }}
          >
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Products
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{
              width: 48, height: 48, borderRadius: 14,
              background: 'linear-gradient(135deg, #4F46E5, #7C3AED)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 16px rgba(79,70,229,0.30)',
              flexShrink: 0,
            }}>
              <svg width="22" height="22" fill="none" stroke="white" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d={isEdit
                    ? 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z'
                    : 'M12 4v16m8-8H4'} />
              </svg>
            </div>
            <div>
              <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 2 }}>
                Product Management
              </p>
              <h1 style={{ fontSize: 28, fontWeight: 800, color: 'var(--text)', margin: 0, letterSpacing: '-0.03em' }}>
                {isEdit ? 'Edit Product' : 'New Product'}
              </h1>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit, () => {
            setFormErrNotif(true);
            setTimeout(() => setFormErrNotif(false), 3500);
          })} className="anim-fade-up" noValidate>

          {/* Section 1: Basic Info */}
          <div className="form-card">
            <div className="form-section-title">
              <div className="form-section-icon">
                <svg width="15" height="15" fill="none" stroke="var(--accent)" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              Basic Information
            </div>

            <div style={{ marginBottom: 20 }}>
              <label className="ent-label">
                Product Title <span style={{ color: 'var(--error)' }}>*</span>
              </label>
              <input
                className={`ent-input${errors.title ? ' error' : ''}`}
                placeholder="e.g. Sony WH-1000XM5 Wireless Headphones"
                {...register('title', {
                  required: 'Title is required',
                  minLength: { value: 5, message: 'At least 5 characters' },
                })}
              />
              {errors.title && (
                <p className="field-error">
                  <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01" />
                  </svg>
                  {errors.title.message}
                </p>
              )}
            </div>

            <div className="form-two-col">
              <div>
                <label className="ent-label">
                  Price (USD) <span style={{ color: 'var(--error)' }}>*</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <span style={{
                    position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)',
                    fontSize: 14, fontWeight: 600, color: 'var(--text-3)', pointerEvents: 'none',
                  }}>$</span>
                  <input
                    type="number" step="0.01" min="0"
                    className={`ent-input${errors.price ? ' error' : ''}`}
                    placeholder="0.00"
                    style={{ paddingLeft: 24 }}
                    {...register('price', {
                      required: 'Price is required',
                      min: { value: 0.01, message: 'Must be greater than $0' },
                    })}
                  />
                </div>
                {errors.price && (
                  <p className="field-error">
                    <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01" />
                    </svg>
                    {errors.price.message}
                  </p>
                )}
              </div>

              <div>
                <label className="ent-label">
                  Category <span style={{ color: 'var(--error)' }}>*</span>
                </label>
                <input
                  type="hidden"
                  {...register('category', { required: 'Please select a category' })}
                />
                <CustomSelect
                  options={categoryOptions}
                  value={watchCategory}
                  onChange={(val) => setValue('category', val, { shouldValidate: true })}
                  error={!!errors.category}
                  placeholder="Select a category"
                />
                {errors.category && (
                  <p className="field-error">
                    <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01" />
                    </svg>
                    {errors.category.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Section 2: Description */}
          <div className="form-card">
            <div className="form-section-title">
              <div className="form-section-icon">
                <svg width="15" height="15" fill="none" stroke="var(--accent)" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h10" />
                </svg>
              </div>
              Product Description
            </div>

            <div>
              <label className="ent-label">
                Description <span style={{ color: 'var(--error)' }}>*</span>
              </label>
              <textarea
                rows={6}
                className={`ent-input resize${errors.description ? ' error' : ''}`}
                placeholder="Describe the product in detail - features, materials, use-cases, dimensions"
                style={{ lineHeight: 1.7 }}
                {...register('description', {
                  required: 'Description is required',
                  minLength: { value: 10, message: 'At least 10 characters' },
                })}
              />
              {errors.description && (
                <p className="field-error">
                  <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01" />
                  </svg>
                  {errors.description.message}
                </p>
              )}
            </div>
          </div>

          {/* Section 3: Image */}
          <div className="form-card">
            <div className="form-section-title">
              <div className="form-section-icon">
                <svg width="15" height="15" fill="none" stroke="var(--accent)" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              Product Image
            </div>

            <div className="form-media-row">
              <div>
                <label className="ent-label">Image URL (thumbnail)</label>
                <input
                  className="ent-input"
                  placeholder="https://example.com/product-image.jpg"
                  {...register('thumbnail')}
                />
                <p style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 7, lineHeight: 1.5 }}>
                  Paste a direct image URL. The preview updates automatically.
                </p>
              </div>

              <div style={{
                width: 110, height: 110,
                borderRadius: 'var(--r-xl)',
                border: imagePreview && !imageError ? '2px solid var(--accent)' : '2px dashed var(--border-mid)',
                background: 'var(--surface-2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                overflow: 'hidden', flexShrink: 0,
                transition: 'border-color 0.25s',
                position: 'relative',
              }}>
                {imagePreview && !imageError ? (
                  <>
                    <img
                      src={imagePreview}
                      alt="preview"
                      onError={() => setImageError(true)}
                      style={{ width: '100%', height: '100%', objectFit: 'contain', padding: 10 }}
                    />
                    <div style={{
                      position: 'absolute', bottom: 5, right: 5,
                      width: 20, height: 20, borderRadius: '50%',
                      background: 'var(--accent)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <svg width="10" height="10" fill="none" stroke="white" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </>
                ) : (
                  <div style={{ textAlign: 'center' }}>
                    <svg width="26" height="26" fill="none" stroke="var(--text-3)" viewBox="0 0 24 24" style={{ display: 'block', margin: '0 auto 5px' }}>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p style={{ fontSize: 10, color: 'var(--text-3)', margin: 0, fontWeight: 500 }}>Preview</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: 12 }}>
            <button
              type="submit"
              className="btn-primary"
              style={{ flex: 1 }}
              disabled={isSaving}
            >
              {isSaving ? (
                <><LoadingSpinner size="sm" /> Saving</>
              ) : (
                <>
                  <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                  {isEdit ? 'Save Changes' : 'Create Product'}
                </>
              )}
            </button>
            <button
              type="button"
              className="btn-sec"
              onClick={() => navigate('/products')}
              style={{ minWidth: 110 }}
            >
              Cancel
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default ProductFormPage;
