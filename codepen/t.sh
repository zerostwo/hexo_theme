#!bin/sh
for i in ./*.zip
do
    unzip -o -d  ./$(basename $i .zip) ./$i
done
