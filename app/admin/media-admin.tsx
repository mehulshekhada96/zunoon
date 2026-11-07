'use client';
import {useEffect,useRef,useState} from 'react';
import { useConfirmDialog } from '@/components/theme-dialog';
import {
  Upload,
  ImageIcon,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  RefreshCw,
  LogOut,
  HelpCircle,
  Sparkles,
  X,
  Check,
  Copy,
  Trash2,
  User,
  Camera,
  Plus,
  Quote,
  Star,
  Edit3,
  Phone,
  ChevronUp,
  ChevronDown,
  CreditCard
} from 'lucide-react';
import type { HeroSlide } from '@/lib/hero-slides';
import HeroCarousel from '@/components/hero-carousel';
import {MemberReview, defaultMemberReviews} from '@/lib/testimonials';
import {defaultContactSettings, type ContactSettings} from '@/lib/contact';
import {
  MediaAsset,
  mediaSections,
  valueSlots,
  defaultValuesMedia,
  whySlots,
  defaultWhyMedia,
  clubSlots,
  defaultClubsMedia,
  communitySlots,
  defaultCommunityMedia,
  defaultFounderMedia
} from '@/lib/media';
import './media-admin.css';
import PaymentsAdmin from './payments/payments-admin';

type Assignment = {slot: string; assetId: string};

const whySlotLabels: Record<string, string> = {
  health: 'Health & Fitness',
  social: 'Social Connection',
  sports: 'Sports & Fun',
  hobby: 'Hobbies & Passion',
  growth: 'Personal & Professional Growth',
  celebration: 'Celebration & Happiness'
};

const clubSlotLabels: Record<string, string> = {
  health: '🌿 Health Club',
  sports: '🏆 Sports Club',
  social: '🤝 Social Club',
  growth: '🚀 Growth Club',
  hobby: '🎨 Hobby Club',
  celebration: '🎊 Celebration Club'
};

const communitySlotLabels: Record<string, string> = {
  students: 'Students (વિદ્યાર્થીઓ)',
  business: 'Business Owners (બિઝનેસ ઓનર્સ)',
  entrepreneurs: 'Entrepreneurs (એન્ટરપ્રેન્યોર્સ)',
  professionals: 'Working Professionals (પ્રોફેશનલ્સ)',
  homemakers: 'Homemakers (હોમમેકર્સ)',
  parents: 'Parents & Families (પેરેન્ટ્સ અને ફેમિલી)',
  youth: 'Young Adults (યુવા વર્ગ)',
  retired: 'Retired Individuals (નિવૃત્ત વ્યક્તિઓ)'
};

const sectionLabels: Record<string, string> = {
  all: 'All Photos',
  values: 'Values Section',
  why: 'Why Join Questions',
  founder: 'Founder Photo (9:16)',
  clubs: 'Community Clubs',
  community: 'Zunoon For Everyone',
  gallery: 'Events & Gallery',
  general: 'General / Reusable'
};

async function api(url: string, options?: RequestInit) {
  const response = await fetch(url.endsWith('/') ? url : url + '/', {
    ...options,
    cache: 'no-store'
  });
  const data = (await response.json()) as {
    error?: string;
    assets: MediaAsset[];
    assignments: Assignment[];
    configured: boolean;
    asset: MediaAsset;
  };
  if (!response.ok) throw new Error(data.error || 'Request failed.');
  return data;
}

export type SectionType = 'values' | 'why' | 'founder' | 'clubs' | 'community';

export type AdminTab =
  | 'hero-carousel'
  | 'founder'
  | 'values'
  | 'why'
  | 'clubs'
  | 'community'
  | 'life-at-zunoon'
  | 'member-experiences'
  | 'payments'
  | 'contact'
  | 'library';

export default function MediaAdmin({ name, initialTab }: { name?: string; initialTab?: string }) {
  const { confirm: confirmAction, DialogComponent } = useConfirmDialog();

  const validTabs: AdminTab[] = [
    'hero-carousel',
    'founder',
    'values',
    'why',
    'clubs',
    'community',
    'life-at-zunoon',
    'member-experiences',
    'payments',
    'contact',
    'library'
  ];

  const [activeTab, setActiveTab] = useState<AdminTab>(() => {
    if (initialTab && validTabs.includes(initialTab as AdminTab)) {
      return initialTab as AdminTab;
    }
    return 'hero-carousel';
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get('tab');
      if (tabParam && validTabs.includes(tabParam as AdminTab)) {
        setActiveTab(tabParam as AdminTab);
      }
    }
  }, []);

  const handleTabChange = (tab: AdminTab) => {
    setActiveTab(tab);
    if (typeof window !== 'undefined') {
      const url = tab === 'hero-carousel' ? '/admin/' : `/admin/?tab=${tab}`;
      window.history.replaceState(null, '', url);
    }
  };
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>([]);
  const [heroUploading, setHeroUploading] = useState(false);
  const [heroSlideFile, setHeroSlideFile] = useState<File | null>(null);
  const [heroSlidePreview, setHeroSlidePreview] = useState<string>('');
  const [heroSlideTitle, setHeroSlideTitle] = useState('');
  const [heroSlideAlt, setHeroSlideAlt] = useState('');
  const heroFileInputRef = useRef<HTMLInputElement>(null);
  const [contactForm, setContactForm] = useState<ContactSettings>(defaultContactSettings);
  const [contactSaving, setContactSaving] = useState(false);
  const [contactSavedNotice, setContactSavedNotice] = useState('');
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [configured, setConfigured] = useState(false);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [updatingSlot, setUpdatingSlot] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  // Member Experiences & Reviews State
  const [reviews, setReviews] = useState<MemberReview[]>([]);
  const [editingReview, setEditingReview] = useState<MemberReview | null>(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    author: '',
    role: '',
    category: 'Health & Fitness',
    title: '',
    quote: '',
    rating: 5
  });

  // Life at Zunoon sections & multi-upload state
  const [gallerySections, setGallerySections] = useState<string[]>([
    'Donation',
    'Volunteering',
    'Music',
    'Outdoors',
    'Celebration',
    'Community'
  ]);
  const [customSections, setCustomSections] = useState<string[]>([]);
  const [selectedGalleryFilter, setSelectedGalleryFilter] = useState('All');
  const [targetUploadSection, setTargetUploadSection] = useState('Donation');
  const [newSectionName, setNewSectionName] = useState('');
  const [gallerySelectedFiles, setGallerySelectedFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState('');

  // Visual Picker Modal State
  const [pickerSlot, setPickerSlot] = useState<{
    section: SectionType;
    slot: string;
    label: string;
  } | null>(null);
  const [pickerSelectedId, setPickerSelectedId] = useState<string>('');
  const [pickerFilter, setPickerFilter] = useState<string>('all');

  // Library tab upload state
  const [libSection, setLibSection] = useState('general');
  const [libFilter, setLibFilter] = useState('all');
  const [libFile, setLibFile] = useState<File | null>(null);
  const [libPreview, setLibPreview] = useState('');
  const [libTitle, setLibTitle] = useState('');
  const libInput = useRef<HTMLInputElement>(null);

  async function refreshReviews() {
    try {
      const res = await fetch('/api/admin/testimonials', {cache: 'no-store'});
      if (res.ok) {
        const data = await res.json();
        if (data?.testimonials && Array.isArray(data.testimonials)) {
          setReviews(data.testimonials);
        }
      }
    } catch {}
  }

  async function refreshSections() {
    try {
      const res = await fetch('/api/admin/gallery-sections/', {cache: 'no-store'});
      if (res.ok) {
        const data = (await res.json()) as {sections: string[]; custom: string[]};
        if (data.sections && Array.isArray(data.sections)) {
          setGallerySections(data.sections);
          setCustomSections(data.custom || []);
          if (!data.sections.includes(targetUploadSection) && data.sections.length > 0) {
            setTargetUploadSection(data.sections[0]);
          }
        }
      }
    } catch {}
  }

  async function refreshContact() {
    try {
      const res = await fetch('/api/admin/contact/', {cache: 'no-store'});
      if (res.ok) {
        const data = await res.json();
        if (data && data.whatsappNumber) {
          setContactForm(data);
        }
      }
    } catch {}
  }

  async function handleSaveContact(e: React.FormEvent) {
    e.preventDefault();
    setContactSaving(true);
    setContactSavedNotice('');
    setError('');
    try {
      const res = await fetch('/api/admin/contact/', {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(contactForm)
      });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error || 'Failed to save contact settings');
      setContactForm(d.contact);
      setContactSavedNotice('Contact & WhatsApp settings updated successfully!');
      setTimeout(() => setContactSavedNotice(''), 4000);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setContactSaving(false);
    }
  }

  async function refreshHeroSlides() {
    try {
      const res = await fetch('/api/admin/hero-slides');
      const data = await res.json();
      if (res.ok && Array.isArray(data.slides)) {
        setHeroSlides(data.slides);
      }
    } catch (err) {
      console.error('Failed to load hero slides:', err);
    }
  }

  async function handleUploadHeroSlide(e: React.FormEvent) {
    e.preventDefault();
    if (!heroSlideFile) return;
    setHeroUploading(true);
    setError('');
    setMessage('');
    try {
      const formData = new FormData();
      formData.set('file', heroSlideFile);
      if (heroSlideTitle.trim()) formData.set('title', heroSlideTitle.trim());
      if (heroSlideAlt.trim()) formData.set('alt', heroSlideAlt.trim());

      const res = await fetch('/api/admin/hero-slides', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to upload slide');

      setHeroSlideFile(null);
      setHeroSlidePreview('');
      setHeroSlideTitle('');
      setHeroSlideAlt('');
      if (heroFileInputRef.current) heroFileInputRef.current.value = '';

      if (data.slide) {
        setHeroSlides(prev => [...prev, data.slide]);
      }
      await refreshHeroSlides();
      setMessage('✓ New 16:9 Carousel slide uploaded successfully!');
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setHeroUploading(false);
    }
  }

  async function handleDeleteHeroSlide(id: string) {
    const ok = await confirmAction({
      title: 'Delete Carousel Slide',
      message: 'Are you sure you want to delete this 16:9 carousel slide?\nThis action cannot be undone.',
      confirmLabel: 'Delete Slide',
      type: 'danger'
    });
    if (!ok) return;

    setBusy(true);
    setError('');
    setMessage('');
    try {
      const res = await fetch('/api/admin/hero-slides', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to delete slide');
      setHeroSlides(prev => prev.filter(s => s.id !== id));
      await refreshHeroSlides();
      setMessage('✓ Slide deleted from carousel.');
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  }

  async function handleMoveHeroSlide(id: string, direction: 'up' | 'down') {
    const idx = heroSlides.findIndex(s => s.id === id);
    if (idx < 0) return;
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= heroSlides.length) return;

    const newSlides = [...heroSlides];
    const [moved] = newSlides.splice(idx, 1);
    newSlides.splice(targetIdx, 0, moved);

    const payload = newSlides.map((s, order) => ({ id: s.id, order }));
    setHeroSlides(newSlides);
    try {
      await fetch('/api/admin/hero-slides', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slides: payload })
      });
    } catch (err) {
      console.error('Failed to update slide order:', err);
      await refreshHeroSlides();
    }
  }

  async function refresh() {
    const data = await api('/api/admin/media');
    setAssets(data.assets);
    setAssignments(data.assignments);
    setConfigured(data.configured);
    await refreshSections();
    await refreshReviews();
    await refreshContact();
    await refreshHeroSlides();
  }

  async function handleAddGallerySection(e: React.FormEvent) {
    e.preventDefault();
    if (!newSectionName.trim()) return;
    setBusy(true);
    setError('');
    setMessage('');
    try {
      const res = await fetch('/api/admin/gallery-sections/', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({name: newSectionName.trim()})
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to add section');
      const added = newSectionName.trim();
      setNewSectionName('');
      await refreshSections();
      setTargetUploadSection(added);
      setSelectedGalleryFilter(added);
      setMessage(`✓ Added section "${added}".`);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  async function handleDeleteGallerySection(secName: string) {
    const ok = await confirmAction({
      title: 'Delete Section',
      message: `Are you sure you want to delete section "${secName}"?`,
      confirmLabel: 'Delete Section',
      type: 'danger'
    });
    if (!ok) return;
    setBusy(true);
    setError('');
    setMessage('');
    try {
      const res = await fetch('/api/admin/gallery-sections/', {
        method: 'DELETE',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({name: secName})
      });
      if (!res.ok) throw new Error('Failed to delete section');
      await refreshSections();
      if (selectedGalleryFilter === secName) setSelectedGalleryFilter('All');
      if (targetUploadSection === secName) setTargetUploadSection('Donation');
      setMessage(`✓ Section "${secName}" deleted.`);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  async function handleGalleryMultiUpload(e: React.FormEvent) {
    e.preventDefault();
    if (gallerySelectedFiles.length === 0) return;
    setBusy(true);
    setError('');
    setMessage('');
    const total = gallerySelectedFiles.length;
    let uploadedCount = 0;
    try {
      for (let i = 0; i < total; i++) {
        setUploadProgress(`Uploading ${i + 1} of ${total} to "${targetUploadSection}"…`);
        const file = gallerySelectedFiles[i];
        const body = new FormData();
        body.set('file', file);
        body.set('section', 'gallery');
        body.set('category', targetUploadSection);
        body.set('title', targetUploadSection);
        body.set('alt', `Life at Zunoon - ${targetUploadSection}`);
        await api('/api/admin/media', {method: 'POST', body});
        uploadedCount++;
      }
      setGallerySelectedFiles([]);
      await refresh();
      await refreshSections();
      setMessage(`✓ Successfully uploaded ${uploadedCount} photo(s) to "${targetUploadSection}".`);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
      setUploadProgress('');
    }
  }

  function openNewReviewModal() {
    setEditingReview(null);
    setReviewForm({
      author: '',
      role: '',
      category: 'Health & Fitness',
      title: '',
      quote: '',
      rating: 5
    });
    setShowReviewModal(true);
  }

  function openEditReviewModal(r: MemberReview) {
    setEditingReview(r);
    setReviewForm({
      author: r.author,
      role: r.role || '',
      category: r.category || 'Member Experience',
      title: r.title || '',
      quote: r.quote || '',
      rating: r.rating || 5
    });
    setShowReviewModal(true);
  }

  async function handleSaveReview(e: React.FormEvent) {
    e.preventDefault();
    if (!reviewForm.author.trim()) {
      setError('Member name is required.');
      return;
    }
    if (!reviewForm.quote.trim()) {
      setError('Member review / experience text is required.');
      return;
    }
    setBusy(true);
    setError('');
    setMessage('');
    try {
      if (editingReview) {
        const res = await fetch('/api/admin/testimonials', {
          method: 'PUT',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            id: editingReview.id,
            author: reviewForm.author.trim(),
            role: reviewForm.role.trim(),
            category: reviewForm.category.trim(),
            title: reviewForm.title.trim(),
            quote: reviewForm.quote.trim(),
            rating: Number(reviewForm.rating) || 5
          })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to update review');
        setMessage(`✓ Updated member experience for "${reviewForm.author}".`);
      } else {
        const res = await fetch('/api/admin/testimonials', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            author: reviewForm.author.trim(),
            role: reviewForm.role.trim(),
            category: reviewForm.category.trim(),
            title: reviewForm.title.trim(),
            quote: reviewForm.quote.trim(),
            rating: Number(reviewForm.rating) || 5
          })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to add review');
        setMessage(`✓ Added member experience for "${reviewForm.author}".`);
      }
      setShowReviewModal(false);
      setEditingReview(null);
      await refreshReviews();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  }

  async function handleDeleteReview(id: string, author: string) {
    const ok = await confirmAction({
      title: 'Delete Review',
      message: `Are you sure you want to delete the review from "${author}"?`,
      confirmLabel: 'Delete Review',
      type: 'danger'
    });
    if (!ok) return;
    setBusy(true);
    setError('');
    setMessage('');
    try {
      const res = await fetch(`/api/admin/testimonials?id=${encodeURIComponent(id)}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to delete review');
      setMessage(`✓ Deleted review from "${author}".`);
      await refreshReviews();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  }

  useEffect(() => {
    refresh()
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!libFile) {
      setLibPreview('');
      return;
    }
    const url = URL.createObjectURL(libFile);
    setLibPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [libFile]);

  // Open modal with auto-filtered section
  function openPicker(sec: SectionType, slot: string, label: string, currentAssignedId?: string) {
    setPickerSelectedId(currentAssignedId || '');
    setPickerFilter(sec); // Auto-filter to current section (e.g. 'founder', 'why', 'values' or 'clubs')
    setPickerSlot({section: sec, slot, label});
  }

  // Direct 1-click photo upload for any card
  async function handleDirectUpload(
    sec: SectionType,
    slot: string,
    file: File,
    label: string
  ) {
    if (file.size > 4 * 1024 * 1024) {
      setError('Please choose an image smaller than 4 MB.');
      return;
    }
    const targetSlot = `${sec}.${slot}`;
    setUpdatingSlot(targetSlot);
    setError('');
    setMessage('');
    try {
      const body = new FormData();
      body.set('file', file);
      body.set('section', sec);
      body.set('title', label);
      body.set('alt', `${label} photo for Zunoon Club`);
      const uploaded = await api('/api/admin/media', {method: 'POST', body});
      await api('/api/admin/assignments', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({slot: targetSlot, assetId: uploaded.asset.id})
      });
      await refresh();
      setMessage(`✓ "${label}" photo updated successfully!`);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setUpdatingSlot(null);
    }
  }

  // Assign photo from visual picker
  async function handleApplyPicker() {
    if (!pickerSlot || !pickerSelectedId) return;
    const {section: sec, slot, label} = pickerSlot;
    const targetSlot = `${sec}.${slot}`;
    setUpdatingSlot(targetSlot);
    setBusy(true);
    setError('');
    setMessage('');
    try {
      await api('/api/admin/assignments', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({slot: targetSlot, assetId: pickerSelectedId})
      });
      await refresh();
      setMessage(`✓ "${label}" photo updated successfully!`);
      setPickerSlot(null);
      setPickerSelectedId('');
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
      setUpdatingSlot(null);
    }
  }

  // Remove / unassign photo from card
  async function handleRemoveSlot(sec: SectionType, slot: string, label: string) {
    const ok = await confirmAction({
      title: 'Remove Photo Assignment',
      message: `Are you sure you want to remove the custom photo for "${label}"?`,
      confirmLabel: 'Remove Photo',
      type: 'warning'
    });
    if (!ok) return;
    const targetSlot = `${sec}.${slot}`;
    setUpdatingSlot(targetSlot);
    setError('');
    setMessage('');
    try {
      await api('/api/admin/assignments', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({slot: targetSlot, assetId: null})
      });
      await refresh();
      setMessage(`✓ Photo removed from "${label}".`);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setUpdatingSlot(null);
    }
  }

  // Delete photo completely from library (Cloudinary + MongoDB)
  async function handleDeleteAsset(id: string, title: string) {
    const ok = await confirmAction({
      title: 'Permanently Delete Photo',
      message: `Permanently delete "${title}" from your photo library?\nThis cannot be undone.`,
      confirmLabel: 'Delete Photo',
      type: 'danger'
    });
    if (!ok) return;
    setBusy(true);
    setError('');
    setMessage('');
    try {
      await api('/api/admin/media', {
        method: 'DELETE',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({id})
      });
      await refresh();
      setMessage(`✓ "${title}" deleted from library.`);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  // General library upload
  async function handleLibraryUpload(e: React.FormEvent) {
    e.preventDefault();
    if (!libFile) return;
    setBusy(true);
    setError('');
    setMessage('');
    try {
      const body = new FormData();
      body.set('file', libFile);
      body.set('section', libSection);
      body.set('title', libTitle.trim() || libFile.name.replace(/\.[^/.]+$/, ''));
      body.set('alt', libTitle.trim() || 'Zunoon media upload');
      await api('/api/admin/media', {method: 'POST', body});
      await refresh();
      setLibFile(null);
      setLibTitle('');
      if (libInput.current) libInput.current.value = '';
      setMessage('✓ Photo added to your library.');
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  const valuesAssetsCount = assets.filter(a => a.section === 'values').length;
  const whyAssetsCount = assets.filter(a => a.section === 'why').length;
  const founderAssetsCount = assets.filter(a => a.section === 'founder').length;
  const clubsAssetsCount = assets.filter(a => a.section === 'clubs').length;
  const communityAssetsCount = assets.filter(a => a.section === 'community').length;
  const galleryAssetsCount = assets.filter(a => a.section === 'gallery').length;

  return (
    <div className="admin-layout">
      {/* Visual Photo Picker Modal */}
      {pickerSlot && (
        <div className="admin-modal-overlay" onClick={() => setPickerSlot(null)}>
          <div className="admin-modal" onClick={e => e.stopPropagation()}>
            <div className="admin-modal-head">
              <div>
                <h3>Choose a Photo for "{pickerSlot.label}"</h3>
                <p>Click any photo from your library to set it live on the website.</p>
              </div>
              <button
                type="button"
                className="admin-modal-close"
                onClick={() => setPickerSlot(null)}
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Category Filter */}
            <div className="admin-modal-filters">
              <button
                type="button"
                className={`modal-filter-btn ${pickerFilter === pickerSlot.section ? 'active' : ''}`}
                onClick={() => setPickerFilter(pickerSlot.section)}
              >
                {pickerSlot.section === 'founder'
                  ? 'Founder Photos'
                  : pickerSlot.section === 'why'
                  ? 'Why Join Photos'
                  : pickerSlot.section === 'clubs'
                  ? 'Community Clubs Photos'
                  : 'Values Photos'}{' '}
                ({assets.filter(a => a.section === pickerSlot.section).length})
              </button>
              <button
                type="button"
                className={`modal-filter-btn ${pickerFilter === 'all' ? 'active' : ''}`}
                onClick={() => setPickerFilter('all')}
              >
                All Photos ({assets.length})
              </button>
              {pickerSlot.section !== 'values' && (
                <button
                  type="button"
                  className={`modal-filter-btn ${pickerFilter === 'values' ? 'active' : ''}`}
                  onClick={() => setPickerFilter('values')}
                >
                  Values ({valuesAssetsCount})
                </button>
              )}
              {pickerSlot.section !== 'why' && (
                <button
                  type="button"
                  className={`modal-filter-btn ${pickerFilter === 'why' ? 'active' : ''}`}
                  onClick={() => setPickerFilter('why')}
                >
                  Why Join ({whyAssetsCount})
                </button>
              )}
              {pickerSlot.section !== 'clubs' && (
                <button
                  type="button"
                  className={`modal-filter-btn ${pickerFilter === 'clubs' ? 'active' : ''}`}
                  onClick={() => setPickerFilter('clubs')}
                >
                  Clubs ({clubsAssetsCount})
                </button>
              )}
              {pickerSlot.section !== 'founder' && (
                <button
                  type="button"
                  className={`modal-filter-btn ${pickerFilter === 'founder' ? 'active' : ''}`}
                  onClick={() => setPickerFilter('founder')}
                >
                  Founder ({founderAssetsCount})
                </button>
              )}
            </div>

            <div className="admin-modal-body">
              {assets.filter(a => pickerFilter === 'all' || a.section === pickerFilter).length === 0 ? (
                <div className="admin-modal-empty">
                  <ImageIcon size={44} />
                  <h4>No photos found in this category</h4>
                  <p>Use "Upload New Photo" on the card to upload an image directly from your device.</p>
                </div>
              ) : (
                <div className="admin-modal-grid">
                  {assets
                    .filter(a => pickerFilter === 'all' || a.section === pickerFilter)
                    .map(a => {
                      const isSelected = pickerSelectedId === a.id;
                      return (
                        <div
                          key={a.id}
                          className={`admin-modal-thumb-wrap ${isSelected ? 'selected' : ''}`}
                          onClick={() => setPickerSelectedId(a.id)}
                        >
                          <img src={a.url} alt={a.alt || a.title} />
                          {isSelected && (
                            <div className="admin-modal-check">
                              <Check size={18} />
                            </div>
                          )}
                          <span className="admin-modal-thumb-title">{a.title}</span>
                          <button
                            type="button"
                            className="modal-thumb-del"
                            title="Delete this photo from library"
                            onClick={e => {
                              e.stopPropagation();
                              void handleDeleteAsset(a.id, a.title);
                            }}
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      );
                    })}
                </div>
              )}
            </div>

            <div className="admin-modal-footer">
              <button
                type="button"
                className="admin-btn-secondary"
                onClick={() => setPickerSlot(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="admin-btn-primary"
                disabled={!pickerSelectedId || busy}
                onClick={handleApplyPicker}
              >
                {busy ? 'Applying…' : `Set Photo for ${pickerSlot.label}`}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-brand-wrap">
          <a href="/" className="admin-brand">
            Zunoon
            <span>ADMIN STUDIO</span>
          </a>
        </div>

        <nav className="admin-nav-tabs">
          {/* 1. Hero Carousel (16:9) - Homepage Top */}
          <button
            type="button"
            className={`admin-nav-item ${activeTab === 'hero-carousel' ? 'active' : ''}`}
            onClick={() => handleTabChange('hero-carousel')}
          >
            <ImageIcon size={18} />
            <span>Hero Carousel (16:9)</span>
            <span className="nav-badge">{heroSlides.length}</span>
          </button>

          {/* 2. Founder Photo - Under Our Story */}
          <button
            type="button"
            className={`admin-nav-item ${activeTab === 'founder' ? 'active' : ''}`}
            onClick={() => handleTabChange('founder')}
          >
            <User size={18} />
            <span>Founder Photo</span>
            <span className="nav-badge">1</span>
          </button>

          {/* 3. Values Section - Vision, Mission & 6 Principles */}
          <button
            type="button"
            className={`admin-nav-item ${activeTab === 'values' ? 'active' : ''}`}
            onClick={() => handleTabChange('values')}
          >
            <Sparkles size={18} />
            <span>Values Section</span>
            <span className="nav-badge">6</span>
          </button>

          {/* 4. Why Join Questions - 6 Questions */}
          <button
            type="button"
            className={`admin-nav-item ${activeTab === 'why' ? 'active' : ''}`}
            onClick={() => handleTabChange('why')}
          >
            <HelpCircle size={18} />
            <span>Why Join Questions</span>
            <span className="nav-badge">6</span>
          </button>

          {/* 5. Community Clubs - 6 Clubs */}
          <button
            type="button"
            className={`admin-nav-item ${activeTab === 'clubs' ? 'active' : ''}`}
            onClick={() => handleTabChange('clubs')}
          >
            <Sparkles size={18} />
            <span>Community Clubs</span>
            <span className="nav-badge">6</span>
          </button>

          {/* 6. Who Can Join Zunoon - 8 Personas */}
          <button
            type="button"
            className={`admin-nav-item ${activeTab === 'community' ? 'active' : ''}`}
            onClick={() => handleTabChange('community')}
          >
            <User size={18} />
            <span>Who Can Join Zunoon</span>
            <span className="nav-badge">8</span>
          </button>

          {/* 7. Life at Zunoon - Gallery Photos */}
          <button
            type="button"
            className={`admin-nav-item ${activeTab === 'life-at-zunoon' ? 'active' : ''}`}
            onClick={() => handleTabChange('life-at-zunoon')}
          >
            <Camera size={18} />
            <span>Life at Zunoon</span>
            <span className="nav-badge">{galleryAssetsCount}</span>
          </button>

          {/* 8. Member Experiences - Reviews & Testimonials */}
          <button
            type="button"
            className={`admin-nav-item ${activeTab === 'member-experiences' ? 'active' : ''}`}
            onClick={() => handleTabChange('member-experiences')}
          >
            <Quote size={18} />
            <span>Member Experiences</span>
            <span className="nav-badge">{reviews.length}</span>
          </button>

          {/* 9. Membership Payments - Fees & Registrations */}
          <button
            type="button"
            className={`admin-nav-item ${activeTab === 'payments' ? 'active' : ''}`}
            onClick={() => handleTabChange('payments')}
          >
            <CreditCard size={18} />
            <span>Membership Payments</span>
          </button>

          {/* 10. Contact & WhatsApp - Contact Info & Links */}
          <button
            type="button"
            className={`admin-nav-item ${activeTab === 'contact' ? 'active' : ''}`}
            onClick={() => handleTabChange('contact')}
          >
            <Phone size={18} />
            <span>Contact &amp; WhatsApp</span>
          </button>

          {/* 11. Photo Library - All Media Assets Manager */}
          <button
            type="button"
            className={`admin-nav-item ${activeTab === 'library' ? 'active' : ''}`}
            onClick={() => handleTabChange('library')}
          >
            <ImageIcon size={18} />
            <span>Photo Library</span>
            <span className="nav-badge">{assets.length}</span>
          </button>
        </nav>

        <div className="admin-sidebar-footer">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="admin-view-site-link"
          >
            <ExternalLink size={16} />
            <span>Open Website</span>
          </a>
          <button
            type="button"
            className="admin-signout-btn"
            onClick={async () => {
              await api('/api/admin/logout', {method: 'POST'});
              window.location.href = '/admin/login/';
            }}
          >
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="admin-main">
        {/* Top Header */}
        <header className="admin-topbar">
          <div>
            <span className="eyebrow">{activeTab === 'payments' ? 'FINANCE & MEMBERSHIP' : 'ADMIN STUDIO'}</span>
            <h1>
              {activeTab === 'hero-carousel' && 'Hero Carousel Slides (16:9 Banner)'}
              {activeTab === 'founder' && 'Founder Portrait Photo (9:16)'}
              {activeTab === 'values' && 'Values Section Photos (16:9)'}
              {activeTab === 'why' && 'Why To Join Zunoon Photos (16:9)'}
              {activeTab === 'clubs' && 'Community Clubs Photos (16:10)'}
              {activeTab === 'community' && 'Who Can Join Zunoon Photos (16:10)'}
              {activeTab === 'life-at-zunoon' && 'Life at Zunoon Photos & Sections'}
              {activeTab === 'member-experiences' && 'Member Experiences & Reviews'}
              {activeTab === 'payments' && 'Membership & Registrations'}
              {activeTab === 'contact' && 'Contact & WhatsApp Settings'}
              {activeTab === 'library' && 'Photo Library'}
            </h1>
          </div>
          <div className="admin-topbar-actions">
            <a
              href={
                activeTab === 'payments'
                  ? '/join/'
                  : activeTab === 'values'
                  ? '/#values'
                  : activeTab === 'why'
                  ? '/#why-join'
                  : activeTab === 'founder'
                  ? '/#founder'
                  : activeTab === 'clubs'
                  ? '/#clubs'
                  : activeTab === 'community'
                  ? '/#community'
                  : activeTab === 'life-at-zunoon'
                  ? '/#gallery'
                  : activeTab === 'member-experiences'
                  ? '/#testimonials'
                  : activeTab === 'contact'
                  ? '/#contact'
                  : '/'
              }
              target="_blank"
              rel="noopener noreferrer"
              className="admin-preview-pill"
            >
              <ExternalLink size={14} />
              <span>Preview on Website</span>
            </a>
            <span className="admin-user-pill">{name}</span>
          </div>
        </header>

        {/* Global Notifications */}
        {error && (
          <div className="admin-alert error" role="alert">
            <AlertCircle size={20} />
            <span>{error}</span>
            <button type="button" onClick={() => setError('')} className="alert-close">
              <X size={16} />
            </button>
          </div>
        )}
        {message && (
          <div className="admin-alert success" role="status">
            <CheckCircle size={20} />
            <span>{message}</span>
            <button type="button" onClick={() => setMessage('')} className="alert-close">
              <X size={16} />
            </button>
          </div>
        )}

        {!configured && (
          <div className="admin-alert warning">
            <AlertCircle size={20} />
            <span>Cloudinary connection pending. Cloud uploads require server environment credentials. Existing images remain active.</span>
          </div>
        )}

        {loading ? (
          <div className="admin-loading-state">
            <RefreshCw size={28} className="spin" />
            <p>Loading your images…</p>
          </div>
        ) : (
          <>
            {/* TAB: HERO 16:9 CAROUSEL */}
            {activeTab === 'hero-carousel' && (
              <section className="admin-tab-content admin-hero-carousel-manager">
                {/* Helper Card */}
                <div className="admin-helper-card">
                  <div className="helper-icon">🎠</div>
                  <div className="helper-text">
                    <strong>Homepage Hero Carousel (16:9):</strong> Add any number of 16:9 widescreen images for the top banner.
                    <span className="helper-sub">
                      The carousel automatically auto-swipes every 4.5 seconds and supports manual touch swipe on phones, drag swipe on computers, and arrow buttons. Recommended image resolution: <strong>1920×1080 (16:9)</strong>.
                    </span>
                  </div>
                </div>

                {/* Upload Form Card */}
                <div className="hero-slides-upload-card">
                  <div className="hero-slides-upload-header">
                    <h3>+ Add New 16:9 Carousel Slide</h3>
                    <p>Upload a new high-resolution 16:9 image to appear in the homepage banner carousel.</p>
                  </div>

                  <form onSubmit={handleUploadHeroSlide} className="hero-upload-form">
                    <div
                      className="hero-dropzone"
                      onClick={() => heroFileInputRef.current?.click()}
                    >
                      <input
                        ref={heroFileInputRef}
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        style={{ display: 'none' }}
                        onChange={e => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setHeroSlideFile(file);
                            setHeroSlidePreview(URL.createObjectURL(file));
                            if (!heroSlideTitle) {
                              setHeroSlideTitle(file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '));
                            }
                          }
                        }}
                      />

                      {heroSlidePreview ? (
                        <div className="hero-preview-wrap">
                          <img src={heroSlidePreview} alt="Slide Preview" className="hero-preview-img" />
                          <div className="hero-preview-overlay-tag">
                            Click to change image
                          </div>
                        </div>
                      ) : (
                        <div className="hero-dropzone-content">
                          <div className="hero-dropzone-icon">
                            <Upload size={22} />
                          </div>
                          <div className="hero-dropzone-text">
                            <strong>Choose 16:9 Slide Photo</strong>
                            <p>Click anywhere to browse or drag an image here</p>
                            <span className="hero-dropzone-badge">16:9 Landscape · Recommended 1920 × 1080</span>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="hero-form-fields">
                      <div className="admin-form-group">
                        <label htmlFor="hero-slide-title-input">Slide Title / Headline (Optional)</label>
                        <input
                          id="hero-slide-title-input"
                          type="text"
                          placeholder="e.g. A Celebration of Life, Sports & Health"
                          value={heroSlideTitle}
                          onChange={e => setHeroSlideTitle(e.target.value)}
                        />
                      </div>
                      <div className="admin-form-group">
                        <label htmlFor="hero-slide-alt-input">Image Description (Alt Text for SEO)</label>
                        <input
                          id="hero-slide-alt-input"
                          type="text"
                          placeholder="e.g. Zunoon Club members gathered together"
                          value={heroSlideAlt}
                          onChange={e => setHeroSlideAlt(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="hero-upload-actions">
                      {heroSlideFile && (
                        <button
                          type="button"
                          className="hero-btn-cancel-select"
                          onClick={() => {
                            setHeroSlideFile(null);
                            setHeroSlidePreview('');
                            setHeroSlideTitle('');
                            setHeroSlideAlt('');
                            if (heroFileInputRef.current) heroFileInputRef.current.value = '';
                          }}
                        >
                          Cancel
                        </button>
                      )}
                      {heroSlideFile ? (
                        <button
                          type="submit"
                          disabled={heroUploading}
                          className="hero-btn-submit-upload"
                        >
                          {heroUploading ? (
                            <>
                              <RefreshCw size={16} className="spin" />
                              <span>Uploading 16:9 Slide…</span>
                            </>
                          ) : (
                            <>
                              <Upload size={16} />
                              <span>Upload 16:9 Slide Now</span>
                            </>
                          )}
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => heroFileInputRef.current?.click()}
                          className="hero-btn-submit-upload disabled-empty"
                        >
                          <Upload size={16} />
                          <span>Select Photo to Upload</span>
                        </button>
                      )}
                    </div>
                  </form>
                </div>

                {/* Slides List & Management */}
                <div>
                  <div className="hero-slides-grid-header">
                    <h3>Active Carousel Slides</h3>
                    <span>{heroSlides.length} slide{heroSlides.length === 1 ? '' : 's'} active</span>
                  </div>

                  {heroSlides.length === 0 ? (
                    <div className="admin-empty-box" style={{ background: '#ffffff', borderRadius: '12px', border: '1.5px dashed #cbd5e1', padding: '36px' }}>
                      <p style={{ margin: '0 0 8px', fontWeight: 600, color: '#1e3325' }}>No custom slides uploaded yet</p>
                      <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>
                        The homepage currently shows default high-resolution 16:9 slides. Upload your own 16:9 photos above to customize the carousel!
                      </p>
                    </div>
                  ) : (
                    <div className="hero-slides-grid">
                      {heroSlides.map((slide, idx) => (
                        <div key={slide.id} className="hero-slide-card">
                          <div className="hero-slide-thumb-wrap">
                            <img src={slide.url} alt={slide.alt || 'Slide'} className="hero-slide-thumb-img" />
                            <span className="hero-slide-badge">Slide #{idx + 1}</span>
                            <span className="hero-slide-ratio-tag">16:9</span>
                          </div>
                          <div className="hero-slide-body">
                            <div className="hero-slide-info">
                              <h4>{slide.title || 'Untitled Slide'}</h4>
                              <p>{slide.alt || 'No description provided'}</p>
                            </div>
                            <div className="hero-slide-actions">
                              <div className="hero-slide-order-btns">
                                <button
                                  type="button"
                                  className="hero-order-btn"
                                  disabled={idx === 0 || busy}
                                  onClick={() => handleMoveHeroSlide(slide.id, 'up')}
                                  title="Move earlier in carousel"
                                >
                                  <ChevronUp size={16} />
                                </button>
                                <button
                                  type="button"
                                  className="hero-order-btn"
                                  disabled={idx === heroSlides.length - 1 || busy}
                                  onClick={() => handleMoveHeroSlide(slide.id, 'down')}
                                  title="Move later in carousel"
                                >
                                  <ChevronDown size={16} />
                                </button>
                              </div>

                              <button
                                type="button"
                                className="hero-btn-delete-slide"
                                disabled={busy}
                                onClick={() => handleDeleteHeroSlide(slide.id)}
                              >
                                <Trash2 size={13} />
                                <span>Delete</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Live Preview Card */}
                <div className="hero-live-preview-section">
                  <div className="hero-live-preview-header">
                    <h3>Live Interactive Preview</h3>
                    <p>This is exactly how the 16:9 carousel behaves on the homepage (with auto-swipe and manual drag/touch swipe):</p>
                  </div>
                  <HeroCarousel key={heroSlides.map(s => s.id).join('-') || 'empty'} initialSlides={heroSlides.length > 0 ? heroSlides : undefined} />
                </div>
              </section>
            )}

            {/* TAB 1: VALUES SECTION */}
            {activeTab === 'values' && (
              <section className="admin-tab-content">
                <div className="admin-helper-card">
                  <div className="helper-icon">💡</div>
                  <div className="helper-text">
                    <strong>Simple 1-Click Update:</strong> Click <strong>"Upload New Photo"</strong> on any card to update it directly from your computer or phone.
                    <span className="helper-sub">Recommended ratio: <strong>16:9</strong> (e.g. 1920×1080 or 1280×720) so the image fits without cropping.</span>
                  </div>
                </div>

                <div className="admin-cards-grid">
                  {valueSlots.map(slot => {
                    const key = `values.${slot}`;
                    const assignedId = assignments.find(a => a.slot === key)?.assetId;
                    const assignedAsset = assets.find(a => a.id === assignedId);
                    const currentUrl = assignedAsset?.url || defaultValuesMedia[slot]?.url;
                    const currentAlt = assignedAsset?.alt || defaultValuesMedia[slot]?.alt || `${slot} photo`;
                    const label = slot[0].toUpperCase() + slot.slice(1);
                    const isUpdating = updatingSlot === key;

                    return (
                      <article key={slot} className="admin-card">
                        <div className="admin-card-media-wrap">
                          {currentUrl ? (
                            <img src={currentUrl} alt={currentAlt} />
                          ) : (
                            <div className="admin-placeholder">No photo assigned</div>
                          )}
                          <span className="admin-badge-live">
                            <span className="dot" /> Live on website
                          </span>
                          {isUpdating && (
                            <div className="admin-card-overlay">
                              <RefreshCw size={26} className="spin" />
                              <span>Updating photo...</span>
                            </div>
                          )}
                        </div>

                        <div className="admin-card-content">
                          <h3>{label}</h3>
                          <span className="admin-card-meta">Values Section</span>
                        </div>

                        <div className="admin-card-buttons">
                          <label className="admin-btn-upload">
                            <Upload size={16} />
                            <span>Upload New Photo</span>
                            <input
                              type="file"
                              accept="image/jpeg,image/png,image/webp"
                              disabled={isUpdating || !configured}
                              onChange={e => {
                                const f = e.target.files?.[0];
                                if (f) void handleDirectUpload('values', slot, f, label);
                                e.target.value = '';
                              }}
                            />
                          </label>

                          <div className="admin-btn-row">
                            <button
                              type="button"
                              className="admin-btn-library"
                              disabled={isUpdating}
                              onClick={() => openPicker('values', slot, label, assignedId)}
                            >
                              <ImageIcon size={15} />
                              <span>Pick from Library</span>
                            </button>

                            {assignedId && (
                              <button
                                type="button"
                                className="admin-btn-remove"
                                disabled={isUpdating}
                                title="Remove assigned photo"
                                onClick={() => void handleRemoveSlot('values', slot, label)}
                              >
                                <Trash2 size={15} />
                              </button>
                            )}
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </section>
            )}

            {/* TAB 2: WHY JOIN QUESTIONS */}
            {activeTab === 'why' && (
              <section className="admin-tab-content">
                <div className="admin-helper-card">
                  <div className="helper-icon">💡</div>
                  <div className="helper-text">
                    <strong>Why To Join Zunoon Cards:</strong> Click <strong>"Upload New Photo"</strong> to change any of the 6 question cards.
                    <span className="helper-sub">Recommended ratio: <strong>16:9</strong> (e.g. 1920×1080 or 1280×720). Each card renders with a stylish gradient overlay.</span>
                  </div>
                </div>

                <div className="admin-cards-grid">
                  {whySlots.map(slot => {
                    const key = `why.${slot}`;
                    const assignedId = assignments.find(a => a.slot === key)?.assetId;
                    const assignedAsset = assets.find(a => a.id === assignedId);
                    const currentUrl = assignedAsset?.url || defaultWhyMedia[slot]?.url;
                    const label = whySlotLabels[slot] || slot;
                    const currentAlt = assignedAsset?.alt || defaultWhyMedia[slot]?.alt || `${label} photo`;
                    const isUpdating = updatingSlot === key;

                    return (
                      <article key={slot} className="admin-card">
                        <div className="admin-card-media-wrap">
                          {currentUrl ? (
                            <img src={currentUrl} alt={currentAlt} />
                          ) : (
                            <div className="admin-placeholder">No photo assigned</div>
                          )}
                          <span className="admin-badge-live">
                            <span className="dot" /> Live on website
                          </span>
                          {isUpdating && (
                            <div className="admin-card-overlay">
                              <RefreshCw size={26} className="spin" />
                              <span>Updating photo...</span>
                            </div>
                          )}
                        </div>

                        <div className="admin-card-content">
                          <h3>{label}</h3>
                          <span className="admin-card-meta">Why Join Section</span>
                        </div>

                        <div className="admin-card-buttons">
                          <label className="admin-btn-upload">
                            <Upload size={16} />
                            <span>Upload New Photo</span>
                            <input
                              type="file"
                              accept="image/jpeg,image/png,image/webp"
                              disabled={isUpdating || !configured}
                              onChange={e => {
                                const f = e.target.files?.[0];
                                if (f) void handleDirectUpload('why', slot, f, label);
                                e.target.value = '';
                              }}
                            />
                          </label>

                          <div className="admin-btn-row">
                            <button
                              type="button"
                              className="admin-btn-library"
                              disabled={isUpdating}
                              onClick={() => openPicker('why', slot, label, assignedId)}
                            >
                              <ImageIcon size={15} />
                              <span>Pick from Library</span>
                            </button>

                            {assignedId && (
                              <button
                                type="button"
                                className="admin-btn-remove"
                                disabled={isUpdating}
                                title="Remove assigned photo"
                                onClick={() => void handleRemoveSlot('why', slot, label)}
                              >
                                <Trash2 size={15} />
                              </button>
                            )}
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </section>
            )}

            {/* TAB 3: FOUNDER SECTION (9:16 PORTRAIT) */}
            {activeTab === 'founder' && (
              <section className="admin-tab-content">
                <div className="admin-helper-card">
                  <div className="helper-icon">💡</div>
                  <div className="helper-text">
                    <strong>Founder Portrait Photo (9:16):</strong> Upload or pick the photo for Founder Jainit Finaviya.
                    <span className="helper-sub">
                      Recommended ratio: <strong>9:16 Portrait</strong> (e.g. 1080×1920 or 720×1280). Displayed on the homepage right below "Our Story".
                    </span>
                  </div>
                </div>

                <div className="admin-founder-card-wrap">
                  {(() => {
                    const key = 'founder.profile';
                    const assignedId = assignments.find(a => a.slot === key || a.slot === 'founder')?.assetId;
                    const assignedAsset = assets.find(a => a.id === assignedId);
                    const currentUrl = assignedAsset?.url || defaultFounderMedia.url;
                    const currentAlt = assignedAsset?.alt || defaultFounderMedia.alt;
                    const label = 'Founder Jainit Finaviya';
                    const isUpdating = updatingSlot === key || updatingSlot === 'founder';

                    return (
                      <article className="admin-card admin-card-portrait">
                        <div className="admin-card-media-wrap portrait-ratio">
                          {currentUrl ? (
                            <img src={currentUrl} alt={currentAlt} />
                          ) : (
                            <div className="admin-placeholder">No photo assigned</div>
                          )}
                          <span className="admin-badge-live">
                            <span className="dot" /> Live on website (9:16)
                          </span>
                          {isUpdating && (
                            <div className="admin-card-overlay">
                              <RefreshCw size={26} className="spin" />
                              <span>Updating portrait...</span>
                            </div>
                          )}
                        </div>

                        <div className="admin-card-content">
                          <h3>{label}</h3>
                          <span className="admin-card-meta">Our Story → Founder Section (9:16 Portrait)</span>
                        </div>

                        <div className="admin-card-buttons">
                          <label className="admin-btn-upload">
                            <Upload size={16} />
                            <span>Upload New Photo (9:16)</span>
                            <input
                              type="file"
                              accept="image/jpeg,image/png,image/webp"
                              disabled={isUpdating || !configured}
                              onChange={e => {
                                const f = e.target.files?.[0];
                                if (f) void handleDirectUpload('founder', 'profile', f, label);
                                e.target.value = '';
                              }}
                            />
                          </label>

                          <div className="admin-btn-row">
                            <button
                              type="button"
                              className="admin-btn-library"
                              disabled={isUpdating}
                              onClick={() => openPicker('founder', 'profile', label, assignedId)}
                            >
                              <ImageIcon size={15} />
                              <span>Pick from Library</span>
                            </button>

                            {assignedId && (
                              <button
                                type="button"
                                className="admin-btn-remove"
                                disabled={isUpdating}
                                title="Remove assigned photo"
                                onClick={() => void handleRemoveSlot('founder', 'profile', label)}
                              >
                                <Trash2 size={15} />
                              </button>
                            )}
                          </div>
                        </div>
                      </article>
                    );
                  })()}
                </div>
              </section>
            )}

            {/* TAB: COMMUNITY CLUBS SECTION */}
            {activeTab === 'clubs' && (
              <section className="admin-tab-content">
                <div className="admin-helper-card">
                  <div className="helper-icon">💡</div>
                  <div className="helper-text">
                    <strong>Community Clubs Photos:</strong> Click <strong>"Upload New Photo"</strong> on any club card to update its photo directly.
                    <span className="helper-sub">Recommended ratio: <strong>16:10 or 16:9</strong> landscape (e.g. 1920×1200 or 1920×1080). Displayed on the homepage under "OUR CLUBS".</span>
                  </div>
                </div>

                <div className="admin-cards-grid">
                  {clubSlots.map(slot => {
                    const key = `clubs.${slot}`;
                    const assignedId = assignments.find(a => a.slot === key)?.assetId;
                    const assignedAsset = assets.find(a => a.id === assignedId);
                    const currentUrl = assignedAsset?.url || defaultClubsMedia[slot]?.url;
                    const label = clubSlotLabels[slot] || slot;
                    const currentAlt = assignedAsset?.alt || defaultClubsMedia[slot]?.alt || `${label} photo`;
                    const isUpdating = updatingSlot === key;

                    return (
                      <article key={slot} className="admin-card">
                        <div className="admin-card-media-wrap">
                          {currentUrl ? (
                            <img src={currentUrl} alt={currentAlt} />
                          ) : (
                            <div className="admin-placeholder">No photo assigned</div>
                          )}
                          <span className="admin-badge-live">
                            <span className="dot" /> Live on website
                          </span>
                          {isUpdating && (
                            <div className="admin-card-overlay">
                              <RefreshCw size={26} className="spin" />
                              <span>Updating photo...</span>
                            </div>
                          )}
                        </div>

                        <div className="admin-card-content">
                          <h3>{label}</h3>
                          <span className="admin-card-meta">Community Clubs Section</span>
                        </div>

                        <div className="admin-card-buttons">
                          <label className="admin-btn-upload">
                            <Upload size={16} />
                            <span>Upload New Photo</span>
                            <input
                              type="file"
                              accept="image/jpeg,image/png,image/webp"
                              disabled={isUpdating || !configured}
                              onChange={e => {
                                const f = e.target.files?.[0];
                                if (f) void handleDirectUpload('clubs', slot, f, label);
                                e.target.value = '';
                              }}
                            />
                          </label>

                          <div className="admin-btn-row">
                            <button
                              type="button"
                              className="admin-btn-library"
                              disabled={isUpdating}
                              onClick={() => openPicker('clubs', slot, label, assignedId)}
                            >
                              <ImageIcon size={15} />
                              <span>Pick from Library</span>
                            </button>

                            {assignedId && (
                              <button
                                type="button"
                                className="admin-btn-remove"
                                disabled={isUpdating}
                                title="Remove assigned photo"
                                onClick={() => void handleRemoveSlot('clubs', slot, label)}
                              >
                                <Trash2 size={15} />
                              </button>
                            )}
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </section>
            )}

            {/* TAB: ZUNOON FOR EVERYONE (COMMUNITY) SECTION */}
            {activeTab === 'community' && (
              <section className="admin-tab-content">
                <div className="admin-helper-card">
                  <div className="helper-icon">💡</div>
                  <div className="helper-text">
                    <strong>Who Can Join Zunoon Photos (8 Personas):</strong> Click <strong>"Upload New Photo"</strong> on any persona card to update its photo directly.
                    <span className="helper-sub">Recommended ratio: <strong>16:10 or 16:9</strong> landscape (e.g. 1920×1200 or 1920×1080). Displayed on the homepage under "WHO CAN JOIN ZUNOON".</span>
                  </div>
                </div>

                <div className="admin-cards-grid">
                  {communitySlots.map(slot => {
                    const key = `community.${slot}`;
                    const assignedId = assignments.find(a => a.slot === key)?.assetId;
                    const assignedAsset = assets.find(a => a.id === assignedId);
                    const currentUrl = assignedAsset?.url || defaultCommunityMedia[slot]?.url;
                    const label = communitySlotLabels[slot] || slot;
                    const currentAlt = assignedAsset?.alt || defaultCommunityMedia[slot]?.alt || `${label} photo`;
                    const isUpdating = updatingSlot === key;

                    return (
                      <article key={slot} className="admin-card">
                        <div className="admin-card-media-wrap">
                          {currentUrl ? (
                            <img src={currentUrl} alt={currentAlt} />
                          ) : (
                            <div className="admin-placeholder">No photo assigned</div>
                          )}
                          <span className="admin-badge-live">
                            <span className="dot" /> Live on website
                          </span>
                          {isUpdating && (
                            <div className="admin-card-overlay">
                              <RefreshCw size={26} className="spin" />
                              <span>Updating photo...</span>
                            </div>
                          )}
                        </div>

                        <div className="admin-card-content">
                          <h3>{label}</h3>
                          <span className="admin-card-meta">Zunoon For Everyone Section</span>
                        </div>

                        <div className="admin-card-buttons">
                          <label className="admin-btn-upload">
                            <Upload size={16} />
                            <span>Upload New Photo</span>
                            <input
                              type="file"
                              accept="image/jpeg,image/png,image/webp"
                              disabled={isUpdating || !configured}
                              onChange={e => {
                                const f = e.target.files?.[0];
                                if (f) void handleDirectUpload('community', slot, f, label);
                                e.target.value = '';
                              }}
                            />
                          </label>

                          <div className="admin-btn-row">
                            <button
                              type="button"
                              className="admin-btn-library"
                              disabled={isUpdating}
                              onClick={() => openPicker('community', slot, label, assignedId)}
                            >
                              <ImageIcon size={15} />
                              <span>Pick from Library</span>
                            </button>

                            {assignedId && (
                              <button
                                type="button"
                                className="admin-btn-remove"
                                disabled={isUpdating}
                                title="Remove assigned photo"
                                onClick={() => void handleRemoveSlot('community', slot, label)}
                              >
                                <Trash2 size={15} />
                              </button>
                            )}
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </section>
            )}

            {/* TAB: LIFE AT ZUNOON (SECTIONS & MULTI-PHOTO UPLOAD) */}
            {activeTab === 'life-at-zunoon' && (
              <section className="admin-tab-content">
                <div className="admin-helper-card">
                  <div className="helper-icon">📸</div>
                  <div className="helper-text">
                    <strong>Life at Zunoon:</strong> Manage activity sections and upload multiple photos per section.
                    <span className="helper-sub">
                      Photos appear on the website under "LIFE AT ZUNOON", organized by section filter buttons. Thumbnails have no title overlay, and clicking opens the full-screen viewer with touch swipe on mobile and arrow keys on desktop.
                    </span>
                  </div>
                </div>

                {/* Section Management Card */}
                <div className="admin-gallery-sec-manager">
                  <div className="sec-manager-header">
                    <div>
                      <h3>Activity Sections</h3>
                      <p>Add new sections or click any section chip to view its photos.</p>
                    </div>
                    <form onSubmit={handleAddGallerySection} className="sec-add-form">
                      <input
                        type="text"
                        placeholder="New Section Name (e.g. Cricket, Yoga, Workshops)"
                        value={newSectionName}
                        onChange={e => setNewSectionName(e.target.value)}
                        disabled={busy}
                      />
                      <button type="submit" disabled={!newSectionName.trim() || busy} className="admin-btn-primary">
                        <Plus size={16} />
                        <span>Add Section</span>
                      </button>
                    </form>
                  </div>

                  <div className="sec-chips-row">
                    <div className={`sec-chip ${selectedGalleryFilter === 'All' ? 'active' : ''}`}>
                      <button
                        type="button"
                        className="sec-chip-select"
                        onClick={() => setSelectedGalleryFilter('All')}
                      >
                        <span>All Sections</span>
                        <span className="sec-chip-count">{assets.filter(a => a.section === 'gallery').length}</span>
                      </button>
                    </div>
                    {gallerySections.map(sec => {
                      const count = assets.filter(a => a.section === 'gallery' && (a.category === sec || (!a.category && sec === 'Community'))).length;
                      const isCustom = customSections.includes(sec);
                      return (
                        <div key={sec} className={`sec-chip ${selectedGalleryFilter === sec ? 'active' : ''}`}>
                          <button
                            type="button"
                            className="sec-chip-select"
                            onClick={() => setSelectedGalleryFilter(sec === selectedGalleryFilter ? 'All' : sec)}
                          >
                            <span>{sec}</span>
                            <span className="sec-chip-count">{count}</span>
                          </button>
                          {isCustom && count === 0 && (
                            <button
                              type="button"
                              className="sec-chip-del"
                              title={`Delete section "${sec}"`}
                              onClick={() => void handleDeleteGallerySection(sec)}
                            >
                              <X size={13} />
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Multi-Photo Uploader Box */}
                <div className="admin-library-uploader">
                  <h3>Upload Photos to a Section</h3>
                  <p>Select a section and upload one or multiple photos to display under Life at Zunoon.</p>

                  <form onSubmit={handleGalleryMultiUpload} className="admin-gallery-upload-form">
                    <div className="gallery-upload-controls">
                      <label className="admin-select-label">
                        <span>Upload into:</span>
                        <select
                          value={targetUploadSection}
                          onChange={e => setTargetUploadSection(e.target.value)}
                          disabled={busy}
                        >
                          {gallerySections.map(s => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </label>

                      <label className="admin-btn-upload gallery-multi-picker">
                        <Upload size={16} />
                        <span>{gallerySelectedFiles.length > 0 ? `${gallerySelectedFiles.length} photo(s) selected` : 'Choose Photos (1 or Multiple)'}</span>
                        <input
                          type="file"
                          multiple
                          accept="image/jpeg,image/png,image/webp"
                          disabled={busy || !configured}
                          onChange={e => {
                            if (e.target.files) {
                              setGallerySelectedFiles(Array.from(e.target.files));
                            }
                          }}
                        />
                      </label>

                      <button
                        type="submit"
                        className="admin-btn-primary"
                        disabled={gallerySelectedFiles.length === 0 || busy}
                      >
                        {busy ? (uploadProgress || 'Uploading…') : `Upload ${gallerySelectedFiles.length ? gallerySelectedFiles.length + ' ' : ''}Photo(s)`}
                      </button>
                    </div>
                  </form>
                </div>

                {/* Section Photos Grid */}
                <div className="admin-gallery-display-head">
                  <h3>
                    {selectedGalleryFilter === 'All' ? 'All Life at Zunoon Photos' : `Photos in "${selectedGalleryFilter}"`}
                    <span className="count-badge">
                      {assets.filter(a => a.section === 'gallery' && (selectedGalleryFilter === 'All' || a.category === selectedGalleryFilter || (!a.category && selectedGalleryFilter === 'Community'))).length}
                    </span>
                  </h3>
                  {selectedGalleryFilter !== 'All' && (
                    <button
                      type="button"
                      className="admin-btn-secondary btn-sm"
                      onClick={() => setSelectedGalleryFilter('All')}
                    >
                      Show All
                    </button>
                  )}
                </div>

                {/* Photos List */}
                {(() => {
                  const galleryAssets = assets.filter(
                    a => a.section === 'gallery' && (selectedGalleryFilter === 'All' || a.category === selectedGalleryFilter || (!a.category && selectedGalleryFilter === 'Community'))
                  );
                  if (galleryAssets.length === 0) {
                    return (
                      <div className="admin-empty-gallery">
                        <ImageIcon size={48} />
                        <h4>No photos in this section yet</h4>
                        <p>Use the uploader above to add photos to "{selectedGalleryFilter === 'All' ? targetUploadSection : selectedGalleryFilter}".</p>
                      </div>
                    );
                  }
                  return (
                    <div className="admin-gallery-grid">
                      {galleryAssets.map(a => (
                        <div key={a.id} className="admin-gallery-card">
                          <div className="gallery-thumb-wrap">
                            <img src={a.url} alt={a.alt || a.title} />
                            <span className="gallery-section-tag">{a.category || 'Community'}</span>
                          </div>
                          <div className="gallery-card-body">
                            <span className="gallery-meta">
                              {(a.bytes / 1024).toFixed(0)} KB · {new Date(a.createdAt).toLocaleDateString()}
                            </span>
                            <div className="gallery-card-actions">
                              <button
                                type="button"
                                className="admin-btn-delete"
                                disabled={busy}
                                onClick={() => void handleDeleteAsset(a.id, a.title)}
                                title="Delete photo"
                              >
                                <Trash2 size={14} />
                                <span>Delete</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })()}
              </section>
            )}

            {/* TAB: MEMBER EXPERIENCES & REVIEWS */}
            {activeTab === 'member-experiences' && (
              <section className="admin-tab-content">
                <div className="admin-helper-card">
                  <div className="helper-icon">💡</div>
                  <div className="helper-text">
                    <strong>Member Experiences & Reviews with Name:</strong> Add, edit, or delete member reviews and testimonials. All reviews added here appear live on the website in the <strong>"Member Experiences"</strong> section.
                    <span className="helper-sub">You can specify Member Name, Member Role/Profile, Category, and the review text.</span>
                  </div>
                </div>

                {/* Reviews Action Bar */}
                <div className="reviews-admin-toolbar">
                  <div className="reviews-toolbar-title">
                    <h3>All Member Experiences</h3>
                    <span className="count-badge">{reviews.length} reviews</span>
                  </div>
                  <button
                    type="button"
                    className="admin-btn-primary"
                    onClick={openNewReviewModal}
                  >
                    <Plus size={16} />
                    <span>Add Member Experience</span>
                  </button>
                </div>

                {/* Reviews Grid */}
                <div className="admin-reviews-grid">
                  {reviews.length === 0 ? (
                    <div className="admin-empty-box">
                      <p>No member experiences added yet. Click "+ Add Member Experience" to add the first one!</p>
                    </div>
                  ) : (
                    reviews.map(rev => (
                      <article key={rev.id} className="admin-review-card">
                        <div className="admin-review-card-head">
                          <span className="admin-review-cat">{rev.category}</span>
                          <div className="admin-review-stars">
                            {Array.from({length: rev.rating || 5}).map((_, i) => (
                              <Star key={i} size={14} fill="#e59819" color="#e59819" />
                            ))}
                          </div>
                        </div>

                        <blockquote className="admin-review-quote">
                          “{rev.quote.replace(/^[“"]|[”"]$/g, '')}”
                        </blockquote>

                        <div className="admin-review-card-foot">
                          <div className="admin-review-author-info">
                            <strong className="admin-review-name">{rev.author}</strong>
                            {rev.role && <span className="admin-review-role">{rev.role}</span>}
                            {!rev.role && rev.title && <span className="admin-review-role">{rev.title}</span>}
                          </div>

                          <div className="admin-review-actions">
                            <button
                              type="button"
                              className="admin-review-btn-edit"
                              onClick={() => openEditReviewModal(rev)}
                              title="Edit Review"
                            >
                              <Edit3 size={15} />
                              <span>Edit</span>
                            </button>
                            <button
                              type="button"
                              className="admin-review-btn-delete"
                              onClick={() => void handleDeleteReview(rev.id, rev.author)}
                              title="Delete Review"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </div>
                      </article>
                    ))
                  )}
                </div>

                {/* Add / Edit Review Modal */}
                {showReviewModal && (
                  <div className="admin-modal-backdrop" onClick={() => setShowReviewModal(false)}>
                    <div className="admin-modal-box review-modal-box" onClick={e => e.stopPropagation()}>
                      <div className="admin-modal-head">
                        <h3>{editingReview ? 'Edit Member Experience' : 'Add New Member Experience'}</h3>
                        <button
                          type="button"
                          className="admin-modal-close"
                          onClick={() => setShowReviewModal(false)}
                        >
                          <X size={18} />
                        </button>
                      </div>

                      <form onSubmit={handleSaveReview} className="admin-review-form">
                        <div className="admin-form-group">
                          <label>
                            Member Name <span className="required">*</span>
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Ramesh Patel, Priya Shah"
                            value={reviewForm.author}
                            onChange={e => setReviewForm(prev => ({...prev, author: e.target.value}))}
                          />
                        </div>

                        <div className="admin-form-row-2">
                          <div className="admin-form-group">
                            <label>Member Role / Tag</label>
                            <input
                              type="text"
                              placeholder="e.g. Entrepreneur, Homemaker, CA"
                              value={reviewForm.role}
                              onChange={e => setReviewForm(prev => ({...prev, role: e.target.value}))}
                            />
                          </div>

                          <div className="admin-form-group">
                            <label>Category</label>
                            <select
                              value={reviewForm.category}
                              onChange={e => setReviewForm(prev => ({...prev, category: e.target.value}))}
                            >
                              <option value="Health & Fitness">Health & Fitness</option>
                              <option value="Personal Growth">Personal Growth</option>
                              <option value="Sports & Fun">Sports & Fun</option>
                              <option value="Hobbies & Creativity">Hobbies & Creativity</option>
                              <option value="Human Connection">Human Connection</option>
                              <option value="Social Impact">Social Impact</option>
                              <option value="Celebration">Celebration</option>
                            </select>
                          </div>
                        </div>

                        <div className="admin-form-group">
                          <label>Review Title / Headline (Optional)</label>
                          <input
                            type="text"
                            placeholder="e.g. A Community Beyond Routine"
                            value={reviewForm.title}
                            onChange={e => setReviewForm(prev => ({...prev, title: e.target.value}))}
                          />
                        </div>

                        <div className="admin-form-group">
                          <label>Rating</label>
                          <select
                            value={reviewForm.rating}
                            onChange={e => setReviewForm(prev => ({...prev, rating: Number(e.target.value)}))}
                          >
                            <option value={5}>⭐⭐⭐⭐⭐ (5 Stars)</option>
                            <option value={4}>⭐⭐⭐⭐ (4 Stars)</option>
                            <option value={3}>⭐⭐⭐ (3 Stars)</option>
                          </select>
                        </div>

                        <div className="admin-form-group">
                          <label>
                            Member Experience / Review Text <span className="required">*</span>
                          </label>
                          <textarea
                            required
                            rows={4}
                            placeholder="Write the member's quote or experience here..."
                            value={reviewForm.quote}
                            onChange={e => setReviewForm(prev => ({...prev, quote: e.target.value}))}
                          />
                        </div>

                        <div className="admin-modal-actions">
                          <button
                            type="button"
                            className="admin-btn-secondary"
                            onClick={() => setShowReviewModal(false)}
                            disabled={busy}
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="admin-btn-primary"
                            disabled={busy || !reviewForm.author.trim() || !reviewForm.quote.trim()}
                          >
                            {busy ? 'Saving…' : editingReview ? 'Update Review' : 'Save & Publish Review'}
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}
              </section>
            )}

            {/* TAB: MEMBERSHIP PAYMENTS & REGISTRATIONS */}
            {activeTab === 'payments' && (
              <section className="admin-tab-content admin-payments-manager" style={{ padding: 0, background: 'transparent', border: 'none' }}>
                <PaymentsAdmin embedded={true} />
              </section>
            )}

            {/* TAB 4: MEDIA LIBRARY */}
            {activeTab === 'library' && (
              <section className="admin-tab-content">
                {/* Quick Upload Box */}
                <div className="admin-library-uploader">
                  <h3>Add Photos to Library</h3>
                  <p>Upload photos in 16:9 ratio to use them anytime across any section on the website.</p>

                  <form onSubmit={handleLibraryUpload} className="admin-lib-upload-form">
                    <label className="admin-lib-dropzone">
                      {libPreview ? (
                        <img src={libPreview} alt="Preview" className="lib-drop-preview" />
                      ) : (
                        <div className="dropzone-text">
                          <Upload size={32} />
                          <strong>Click or drop a photo here</strong>
                          <span>JPG, PNG or WebP · up to 4 MB</span>
                        </div>
                      )}
                      <input
                        ref={libInput}
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        disabled={busy || !configured}
                        onChange={e => {
                          const f = e.target.files?.[0] || null;
                          if (f && f.size > 4 * 1024 * 1024) {
                            setError('Please choose an image smaller than 4 MB.');
                            e.target.value = '';
                            setLibFile(null);
                            return;
                          }
                          setLibFile(f);
                          if (f && !libTitle) {
                            setLibTitle(f.name.replace(/\.[^/.]+$/, ''));
                          }
                        }}
                      />
                    </label>

                    <div className="admin-lib-controls">
                      <label>
                        Photo Title
                        <input
                          type="text"
                          value={libTitle}
                          onChange={e => setLibTitle(e.target.value)}
                          placeholder="e.g. Community Gathering"
                          disabled={busy}
                        />
                      </label>
                      <label>
                        Section Category
                        <select
                          value={libSection}
                          onChange={e => setLibSection(e.target.value)}
                          disabled={busy}
                        >
                          <option value="general">General / Reusable</option>
                          <option value="values">Values Section</option>
                          <option value="why">Why Join Questions</option>
                          <option value="founder">Founder Photo (9:16)</option>
                          <option value="clubs">Community Clubs</option>
                          <option value="gallery">Events & Gallery</option>
                        </select>
                      </label>
                      <button
                        type="submit"
                        className="admin-btn-primary"
                        disabled={busy || !libFile || !configured}
                      >
                        {busy ? 'Uploading…' : 'Upload to Cloudinary'}
                      </button>
                    </div>
                  </form>
                </div>

                {/* Library Gallery */}
                <div className="admin-library-header">
                  <div>
                    <h3>Uploaded Photos ({assets.length})</h3>
                    <p>All photos saved in Cloudinary.</p>
                  </div>
                  <div className="admin-lib-filters">
                    <button
                      type="button"
                      className={`filter-btn ${libFilter === 'all' ? 'active' : ''}`}
                      onClick={() => setLibFilter('all')}
                    >
                      All ({assets.length})
                    </button>
                    <button
                      type="button"
                      className={`filter-btn ${libFilter === 'values' ? 'active' : ''}`}
                      onClick={() => setLibFilter('values')}
                    >
                      Values ({valuesAssetsCount})
                    </button>
                    <button
                      type="button"
                      className={`filter-btn ${libFilter === 'why' ? 'active' : ''}`}
                      onClick={() => setLibFilter('why')}
                    >
                      Why Join ({whyAssetsCount})
                    </button>
                    <button
                      type="button"
                      className={`filter-btn ${libFilter === 'founder' ? 'active' : ''}`}
                      onClick={() => setLibFilter('founder')}
                    >
                      Founder ({founderAssetsCount})
                    </button>
                    <button
                      type="button"
                      className="filter-refresh"
                      onClick={() => refresh().catch(e => setError(e.message))}
                      title="Refresh library"
                    >
                      <RefreshCw size={15} />
                    </button>
                  </div>
                </div>

                {assets.length === 0 ? (
                  <div className="admin-empty-gallery">
                    <ImageIcon size={44} />
                    <h4>Your photo library is empty</h4>
                    <p>Use the upload box above or upload directly from any section.</p>
                  </div>
                ) : (
                  <div className="admin-gallery-grid">
                    {assets
                      .filter(a => libFilter === 'all' || a.section === libFilter)
                      .map(a => {
                        const assignedSlot = assignments.find(asgn => asgn.assetId === a.id)?.slot;
                        return (
                          <div key={a.id} className="admin-gallery-card">
                            <div className="gallery-thumb-wrap">
                              <img src={a.url} alt={a.alt || a.title} loading="lazy" />
                              <span className="gallery-section-tag">{sectionLabels[a.section] || a.section}</span>
                              {assignedSlot && (
                                <span className="gallery-assigned-tag">In use</span>
                              )}
                            </div>
                            <div className="gallery-card-body">
                              <h4>{a.title}</h4>
                              <span className="gallery-meta">
                                {Math.round(a.bytes / 1024)} KB · {new Date(a.createdAt).toLocaleDateString()}
                              </span>
                              <div className="gallery-card-actions">
                                <button
                                  type="button"
                                  className="action-btn"
                                  onClick={async () => {
                                    try {
                                      await navigator.clipboard.writeText(a.url);
                                      setMessage('✓ Photo URL copied to clipboard.');
                                    } catch {
                                      setError('Could not copy automatically.');
                                    }
                                  }}
                                >
                                  <Copy size={13} /> Copy
                                </button>
                                <a
                                  href={a.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="action-btn"
                                >
                                  <ExternalLink size={13} /> View
                                </a>
                                <button
                                  type="button"
                                  className="action-btn danger"
                                  disabled={busy}
                                  onClick={() => void handleDeleteAsset(a.id, a.title)}
                                  title="Permanently delete from library"
                                >
                                  <Trash2 size={13} /> Delete
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                )}
              </section>
            )}

            {/* TAB: CONTACT & WHATSAPP SETTINGS */}
            {activeTab === 'contact' && (
              <section className="admin-tab-content">
                <div className="admin-helper-card">
                  <div className="helper-icon"><Phone size={24} /></div>
                  <div className="helper-text">
                    <strong>Dynamic WhatsApp &amp; Contact Details:</strong> Update the club's WhatsApp number, phone, Instagram, and address.
                    <span className="helper-sub">
                      When a member finishes payment on the website, they will automatically be redirected to send their membership confirmation details to this WhatsApp number. All website buttons, links, and footer details update immediately.
                    </span>
                  </div>
                </div>

                {contactSavedNotice && (
                  <div className="admin-alert admin-alert-success" style={{margin: '16px 0', padding: '14px 18px', background: '#dcfce7', border: '1px solid #86efac', borderRadius: '10px', color: '#166534', fontWeight: 600}}>
                    ✓ {contactSavedNotice}
                  </div>
                )}

                <div className="admin-panel-card" style={{maxWidth: '820px', background: '#ffffff', border: '1px solid #e2e8e4', borderRadius: '14px', padding: '28px', marginTop: '16px'}}>
                  <form onSubmit={handleSaveContact} style={{display: 'flex', flexDirection: 'column', gap: '22px'}}>
                    {/* WhatsApp & Phone Group */}
                    <div>
                      <h3 style={{fontSize: '17px', fontWeight: 700, color: '#162a20', marginBottom: '6px'}}>WhatsApp &amp; Calling Numbers</h3>
                      <p style={{fontSize: '13px', color: '#52665a', marginBottom: '16px'}}>This WhatsApp number receives lead enquiries and post-payment membership verification details.</p>
                      
                      <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px'}}>
                        <label style={{display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '13px', fontWeight: 600, color: '#263d2f'}}>
                          WhatsApp Number (with country code, e.g. 919712112110)
                          <input
                            type="text"
                            required
                            value={contactForm.whatsappNumber}
                            onChange={e => setContactForm(prev => ({...prev, whatsappNumber: e.target.value}))}
                            placeholder="919712112110"
                            style={{padding: '11px 14px', border: '1px solid #c9d6ce', borderRadius: '8px', fontSize: '14px'}}
                          />
                          <small style={{fontSize: '11px', color: '#688272', fontWeight: 400}}>Only digits with country code. Used for wa.me redirect after payment.</small>
                        </label>

                        <label style={{display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '13px', fontWeight: 600, color: '#263d2f'}}>
                          Display Phone (Shown on website)
                          <input
                            type="text"
                            required
                            value={contactForm.displayPhone}
                            onChange={e => setContactForm(prev => ({...prev, displayPhone: e.target.value}))}
                            placeholder="97 121 121 10"
                            style={{padding: '11px 14px', border: '1px solid #c9d6ce', borderRadius: '8px', fontSize: '14px'}}
                          />
                          <small style={{fontSize: '11px', color: '#688272', fontWeight: 400}}>Formatted text in the footer and help notes.</small>
                        </label>
                      </div>

                      <div style={{marginTop: '14px'}}>
                        <label style={{display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '13px', fontWeight: 600, color: '#263d2f'}}>
                          Calling Link (tel: format, e.g. +919712112110)
                          <input
                            type="text"
                            required
                            value={contactForm.telNumber}
                            onChange={e => setContactForm(prev => ({...prev, telNumber: e.target.value}))}
                            placeholder="+919712112110"
                            style={{padding: '11px 14px', border: '1px solid #c9d6ce', borderRadius: '8px', fontSize: '14px'}}
                          />
                          <small style={{fontSize: '11px', color: '#688272', fontWeight: 400}}>Destination when users tap the phone call button.</small>
                        </label>
                      </div>
                    </div>

                    <hr style={{border: 'none', borderTop: '1px solid #e8ede9'}} />

                    {/* Instagram Group */}
                    <div>
                      <h3 style={{fontSize: '17px', fontWeight: 700, color: '#162a20', marginBottom: '6px'}}>Instagram Social Profile</h3>
                      <p style={{fontSize: '13px', color: '#52665a', marginBottom: '16px'}}>Displayed in the website footer.</p>
                      
                      <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px'}}>
                        <label style={{display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '13px', fontWeight: 600, color: '#263d2f'}}>
                          Instagram Handle (e.g. @zunoon_club)
                          <input
                            type="text"
                            required
                            value={contactForm.instagramHandle}
                            onChange={e => setContactForm(prev => ({...prev, instagramHandle: e.target.value}))}
                            placeholder="@zunoon_club"
                            style={{padding: '11px 14px', border: '1px solid #c9d6ce', borderRadius: '8px', fontSize: '14px'}}
                          />
                        </label>

                        <label style={{display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '13px', fontWeight: 600, color: '#263d2f'}}>
                          Instagram URL
                          <input
                            type="url"
                            required
                            value={contactForm.instagramUrl}
                            onChange={e => setContactForm(prev => ({...prev, instagramUrl: e.target.value}))}
                            placeholder="https://www.instagram.com/zunoon_club/"
                            style={{padding: '11px 14px', border: '1px solid #c9d6ce', borderRadius: '8px', fontSize: '14px'}}
                          />
                        </label>
                      </div>
                    </div>

                    <hr style={{border: 'none', borderTop: '1px solid #e8ede9'}} />

                    {/* Address Group */}
                    <div>
                      <h3 style={{fontSize: '17px', fontWeight: 700, color: '#162a20', marginBottom: '6px'}}>Club Location &amp; Address</h3>
                      <p style={{fontSize: '13px', color: '#52665a', marginBottom: '16px'}}>Appears in the footer for each supported language.</p>
                      
                      <div style={{display: 'flex', flexDirection: 'column', gap: '14px'}}>
                        <label style={{display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '13px', fontWeight: 600, color: '#263d2f'}}>
                          Address (English)
                          <input
                            type="text"
                            required
                            value={contactForm.addressEn}
                            onChange={e => setContactForm(prev => ({...prev, addressEn: e.target.value}))}
                            placeholder="Surat, Gujarat, India"
                            style={{padding: '11px 14px', border: '1px solid #c9d6ce', borderRadius: '8px', fontSize: '14px'}}
                          />
                        </label>

                        <label style={{display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '13px', fontWeight: 600, color: '#263d2f'}}>
                          Address (ગુજરાતી)
                          <input
                            type="text"
                            required
                            value={contactForm.addressGu}
                            onChange={e => setContactForm(prev => ({...prev, addressGu: e.target.value}))}
                            placeholder="સુરત, ગુજરાત, ભારત"
                            style={{padding: '11px 14px', border: '1px solid #c9d6ce', borderRadius: '8px', fontSize: '14px'}}
                          />
                        </label>

                        <label style={{display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '13px', fontWeight: 600, color: '#263d2f'}}>
                          Address (हिन्दी)
                          <input
                            type="text"
                            required
                            value={contactForm.addressHi}
                            onChange={e => setContactForm(prev => ({...prev, addressHi: e.target.value}))}
                            placeholder="सूरत, गुजरात, भारत"
                            style={{padding: '11px 14px', border: '1px solid #c9d6ce', borderRadius: '8px', fontSize: '14px'}}
                          />
                        </label>
                      </div>
                    </div>

                    <div style={{display: 'flex', justifyContent: 'flex-start', paddingTop: '10px'}}>
                      <button
                        type="submit"
                        disabled={contactSaving}
                        className="admin-login-btn"
                        style={{padding: '13px 28px', fontSize: '14.5px', background: '#205c38', color: '#ffffff', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 700}}
                      >
                        {contactSaving ? 'Saving Changes…' : 'Save Contact Settings'}
                      </button>
                    </div>
                  </form>
                </div>
              </section>
            )}
          </>
        )}
      </main>
      <DialogComponent />
    </div>
  );
}
