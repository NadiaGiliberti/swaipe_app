
const DISMISS_KEY = 'swaipe_install_dismissed'

export function usePwaInstall() {
    const deferredPrompt = useState<any>('pwaDeferredPrompt', () => null)
    const canInstall = useState('pwaCanInstall', () => false)
    const isIos = useState('pwaIsIos', () => false)
    const isMobile = useState('pwaIsMobile', () => false)
    const isStandalone = useState('pwaIsStandalone', () => false)
    const wurdeDiesesMalVerworfen = useState('pwaDismissedThisSession', () => false)

    function wurdeDiesesMalAbgelehnt() {
        if (!import.meta.client) return true
        return sessionStorage.getItem(DISMISS_KEY) === '1'
    }

    function verwerfen() {
        if (!import.meta.client) return
        sessionStorage.setItem(DISMISS_KEY, '1')
        wurdeDiesesMalVerworfen.value = true
    }

    function erkenneUmgebung() {
        if (!import.meta.client) return

        const ua = window.navigator.userAgent
        isIos.value = /iphone|ipad|ipod/i.test(ua) && !(window as any).MSStream
        isMobile.value = /android|iphone|ipad|ipod/i.test(ua)
        isStandalone.value =
            window.matchMedia('(display-mode: standalone)').matches ||
            (window.navigator as any).standalone === true
        wurdeDiesesMalVerworfen.value = wurdeDiesesMalAbgelehnt()
    }

    function initListener() {
        if (!import.meta.client) return

        // Feuert bei Android/Chrome nicht bei jedem Aufruf (Browser-Heuristik) -
        // wird nur genutzt, um den nativen Installations-Dialog auszulösen, falls verfügbar.
        window.addEventListener('beforeinstallprompt', (event: any) => {
            event.preventDefault()
            // markRaw verhindert, dass Vue das native Event in einen Proxy
            // einwickelt - sonst wirft der Browser bei .prompt() eine
            // "Illegal invocation", weil er kein echtes BeforeInstallPromptEvent mehr ist.
            deferredPrompt.value = markRaw(event)
            canInstall.value = true
        })

        window.addEventListener('appinstalled', () => {
            deferredPrompt.value = null
            canInstall.value = false
            isStandalone.value = true
        })
    }

    async function installieren() {
        if (!deferredPrompt.value) return
        try {
            await deferredPrompt.value.prompt()
            await deferredPrompt.value.userChoice
        } catch (error) {
            console.error('PWA-Installation fehlgeschlagen:', error)
        } finally {
            deferredPrompt.value = null
            canInstall.value = false
        }
    }

    // Zeigt den Hinweis bei jedem neuen Seitenaufruf/Login (statt nur einmalig),
    // aber nur wenn wirklich ein Installationsweg verfügbar ist: nativer Dialog
    // (Android/Chrome) oder die Teilen-Anleitung (iOS). Kein Text-Fallback ohne
    // echten Installationsweg, sonst verdeckt er den echten INSTALLIEREN-Button.
    const zeigeBanner = computed(() => {
        return isMobile.value && !isStandalone.value && !wurdeDiesesMalVerworfen.value && (canInstall.value || isIos.value)
    })

    return { canInstall, isIos, isMobile, isStandalone, zeigeBanner, erkenneUmgebung, initListener, installieren, verwerfen }
}
