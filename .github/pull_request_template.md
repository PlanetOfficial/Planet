## Pull Request Checklist

- [ ] Performed a self-review of my own code
- [ ] Thoroughly tested all affected areas in this PR (don't just test flows, test different inputs too. Try to break the code! Give up after about 10 minutes if you can't find any flaws.)
- [ ] Did a quick functionality check on the OS not used in the testing above
- [ ] Wrote comments where necessary, especially in dense areas of code
- [ ] When possible, wrote function specs for new functions (@params, @requires, @returns, @throws, a description). No need to write specs for functions in UI files, but please for functions in utils.
- [ ] No console.logs
- [ ] Type checking for all new variables, don't use the any type
- [ ] Wrote a 2+ sentence description of the PR in the description box for this PR. Write ALL features created or updated in this PR.

Now you are ready for someone to review your beautiful code!

Reviewer Checklist
- [ ] Code reviewed all changes
- [ ] Tested all affected areas in this PR (don't just test flows, test different inputs too. Try to break the code! Give up after about 10 minutes if you can't find any flaws.)
