---
sidebar_position: 5
title: Running a workload
---

# Running a workload

The `run` command launches a program on the isolated real-time CPU that host
setup prepared. You can run one of the bundled examples by name, or your own
binary by path. It automatically forwards your `LXMASTER_*` configuration into
the workload so the library picks up the right settings.

## Step 1 — See what you can run

```bash
sudo lxmaster run --list
```

**What you'll see:** a list of the example binaries you can launch by name, such
as `test_servo` and `servo_sin_demo`.

## Step 2 — Run a bundled example

Launch an example and pass it your ENI file:

```bash
sudo lxmaster run --pty test_servo --eni network.eni.xml
```

The `--pty` flag allocates a terminal so interactive examples display correctly.

**What you'll see:** the example brings the network up on your real-time CPU and
starts printing its output. Press `Ctrl+C` to stop it cleanly.

## Step 3 — Run your own program

Point `run` at your own binary by path instead of a name:

```bash
sudo lxmaster run /path/to/my_app --eni network.eni.xml
```

**What you'll see:** your program runs inside the real-time slice on the isolated
CPU, exactly like the bundled examples.

:::tip
Add `--background` to launch a workload and return to your shell immediately,
instead of waiting for it to exit. By default `run` blocks until the workload
finishes.
:::
