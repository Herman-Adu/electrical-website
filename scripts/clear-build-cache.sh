#!/bin/bash
set -e

echo "Clearing Next.js build cache..."
rm -rf /vercel/share/v0-project/.next
rm -rf /vercel/share/v0-project/.turbo
rm -rf /vercel/share/v0-project/node_modules/.cache

echo "Build cache cleared. Dev server will rebuild on next request."
