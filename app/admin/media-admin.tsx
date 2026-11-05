'use client';
import {useEffect,useRef,useState} from 'react';
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
  Plus
} from 'lucide-react';
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

export default function MediaAdmin({name}: {name: string}) {
  const [activeTab, setActiveTab] = useState<'values' | 'why' | 'founder' | 'clubs' | 'community' | 'life-at-zunoon' | 'library'>('values');
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [configured, setConfigured] = useState(false);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [updatingSlot, setUpdatingSlot] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

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

  async function refresh() {
    const data = await api('/api/admin/media');
    setAssets(data.assets);
    setAssignments(data.assignments);
    setConfigured(data.configured);
    await refreshSections();
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
    if (!confirm(`Delete section "${secName}"?`)) return;
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
    if (!confirm(`Are you sure you want to remove the custom photo for "${label}"?`)) return;
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
    if (!confirm(`Permanently delete "${title}" from your photo library?\nThis cannot be undone.`)) return;
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
          <button
            type="button"
            className={`admin-nav-item ${activeTab === 'values' ? 'active' : ''}`}
            onClick={() => setActiveTab('values')}
          >
            <Sparkles size={18} />
            <span>Values Section</span>
            <span className="nav-badge">6</span>
          </button>

          <button
            type="button"
            className={`admin-nav-item ${activeTab === 'why' ? 'active' : ''}`}
            onClick={() => setActiveTab('why')}
          >
            <HelpCircle size={18} />
            <span>Why Join Questions</span>
            <span className="nav-badge">6</span>
          </button>

          <button
            type="button"
            className={`admin-nav-item ${activeTab === 'founder' ? 'active' : ''}`}
            onClick={() => setActiveTab('founder')}
          >
            <User size={18} />
            <span>Founder Photo</span>
            <span className="nav-badge">1</span>
          </button>

          <button
            type="button"
            className={`admin-nav-item ${activeTab === 'clubs' ? 'active' : ''}`}
            onClick={() => setActiveTab('clubs')}
          >
            <Sparkles size={18} />
            <span>Community Clubs</span>
            <span className="nav-badge">6</span>
          </button>

          <button
            type="button"
            className={`admin-nav-item ${activeTab === 'community' ? 'active' : ''}`}
            onClick={() => setActiveTab('community')}
          >
            <User size={18} />
            <span>Zunoon For Everyone</span>
            <span className="nav-badge">8</span>
          </button>

          <button
            type="button"
            className={`admin-nav-item ${activeTab === 'life-at-zunoon' ? 'active' : ''}`}
            onClick={() => setActiveTab('life-at-zunoon')}
          >
            <Camera size={18} />
            <span>Life at Zunoon</span>
            <span className="nav-badge">{galleryAssetsCount}</span>
          </button>

          <button
            type="button"
            className={`admin-nav-item ${activeTab === 'library' ? 'active' : ''}`}
            onClick={() => setActiveTab('library')}
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
            <span className="eyebrow">IMAGE STUDIO</span>
            <h1>
              {activeTab === 'values' && 'Values Section Photos (16:9)'}
              {activeTab === 'why' && 'Why To Join Zunoon Photos (16:9)'}
              {activeTab === 'founder' && 'Founder Portrait Photo (9:16)'}
              {activeTab === 'clubs' && 'Community Clubs Photos (16:10)'}
              {activeTab === 'community' && 'Zunoon Is For Everyone Photos (16:10)'}
              {activeTab === 'life-at-zunoon' && 'Life at Zunoon Photos & Sections'}
              {activeTab === 'library' && 'Photo Library'}
            </h1>
          </div>
          <div className="admin-topbar-actions">
            <a
              href={
                activeTab === 'values'
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
                    <strong>Zunoon is For Everyone Photos (8 Personas):</strong> Click <strong>"Upload New Photo"</strong> on any persona card to update its photo directly.
                    <span className="helper-sub">Recommended ratio: <strong>16:10 or 16:9</strong> landscape (e.g. 1920×1200 or 1920×1080). Displayed on the homepage under "ZUNOON IS FOR EVERYONE".</span>
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
          </>
        )}
      </main>
    </div>
  );
}
