---
layout: page
title: Component Showcase
---

<style>
.showcase-frame {
  width: 100%;
  height: calc(100vh - 64px);
  border: none;
  display: block;
}

.VPDoc .container {
  max-width: 100% !important;
}

.VPDoc .content {
  max-width: 100% !important;
  padding: 0 !important;
}

.VPDoc .content-container {
  max-width: 100% !important;
  padding: 0 !important;
}
</style>

<iframe class="showcase-frame" src="/docs/gea-ui-showcase/"></iframe>

<script setup>
import { onMounted, onUnmounted } from 'vue'
import { useData } from 'vitepress'

const { isDark } = useData()

let observer

onMounted(() => {
  const frame = document.querySelector('.showcase-frame')
  if (!frame) return

  function sendDark() {
    frame.contentWindow?.postMessage({ dark: isDark.value }, '*')
  }

  frame.addEventListener('load', sendDark)

  observer = new MutationObserver(() => sendDark())
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
})

onUnmounted(() => {
  observer?.disconnect()
})
</script>
