
export function useAppReady() {
    return useState('appReady', () => false)
}