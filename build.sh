#!/bin/bash
#
# @author changyanlong
# @email porschegt23@foxmail.com
# @qq 531365872
# @wechat numberwolf11
# @github github.com/numberwolf
#
#set -x
REMOVE_FUNCS='console.log'
# REMOVE_FUNCS=''
cmd[0]="browserify example.js -o ./example-dist.js"
cmd[1]="python -m SimpleHTTPServer 8000"
cmdLen=${#cmd[@]}
for ((i=0; i<$cmdLen; i++)); do
	echo ${cmd[$i]}
	${cmd[$i]}
done






