// app/composables/useAppReady.ts
export function useAppReady() {
    return useState('appReady', () => false)
}