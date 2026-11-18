---
name: disks
description: Inventory and manage disks, partitions, LVM volumes, network mounts and filesystems on the fleet hosts (ay.toml [hosts]), find where large work (builds, caches, mirrors, datasets) must go, and grow or clean storage safely. Use before any large build, clone, download or mirror, when a disk looks full, or when asked about free space, partitions, LVM, XFS/ext4/btrfs, NFS or disk cleanup.
---

# Disks on the fleet

Never judge free space from `df -h /` alone: the root filesystem is often the smallest volume. Large work lives on
dedicated volumes (LVM, extra disks, NFS exports).

## Inventory (always first)
```sh
bun tools/disks.ts              # every host: devices, partitions, LVM, mounts, free space, best place for large work
bun tools/disks.ts <build-host> --json   # one host, machine-readable
bun tools/disks.ts --usage $WORK   # biggest directories (dust, else du)
```
The last line per host, `→ large work: <mount>`, is where builds, `CARGO_TARGET_DIR`, CEF/Chromium checkouts,
mirrors and datasets go. Put a per-project directory under it, never under `~` on a small root.

## What the tools are for
| Need | Tool (present on the hosts, checked by `tools/disks.ts`) |
|---|---|
| Block devices and partitions | `lsblk -e7 -o NAME,SIZE,TYPE,FSTYPE,MOUNTPOINTS`, `parted -lm`, `sgdisk` |
| Filesystem free space | `df -hT -x tmpfs -x devtmpfs -x overlay -x squashfs` |
| LVM | `pvs`, `vgs`, `lvs`; grow with `lvextend -r` after `vgextend` with a new PV |
| Grow a partition after a provider resize | `growpart /dev/sdX N` then `resize2fs` (ext4), `xfs_growfs <mount>` (XFS), `btrfs filesystem resize max <mount>` |
| Find what fills a disk | `dust -d 1 <path>` (fallback `du -xh -d1 | sort -h`), `ncdu -x <path>` interactively |
| Network storage | NFS mounts appear in `df` with `nfs4`; the export lives on the host that owns the LVM volume |

## Rules
- Measure before and after any cleanup or resize, and keep both outputs as the proof.
- Prefer moving work to the large volume over deleting; delete only build outputs, caches and temp dirs you created.
- Resizing or repartitioning a disk with data needs a snapshot or provider backup first (OVH/Hostinger API);
  growing into free space (growpart, lvextend -r, xfs_growfs) is online and non-destructive.
- Build flags that keep disks small: `CARGO_INCREMENTAL=0`, `CARGO_PROFILE_DEV_DEBUG=0`, a shared
  `CARGO_TARGET_DIR` on the large volume, sccache.
