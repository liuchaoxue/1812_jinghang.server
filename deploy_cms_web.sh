#!/bin/bash

TS=`date +"%s"`

TARGET_DIST="/home/fxp/dist.zip"
BACKUP_FOLDER="/home/fxp/test/backup"
BACKUP_DIST_NEW="$BACKUP_FOLDER/cms_web_new_$TS.zip"
BACKUP_DIST_OLD="$BACKUP_FOLDER/cms_web_old_$TS.zip"
TMP_FOLDER="/tmp/cms_web_$TS"
CMS_WEB_FOLDER="/home/fxp/test/1812_jinghang_dev/public"
CMS_WEB_FOLDER_SWAP="/home/fxp/test/1812_jinghang_dev/public_swap"

echo "ready to upload dist,${TS}"

if [ ! -f $TARGET_DIST ]; then
  echo "dist.zip not exists"
  exit
fi

echo "backup dist.zip, $TARGET_DIST, BACKUP_DIST_NEW"
cp $TARGET_DIST $BACKUP_DIST_NEW

unzip $TARGET_DIST -d $TMP_FOLDER

if [ ! -f $TMP_FOLDER/dist/index.html ]; then
  echo "invalid dist.zip. index.html does not exists"
  exit
fi

echo "backup current cms web,$CMS_WEB_FOLDER, $BACKUP_DIST_OLD"

cd $CMS_WEB_FOLDER
zip -r $BACKUP_DIST_OLD *
cd -

echo "move current cms web to swap folder"
rm -rf $CMS_WEB_FOLDER_SWAP
mv $CMS_WEB_FOLDER $CMS_WEB_FOLDER_SWAP

echo "move new dist to cms web"
mv $TMP_FOLDER/dist $CMS_WEB_FOLDER

echo "done all"