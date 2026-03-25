param(
  [string]$SourceBranch,
  [switch]$RunValidation,
  [switch]$Push,
  [switch]$DeleteRemoteMerged
)

$ErrorActionPreference = "Stop"

function Write-Step {
  param([string]$Message)
  Write-Host "`n==> $Message" -ForegroundColor Cyan
}

function Assert-CleanWorkingTree {
  $status = git status --porcelain
  if ($status) {
    throw "Working tree is not clean. Commit/stash changes before running cleanup."
  }
}

function Get-CurrentBranch {
  return (git branch --show-current).Trim()
}

function Assert-BranchExists {
  param([string]$Branch)
  $exists = git branch --list $Branch
  if (-not $exists) {
    throw "Branch '$Branch' does not exist locally."
  }
}

function Protect-Branch {
  param([string]$Branch)
  return @("main", "master", "develop") -contains $Branch
}

Write-Step "Fetching and pruning remotes"
git fetch --prune

if (-not $SourceBranch) {
  $SourceBranch = Get-CurrentBranch
}

Assert-BranchExists -Branch $SourceBranch

Write-Host "Source branch: $SourceBranch" -ForegroundColor Yellow

Write-Step "Checking clean working tree"
Assert-CleanWorkingTree

if ($RunValidation) {
  Write-Step "Running validation (TypeScript + Next build)"
  pnpm exec tsc --noEmit
  pnpm run build
}

Write-Step "Switching to main"
git checkout main

Write-Step "Merging source branch into main (fast-forward only)"
git merge --ff-only $SourceBranch

if ($RunValidation) {
  Write-Step "Re-validating on main"
  pnpm exec tsc --noEmit
  pnpm run build
}

Write-Step "Deleting merged local branches"
$merged = git branch --merged main | ForEach-Object { $_.Trim().TrimStart('*').Trim() } | Where-Object { $_ -and $_ -ne "main" }

foreach ($branch in $merged) {
  if (Protect-Branch -Branch $branch) {
    continue
  }

  try {
    git branch -d $branch
  } catch {
    Write-Warning "Could not delete local branch '$branch': $_"
  }
}

if ($Push) {
  Write-Step "Pushing main to origin"
  git push origin main
}

if ($DeleteRemoteMerged) {
  Write-Step "Deleting merged remote feature branches"
  $remoteMerged = git branch -r --merged main |
    ForEach-Object { $_.Trim() } |
    Where-Object {
      $_ -and
      $_ -notmatch "origin/main$" -and
      $_ -notmatch "origin/HEAD"
    }

  foreach ($remoteRef in $remoteMerged) {
    $name = $remoteRef -replace "^origin/", ""
    if (Protect-Branch -Branch $name) {
      continue
    }

    try {
      git push origin --delete $name
    } catch {
      Write-Warning "Could not delete remote branch '$name': $_"
    }
  }
}

Write-Step "Final status"
git status -sb
git branch -a

Write-Host "`nCleanup complete." -ForegroundColor Green
