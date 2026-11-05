---
title: "Restoring a production Strapi site from a sleeping database"
date: 2026-10-07
description: "A Railway Postgres instance went to sleep and took a live bilingual clinic site down with it. The restore worked because the scripts were idempotent, the backups already existed, and I verified every file against the database before trusting either."
slug: restoring-strapi-site-from-sleeping-database
draft: false
---

## The incident

This week the production database for a bilingual (Greek/Russian) ENT clinic platform I operate — Next.js frontend, Strapi 5 CMS, Postgres, Meilisearch, all on Railway — went to sleep. Railway's Postgres idles down to save resources, and normally it wakes on the next connection. This time the wake-up raced the app's boot sequence, Strapi crash-looped waiting for a database that was still stretching, and the site stayed down.

Getting the site serving again was the easy part. The interesting failure came next, when I pulled production down to a local environment to work safely — and found that the database and the media library no longer agreed with each other.

## Two sources of truth, neither true

Strapi stores every uploaded asset twice: a row in the files table (name, hash, dimensions, the URL it will be served at) and the physical file on a Railway volume. Pulling the database down with `pg_dump` gives you the rows. Pulling the volume over SSH gives you the files. Nothing anywhere guarantees the two sets match, and after months of editorial work in two languages, they didn't.

Rows pointed at files that weren't on disk. Files sat on disk that no row claimed. Some of that is normal residue — Strapi keeps thumbnail formats around, and deleted media can leave orphans — but some of it was genuine drift, and from the outside you cannot tell the two apart. A page that renders fine in the CMS admin can 404 its hero image in production because the row survived and the file didn't.

So the restore turned into a reconciliation. For every one of the 1,126 media rows: does the file exist on disk, and does its md5 match the hash stored in the row? For every one of the 5,564 files (384 MB) on the volume: does a row claim it? Verify before you trust — the database's metadata about files is a claim, not a fact, until the disk confirms it. The end state was 181 Greek and 144 Russian published pages with a media library verified checksum by checksum, and a written list of what was discarded and why.

## The feature that started all of this

The reason I was in production at all was unglamorous: publishing a new homepage hero. I did it through Strapi's documents API from a script, not the admin UI, because bilingual structured content clicked together in a browser is unreviewable and unreproducible. Instead I built a plan file from fresh reads of the live database, rehearsed the whole thing against a local copy, and only then applied it to prod. Two surprises waited there.

**The live site violated its own content policy.** The project has a validation hook restricting which components a home page may contain. The live homepage predates that policy, so the draft update succeeded but `publish()` threw — the hook fired on the publish path and rejected content that had been serving for months. The fix was a surgical bypass: suspend only the page model's `beforeCreate`/`beforeUpdate` hooks during the publish call, while keeping the `after*` lifecycle hooks — the ones that revalidate the Next.js cache — fully running. That distinction mattered. A blunt "disable validation" would have silently skipped cache revalidation too, and the new hero would have been published but invisible. I found the boundary by reading the lifecycle code, not by trying flags until something worked.

**The network was flakier than the code.** Strapi ran against Railway's public Postgres proxy, and the proxy dropped connections mid-write. A publish that takes a few seconds is a long relationship for an idle-happy proxy. Every write went inside a transaction with retry: if the proxy killed the connection, the transaction rolled back and the script retried, instead of leaving a half-published page in one locale and not the other. Idempotency guards did the rest — the plan builder refuses to run if the hero already exists, so a retried script is safe by construction.

## What I'm taking from it

**Backups are a deliverable, not an assumption.** The only reason this week was tedious instead of catastrophic is that a backup existed before anything was touched. The runbook's step zero is a timestamped `pg_dump`. If your client contract doesn't name backups as a thing you hand over — dumps, media, and the script that restores them — you don't have backups, you have hope.

**Idempotent scripts with a safety catch.** Every destructive script in this repo refuses to run without `--force`, prints the database fingerprint before doing anything, and treats production as the source of truth in exactly one direction. When a script can be re-run safely after a failure, retries stop being scary and start being the plan.

**Migration discipline pays in boring ways.** Schema and content policies changed over the life of this site, and every change went through the same reviewed path. The one place that discipline was bypassed — content that predated a policy — is exactly where production surprised me months later.

**Verify metadata against reality.** A row that says a file exists is not evidence the file exists. A green admin panel is not evidence the frontend works. After any restore, the check that matters is the end-to-end one: does the public page render, in both locales, with its images?

The site is back, the hero is live, and the restore scripts are a little more paranoid than they were last week. That's what a good incident buys you.
