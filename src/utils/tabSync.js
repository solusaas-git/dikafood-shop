/**
 * Cross-tab synchronization utility
 * Handles state synchronization across multiple browser tabs
 */

class TabSyncManager {
    constructor() {
        this.listeners = new Map();
        this.tabId = `tab_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        this.handleStorageChange = this.handleStorageChange.bind(this);
        this.handleUnload = this.handleUnload.bind(this);
    }

    /**
     * Initialize the tab sync manager
     */
    init() {
        window.addEventListener('storage', this.handleStorageChange);
        window.addEventListener('beforeunload', this.handleUnload);
        
        this.registerTab();
    
    }

    /**
     * Register this tab as active
     */
    registerTab() {
        const activeTabs = this.getActiveTabs();
        activeTabs[this.tabId] = {
            lastSeen: Date.now(),
            url: window.location.href
        };
        
        localStorage.setItem('dikafood_active_tabs', JSON.stringify(activeTabs));
    }

    /**
     * Get list of active tabs
     */
    getActiveTabs() {
        try {
            const stored = localStorage.getItem('dikafood_active_tabs');
            const tabs = stored ? JSON.parse(stored) : {};
            
            // Clean up stale tabs (older than 30 seconds)
            const now = Date.now();
            const cleanTabs = {};
            
            Object.entries(tabs).forEach(([tabId, tabInfo]) => {
                if (now - tabInfo.lastSeen < 30000) {
                    cleanTabs[tabId] = tabInfo;
                }
            });
            
            return cleanTabs;
        } catch (error) {
            console.error('[TabSync] Error getting active tabs:', error);
            return {};
        }
    }

    /**
     * Broadcast event to other tabs
     */
    broadcastEvent(type, data = {}) {
        const event = {
            type,
            data,
            tabId: this.tabId,
            timestamp: Date.now()
        };

        try {
            localStorage.setItem('dikafood_tab_event', JSON.stringify(event));
            setTimeout(() => {
                localStorage.removeItem('dikafood_tab_event');
            }, 100);
        } catch (error) {
            console.error('[TabSync] Error broadcasting event:', error);
        }
    }

    /**
     * Listen for specific event types
     */
    addEventListener(eventType, callback) {
        if (!this.listeners.has(eventType)) {
            this.listeners.set(eventType, new Set());
        }
        this.listeners.get(eventType).add(callback);
    }

    /**
     * Remove event listener
     */
    removeEventListener(eventType, callback) {
        if (this.listeners.has(eventType)) {
            this.listeners.get(eventType).delete(callback);
        }
    }

    /**
     * Handle storage change events
     */
    handleStorageChange(event) {
        // Handle tab events
        if (event.key === 'dikafood_tab_event' && event.newValue) {
            try {
                const eventData = JSON.parse(event.newValue);
                
                // Ignore events from this tab
                if (eventData.tabId === this.tabId) return;
                
                this.dispatchEvent(eventData.type, eventData.data);
            } catch (error) {
                console.error('[TabSync] Error parsing tab event:', error);
            }
        }

        // Handle cart synchronization
        if (event.key === 'dikafood_cart_sync' && event.newValue) {
            try {
                const cartData = JSON.parse(event.newValue);
                this.dispatchEvent('cart_sync', cartData);
            } catch (error) {
                console.error('[TabSync] Error handling cart sync:', error);
            }
        }

        // Handle checkout synchronization
        if (event.key === 'dikafood_checkout_sync' && event.newValue) {
            try {
                const checkoutData = JSON.parse(event.newValue);
                this.dispatchEvent('checkout_sync', checkoutData);
            } catch (error) {
                console.error('[TabSync] Error handling checkout sync:', error);
            }
        }
    }

    /**
     * Handle tab unload
     */
    handleUnload() {
        const activeTabs = this.getActiveTabs();
        delete activeTabs[this.tabId];
        localStorage.setItem('dikafood_active_tabs', JSON.stringify(activeTabs));
    }

    /**
     * Dispatch event to listeners
     */
    dispatchEvent(type, data) {
        if (this.listeners.has(type)) {
            this.listeners.get(type).forEach(callback => {
                try {
                    callback(data);
                } catch (error) {
                    console.error(`[TabSync] Error in event listener for ${type}:`, error);
                }
            });
        }
    }

    /**
     * Sync cart data across tabs
     */
    syncCart(cartData) {
        try {
            localStorage.setItem('dikafood_cart_sync', JSON.stringify({
                ...cartData,
                tabId: this.tabId,
                timestamp: Date.now()
            }));
        } catch (error) {
            console.error('[TabSync] Error syncing cart:', error);
        }
    }

    /**
     * Sync checkout data across tabs
     */
    syncCheckout(checkoutData) {
        try {
            localStorage.setItem('dikafood_checkout_sync', JSON.stringify({
                ...checkoutData,
                tabId: this.tabId,
                timestamp: Date.now()
            }));
        } catch (error) {
            console.error('[TabSync] Error syncing checkout:', error);
        }
    }

    /**
     * Check if multiple tabs are open
     */
    hasMultipleTabs() {
        const activeTabs = this.getActiveTabs();
        return Object.keys(activeTabs).length > 1;
    }

    /**
     * Notify about checkout conflicts
     */
    notifyCheckoutConflict(conflictData) {
        this.broadcastEvent('checkout_conflict', conflictData);
    }
}

// Singleton instance
const tabSyncManager = new TabSyncManager();

// Auto-initialize when module loads
if (typeof window !== 'undefined') {
    setTimeout(() => {
        tabSyncManager.init();
    }, 100);
}

export default tabSyncManager; 