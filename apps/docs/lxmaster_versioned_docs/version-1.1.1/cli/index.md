---
sidebar_position: 1
title: CLI Tutorials
---

# LXMASTER CLI Tutorials

The `lxmaster` command-line tool is the single front-end for setting up your
machine, discovering EtherCAT devices, launching workloads, and diagnosing
timing. These tutorials walk through each command one concept at a time, with
simple step-by-step examples and what to expect along the way.

Most commands touch the network stack and real-time scheduler, so they usually
need root:

```bash
sudo lxmaster <command> [subcommand] [options]
```

## Where to start

If you are setting up a machine for the first time, follow the tutorials in this
order: prepare the host, scan the bus, generate an ENI, then run a workload.

## Available commands

| Command | What it does | Tutorial |
| --- | --- | --- |
| `host` | Prepare the Linux machine for real-time EtherCAT (a one-time setup) | [Preparing your host](./host.md) |
| `scan` | Discover the devices connected on the bus | [Scanning the bus](./scan.md) |
| `eni` | Create and verify the ENI file that describes your network | [Generating an ENI file](./eni.md) |
| `run` | Launch an example or your own app on the real-time core | [Running a workload](./run.md) |
| `diag` | Measure timing/jitter and soak-test CPU isolation | [Diagnosing timing](./diagnostics.md) |
| `license` | Activate and check your node-locked license | [Activating your license](./license.md) |

## Handy extras

A few small commands you will use often:

```bash
lxmaster version        # print the installed LXMASTER version
lxmaster help           # list all commands
lxmaster help host      # help for a specific command
```

To enable tab-completion for every command, subcommand, and flag, install the
completion script once and open a new shell:

```bash
lxmaster completion bash | sudo tee /etc/bash_completion.d/lxmaster > /dev/null
```
