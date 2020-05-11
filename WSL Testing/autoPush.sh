echo "Adding any new files to git"
git add .
if git commit; then
    echo "Success"
    echo "Pushing changes to GitHub"
    if git push; then
        echo "Successfully completed"
    else
        echo "Could not push files to Git. Please check your username and password"
    fi
else
    echo "No new files to add or commit aborted"
fi
