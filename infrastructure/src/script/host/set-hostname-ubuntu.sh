#!/bin/bash

DOMAIN=""
FQDN=""
INSTANCE_ID=""
RESERVATION_ID=""

function set_hostname() {
	log "Changing hostname to $FQDN"

	echo "$FQDN" > /etc/hostname

	grep $FQDN /etc/hosts > /dev/null
	if [ ! $? -eq 0 ];
	then
	    sed -i.BAK -e "s/127\.0\.0\.1\(.*\)/127.0.0.1 $FQDN\1 /" /etc/hosts
	fi

	hostname $FQDN
}

function setup() {
	while getopts "h:d:ir" OPTION; do
		case $OPTION in
			h)
				FQDN=$OPTARG
				;;
			d)
				DOMAIN=$OPTARG
				;;
			i)
				INSTANCE_ID=`curl -s 169.254.169.254/2014-02-25/meta-data/instance-id`
				;;
			r)
				RESERVATION_ID=`curl -s 169.254.169.254/2014-02-25/meta-data/reservation-id`
				;;
			*)
				quit_with_error "Unimplemented option $OPTION chosen."
				;;
		esac
	done

	if [ -n "$INSTANCE_ID" ]; then
		FQDN="$FQDN-$INSTANCE_ID"
	fi

	if [ -n "$RESERVATION_ID" ]; then
		FQDN="$FQDN-$RESERVATION_ID"
	fi

	if [ -n "$DOMAIN" ]; then
		FQDN="$FQDN.$DOMAIN"
	fi

	log "(FQDN: $FQDN, DOMAIN: $DOMAIN, INSTANCE_ID: $INSTANCE_ID, RESERVATION_ID: $RESERVATION_ID)"
}

function quit_with_error() {
	log $1
	exit 1
}

function log() {
	echo "$*"
}


function main() {
	setup $*
	set_hostname
}

main $*
