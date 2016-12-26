#!/bin/bash

mkfs -t ext4 /dev/xvdf
mkdir /web
mount /dev/xvdf /web

echo -n "/dev/xvdf" >> /etc/fstab
echo -e -n "\t" >> /etc/fstab    #INSERT TAB
echo -n "/web" >> /etc/fstab
echo -e -n "\t" >> /etc/fstab    #INSERT TAB
echo -n "ext4" >> /etc/fstab
echo -e -n "\t" >> /etc/fstab    #INSERT TAB
echo -n "defaults,nofail" >> /etc/fstab
echo -e -n "\t" >> /etc/fstab    #INSERT TAB
echo -n "0" >> /etc/fstab
echo -e -n "\t" >> /etc/fstab    #INSERT TAB
echo -n "2" >> /etc/fstab