---
title: Enterprise
description: Managed Numstore for production teams.
---

# Numstore Enterprise

Numstore Enterprise is the managed, supported, multi-tenant tier of Numstore. The engine is identical to the open-source build — the difference is who operates it, who is on the hook when something breaks, and what surface area you get on top.

## What you get

- **Managed multi-region replication.** Failover and quorum handling are handled by the control plane. Your team sees a single endpoint.
- **SSO & SAML.** Hook into Okta, Entra, Google Workspace, or any OIDC provider.
- **Audit logs.** Every administrative action is recorded and exportable to your SIEM.
- **Fine-grained RBAC.** Per-column read/write/delete grants. Scoped to projects.
- **SOC 2 Type II controls.** Continuous compliance, with reports available on request.
- **Support SLA.** Named engineers, 24/7 on-call, 1-hour response for P1 incidents.

## Deployment options

| Option                | Where it runs           | Best for                                  |
| --------------------- | ----------------------- | ----------------------------------------- |
| **Cloud**             | Our infrastructure      | Teams that want zero ops overhead         |
| **Bring your own cloud** | Your AWS/GCP account | Compliance regimes that mandate residency |
| **Self-hosted Enterprise** | Your data center    | Air-gapped or regulated environments      |

## Pricing

Enterprise is sold on annual contracts sized to peak ingest rate and total retained bytes. Pricing is not public — [reach out](https://numstore.com/contact) for a quote.

## Upgrade path

If you are already running open-source Numstore, the upgrade is in place:

```sh
numstore enterprise enroll --license ./license.key
```

Existing data, columns, and configuration are preserved. The control plane will register your cluster the moment the binary restarts.
