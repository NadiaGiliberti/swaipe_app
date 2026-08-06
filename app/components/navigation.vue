<template>
    <nav class="container_navigation">
        <NuxtLink to="/">
            <img src="/icon_swaipe.svg" alt="SWAIPE Icon" class="icon_swaipe">
        </NuxtLink>
    </nav>
</template>

<style>
.container_navigation {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0.5rem;
}

.icon_swaipe {
    width: 10vw;
}

@media (min-width: 768px) {
    .container_navigation {
        padding: 1rem;
    }

    .icon_swaipe {
        width: 4rem;
    }
}

@media (min-width: 1024px) {
    .icon_swaipe {
        width: 4.5rem;
    }
}
</style>