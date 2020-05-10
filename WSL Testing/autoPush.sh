echo "Adding any new files to git"
if git add . && git commit; then
    echo "Success"
    echo "Pushing changes to GitHub"
    git push
else
    echo "No new files to add or commit aborted"
fi
