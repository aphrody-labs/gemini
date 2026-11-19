---
name: inventory-before-asserting
description: "Owner's target stack (Linux 7.5 optimized, Wayland DE from GPUI/Zed, Android 17/18 in WSL/QEMU/Docker); read everything that already exists before answering, never contradict the goal"
metadata:
  node_type: memory
  type: feedback
  originSessionId: aae12588-4a11-4aae-b28f-f3d886683cbb
  modified: 2026-11-17T05:40:44.016Z
---

When the owner states a goal or an opinion ("prd is old and badly managed", "I aim at Linux 7.5 full optimized + Wayland + Android 17/18 that boots natively in WSL, QEMU, Docker"), treat it as the target: do not rebut it with a narrow reading (e.g. "packages are current"), and do not answer from memory. First read what already exists across the whole estate, then map existing work against the target and say what is missing.

**Why:** 2026-11-17 the owner called an answer idiotic for contradicting the goal on prd (judged by the kernel, not by package freshness) and for ignoring work that already existed: Gemini (agy) already turned Zed/GPUI into a Wayland desktop shell (aphrody-dev/aphrody crates/os_desktop, gpui_linux, "COSMIC Epoch" shell), and the org already holds forks of linux, linux-cachyos, kernel-patches, WSL, cosmic-*, smithay, niri, Hyprland, gamescope, plus legacy src/wayland and src/posix/wslg.

**How to apply:** before any audit or plan, search the org repos (`gh repo list`, cached JSON), legacy, aphrody, ay docs and the kernel-watch pages; cite hashes and live reads; state facts that bear on the goal neutrally (Linux 7.5 is not released: mainline is 7.4-rc3, 7.5 lives in linux-next; AOSP has android-17.0.0_r1, Android 18 only as the GKI kernel android18-7.3). Link: [[agent-policy]], [[assemble-and-reuse]], [[pc-no-local-builds]].
