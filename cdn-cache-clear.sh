#!/usr/bin/env bash

echo Clearing CDN cache...

if [ "$1" = "dogfood" ]; then
    id=E16OHMBSODHB04
    url=https://dogfood.0xproject.com
elif [ "$1" = "live" ]; then
    id=E1PKJDEJRHTC64
    url=https://0x.org
else
    echo Invalid environment: $1
    exit 1
fi

aws cloudfront create-invalidation --distribution-id $id --paths '/*' --profile $(npm config get awscli_profile) || exit $?
sleep 10
curl -sI $url | grep -q 'cache: Miss' || exit $?
curl -sI $url | grep -q 'cache: Hit' || exit $?
