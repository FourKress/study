<template>
  <div class="world">
    <div class="sun" aria-hidden="true"></div>
    <i class="cloud c1" aria-hidden="true"></i>
    <i class="cloud c2" aria-hidden="true"></i>
    <i class="cloud c3" aria-hidden="true"></i>
    <i class="spark s1" aria-hidden="true"></i>
    <i class="spark s2" aria-hidden="true"></i>
    <i class="spark s3" aria-hidden="true"></i>
    <div class="hill back" aria-hidden="true"></div>
    <div class="hill front" aria-hidden="true"></div>
    <div class="world-content">
      <slot />
    </div>
  </div>
</template>
