// app/composables/usePwaInstall.ts
const DISMISS_KEY = 'swaipe_install_dismissed'
const DISMISS_DAUER_MS = 14 * 24 * 60 * 60 * 1000 // 14 Tage

export function usePwaInstall() {
    const deferredPrompt = useState<any>('pwaDeferredPrompt', () => null)
    const canInstall = useState('pwaCanInstall', () => false)
    const isIos = useState('pwaIsIos', () => false)
    const isMobile = useState('pwaIsMobile', () => false)
    const isStandalone = useState('pwaIsStandalone', () => false)

    function wurdeKuerzlichAbgelehnt() {
        if (!import.meta.client) return true
        const wert = localStorage.getItem(DISMISS_KEY)
        if (!wert) return false
        return Date.now() - Number(wert) < DISMISS_DAUER_MS
    }

    function verwerfen() {
        if (!import.meta.client) return
        localStorage.setItem(DISMISS_KEY, String(Date.now()))
        canInstall.value = false
        isMobile.value = false
    }

    function erkenneUmgebung() {
        if (!import.meta.client) return

        const ua = window.navigator.userAgent
        isIos.value = /iphone|ipad|ipod/i.test(ua) && !(window as any).MSStream
        isMobile.value = /android|iphone|ipad|ipod/i.test(ua)
        isStandalone.value =
            window.matchMedia('(display-mode: standalone)').matches ||
            (window.navigator as any).standalone === true
    }

    function initListener() {
        if (!import.meta.client) return

        window.addEventListener('beforeinstallprompt', (event: any) => {
            event.preventDefault()
            deferredPrompt.value = event
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
        await deferredPrompt.value.prompt()
        await deferredPrompt.value.userChoice
        deferredPrompt.value = null
        canInstall.value = false
    }

    const zeigeBanner = computed(() => {
        return isMobile.value && !isStandalone.value && !wurdeKuerzlichAbgelehnt() && (canInstall.value || isIos.value)
    })

    return { canInstall, isIos, isMobile, isStandalone, zeigeBanner, erkenneUmgebung, initListener, installieren, verwerfen }
}
