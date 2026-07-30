<template>
  <div>
    <NuxtPwaAssets />
    <loadingScreen />
    <NuxtRouteAnnouncer />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <installPrompt />
  </div>
</template>
