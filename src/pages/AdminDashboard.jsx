import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '../context/AdminContext';
import { 
  Search, 
  Trash2, 
  LogOut, 
  Calendar, 
  Phone, 
  User, 
  MessageSquare, 
  Clock, 
  Sparkles, 
  X,
  FileText,
  AlertCircle,
  Eye
} from 'lucide-react';

const AdminDashboard = () => {
  const { 
    isAuthenticated, 
    logout, 
    inquiries, 
    inquiriesLoading, 
    updateInquiryStatus, 
    updateInquiryNotes,
    deleteInquiry,
    simulateIncomingEnquiry
  } = useAdmin();
  
  const navigate = useNavigate();

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSortType, setFilterSortType] = useState('latest'); 
  const [selectedInquiry, setSelectedInquiry] = useState(null); 
  const [showDeleteConfirmId, setShowDeleteConfirmId] = useState(null);

  // New arrivals notifications state
  const [pageLoadTime, setPageLoadTime] = useState(new Date());
  const [newArrivalsCount, setNewArrivalsCount] = useState(0);

  // Notes state inside modal
  const [modalNotes, setModalNotes] = useState('');
  const [isSavingNotes, setIsSavingNotes] = useState(false);

  // Bulk action selection state
  const [selectedInquiryIds, setSelectedInquiryIds] = useState([]);

  // Auth Guard
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin/login');
    }
  }, [isAuthenticated, navigate]);

  // Sync selectedInquiry notes to modalNotes when it changes
  useEffect(() => {
    if (selectedInquiry) {
      const current = inquiries.find(inq => inq.id === selectedInquiry.id);
      setModalNotes(current ? current.notes || '' : '');
    }
  }, [selectedInquiry, inquiries]);

  // Listen to new enquiries count since pageLoadTime
  useEffect(() => {
    const newCount = inquiries.filter(inq => {
      const submittedDate = new Date(inq.submittedAt);
      return submittedDate > pageLoadTime && inq.status === 'Pending';
    }).length;
    setNewArrivalsCount(newCount);
  }, [inquiries, pageLoadTime]);

  if (!isAuthenticated) {
    return null;
  }

  // Calculate statistics
  const totalCount = inquiries.length;
  const pendingCount = inquiries.filter(inq => inq.status === 'Pending').length;
  const contactedCount = inquiries.filter(inq => inq.status === 'Contacted').length;
  const confirmedCount = inquiries.filter(inq => inq.status === 'Confirmed').length;
  const completedCount = inquiries.filter(inq => inq.status === 'Completed').length;

  // Handle Search and Filter/Sort logic
  const getProcessedInquiries = () => {
    let result = [...inquiries];

    // 1. Apply Search (by Name or Phone)
    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase();
      result = result.filter(
        inq => 
          (inq.name && inq.name.toLowerCase().includes(search)) || 
          (inq.phone && inq.phone.includes(search))
      );
    }

    // 2. Apply Filters & Sorting
    if (filterSortType === 'all' || filterSortType === 'latest') {
      result.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));
    } else if (filterSortType === 'oldest') {
      result.sort((a, b) => new Date(a.submittedAt) - new Date(b.submittedAt));
    } else if (['Pending', 'Contacted', 'Confirmed', 'Completed'].includes(filterSortType)) {
      result = result.filter(inq => inq.status === filterSortType);
      result.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));
    } else if (filterSortType === 'Bridal Mehendi') {
      result = result.filter(inq => inq.serviceType === 'Bridal Mehendi');
      result.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));
    } else if (filterSortType === 'Arabic Mehendi') {
      result = result.filter(inq => inq.serviceType === 'Arabic Mehendi');
      result.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));
    } else if (filterSortType === 'Saree Draping') {
      result = result.filter(inq => inq.serviceType && inq.serviceType.toLowerCase().includes('saree'));
      result.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));
    }

    return result;
  };

  const processedInquiries = getProcessedInquiries();

  // Date Formatting Helpers
  const formatDateStr = (isoString) => {
    if (!isoString) return 'N/A';
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    } catch (e) {
      return isoString;
    }
  };

  const formatTimeStr = (isoString) => {
    if (!isoString) return '';
    try {
      const d = new Date(isoString);
      return d.toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return '';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'Contacted':
        return 'bg-blue-50 text-blue-800 border-blue-200';
      case 'Confirmed':
        return 'bg-purple-50 text-purple-800 border-purple-200';
      case 'Completed':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      default:
        return 'bg-gray-50 text-gray-800 border-gray-200';
    }
  };

  const getDaysLeftTextAndStyle = (eventDateStr) => {
    if (!eventDateStr) return { text: 'N/A', className: 'text-charcoal-light font-medium text-xs' };
    
    const parts = eventDateStr.split('-');
    if (parts.length !== 3) return { text: 'N/A', className: 'text-charcoal-light font-medium text-xs' };
    const eventDate = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
    eventDate.setHours(0, 0, 0, 0);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const diffTime = eventDate.getTime() - today.getTime();
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return { text: `${Math.abs(diffDays)} Days Ago`, className: 'text-gray-400 font-medium text-xs' };
    } else if (diffDays === 0) {
      return { text: '⚠️ Urgent (Today)', className: 'text-rose-600 font-bold bg-rose-50 px-2 py-1 rounded border border-rose-200 inline-block text-[11px]' };
    } else if (diffDays <= 3) {
      return { text: `⚠️ Urgent (${diffDays} ${diffDays === 1 ? 'Day' : 'Days'} Left)`, className: 'text-rose-600 font-bold bg-rose-50 px-2 py-1 rounded border border-rose-200 inline-block text-[11px] animate-pulse' };
    } else {
      return { text: `${diffDays} Days Left`, className: 'text-charcoal font-medium text-xs' };
    }
  };

  const getUpcomingEvents = () => {
    const todayEvents = [];
    const thisWeekEvents = [];
    const nextWeekEvents = [];

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    inquiries.forEach(inq => {
      if (!inq.eventDate) return;
      
      const parts = inq.eventDate.split('-');
      if (parts.length !== 3) return;
      const eventDate = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
      eventDate.setHours(0, 0, 0, 0);
      
      const diffTime = eventDate.getTime() - today.getTime();
      const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 0) {
        todayEvents.push(inq);
      } else if (diffDays >= 1 && diffDays <= 7) {
        thisWeekEvents.push(inq);
      } else if (diffDays >= 8 && diffDays <= 14) {
        nextWeekEvents.push(inq);
      }
    });

    const sortByEventDate = (a, b) => new Date(a.eventDate) - new Date(b.eventDate);
    todayEvents.sort(sortByEventDate);
    thisWeekEvents.sort(sortByEventDate);
    nextWeekEvents.sort(sortByEventDate);

    return { todayEvents, thisWeekEvents, nextWeekEvents };
  };

  const upcomingEvents = getUpcomingEvents();

  // Today Summary Statistics
  const getTodaySummaryData = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todayEnquiries = inquiries.filter(inq => {
      const subDate = new Date(inq.submittedAt);
      subDate.setHours(0, 0, 0, 0);
      return subDate.getTime() === today.getTime();
    }).length;

    const todayEventsCount = upcomingEvents.todayEvents.length;

    const urgentCount = inquiries.filter(inq => {
      if (!inq.eventDate || inq.status === 'Completed') return false;
      const parts = inq.eventDate.split('-');
      if (parts.length !== 3) return false;
      const evDate = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
      evDate.setHours(0, 0, 0, 0);
      const diff = evDate.getTime() - today.getTime();
      const diffDays = Math.round(diff / (1000 * 60 * 60 * 24));
      return diffDays >= 0 && diffDays <= 3;
    }).length;

    return { todayEnquiries, todayEvents: todayEventsCount, urgentCount };
  };

  const todaySummary = getTodaySummaryData();

  const getWhatsAppLink = (phone, name) => {
    if (!phone) return '#';
    let cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length === 10) {
      cleanPhone = '91' + cleanPhone;
    }
    const message = `Hello ${name}, this is Alankrita. We received your booking request and would love to connect with you.`;
    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
  };

  const getTimelineStepStatus = (status, currentStatus) => {
    const statuses = ['Pending', 'Contacted', 'Confirmed', 'Completed'];
    const currentIndex = statuses.indexOf(currentStatus || 'Pending');
    const stepIndex = statuses.indexOf(status);
    
    if (stepIndex <= currentIndex) {
      return 'completed';
    } else {
      return 'upcoming';
    }
  };

  const handleStatusChange = (id, newStatus) => {
    updateInquiryStatus(id, newStatus);
    if (selectedInquiry && selectedInquiry.id === id) {
      setSelectedInquiry(prev => ({ ...prev, status: newStatus }));
    }
  };

  const handleDelete = (id) => {
    deleteInquiry(id);
    setShowDeleteConfirmId(null);
    setSelectedInquiryIds(prev => prev.filter(item => item !== id));
    if (selectedInquiry && selectedInquiry.id === id) {
      setSelectedInquiry(null);
    }
  };



  return (
    <div className="min-h-screen bg-ivory/20 font-sans pb-16">
      
      {/* Premium Header */}
      <header className="bg-burgundy text-white sticky top-0 z-30 shadow-md border-b border-gold/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">✨</span>
            <div>
              <h1 className="font-display text-xl sm:text-2xl font-bold tracking-wide text-gold">
                Alankrita Dashboard
              </h1>
              <p className="text-[10px] text-ivory/60 tracking-widest uppercase">
                Owner Administration
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button
              onClick={simulateIncomingEnquiry}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-gold/10 hover:bg-gold/20 text-gold hover:text-white rounded-md text-xs font-semibold tracking-wide border border-gold/30 transition-all duration-200 cursor-pointer"
              title="Simulates a new customer inquiry form submission"
            >
              <Sparkles className="w-3.5 h-3.5" />
              ⚡ Test New Enquiry
            </button>
            <button
              onClick={logout}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-rose-950/40 hover:bg-rose-950 text-rose-200 hover:text-white rounded-lg text-xs font-semibold tracking-wide border border-rose-900/40 hover:border-rose-700/50 transition-all duration-200 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto py-[16px] px-[18px]">
        
        {/* Outer Dashboard Wrapper */}
        <div className="bg-white/30 backdrop-blur-xs rounded-[var(--border-radius-lg)] border border-gold/10 p-6 shadow-xs">
          
          {/* Today Summary Bar */}
          <div className="bg-white rounded-lg border border-gold/10 py-[8px] px-[20px] mb-6 flex flex-wrap items-center justify-between gap-[12px] text-[11px] text-charcoal">
            <div className="flex items-center gap-[12px]">
              <span className="font-bold text-burgundy">📅 Today Summary</span>
              <span className="opacity-30">|</span>
              <span>New Enquiries: <strong className="text-burgundy">{todaySummary.todayEnquiries}</strong></span>
              <span className="opacity-30">|</span>
              <span>Events Scheduled: <strong className="text-burgundy">{todaySummary.todayEvents}</strong></span>
              <span className="opacity-30">|</span>
              <span>Urgent Follow-ups: <strong className="text-rose-600">{todaySummary.urgentCount}</strong></span>
            </div>
            <div className="text-charcoal-light">
              {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' })}
            </div>
          </div>

          {/* Real-time notification banner */}
          {newArrivalsCount > 0 && (
            <div className="bg-gold/15 border-2 border-gold text-burgundy px-4 py-3.5 rounded-xl mb-[18px] flex items-center justify-between animate-fadeIn shadow-md">
              <div className="flex items-center gap-2.5 font-bold text-sm">
                <span className="animate-bounce">🔔</span>
                <span>New Enquiry ({newArrivalsCount})</span>
                <span className="text-xs font-medium text-charcoal-light bg-gold/25 px-2 py-0.5 rounded-full">Updates live</span>
              </div>
              <button 
                onClick={() => {
                  setPageLoadTime(new Date());
                }}
                className="text-xs bg-burgundy hover:bg-burgundy-dark text-white px-3 py-1.5 rounded-lg font-bold tracking-wide transition-colors cursor-pointer shadow-sm"
              >
                Mark as Read
              </button>
            </div>
          )}

          {/* Mobile Test New Enquiry Trigger */}
          <div className="sm:hidden mb-6 flex justify-end">
            <button
              onClick={simulateIncomingEnquiry}
              className="flex items-center gap-1.5 px-3 py-2 bg-gold text-burgundy rounded-lg text-xs font-bold shadow-md cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              ⚡ Test Enquiry
            </button>
          </div>

          {/* Stats Grid */}
          <section className="grid grid-cols-2 md:grid-cols-5 gap-[10px] mb-[18px]">
            
            {/* Total */}
            <div className="bg-white rounded-xl shadow-sm border border-gold/10 border-l-[3px] border-l-burgundy py-[14px] px-[16px] flex flex-col justify-between">
              <span className="text-xs font-bold text-charcoal-light uppercase tracking-wider">Total</span>
              <div className="flex items-baseline gap-2 mt-[4px]">
                <span className="text-[28px] font-medium text-burgundy font-display leading-tight">{totalCount}</span>
                <span className="text-xs text-charcoal-light">enquiries</span>
              </div>
              <p className="text-[10px] text-charcoal-light/75 mt-[6px] italic">All time enquiries</p>
              <div className="w-full bg-burgundy/10 h-1 rounded-full mt-3 overflow-hidden">
                <div className="bg-burgundy h-full rounded-full" style={{ width: '100%' }} />
              </div>
            </div>

            {/* Pending */}
            <div className="bg-white rounded-xl shadow-sm border border-gold/10 border-l-[3px] border-l-amber-500 py-[14px] px-[16px] flex flex-col justify-between">
              <span className="text-xs font-bold text-charcoal-light uppercase tracking-wider">Pending</span>
              <div className="flex items-baseline gap-2 mt-[4px]">
                <span className="text-[28px] font-medium text-amber-600 font-display leading-tight">{pendingCount}</span>
                <span className="text-xs text-charcoal-light">new</span>
              </div>
              <p className="text-[10px] text-amber-700/80 mt-[6px] italic font-medium">Needs Follow-up</p>
              <div className="w-full bg-amber-100 h-1 rounded-full mt-3 overflow-hidden">
                <div className="bg-amber-500 h-full rounded-full" style={{ width: totalCount > 0 ? `${(pendingCount / totalCount) * 100}%` : '0%' }} />
              </div>
            </div>

            {/* Contacted */}
            <div className="bg-white rounded-xl shadow-sm border border-gold/10 border-l-[3px] border-l-blue-500 py-[14px] px-[16px] flex flex-col justify-between">
              <span className="text-xs font-bold text-charcoal-light uppercase tracking-wider">Contacted</span>
              <div className="flex items-baseline gap-2 mt-[4px]">
                <span className="text-[28px] font-medium text-blue-600 font-display leading-tight">{contactedCount}</span>
                <span className="text-xs text-charcoal-light">replied</span>
              </div>
              <p className="text-[10px] text-blue-700/80 mt-[6px] italic font-medium">Waiting for Confirmation</p>
              <div className="w-full bg-blue-100 h-1 rounded-full mt-3 overflow-hidden">
                <div className="bg-blue-500 h-full rounded-full" style={{ width: totalCount > 0 ? `${(contactedCount / totalCount) * 100}%` : '0%' }} />
              </div>
            </div>

            {/* Confirmed */}
            <div className="bg-white rounded-xl shadow-sm border border-gold/10 border-l-[3px] border-l-purple-500 py-[14px] px-[16px] flex flex-col justify-between">
              <span className="text-xs font-bold text-charcoal-light uppercase tracking-wider">Confirmed</span>
              <div className="flex items-baseline gap-2 mt-[4px]">
                <span className="text-[28px] font-medium text-purple-600 font-display leading-tight">{confirmedCount}</span>
                <span className="text-xs text-charcoal-light">booked</span>
              </div>
              <p className="text-[10px] text-purple-700/80 mt-[6px] italic font-medium">Upcoming Booking</p>
              <div className="w-full bg-purple-100 h-1 rounded-full mt-3 overflow-hidden">
                <div className="bg-purple-500 h-full rounded-full" style={{ width: totalCount > 0 ? `${(confirmedCount / totalCount) * 100}%` : '0%' }} />
              </div>
            </div>

            {/* Completed */}
            <div className="bg-white rounded-xl shadow-sm border border-gold/10 border-l-[3px] border-l-emerald-500 py-[14px] px-[16px] flex flex-col justify-between col-span-2 md:col-span-1">
              <span className="text-xs font-bold text-charcoal-light uppercase tracking-wider">Completed</span>
              <div className="flex items-baseline gap-2 mt-[4px]">
                <span className="text-[28px] font-medium text-emerald-600 font-display leading-tight">{completedCount}</span>
                <span className="text-xs text-charcoal-light">done</span>
              </div>
              <p className="text-[10px] text-emerald-700/80 mt-[6px] italic font-medium">Service Finished</p>
              <div className="w-full bg-emerald-100 h-1 rounded-full mt-3 overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full" style={{ width: totalCount > 0 ? `${(completedCount / totalCount) * 100}%` : '0%' }} />
              </div>
            </div>

          </section>

          {/* Upcoming Events Scheduling Section */}
          <section className="bg-white rounded-xl shadow-sm border border-gold/10 p-4.5 mb-[18px]">
            <div className="flex items-center gap-[6px] mb-[18px] border-b border-gold/10 pb-2">
              <Calendar className="w-4.5 h-4.5 text-gold" />
              <h3 className="font-display text-[12px] font-medium text-burgundy tracking-wide uppercase">
                Upcoming Events Schedule
              </h3>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              
              {/* Today */}
              <div className="bg-ivory/20 rounded-lg p-3 border border-gold/5 lg:border-r-[0.5px] lg:border-r-[var(--color-border-tertiary)] lg:rounded-none lg:first:rounded-l-lg lg:last:rounded-r-lg lg:last:border-r-0">
                <span className="block text-[10px] uppercase font-bold text-rose-600 tracking-wider mb-2 flex items-center justify-between">
                  <span>Today</span>
                  <span className="bg-rose-100 text-rose-800 px-1.5 py-0.5 rounded-full text-[9px] font-semibold">{upcomingEvents.todayEvents.length}</span>
                </span>
                {upcomingEvents.todayEvents.length === 0 ? (
                  <div className="py-[14px] px-[12px]">
                    <p className="text-xs text-charcoal-light italic text-center">No upcoming events.</p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-56 overflow-y-auto">
                    {upcomingEvents.todayEvents.map(inq => (
                      <button
                        key={inq.id}
                        onClick={() => setSelectedInquiry(inq)}
                        className="w-full text-left py-[12px] px-[14px] bg-white rounded border border-gold/10 hover:border-gold hover:shadow-xs transition-all text-xs cursor-pointer block"
                      >
                        <ul className="list-none space-y-1 text-charcoal">
                          <li className="font-bold text-burgundy text-sm">• {inq.name}</li>
                          <li className="pl-3 text-[11px] font-medium text-charcoal-light">• {inq.serviceType}</li>
                          <li className="pl-3 text-[11px] text-charcoal-light/75">• {formatTimeStr(inq.submittedAt) || '10:00 AM'}</li>
                        </ul>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* This Week */}
              <div className="bg-ivory/20 rounded-lg p-3 border border-gold/5 lg:border-r-[0.5px] lg:border-r-[var(--color-border-tertiary)] lg:rounded-none lg:first:rounded-l-lg lg:last:rounded-r-lg lg:last:border-r-0">
                <span className="block text-[10px] uppercase font-bold text-amber-700 tracking-wider mb-2 flex items-center justify-between">
                  <span>This Week</span>
                  <span className="bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded-full text-[9px] font-semibold">{upcomingEvents.thisWeekEvents.length}</span>
                </span>
                {upcomingEvents.thisWeekEvents.length === 0 ? (
                  <div className="py-[14px] px-[12px]">
                    <p className="text-xs text-charcoal-light italic text-center">No upcoming events.</p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-56 overflow-y-auto">
                    {upcomingEvents.thisWeekEvents.map(inq => (
                      <button
                        key={inq.id}
                        onClick={() => setSelectedInquiry(inq)}
                        className="w-full text-left py-[12px] px-[14px] bg-white rounded border border-gold/10 hover:border-gold hover:shadow-xs transition-all text-xs cursor-pointer block"
                      >
                        <ul className="list-none space-y-1 text-charcoal">
                          <li className="font-bold text-burgundy text-sm">• {inq.name}</li>
                          <li className="pl-3 text-[11px] font-medium text-charcoal-light">• {inq.serviceType}</li>
                          <li className="pl-3 text-[11px] text-charcoal-light/75">• {formatDateStr(inq.eventDate)}</li>
                        </ul>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Next Week */}
              <div className="bg-ivory/20 rounded-lg p-3 border border-gold/5 lg:border-r-[0.5px] lg:border-r-[var(--color-border-tertiary)] lg:rounded-none lg:first:rounded-l-lg lg:last:rounded-r-lg lg:last:border-r-0">
                <span className="block text-[10px] uppercase font-bold text-indigo-700 tracking-wider mb-2 flex items-center justify-between">
                  <span>Next Week</span>
                  <span className="bg-indigo-100 text-indigo-800 px-1.5 py-0.5 rounded-full text-[9px] font-semibold">{upcomingEvents.nextWeekEvents.length}</span>
                </span>
                {upcomingEvents.nextWeekEvents.length === 0 ? (
                  <div className="py-[14px] px-[12px]">
                    <p className="text-xs text-charcoal-light italic text-center">No upcoming events.</p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-56 overflow-y-auto">
                    {upcomingEvents.nextWeekEvents.map(inq => (
                      <button
                        key={inq.id}
                        onClick={() => setSelectedInquiry(inq)}
                        className="w-full text-left py-[12px] px-[14px] bg-white rounded border border-gold/10 hover:border-gold hover:shadow-xs transition-all text-xs cursor-pointer block"
                      >
                        <ul className="list-none space-y-1 text-charcoal">
                          <li className="font-bold text-burgundy text-sm">• {inq.name}</li>
                          <li className="pl-3 text-[11px] font-medium text-charcoal-light">• {inq.serviceType}</li>
                          <li className="pl-3 text-[11px] text-charcoal-light/75">• {formatDateStr(inq.eventDate)}</li>
                        </ul>
                      </button>
                    ))}
                  </div>
                )}
              </div>

            </div>
          </section>

          {/* Filters and Search Bar Section (Toolbar) */}
          <section className="bg-white rounded-xl shadow-sm border border-gold/10 p-4 mb-[12px] flex flex-col sm:flex-row items-center gap-[8px]">
            
            {/* Search Box */}
            <div className="relative w-full sm:flex-1">
              <Search className="absolute left-2.5 top-[10px] w-4 h-4 text-gold" />
              <input
                type="text"
                placeholder="Search customers by name or phone..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setSelectedInquiryIds([]); // Reset selection on search change
                }}
                className="w-full h-[36px] pl-[32px] pr-[10px] py-0 bg-ivory/10 border border-gold/20 focus:border-gold focus:ring-1 focus:ring-gold rounded-lg outline-none text-sm text-charcoal focus:bg-white transition-all duration-200"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-[9px] text-charcoal-light hover:text-charcoal cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Sort/Filter Dropdown */}
            <div className="w-full sm:w-auto min-w-[200px]">
              <select
                value={filterSortType}
                onChange={(e) => {
                  setFilterSortType(e.target.value);
                  setSelectedInquiryIds([]); // Reset selection on filter change
                }}
                className="w-full h-[36px] py-[7px] px-[12px] bg-ivory/10 border border-gold/20 focus:border-gold focus:ring-1 focus:ring-gold rounded-lg outline-none text-sm text-charcoal focus:bg-white transition-all duration-200 cursor-pointer"
              >
                <option value="all">All Enquiries</option>
                <option value="latest">Latest Responses</option>
                <option value="oldest">Oldest Responses</option>
                <option disabled className="text-gold font-bold">--- Filter By Status ---</option>
                <option value="Pending">Pending</option>
                <option value="Contacted">Contacted</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Completed">Completed</option>
                <option disabled className="text-gold font-bold">--- Filter By Service ---</option>
                <option value="Bridal Mehendi">Bridal Mehendi</option>
                <option value="Arabic Mehendi">Arabic Mehendi</option>
                <option value="Saree Draping">Saree Draping</option>
              </select>
            </div>



          </section>

          {/* Bulk Action Bar (Mobile Only) */}
          {selectedInquiryIds.length > 0 && (
            <div className="block lg:hidden bg-ivory/40 border border-gold/25 py-[8px] px-[12px] mb-[10px] rounded-[var(--border-radius-md)] flex items-center justify-between gap-[6px] animate-fadeIn">
              <div className="text-xs font-bold text-burgundy">
                Selected {selectedInquiryIds.length} {selectedInquiryIds.length === 1 ? 'enquiry' : 'enquiries'}
              </div>
              <div className="flex flex-wrap items-center gap-[6px]">
                <button
                  onClick={() => {
                    selectedInquiryIds.forEach(id => updateInquiryStatus(id, 'Contacted'));
                    setSelectedInquiryIds([]);
                  }}
                  className="px-2 py-1 bg-blue-50 text-blue-800 border border-blue-200 hover:bg-blue-100 rounded-md text-[10px] font-bold cursor-pointer transition-colors"
                >
                  Contacted
                </button>
                <button
                  onClick={() => {
                    selectedInquiryIds.forEach(id => updateInquiryStatus(id, 'Confirmed'));
                    setSelectedInquiryIds([]);
                  }}
                  className="px-2 py-1 bg-purple-50 text-purple-800 border border-purple-200 hover:bg-purple-100 rounded-md text-[10px] font-bold cursor-pointer transition-colors"
                >
                  Confirmed
                </button>
                <button
                  onClick={() => {
                    selectedInquiryIds.forEach(id => updateInquiryStatus(id, 'Completed'));
                    setSelectedInquiryIds([]);
                  }}
                  className="px-2 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 rounded-md text-[10px] font-bold cursor-pointer transition-colors"
                >
                  Completed
                </button>
                <button
                  onClick={() => {
                    if (window.confirm(`Are you sure you want to delete ${selectedInquiryIds.length} selected enquiries?`)) {
                      selectedInquiryIds.forEach(id => deleteInquiry(id));
                      setSelectedInquiryIds([]);
                    }
                  }}
                  className="px-2 py-1 bg-rose-50 text-rose-800 border border-rose-200 hover:bg-rose-100 rounded-md text-[10px] font-bold cursor-pointer transition-colors"
                >
                  Delete
                </button>
                <button
                  onClick={() => setSelectedInquiryIds([])}
                  className="px-1.5 py-1 text-charcoal-light hover:text-charcoal text-[10px] font-semibold cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}


          {/* Table / List Container */}
          <section className="bg-white rounded-xl shadow-sm border border-gold/10 overflow-hidden">
            {inquiriesLoading ? (
              <div className="py-20 text-center">
                <div className="inline-block w-8 h-8 border-4 border-gold border-t-burgundy rounded-full animate-spin mb-4" />
                <p className="text-sm font-semibold text-charcoal-light">Retrieving customer enquiries...</p>
              </div>
            ) : processedInquiries.length === 0 ? (
              <div className="py-16 px-4 text-center">
                <div className="w-16 h-16 rounded-full bg-gold/5 border border-gold/20 flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-7 h-7 text-gold" />
                </div>
                <h3 className="font-display text-lg font-bold text-burgundy mb-1">No Enquiries Found</h3>
                <p className="text-sm text-charcoal-light max-w-sm mx-auto">
                  {searchTerm || filterSortType !== 'latest'
                    ? "We couldn't find any booking enquiries matching your search terms or filters."
                    : "No enquiries have been submitted yet. Try sending one from the contact booking form."}
                </p>
              </div>
            ) : (
              <>
                {/* Desktop Table View */}
                <div className="hidden lg:block overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-burgundy/5 border-b border-gold/10 text-xs font-bold text-burgundy uppercase tracking-wider">
                        <th className="py-[10px] px-[12px] w-10 text-center">
                          <input 
                            type="checkbox" 
                            checked={processedInquiries.length > 0 && selectedInquiryIds.length === processedInquiries.length}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedInquiryIds(processedInquiries.map(inq => inq.id));
                              } else {
                                setSelectedInquiryIds([]);
                              }
                            }}
                            className="rounded border-gold/30 text-burgundy focus:ring-gold cursor-pointer"
                          />
                        </th>
                        {selectedInquiryIds.length > 0 ? (
                          <th colSpan="8" className="py-[6px] px-[12px] normal-case font-normal text-charcoal">
                            <div className="flex items-center justify-between gap-4 w-full">
                              <span className="text-burgundy font-bold text-xs">
                                {selectedInquiryIds.length} {selectedInquiryIds.length === 1 ? 'enquiry' : 'enquiries'} selected
                              </span>
                              <div className="flex items-center gap-[6px]">
                                <button
                                  onClick={() => {
                                    selectedInquiryIds.forEach(id => updateInquiryStatus(id, 'Contacted'));
                                    setSelectedInquiryIds([]);
                                  }}
                                  className="px-2.5 py-1 bg-blue-50 text-blue-800 border border-blue-200 hover:bg-blue-100 rounded-md text-[11px] font-bold cursor-pointer transition-colors"
                                >
                                  Mark Contacted
                                </button>
                                <button
                                  onClick={() => {
                                    selectedInquiryIds.forEach(id => updateInquiryStatus(id, 'Confirmed'));
                                    setSelectedInquiryIds([]);
                                  }}
                                  className="px-2.5 py-1 bg-purple-50 text-purple-800 border border-purple-200 hover:bg-purple-100 rounded-md text-[11px] font-bold cursor-pointer transition-colors"
                                >
                                  Mark Confirmed
                                </button>
                                <button
                                  onClick={() => {
                                    selectedInquiryIds.forEach(id => updateInquiryStatus(id, 'Completed'));
                                    setSelectedInquiryIds([]);
                                  }}
                                  className="px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 rounded-md text-[11px] font-bold cursor-pointer transition-colors"
                                >
                                  Mark Completed
                                </button>
                                <button
                                  onClick={() => {
                                    if (window.confirm(`Are you sure you want to delete ${selectedInquiryIds.length} selected enquiries?`)) {
                                      selectedInquiryIds.forEach(id => deleteInquiry(id));
                                      setSelectedInquiryIds([]);
                                    }
                                  }}
                                  className="px-2.5 py-1 bg-rose-50 text-rose-800 border border-rose-200 hover:bg-rose-100 rounded-md text-[11px] font-bold cursor-pointer transition-colors"
                                >
                                  Delete Selected
                                </button>
                                <button
                                  onClick={() => setSelectedInquiryIds([])}
                                  className="px-2 py-1 text-charcoal-light hover:text-charcoal text-[11px] font-semibold cursor-pointer"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          </th>
                        ) : (
                          <>
                            <th className="py-[10px] px-[12px]">Customer Name</th>
                            <th className="py-[10px] px-[12px]">Phone Number</th>
                            <th className="py-[10px] px-[12px]">Service Requested</th>
                            <th className="py-[10px] px-[12px]">Event Date</th>
                            <th className="py-[10px] px-[12px]">Days Left</th>
                            <th className="py-[10px] px-[12px]">Submitted Date</th>
                            <th className="py-[10px] px-[12px]">Status</th>
                            <th className="py-[10px] px-[12px] text-right">Actions</th>
                          </>
                        )}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gold/10 text-sm text-charcoal">
                      {processedInquiries.map((inq) => {
                        const daysLeftInfo = getDaysLeftTextAndStyle(inq.eventDate);
                        const isSelected = selectedInquiryIds.includes(inq.id);
                        return (
                          <tr 
                            key={inq.id}
                            onClick={() => setSelectedInquiry(inq)}
                            className={`hover:bg-ivory/20 transition-all duration-150 cursor-pointer border-b-[0.5px] border-b-[var(--color-border-tertiary)] even:bg-[var(--color-background-tertiary)] ${isSelected ? 'bg-gold/5' : ''}`}
                          >
                            <td className="py-[13px] px-[12px] w-10 text-center" onClick={(e) => e.stopPropagation()}>
                              <input 
                                type="checkbox" 
                                checked={isSelected}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setSelectedInquiryIds(prev => [...prev, inq.id]);
                                  } else {
                                    setSelectedInquiryIds(prev => prev.filter(id => id !== inq.id));
                                  }
                                }}
                                className="rounded border-gold/30 text-burgundy focus:ring-gold cursor-pointer"
                              />
                            </td>
                            <td className="py-[13px] px-[12px] font-semibold text-burgundy max-w-[150px] truncate">
                              {inq.name}
                            </td>
                            <td className="py-[13px] px-[12px] select-all whitespace-nowrap">
                              {inq.phone}
                            </td>
                            <td className="py-[13px] px-[12px] max-w-[160px] truncate font-medium">
                              {inq.serviceType}
                            </td>
                            <td className="py-[13px] px-[12px] whitespace-nowrap">
                              {inq.eventDate ? formatDateStr(inq.eventDate) : 'N/A'}
                            </td>
                            <td className="py-[13px] px-[12px] whitespace-nowrap">
                              <span className={daysLeftInfo.className}>{daysLeftInfo.text}</span>
                            </td>
                            <td className="py-[13px] px-[12px] whitespace-nowrap">
                              <div className="text-xs">
                                <div>{formatDateStr(inq.submittedAt)}</div>
                                <div className="text-[10px] text-charcoal-light mt-0.5">{formatTimeStr(inq.submittedAt)}</div>
                              </div>
                            </td>
                            <td className="py-[13px] px-[12px]" onClick={(e) => e.stopPropagation()}>
                              <select
                                value={inq.status || 'Pending'}
                                onChange={(e) => handleStatusChange(inq.id, e.target.value)}
                                className={`px-3 py-1.5 border rounded-lg text-xs font-semibold outline-none cursor-pointer ${getStatusColor(inq.status || 'Pending')}`}
                              >
                                <option value="Pending">Pending</option>
                                <option value="Contacted">Contacted</option>
                                <option value="Confirmed">Confirmed</option>
                                <option value="Completed">Completed</option>
                              </select>
                            </td>
                            <td className="py-[13px] px-[12px] text-right" onClick={(e) => e.stopPropagation()}>
                              <div className="flex items-center justify-end gap-[6px]">
                                <a
                                  href={`tel:${inq.phone}`}
                                  className="w-[28px] h-[28px] flex items-center justify-center p-0 text-charcoal-light hover:text-burgundy hover:bg-ivory/30 rounded-lg transition-colors cursor-pointer border border-gold/10"
                                  title="Call Customer"
                                >
                                  <Phone className="w-3.5 h-3.5" />
                                </a>
                                <a
                                  href={getWhatsAppLink(inq.phone, inq.name)}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="w-[28px] h-[28px] flex items-center justify-center p-0 text-charcoal-light hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer border border-emerald-100"
                                  title="WhatsApp Customer"
                                >
                                  <MessageSquare className="w-3.5 h-3.5 text-emerald-500" />
                                </a>
                                <button
                                  onClick={() => setSelectedInquiry(inq)}
                                  className="w-[28px] h-[28px] flex items-center justify-center p-0 text-charcoal-light hover:text-burgundy hover:bg-ivory/30 rounded-lg transition-colors cursor-pointer border border-gold/10"
                                  title="View Details"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                </button>
                                
                                {showDeleteConfirmId === inq.id ? (
                                  <div className="flex items-center gap-1 border border-rose-100 rounded p-0.5">
                                    <button
                                      onClick={() => handleDelete(inq.id)}
                                      className="px-2 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded text-[11px] font-medium cursor-pointer"
                                    >
                                      Confirm
                                    </button>
                                    <button
                                      onClick={() => setShowDeleteConfirmId(null)}
                                      className="px-2 py-1 bg-gray-100 hover:bg-gray-200 text-charcoal rounded text-[11px] font-medium cursor-pointer"
                                    >
                                      X
                                    </button>
                                  </div>
                                ) : (
                                  <button
                                    onClick={() => setShowDeleteConfirmId(inq.id)}
                                    className="w-[28px] h-[28px] flex items-center justify-center p-0 text-charcoal-light hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer border border-rose-100"
                                    title="Delete Enquiry"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Mobile / Tablet Card List View */}
                <div className="block lg:hidden divide-y divide-gold/10">
                  {processedInquiries.map((inq) => {
                    const daysLeftInfo = getDaysLeftTextAndStyle(inq.eventDate);
                    const isSelected = selectedInquiryIds.includes(inq.id);
                    return (
                      <div 
                        key={inq.id}
                        onClick={() => setSelectedInquiry(inq)}
                        className={`p-5 hover:bg-ivory/20 active:bg-ivory/30 transition-colors cursor-pointer relative ${isSelected ? 'bg-gold/5' : ''}`}
                      >
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <div className="flex items-center gap-3">
                            <div onClick={(e) => e.stopPropagation()} className="pt-0.5">
                              <input 
                                type="checkbox" 
                                checked={isSelected}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setSelectedInquiryIds(prev => [...prev, inq.id]);
                                  } else {
                                    setSelectedInquiryIds(prev => prev.filter(id => id !== inq.id));
                                  }
                                }}
                                className="rounded border-gold/30 text-burgundy focus:ring-gold cursor-pointer"
                              />
                            </div>
                            <div>
                              <h4 className="font-bold text-burgundy text-base leading-tight">
                                {inq.name}
                              </h4>
                              <p className="text-xs text-charcoal-light mt-0.5">
                                {inq.serviceType}
                              </p>
                            </div>
                          </div>
                          <span className={`px-2.5 py-1 border rounded-lg text-xs font-semibold ${getStatusColor(inq.status || 'Pending')}`}>
                            {inq.status || 'Pending'}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-2 mt-3.5 mb-4 text-xs text-charcoal pl-6">
                          <div>
                            <span className="text-[10px] text-charcoal-light block uppercase font-bold tracking-wider">Event Date:</span>
                            <span className="font-semibold">{inq.eventDate ? formatDateStr(inq.eventDate) : 'N/A'}</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-charcoal-light block uppercase font-bold tracking-wider">Days Left:</span>
                            <span className={`${daysLeftInfo.className} block mt-0.5`}>{daysLeftInfo.text}</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-charcoal-light block uppercase font-bold tracking-wider">Phone:</span>
                            <span className="font-semibold select-all">{inq.phone}</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-charcoal-light block uppercase font-bold tracking-wider">Submitted:</span>
                            <span className="font-medium text-charcoal-light">{formatDateStr(inq.submittedAt)}</span>
                          </div>
                        </div>

                        {/* Quick actions row */}
                        <div 
                          className="mt-4 flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-dashed border-gold/10 pl-6"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] uppercase font-bold text-charcoal-light tracking-wider">Status:</span>
                            <select
                              value={inq.status || 'Pending'}
                              onChange={(e) => handleStatusChange(inq.id, e.target.value)}
                              className={`px-2.5 py-1 border rounded-md text-xs font-semibold outline-none cursor-pointer ${getStatusColor(inq.status || 'Pending')}`}
                            >
                              <option value="Pending">Pending</option>
                              <option value="Contacted">Contacted</option>
                              <option value="Confirmed">Confirmed</option>
                              <option value="Completed">Completed</option>
                            </select>
                          </div>

                          <div className="flex items-center gap-[6px]">
                            <a
                              href={`tel:${inq.phone}`}
                              className="w-[28px] h-[28px] flex items-center justify-center p-0 text-charcoal-light hover:text-burgundy hover:bg-ivory/30 rounded-lg transition-colors cursor-pointer border border-gold/10"
                              title="Call Customer"
                            >
                              <Phone className="w-3.5 h-3.5" />
                            </a>
                            <a
                              href={getWhatsAppLink(inq.phone, inq.name)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-[28px] h-[28px] flex items-center justify-center p-0 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer border border-emerald-100"
                              title="WhatsApp Customer"
                            >
                              <MessageSquare className="w-3.5 h-3.5 text-emerald-500" />
                            </a>
                            <button
                              onClick={() => setSelectedInquiry(inq)}
                              className="w-[28px] h-[28px] flex items-center justify-center p-0 text-charcoal-light hover:text-burgundy hover:bg-ivory/30 rounded-lg transition-colors cursor-pointer border border-gold/10"
                              title="View Details"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>

                            {showDeleteConfirmId === inq.id ? (
                              <div className="flex items-center gap-1 ml-1">
                                <button
                                  onClick={() => handleDelete(inq.id)}
                                  className="px-2 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded text-[11px] font-semibold cursor-pointer"
                                >
                                  Del
                                </button>
                                <button
                                  onClick={() => setShowDeleteConfirmId(null)}
                                  className="px-1.5 py-1 bg-gray-150 text-charcoal rounded text-[11px] font-semibold cursor-pointer"
                                >
                                  X
                                </button>
                              </div>
                            ) : (
                              <button
                                  onClick={() => setShowDeleteConfirmId(inq.id)}
                                  className="w-[28px] h-[28px] flex items-center justify-center p-0 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer border border-rose-100"
                                  title="Delete"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </section>

        </div>
      </main>

      {/* Detailed Modal Popup / Drawer */}
      {selectedInquiry && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div 
            className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-gold/20 overflow-hidden relative max-h-[95vh] flex flex-col animate-fadeIn"
            onClick={(e) => e.stopPropagation()}
          >
            
            {/* Modal Header */}
            <div className="bg-burgundy text-white p-5 flex items-center justify-between border-b border-gold/20">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-gold" />
                <h3 className="font-display text-lg font-bold text-gold tracking-wide">
                  Customer Enquiry Detail Card
                </h3>
              </div>
              <button
                onClick={() => setSelectedInquiry(null)}
                className="p-1 rounded-full hover:bg-white/10 text-white transition-colors cursor-pointer"
                aria-label="Close details"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1 text-sm text-charcoal">
              
              {/* Customer summary block */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4.5 bg-ivory/30 rounded-xl border border-gold/10">
                <div>
                  <h4 className="text-lg font-bold text-burgundy">{selectedInquiry.name}</h4>
                  <p className="text-xs text-charcoal-light font-semibold mt-0.5">{selectedInquiry.serviceType}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs uppercase font-bold text-charcoal-light tracking-wider">Status:</span>
                  <select
                    value={selectedInquiry.status || 'Pending'}
                    onChange={(e) => handleStatusChange(selectedInquiry.id, e.target.value)}
                    className={`px-3.5 py-1.5 border rounded-lg text-xs font-semibold outline-none cursor-pointer ${getStatusColor(selectedInquiry.status || 'Pending')}`}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>

              {/* Data fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                
                {/* Phone */}
                <div className="flex gap-3">
                  <div className="w-9 h-9 rounded-full bg-gold/5 flex items-center justify-center border border-gold/20 shrink-0">
                    <Phone className="w-4 h-4 text-gold" />
                  </div>
                  <div>
                    <span className="block text-[10px] uppercase font-bold text-charcoal-light tracking-wider mb-0.5">Phone Number</span>
                    <a href={`tel:${selectedInquiry.phone}`} className="text-sm font-bold hover:underline select-all text-burgundy">
                      {selectedInquiry.phone}
                    </a>
                  </div>
                </div>

                {/* Event Date */}
                <div className="flex gap-3">
                  <div className="w-9 h-9 rounded-full bg-gold/5 flex items-center justify-center border border-gold/20 shrink-0">
                    <Calendar className="w-4 h-4 text-gold" />
                  </div>
                  <div>
                    <span className="block text-[10px] uppercase font-bold text-charcoal-light tracking-wider mb-0.5">Event Date</span>
                    <span className="text-sm font-semibold">
                      {selectedInquiry.eventDate ? formatDateStr(selectedInquiry.eventDate) : 'Not specified'}
                    </span>
                  </div>
                </div>

                {/* Days Left */}
                <div className="flex gap-3">
                  <div className="w-9 h-9 rounded-full bg-gold/5 flex items-center justify-center border border-gold/20 shrink-0">
                    <AlertCircle className="w-4 h-4 text-gold" />
                  </div>
                  <div>
                    <span className="block text-[10px] uppercase font-bold text-charcoal-light tracking-wider mb-0.5">Days Left</span>
                    <span className={`${getDaysLeftTextAndStyle(selectedInquiry.eventDate).className} text-xs font-semibold`}>
                      {getDaysLeftTextAndStyle(selectedInquiry.eventDate).text}
                    </span>
                  </div>
                </div>

                {/* Date Submitted */}
                <div className="flex gap-3">
                  <div className="w-9 h-9 rounded-full bg-gold/5 flex items-center justify-center border border-gold/20 shrink-0">
                    <Clock className="w-4 h-4 text-gold" />
                  </div>
                  <div>
                    <span className="block text-[10px] uppercase font-bold text-charcoal-light tracking-wider mb-0.5">Date & Time Submitted</span>
                    <span className="text-xs font-medium">
                      {formatDateStr(selectedInquiry.submittedAt)} at {formatTimeStr(selectedInquiry.submittedAt)}
                    </span>
                  </div>
                </div>

              </div>

              {/* Customer message */}
              <div className="pt-4 border-t border-gold/10">
                <div className="flex items-start gap-2 mb-2">
                  <MessageSquare className="w-4.5 h-4.5 text-gold mt-0.5" />
                  <span className="text-[10px] uppercase font-bold text-charcoal-light tracking-wider">Customer Message</span>
                </div>
                <div className="p-4 bg-ivory/20 rounded-xl border border-gold/5 text-sm leading-relaxed whitespace-pre-wrap select-text">
                  {selectedInquiry.message || 'No additional details provided.'}
                </div>
              </div>

              {/* Private Owner Notes */}
              <div className="pt-4 border-t border-gold/10">
                <div className="flex items-start gap-2 mb-2">
                  <FileText className="w-4.5 h-4.5 text-gold mt-0.5" />
                  <span className="text-[10px] uppercase font-bold text-charcoal-light tracking-wider">Owner Notes (Private)</span>
                </div>
                <textarea
                  rows="3"
                  value={modalNotes}
                  onChange={(e) => setModalNotes(e.target.value)}
                  placeholder="E.g., Customer requested Arabic style, call after 6 PM, advance payment received."
                  className="w-full p-3 bg-ivory/10 border border-gold/20 focus:border-gold focus:ring-1 focus:ring-gold rounded-lg outline-none text-sm text-charcoal focus:bg-white transition-all duration-200 resize-y"
                />
                <div className="mt-2 flex justify-end">
                  <button
                    onClick={async () => {
                      setIsSavingNotes(true);
                      await updateInquiryNotes(selectedInquiry.id, modalNotes);
                      setIsSavingNotes(false);
                    }}
                    className="px-3.5 py-1.5 bg-gold text-burgundy hover:bg-gold-light rounded-md text-xs font-bold tracking-wide transition-all shadow-sm flex items-center gap-1 cursor-pointer"
                  >
                    {isSavingNotes ? 'Saving...' : 'Save Notes'}
                  </button>
                </div>
              </div>

              {/* Interactive Booking Progress Timeline */}
              <div className="pt-4 border-t border-gold/10">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="w-4.5 h-4.5 text-gold" />
                  <span className="text-[10px] uppercase font-bold text-charcoal-light tracking-wider">Booking Progress Timeline</span>
                </div>
                <div className="relative pl-6 space-y-6 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-200">
                  {[
                    { label: 'Enquiry Submitted', desc: 'Customer filled enquiry form', status: 'Pending' },
                    { label: 'Owner Contacted', desc: 'Initial details discussed', status: 'Contacted' },
                    { label: 'Booking Confirmed', desc: 'Booking date & services locked', status: 'Confirmed' },
                    { label: 'Service Completed', desc: 'Saree/Mehendi work finished', status: 'Completed' }
                  ].map((step, idx) => {
                    const stepStatus = getTimelineStepStatus(step.status, selectedInquiry.status);
                    const isDone = stepStatus === 'completed';
                    return (
                      <div key={step.status} className="relative flex gap-4 items-start">
                        <span className={`absolute -left-[21px] mt-0.5 w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold ${
                          isDone 
                            ? 'bg-emerald-500 border-emerald-500 text-white shadow-sm' 
                            : 'bg-white border-gray-300 text-gray-400'
                        }`}>
                          {isDone ? '✓' : idx + 1}
                        </span>
                        <div>
                          <h5 className={`font-semibold ${isDone ? 'text-burgundy' : 'text-gray-400'}`}>
                            {step.label} {isDone && '✅'}
                          </h5>
                          <p className="text-xs text-charcoal-light">{step.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* Modal Footer & Quick Actions */}
            <div className="p-5 bg-ivory/10 border-t border-gold/10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              
              {/* Quick Contact Actions */}
              <div className="flex items-center gap-2">
                <a
                  href={`tel:${selectedInquiry.phone}`}
                  className="flex items-center gap-1.5 px-3 py-2 bg-burgundy/5 hover:bg-burgundy text-burgundy hover:text-white rounded-lg border border-burgundy/15 text-xs font-bold transition-all cursor-pointer"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call Customer</span>
                </a>
                <a
                  href={getWhatsAppLink(selectedInquiry.phone, selectedInquiry.name)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-2 bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white rounded-lg border border-emerald-100 text-xs font-bold transition-all cursor-pointer"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>WhatsApp Customer</span>
                </a>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-2.5">
                <button
                  onClick={() => {
                    if (window.confirm("Are you sure you want to permanently delete this customer enquiry?")) {
                      handleDelete(selectedInquiry.id);
                    }
                  }}
                  className="flex items-center gap-1.5 px-3 py-2 text-rose-600 hover:bg-rose-50 rounded-lg border border-rose-100 hover:border-rose-200 text-xs font-semibold tracking-wide transition-all cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete</span>
                </button>
                
                <button
                  onClick={() => setSelectedInquiry(null)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-charcoal hover:text-black rounded-lg text-xs font-bold transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default AdminDashboard;
