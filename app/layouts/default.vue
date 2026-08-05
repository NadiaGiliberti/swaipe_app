<template>
  <div class="container_body">
    <header>
      <navigation />
    </header>

    <SchliessenButton />

    <!-- Einziger scrollbarer Bereich der App: technisch auf die verbleibende
         Höhe begrenzt (flex:1 1 auto + overflow-y:auto), endet also immer
         VOR dem Zurück-Button-Slot darunter. Dadurch kann Content bei keiner
         Scrollposition mehr hinter/unter den Button geraten - nicht nur am
         Seitenende, sondern strukturell nie, weil dieser Bildschirmbereich
         technisch ausserhalb der scrollbaren Box liegt. -->
    <div class="scroll_area">
      <slot />
    </div>

    <!-- Teleport-Ziel für buttonZurueck.vue: liegt als eigene Flex-Zeile
         AUSSERHALB von .scroll_area, direkt am unteren Rand von .container_body. -->
    <div id="back_button_slot"></div>

  </div>
</template>
