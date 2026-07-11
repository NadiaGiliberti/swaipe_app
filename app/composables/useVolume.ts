export function useVolume() {
    const volume = useState('volume', () => 40) // Default: etwas leiser als mittellaut (Skala 0-100)

    function loadVolume() {
        if (import.meta.client) {
            const saved = localStorage.getItem('swaipe_volume')
            volume.value = saved !== null ? Number(saved) : 40
        }
    }

    function setVolume(value: number) {
        volume.value = value
        if (import.meta.client) {
            localStorage.setItem('swaipe_volume', String(value))
        }
    }

    return { volume, loadVolume, setVolume }
}