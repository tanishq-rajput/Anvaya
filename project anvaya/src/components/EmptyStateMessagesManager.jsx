import React, { useState, useEffect, useCallback } from 'react';
import { 
  Plus, 
  Edit3, 
  Trash2, 
  Eye, 
  RotateCcw, 
  Check, 
  X, 
  Sparkles, 
  MessageSquare,
  Shuffle,
  AlertCircle,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';
import { 
  getEmptyStateMessages, 
  addEmptyStateMessage, 
  updateEmptyStateMessage, 
  deleteEmptyStateMessage, 
  toggleEmptyStateMessage, 
  resetEmptyStateMessages,
  getRandomEmptyStateMessage,
  FALLBACK_MESSAGE
} from '../services/emptyStateMessages';

export default function EmptyStateMessagesManager({ onBack }) {
  const [messages, setMessages] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPreviewText, setSelectedPreviewText] = useState('');
  
  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingMessage, setEditingMessage] = useState(null);
  const [deletingMessage, setDeletingMessage] = useState(null);
  const [showResetConfirmModal, setShowResetConfirmModal] = useState(false);
  
  // Form states
  const [formDataText, setFormDataText] = useState('');
  const [formDataEnabled, setFormDataEnabled] = useState(true);
  const [formError, setFormError] = useState('');

  // Load messages from service
  const reloadMessages = useCallback(() => {
    const list = getEmptyStateMessages();
    setMessages(list);
    if (!selectedPreviewText && list.length > 0) {
      const firstEnabled = list.find(m => m.enabled) || list[0];
      setSelectedPreviewText(firstEnabled.text);
    }
  }, [selectedPreviewText]);

  useEffect(() => {
    reloadMessages();
    const handleUpdate = () => reloadMessages();
    window.addEventListener('anvaya_assets_updated', handleUpdate);
    return () => window.removeEventListener('anvaya_assets_updated', handleUpdate);
  }, [reloadMessages]);

  const enabledCount = messages.filter(m => m.enabled).length;

  // Filter messages based on search query
  const filteredMessages = messages.filter(m => 
    m.text.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Toggle enable/disable
  const handleToggle = (id) => {
    toggleEmptyStateMessage(id);
    reloadMessages();
  };

  // Open Add Modal
  const handleOpenAddModal = () => {
    setFormDataText('');
    setFormDataEnabled(true);
    setFormError('');
    setShowAddModal(true);
  };

  // Submit Add
  const handleSaveAdd = () => {
    if (!formDataText.trim()) {
      setFormError('Please enter a message.');
      return;
    }
    const created = addEmptyStateMessage(formDataText, formDataEnabled);
    if (created) {
      setSelectedPreviewText(created.text);
    }
    setShowAddModal(false);
    reloadMessages();
  };

  // Open Edit Modal
  const handleOpenEditModal = (msg) => {
    setEditingMessage(msg);
    setFormDataText(msg.text);
    setFormDataEnabled(msg.enabled);
    setFormError('');
  };

  // Submit Edit
  const handleSaveEdit = () => {
    if (!formDataText.trim()) {
      setFormError('Please enter a message.');
      return;
    }
    updateEmptyStateMessage(editingMessage.id, {
      text: formDataText,
      enabled: formDataEnabled
    });
    setSelectedPreviewText(formDataText.trim());
    setEditingMessage(null);
    reloadMessages();
  };

  // Confirm Delete
  const handleConfirmDelete = () => {
    if (deletingMessage) {
      deleteEmptyStateMessage(deletingMessage.id);
      if (selectedPreviewText === deletingMessage.text) {
        setSelectedPreviewText(getRandomEmptyStateMessage());
      }
      setDeletingMessage(null);
      reloadMessages();
    }
  };

  // Cycle Random Preview
  const handleCycleRandomPreview = () => {
    const nextRandom = getRandomEmptyStateMessage(selectedPreviewText);
    setSelectedPreviewText(nextRandom);
  };

  // Reset to initial collection
  const handleResetToDefaults = () => {
    resetEmptyStateMessages();
    setShowResetConfirmModal(false);
    setSelectedPreviewText(FALLBACK_MESSAGE);
    reloadMessages();
  };

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      
      {/* ── Section Header ────────────────────────────────────────────── */}
      <div className="border-b border-[#49382C]/15 pb-6">
        <div className="flex flex-col md:flex-row md:items-baseline md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-mono uppercase tracking-[0.24em] text-[#34483A] font-semibold">
                Sartorial Wit & Content Architecture
              </span>
              <span className="text-[#49382C]/30">•</span>
              <span className="text-[10px] font-mono text-[#49382C]/60">
                {enabledCount} of {messages.length} Active
              </span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl text-[#49382C] font-normal tracking-tight">
              Empty State Messages
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-[#49382C]/75 font-sans max-w-2xl leading-relaxed">
              Curate the humorous placeholder messages presented in the reverse-side About panel when an outfit card has no manually entered description. Messages are chosen at random from active items.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={handleOpenAddModal}
              className="px-4 py-2 bg-[#34483A] text-[#FAF8F3] hover:bg-[#25362B] text-xs font-mono uppercase tracking-wider font-semibold rounded-xs shadow-xs transition-all flex items-center gap-2 cursor-pointer hover:shadow-md"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Message</span>
            </button>

            <button
              type="button"
              onClick={() => setShowResetConfirmModal(true)}
              className="px-3 py-2 bg-[#FAF8F3] text-[#49382C] border border-[#49382C]/20 hover:bg-[#EFEAE0] text-xs font-mono tracking-wider rounded-xs transition-all flex items-center gap-1.5 cursor-pointer"
              title="Reset to default 16 messages"
            >
              <RotateCcw className="w-3.5 h-3.5 text-[#49382C]/70" />
              <span className="hidden sm:inline">Reset Defaults</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── Main Two-Column Layout (List + Live Preview) ────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Manageable Message List (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Search Bar & Filter Stats */}
          <div className="flex items-center justify-between gap-3 bg-[#F3EDE2] border border-[#49382C]/15 rounded-xs p-3">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search placeholder messages..."
              className="bg-[#FAF8F3] border border-[#49382C]/20 rounded-xs px-3 py-1.5 text-xs text-[#49382C] placeholder-[#49382C]/40 flex-1 focus:outline-none focus:border-[#34483A]"
            />
            <span className="text-[11px] font-mono text-[#49382C]/65 shrink-0">
              {filteredMessages.length} {filteredMessages.length === 1 ? 'item' : 'items'}
            </span>
          </div>

          {/* Messages List */}
          <div className="space-y-2.5">
            {filteredMessages.length === 0 ? (
              <div className="py-12 text-center bg-[#F3EDE2]/50 border border-dashed border-[#49382C]/20 rounded-xs p-6">
                <MessageSquare className="w-8 h-8 text-[#49382C]/40 mx-auto mb-2" />
                <p className="font-serif text-base text-[#49382C]/70 font-normal">
                  No matching placeholder messages found.
                </p>
                <p className="text-xs text-[#49382C]/50 mt-1">
                  Try adjusting your search or add a new message.
                </p>
              </div>
            ) : (
              filteredMessages.map((msg, index) => {
                const isSelectedForPreview = selectedPreviewText === msg.text;

                return (
                  <div
                    key={msg.id}
                    className={`bg-[#FAF8F3] border rounded-xs p-3 sm:p-4 transition-all duration-200 flex items-start gap-3.5 ${
                      isSelectedForPreview
                        ? 'border-[#34483A] shadow-sm bg-[#FAF8F3]'
                        : 'border-[#49382C]/15 hover:border-[#49382C]/35'
                    }`}
                  >
                    {/* Enable / Disable Toggle Switch */}
                    <button
                      type="button"
                      onClick={() => handleToggle(msg.id)}
                      className="mt-0.5 shrink-0 cursor-pointer focus:outline-none transition-transform active:scale-95"
                      title={msg.enabled ? 'Click to disable' : 'Click to enable'}
                      aria-label={msg.enabled ? 'Disable message' : 'Enable message'}
                    >
                      {msg.enabled ? (
                        <div className="w-9 h-5 bg-[#34483A] rounded-full p-0.5 transition-colors flex items-center justify-end">
                          <div className="w-4 h-4 bg-[#FAF8F3] rounded-full shadow-xs" />
                        </div>
                      ) : (
                        <div className="w-9 h-5 bg-[#49382C]/25 rounded-full p-0.5 transition-colors flex items-center justify-start">
                          <div className="w-4 h-4 bg-[#FAF8F3] rounded-full shadow-xs" />
                        </div>
                      )}
                    </button>

                    {/* Message Body */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline gap-2 mb-1">
                        <span className="text-[10px] font-mono text-[#49382C]/40">
                          #{index + 1}
                        </span>
                        <span className={`text-[9px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded-2xs font-semibold ${
                          msg.enabled 
                            ? 'bg-[#34483A]/10 text-[#34483A] border border-[#34483A]/20' 
                            : 'bg-[#49382C]/8 text-[#49382C]/50 border border-[#49382C]/15'
                        }`}>
                          {msg.enabled ? 'Active' : 'Disabled'}
                        </span>
                        {isSelectedForPreview && (
                          <span className="text-[9px] font-mono uppercase tracking-wider text-[#34483A] font-semibold flex items-center gap-1">
                            <Sparkles className="w-2.5 h-2.5" /> Previewing
                          </span>
                        )}
                      </div>

                      <p className={`font-serif text-sm sm:text-base leading-relaxed break-words ${
                        msg.enabled ? 'text-[#2C1810]' : 'text-[#49382C]/50 italic'
                      }`}>
                        "{msg.text}"
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1 shrink-0 self-center">
                      <button
                        type="button"
                        onClick={() => setSelectedPreviewText(msg.text)}
                        className={`p-1.5 rounded-xs transition-colors cursor-pointer ${
                          isSelectedForPreview
                            ? 'bg-[#34483A] text-[#FAF8F3]'
                            : 'text-[#49382C]/60 hover:text-[#34483A] hover:bg-[#F3EDE2]'
                        }`}
                        title="Preview in About section card"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleOpenEditModal(msg)}
                        className="p-1.5 text-[#49382C]/60 hover:text-[#49382C] hover:bg-[#F3EDE2] rounded-xs transition-colors cursor-pointer"
                        title="Edit message"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => setDeletingMessage(msg)}
                        className="p-1.5 text-[#49382C]/50 hover:text-[#7C3F2A] hover:bg-[#7C3F2A]/10 rounded-xs transition-colors cursor-pointer"
                        title="Delete message"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Interactive Card Preview (5 cols, sticky) */}
        <div className="lg:col-span-5 sticky top-20 space-y-4">
          <div className="bg-[#F3EDE2] border border-[#49382C]/20 rounded-sm p-5 sm:p-6 shadow-xs">
            
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#49382C]/15">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#34483A]" />
                <h3 className="font-serif text-base text-[#49382C] font-normal">
                  Live Card Preview
                </h3>
              </div>
              <button
                type="button"
                onClick={handleCycleRandomPreview}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-mono text-[#34483A] bg-[#FAF8F3] hover:bg-[#FAF8F3]/90 border border-[#34483A]/30 rounded-xs transition-all cursor-pointer shadow-2xs font-medium"
                title="Pick another random enabled message"
              >
                <Shuffle className="w-3 h-3" />
                <span>Test Randomizer</span>
              </button>
            </div>

            <p className="text-[11px] font-sans text-[#49382C]/70 mb-4 leading-relaxed">
              Below is an exact replica of how this message displays on the reverse side of an outfit card when no manual description is set:
            </p>

            {/* Specimen Card Frame */}
            <div className="bg-[#FBF9F4] border-[2.5px] border-[#2C1810] p-4 sm:p-5 rounded-none shadow-sm relative overflow-hidden">
              
              {/* Mock Top Area */}
              <div className="shrink-0 pb-2 mb-2 border-b border-[#D8CEC0] flex items-center justify-between">
                <div>
                  <h4 className="font-serif text-sm text-[#2C1810] font-normal leading-snug">
                    Specimen Card Reverse
                  </h4>
                  <p className="text-[9px] font-mono uppercase tracking-wider text-[#8A7A6E]">
                    Aesthetic Category
                  </p>
                </div>
                <span className="text-[9px] font-mono uppercase tracking-widest text-[#49382C]/40">
                  Preview
                </span>
              </div>

              {/* Recessed editorial About panel — authentic styling */}
              <div className="h-36 sm:h-44 bg-[#EDE7DC] border border-[#C8BEB5] rounded-[2px] p-4 flex items-center justify-center relative overflow-hidden">
                <p className="font-serif text-sm sm:text-base text-[#49382C] italic leading-relaxed text-center max-w-[24ch] mx-auto transition-all duration-200">
                  {selectedPreviewText || FALLBACK_MESSAGE}
                </p>
              </div>

              {/* Mock Flip Back Button */}
              <div className="pt-2.5 flex items-center justify-between shrink-0">
                <span className="text-[9px] font-mono text-[#49382C]/50 italic">
                  Empty description state
                </span>
                <div className="w-7 h-7 rounded-full bg-[#1E3A2B] text-[#FBF9F4] flex items-center justify-center shadow-xs">
                  <span className="font-serif font-semibold text-xs select-none">A</span>
                </div>
              </div>

            </div>

            {/* Explanatory Footer */}
            <div className="mt-4 p-3 bg-[#FAF8F3] border border-[#49382C]/15 rounded-xs text-[11px] font-sans text-[#49382C]/75 leading-relaxed flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-[#34483A] shrink-0 mt-0.5" />
              <span>
                <strong>Behavior Rule:</strong> If an outfit card has a manual description in Developer Mode, it will always show that text. Only cards with empty About text show one of these random active messages.
              </span>
            </div>

          </div>
        </div>

      </div>

      {/* ── Add Message Modal ────────────────────────────────────────── */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-[#2C1810]/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FAF8F3] border border-[#49382C]/20 rounded-sm max-w-lg w-full p-6 sm:p-8 shadow-xl animate-scale-in">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#49382C]/15">
              <h3 className="font-serif text-xl sm:text-2xl text-[#49382C] font-normal">
                Add Empty State Message
              </h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-[#49382C]/60 hover:text-[#49382C]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-[#49382C]/75 mb-4">
              Enter a concise, witty placeholder message to display when no About description has been written for an outfit card.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-mono uppercase tracking-wider text-[#49382C] font-semibold mb-1.5">
                  Message Text
                </label>
                <textarea
                  value={formDataText}
                  onChange={(e) => {
                    setFormDataText(e.target.value);
                    if (formError) setFormError('');
                  }}
                  rows={3}
                  placeholder="e.g. Modern art enthusiasts are losing their minds."
                  className="w-full bg-[#FAF8F3] border border-[#49382C]/25 rounded-xs p-3 text-sm text-[#2C1810] font-serif focus:outline-none focus:border-[#34483A]"
                  autoFocus
                />
                {formError && (
                  <p className="text-xs text-[#7C3F2A] mt-1 font-sans">{formError}</p>
                )}
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="add-enabled-checkbox"
                  checked={formDataEnabled}
                  onChange={(e) => setFormDataEnabled(e.target.checked)}
                  className="w-4 h-4 rounded-2xs accent-[#34483A] cursor-pointer"
                />
                <label htmlFor="add-enabled-checkbox" className="text-xs font-sans text-[#49382C] cursor-pointer select-none">
                  Enable this message immediately in recommendations
                </label>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-[#49382C]/15 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 border border-[#49382C]/20 hover:bg-[#EFEAE0] text-xs font-mono uppercase tracking-wider text-[#49382C] rounded-xs transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveAdd}
                className="px-5 py-2 bg-[#34483A] hover:bg-[#25362B] text-[#FAF8F3] text-xs font-mono uppercase tracking-wider font-semibold rounded-xs shadow-xs transition-colors cursor-pointer"
              >
                Add Message
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Edit Message Modal ────────────────────────────────────────── */}
      {editingMessage && (
        <div className="fixed inset-0 z-50 bg-[#2C1810]/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FAF8F3] border border-[#49382C]/20 rounded-sm max-w-lg w-full p-6 sm:p-8 shadow-xl animate-scale-in">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#49382C]/15">
              <h3 className="font-serif text-xl sm:text-2xl text-[#49382C] font-normal">
                Edit Empty State Message
              </h3>
              <button
                type="button"
                onClick={() => setEditingMessage(null)}
                className="text-[#49382C]/60 hover:text-[#49382C]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-mono uppercase tracking-wider text-[#49382C] font-semibold mb-1.5">
                  Message Text
                </label>
                <textarea
                  value={formDataText}
                  onChange={(e) => {
                    setFormDataText(e.target.value);
                    if (formError) setFormError('');
                  }}
                  rows={3}
                  className="w-full bg-[#FAF8F3] border border-[#49382C]/25 rounded-xs p-3 text-sm text-[#2C1810] font-serif focus:outline-none focus:border-[#34483A]"
                  autoFocus
                />
                {formError && (
                  <p className="text-xs text-[#7C3F2A] mt-1 font-sans">{formError}</p>
                )}
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="edit-enabled-checkbox"
                  checked={formDataEnabled}
                  onChange={(e) => setFormDataEnabled(e.target.checked)}
                  className="w-4 h-4 rounded-2xs accent-[#34483A] cursor-pointer"
                />
                <label htmlFor="edit-enabled-checkbox" className="text-xs font-sans text-[#49382C] cursor-pointer select-none">
                  Message is active (eligible for random selection)
                </label>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-[#49382C]/15 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setEditingMessage(null)}
                className="px-4 py-2 border border-[#49382C]/20 hover:bg-[#EFEAE0] text-xs font-mono uppercase tracking-wider text-[#49382C] rounded-xs transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveEdit}
                className="px-5 py-2 bg-[#34483A] hover:bg-[#25362B] text-[#FAF8F3] text-xs font-mono uppercase tracking-wider font-semibold rounded-xs shadow-xs transition-colors cursor-pointer"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete Confirmation Modal ─────────────────────────────────── */}
      {deletingMessage && (
        <div className="fixed inset-0 z-50 bg-[#2C1810]/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FAF8F3] border border-[#7C3F2A]/30 rounded-sm max-w-md w-full p-6 shadow-xl animate-scale-in">
            <h3 className="font-serif text-xl text-[#7C3F2A] font-normal mb-2">
              Delete Placeholder Message?
            </h3>
            <p className="text-xs text-[#49382C]/75 mb-3 leading-relaxed">
              Are you sure you want to remove this message from your collection?
            </p>
            <div className="p-3 bg-[#EDE7DC] border border-[#C8BEB5] rounded-xs font-serif text-xs text-[#2C1810] italic mb-5">
              "{deletingMessage.text}"
            </div>
            <div className="flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setDeletingMessage(null)}
                className="px-4 py-1.5 border border-[#49382C]/20 hover:bg-[#EFEAE0] text-xs font-mono uppercase tracking-wider text-[#49382C] rounded-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-4 py-1.5 bg-[#7C3F2A] hover:bg-[#632F1E] text-[#FAF8F3] text-xs font-mono uppercase tracking-wider font-semibold rounded-xs shadow-xs cursor-pointer"
              >
                Delete Message
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Reset to Defaults Confirmation Modal ───────────────────────── */}
      {showResetConfirmModal && (
        <div className="fixed inset-0 z-50 bg-[#2C1810]/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FAF8F3] border border-[#49382C]/25 rounded-sm max-w-md w-full p-6 shadow-xl animate-scale-in">
            <h3 className="font-serif text-xl text-[#49382C] font-normal mb-2">
              Reset All Messages to Default Collection?
            </h3>
            <p className="text-xs text-[#49382C]/75 mb-5 leading-relaxed">
              This will restore the initial 16 curated messages and enable all of them. Any custom messages you have added will be replaced.
            </p>
            <div className="flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setShowResetConfirmModal(false)}
                className="px-4 py-1.5 border border-[#49382C]/20 hover:bg-[#EFEAE0] text-xs font-mono uppercase tracking-wider text-[#49382C] rounded-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleResetToDefaults}
                className="px-4 py-1.5 bg-[#34483A] hover:bg-[#25362B] text-[#FAF8F3] text-xs font-mono uppercase tracking-wider font-semibold rounded-xs shadow-xs cursor-pointer"
              >
                Reset to 16 Messages
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
