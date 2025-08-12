@echo off
set FILTER_BRANCH_SQUELCH_WARNING=1

git filter-branch -f --env-filter "if [ $GIT_AUTHOR_EMAIL = 'samir@apac.microagility.com' ]; then export GIT_AUTHOR_NAME='Saad Amir'; export GIT_AUTHOR_EMAIL='saadamir070@gmail.com'; fi; if [ $GIT_COMMITTER_EMAIL = 'samir@apac.microagility.com' ]; then export GIT_COMMITTER_NAME='Saad Amir'; export GIT_COMMITTER_EMAIL='saadamir070@gmail.com'; fi" --tag-name-filter cat -- --branches --tags