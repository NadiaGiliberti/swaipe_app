<template>
    <nav class="container_navigation">
        <div class="container_icon">
            <img src="/icon_swaipe.svg" alt="SWAIPE Icon" class="icon_swaipe">
        </div>
    </nav>
</template>

<style>

.container_navigation {
    width: 100%;
    height: 5%;
    display: flex;
}

.container_icon {
    width: 100%;
    padding: 1.5rem;
}

.icon_swaipe {
    width: 10vw;
    object-fit: contain;
    filter: drop-shadow(0 25px 25px rgb(0 0 0 / 0.15));
}

@media (min-width: 768px) {}
</style>