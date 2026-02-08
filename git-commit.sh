#!/bin/bash
cd "/Users/kkk/CascadeProjects/New Admin Vantage Lane 1/New-Admin-Vantage-Lane-"
BRANCH=$(git branch --show-current)
echo "Branch: $BRANCH"
git add -A
git commit -m "feat: Surge Multipliers full edit/add/delete + Hourly/Daily/Return/Fleet tabs + full-width layout"
git push origin "$BRANCH"
git checkout main
git merge "$BRANCH"
git push origin main
git checkout "$BRANCH"
echo "DONE - all pushed and merged to main"
