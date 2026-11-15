/**
 * Anvaya Empty State Messages Service
 * 
 * Manages the collection of humorous placeholder messages displayed in
 * outfit cards when no manual About description has been provided.
 * 
 * Features:
 * - Persistent storage with localStorage (survives page refreshes)
 * - CRUD operations: Add, Edit, Delete, and Toggle Enable/Disable
 * - Random selection algorithm that avoids consecutive duplicate messages
 * - Dispatches 'anvaya_assets_updated' events for real-time reactivity
 */

import { dispatchAssetsUpdated } from './imageStorage.js';

export const STORAGE_KEY = 'anvaya_empty_state_messages';
export const ASSIGNMENTS_STORAGE_KEY = 'anvaya_card_empty_message_assignments';
export const FALLBACK_MESSAGE = 'Space left empty for dramatic effect.';

export const INITIAL_EMPTY_STATE_MESSAGES = [
  { id: 'msg_1',  text: 'Space left empty for dramatic effect.', enabled: true },
  { id: 'msg_2',  text: 'An impressive amount of absolutely nothing.', enabled: true },
  { id: 'msg_3',  text: 'Minimalism is getting out of hand.', enabled: true },
  { id: 'msg_4',  text: 'The void sends its regards.', enabled: true },
  { id: 'msg_5',  text: 'Modern art enthusiasts are losing their minds.', enabled: true },
  { id: 'msg_6',  text: "Schrödinger's content: both here and not here.", enabled: true },
  { id: 'msg_7',  text: 'Scientists are still trying to explain this.', enabled: true },
  { id: 'msg_8',  text: 'I think, therefore I am. Except here.', enabled: true },
  { id: 'msg_9',  text: 'Perhaps the real content was the friends we made along the way.', enabled: true },
  { id: 'msg_10', text: 'This meeting could have been an email.', enabled: true },
  { id: 'msg_11', text: 'Our productivity is under review.', enabled: true },
  { id: 'msg_12', text: '404: Personality not found.', enabled: true },
  { id: 'msg_13', text: 'Have you tried turning it off and on again?', enabled: true },
  { id: 'msg_14', text: 'Please lower your expectations.', enabled: true },
  { id: 'msg_15', text: 'All dressed up with nowhere to go.', enabled: true },
  { id: 'msg_16', text: 'Silence has never been this loud.', enabled: true },
];

/**
 * Retrieve all messages from storage.
 * Seeds with initial collection on first run.
 */
export function getEmptyStateMessages() {
  if (typeof window === 'undefined') return INITIAL_EMPTY_STATE_MESSAGES;

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_EMPTY_STATE_MESSAGES));
      return INITIAL_EMPTY_STATE_MESSAGES;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_EMPTY_STATE_MESSAGES));
      return INITIAL_EMPTY_STATE_MESSAGES;
    }
    return parsed;
  } catch (err) {
    console.error('Failed to parse empty state messages from localStorage:', err);
    return INITIAL_EMPTY_STATE_MESSAGES;
  }
}

/**
 * Save messages array to storage and dispatch sync event
 */
export function saveEmptyStateMessages(messages) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    dispatchAssetsUpdated({ type: 'empty_messages_updated' });
  } catch (err) {
    console.error('Failed to save empty state messages to localStorage:', err);
  }
}

/**
 * Add a new message to the collection
 */
export function addEmptyStateMessage(text, enabled = true) {
  if (!text || !text.trim()) return null;
  const messages = getEmptyStateMessages();
  const newMessage = {
    id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
    text: text.trim(),
    enabled: Boolean(enabled),
    createdAt: new Date().toISOString()
  };
  const updated = [newMessage, ...messages];
  saveEmptyStateMessages(updated);
  return newMessage;
}

/**
 * Edit an existing message by ID
 */
export function updateEmptyStateMessage(id, updates) {
  const messages = getEmptyStateMessages();
  const index = messages.findIndex(m => m.id === id);
  if (index === -1) return null;

  const updatedMessage = {
    ...messages[index],
    ...updates,
    text: updates.text !== undefined ? updates.text.trim() : messages[index].text,
    updatedAt: new Date().toISOString()
  };
  messages[index] = updatedMessage;
  saveEmptyStateMessages(messages);
  return updatedMessage;
}

/**
 * Delete a message by ID
 */
export function deleteEmptyStateMessage(id) {
  const messages = getEmptyStateMessages();
  const updated = messages.filter(m => m.id !== id);
  saveEmptyStateMessages(updated);
  return true;
}

/**
 * Toggle enable/disable status for a message
 */
export function toggleEmptyStateMessage(id) {
  const messages = getEmptyStateMessages();
  const msg = messages.find(m => m.id === id);
  if (!msg) return null;
  return updateEmptyStateMessage(id, { enabled: !msg.enabled });
}

/**
 * Select a random enabled message, avoiding consecutive repetition if multiple exist
 */
export function getRandomEmptyStateMessage(excludeText = null) {
  const messages = getEmptyStateMessages();
  const enabled = messages.filter(m => m.enabled && m.text && m.text.trim().length > 0);

  if (enabled.length === 0) {
    return FALLBACK_MESSAGE;
  }

  if (enabled.length === 1) {
    return enabled[0].text;
  }

  // Avoid consecutive duplicate if multiple enabled
  const candidates = excludeText
    ? enabled.filter(m => m.text !== excludeText)
    : enabled;

  const pool = candidates.length > 0 ? candidates : enabled;
  const randomIndex = Math.floor(Math.random() * pool.length);
  return pool[randomIndex].text;
}

/**
 * Reset collection to the initial 16 messages
 */
export function resetEmptyStateMessages() {
  saveEmptyStateMessages(INITIAL_EMPTY_STATE_MESSAGES);
  return INITIAL_EMPTY_STATE_MESSAGES;
}

/**
 * Retrieve persisted card-to-message assignments from localStorage
 */
export function getPersistedAssignments() {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(ASSIGNMENTS_STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) || {};
  } catch (err) {
    console.error('Failed to read empty message assignments from localStorage:', err);
    return {};
  }
}

/**
 * Save card-to-message assignments to localStorage
 */
export function savePersistedAssignments(assignments) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(ASSIGNMENTS_STORAGE_KEY, JSON.stringify(assignments));
  } catch (err) {
    console.error('Failed to save empty message assignments to localStorage:', err);
  }
}

/**
 * Distribute empty state placeholder messages across cards with minimal repetition.
 * 
 * Rules:
 * 1. Cards with manual About content (`about.trim().length > 0`) are excluded completely.
 * 2. Cards with emptyAboutMode === 'none' receive an empty string.
 * 3. Cards with emptyAboutMode === 'specific' receive their designated message and do NOT consume from the auto pool.
 * 4. Cards with automatic assignment:
 *    - Each card gets a unique active message when N <= M.
 *    - No message is reused until all active messages are exhausted once.
 *    - If N > M, repeated messages are distributed as evenly as possible (max count - min count <= 1).
 * 5. Stability & Persistence:
 *    - Re-uses persisted assignments from localStorage.
 *    - When active messages or cards change, unaffected card assignments are preserved without unnecessary reshuffling.
 */
export function distributeEmptyStateMessages(cards = [], customMessages = null) {
  const allMessages = customMessages || getEmptyStateMessages();
  const activeMessages = allMessages.filter(m => m.enabled && m.text && m.text.trim().length > 0);
  const savedAssignments = getPersistedAssignments();

  const resultMap = {};
  const currentAssignmentsToSave = {};

  // Map for quick message lookup
  const messageById = new Map();
  const messageByText = new Map();
  allMessages.forEach(m => {
    messageById.set(m.id, m);
    if (m.text) messageByText.set(m.text.trim(), m);
  });

  const activeMsgByText = new Map();
  activeMessages.forEach(m => activeMsgByText.set(m.text.trim(), m));

  const autoEligibleCards = [];

  // Step 1: Handle Manual About, 'none', and 'specific' cards
  cards.forEach(card => {
    const hasManualAbout = Boolean(card.about && card.about.trim().length > 0);
    if (hasManualAbout) {
      // Manual content exists; do not consume or assign placeholder
      return;
    }

    const mode = card.emptyAboutMode || 'auto';
    if (mode === 'none') {
      // User explicitly set mode to None
      resultMap[card.id] = '';
      return;
    }

    if (mode === 'specific') {
      // User pinned a specific message
      const targetMsg = messageById.get(card.emptyAboutMessageId) || 
                        messageByText.get(card.emptyAboutMessageText);
      if (targetMsg && targetMsg.text) {
        resultMap[card.id] = targetMsg.text;
      } else {
        resultMap[card.id] = FALLBACK_MESSAGE;
      }
      return;
    }

    // Eligible for automatic minimal-repetition distribution
    autoEligibleCards.push(card);
  });

  if (autoEligibleCards.length === 0) {
    return resultMap;
  }

  // If no active messages exist, fallback for all
  if (activeMessages.length === 0) {
    autoEligibleCards.forEach(c => {
      resultMap[c.id] = FALLBACK_MESSAGE;
      currentAssignmentsToSave[c.id] = FALLBACK_MESSAGE;
    });
    savePersistedAssignments({ ...savedAssignments, ...currentAssignmentsToSave });
    return resultMap;
  }

  const N = autoEligibleCards.length;
  const M = activeMessages.length;
  const maxQuota = Math.ceil(N / M);

  const usageCount = new Map();
  activeMessages.forEach(m => usageCount.set(m.id, 0));

  const unassignedCards = [];

  // Step 2: Pass 1 — Retain previous assignment for cards if the message is still active and under quota
  for (const card of autoEligibleCards) {
    const prevText = savedAssignments[card.id];
    if (prevText && activeMsgByText.has(prevText.trim())) {
      const activeMsg = activeMsgByText.get(prevText.trim());
      const count = usageCount.get(activeMsg.id) || 0;
      if (count < maxQuota) {
        resultMap[card.id] = activeMsg.text;
        currentAssignmentsToSave[card.id] = activeMsg.text;
        usageCount.set(activeMsg.id, count + 1);
        continue;
      }
    }
    unassignedCards.push(card);
  }

  // Step 3: Pass 2 — Assign least-used active message to remaining cards
  let lastAssignedText = null;

  for (const card of unassignedCards) {
    // Find active messages with the minimum usage count below maxQuota
    let minUsage = Infinity;
    for (const msg of activeMessages) {
      const count = usageCount.get(msg.id) || 0;
      if (count < maxQuota && count < minUsage) {
        minUsage = count;
      }
    }

    // Filter candidates that have this minimum usage
    const candidates = activeMessages.filter(msg => {
      const count = usageCount.get(msg.id) || 0;
      return count === minUsage && count < maxQuota;
    });

    let chosenMsg = null;
    if (candidates.length > 0) {
      // Avoid repeating the immediately preceding card if multiple options exist
      const nonConsecutive = candidates.filter(m => m.text !== lastAssignedText);
      chosenMsg = nonConsecutive.length > 0 ? nonConsecutive[0] : candidates[0];
    } else {
      chosenMsg = activeMessages[0];
    }

    resultMap[card.id] = chosenMsg.text;
    currentAssignmentsToSave[card.id] = chosenMsg.text;
    usageCount.set(chosenMsg.id, (usageCount.get(chosenMsg.id) || 0) + 1);
    lastAssignedText = chosenMsg.text;
  }

  // Step 4: Persist merged assignments
  const mergedPersistence = { ...savedAssignments, ...currentAssignmentsToSave };
  savePersistedAssignments(mergedPersistence);

  return resultMap;
}
