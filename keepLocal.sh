# I want to keep MY version when there is a conflict
# Nothing to do: %A (the second parameter) already contains my version
# Just indicate the merge has been successfully "resolved" with the exit status
#(If you wanted to keep the other version, just add before the exit 0 line: cp -f $3 $2
exit 0
