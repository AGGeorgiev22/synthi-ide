# Vectant sample guarded-run methodology

This directory is a synthetic, public demonstration bundle. It exists to make the site narrative inspectable. It is not a customer record, production telemetry export, independently reproduced benchmark, or service-level commitment.

## Run boundary

The repository, isolated demonstration workspace, actors, allowed paths and commands, protected paths, required runtime conditions, network policy, and expiry are attached before execution in `boundary-contract.json`.

## Decision trail

`action-events.json` records an allowed read, a blocked ABI-breaking proposal, an escalation carrying both the rejected and corrected patches, and a scoped approval. `approval-record.json` limits the approval to one corrected patch and explicitly excludes the rejected proposal.

## Change and runtime evidence

`rejected.patch` preserves the unsafe branch. `approved.patch` is the reviewed change. `runtime-events.json` records the accepted edit, compile completion, hot-patch application, retained state token, and observed visual output in one ordered run.

## Verification

`verification-result.json` contains the synthetic command result and checks for ABI compatibility, retained state, the applied artifact, and expected output. The file is shaped like an inspectable result; it must not be presented as a real customer test log.

## Latency display

`measurement.json` defines the edit-to-visual boundary from event `evt-005` to `evt-008`. Their synthetic monotonic timestamps differ by 89,700,000 nanoseconds, or 89.7 milliseconds. The page displays `<90 ms`, counts visibly to 90, then reveals the underline. The record contains one sample and is not a generalized performance claim.

## Integrity

The top-level `/sample-guarded-run-proof.json` manifest publishes a SHA-256 digest for every linked artifact so a downloaded file can be checked against the bundle index.
