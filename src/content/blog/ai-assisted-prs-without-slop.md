---
title: "How I run AI-assisted PRs without shipping slop code"
date: 2026-10-04
description: "AI makes writing code fast. Review is what makes it safe. Here is the gate-based workflow I use on this portfolio so both kinds of code are held to the same standard."
slug: ai-assisted-prs-without-slop
draft: false
---

## The problem

AI coding tools made the writing part fast. They did nothing for the part that actually keeps a codebase healthy: deciding whether a change is correct, safe, and worth merging. Most "AI shipped slop to production" stories are not stories about bad models. They are stories about teams that kept the first half of the workflow — generate code quickly — and quietly dropped the second half: review, tests, and gates.

I use AI assistance on almost every pull request in this portfolio, including the one that added the blog you are reading. I also assume the output is wrong until proven otherwise. Those two statements only contradict each other if your process treats AI-written code as special. Mine does not. Every PR passes the same gates whether I typed every character by hand or accepted a generated diff.

## The actual workflow

The rule is one sentence: **the merge button is downstream of the gates, and the gates do not know or care who wrote the code.**

On this repository, merging to `main` requires five CI jobs to pass. The `quality` job installs from a frozen lockfile, generates the Prisma client, validates the schema, applies migrations to a real Postgres service container, runs the seed, typechecks, runs the full Vitest suite, builds the production bundle, and builds the Docker image. Then four browser-level gates run against a live dev server: the full Playwright e2e suite, a smoke gate covering public navigation and admin guards, an accessibility gate running axe scans, and a private-room gate covering the token-gated client areas. Only when all five are green does the deploy job ship to Railway — and it only runs on `main`.

That pipeline is the entire trick. AI writes the first draft; the gates decide whether there is a second one.

## What this looks like in practice

A few concrete examples from this codebase, because "I have good process" without evidence is marketing.

**The test suite is the floor.** This repo carries more than 140 Vitest unit tests — query policies, access-token logic, validation schemas, the Markdown rendering pipeline. When AI proposes a change to a query function, the tests that pin down its filtering and ordering behavior run on every PR. A plausible-looking diff that weakens a visibility filter fails loudly.

**Schema changes go through migrations, never `db push`.** The project rule is explicit: `prisma migrate dev` generates a SQL file, that file is reviewed in the PR like any other code, and production applies migrations automatically on deploy. AI tools love suggesting `db push` because it is the fast path. The rule exists precisely so the fast path is not available, regardless of who — or what — suggests it. When the migration baseline was reset, that decision was recorded in an architecture decision record (ADR-0006) with its reasons, not left in a chat log.

**Decisions are written down.** The `docs/adr/` directory holds one record per significant decision: framework, database, design system, private-room links, CI and hosting, migration discipline. When AI suggests a structural change, the first question is not "does this compile" but "which ADR does this contradict, and is this PR also updating it?" Slop is often just an undocumented change of direction. ADRs make direction changes visible.

**The seed is idempotent and CI re-runs it on every job.** It uses `upsert` and scoped deletes, so any PR that breaks seeding breaks all five gates at once. Data-layer slop has nowhere to hide.

**Accessibility is a gate, not a good intention.** axe scans run in CI against the real pages. Generated markup with missing labels or bad contrast does not merge.

## What it costs

Honesty matters here, because this workflow has a real price.

Merges are slower. A one-line copy change waits for the same five gates as a schema migration. Sometimes the gates catch a real problem in AI output and I iterate two or three times before green — that time comes out of the speed the tool gave me. Occasionally a gate fails on something flaky or environmental, and I spend ten minutes on infrastructure instead of the change itself.

I pay that cost deliberately. The alternative — a fast path for "obviously fine" changes — is exactly where slop enters. Every team that shipped AI-generated breakage had a fast path, and the breakage took it.

There is a second, quieter cost: I have to actually read the diffs. The gates catch behavior, not taste. A technically passing change can still be the wrong shape for the codebase, and no CI job will tell me that. Review time has not shrunk. In AI-assisted PRs it has arguably grown, because generated code always looks more finished than it is.

## The takeaway

AI changed how fast the first draft arrives. It changed nothing about what "done" means. If your definition of done lives in CI — tests, type checks, migrations, accessibility scans, a deploy that only fires on green — then AI assistance is pure upside: faster drafts, same standard. If your definition of done lives in someone's head during a quick skim of the diff, AI will find that gap and fill it with slop.

The gates are the product. The model is interchangeable.
