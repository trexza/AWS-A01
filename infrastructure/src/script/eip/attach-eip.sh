#!/bin/bash

EIP_ALLOCATION_ID=""
INSTANCE_ID=""
REGION=""

function attach_eip() {
	OUTPUT=`aws ec2 associate-address --instance-id $INSTANCE_ID --allocation-id $EIP_ALLOCATION_ID --region $REGION`
	EXIT_STATUS=`echo $?`
	check_exit_status "Unable to associate EIP $EIP_ALLOCATION_ID to $INSTANCE_ID."
}

function setup() {
	while getopts "e:i:r:h" OPTION; do
		case $OPTION in
			e)
				EIP_ALLOCATION_ID=$OPTARG
				;;
			i)
				INSTANCE_ID=$OPTARG
				;;
			r)
				REGION=$OPTARG
				;;
			h)
				help
				exit 0
				;;
			*)
				quit_with_error "Unimplemented option $OPTION chosen."
				;;
		esac
	done

	if [ -z "$EIP_ALLOCATION_ID" ]; then
		quit_with_error_no_cleanup "An EIP Allocation Id must be set."
	fi

	if [ -z "$REGION" ]; then
		quit_with_error_no_cleanup "A region must be set."
	fi

	if [ -z "$INSTANCE_ID" ]; then
		INSTANCE_ID=$(curl -s 169.254.169.254/2014-02-25/meta-data/instance-id)
	fi

	log "(EIP_ALLOCATION_ID: $EIP_ALLOCATION_ID, INSTANCE_ID: $INSTANCE_ID)"
}

function check_exit_status() {
	if [ "$EXIT_STATUS" != "0" ]; then
		quit_with_error "$1"
	fi
}

function quit_with_error_no_cleanup() {
	log $1
	exit 2
}

function quit_with_error() {
	log $1
	clean_up
	exit 1
}

function log() {
	echo "$*"
}

function help() {
	log "Used to associate an EIP to an instance."
	log "  -i: Instance ID (Optional)"
	log "  -e: EIP Allocation Id"
}

function main() {
	setup "$@"
	attach_eip
}

main "$@"
