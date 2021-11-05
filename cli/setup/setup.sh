#!/bin/bash
basedir=$(dirname "$(echo "$0" | sed -e 's,\\,/,g')")

./update.sh
node "$basedir/setup.js" $@

ret=$?
exit $ret
